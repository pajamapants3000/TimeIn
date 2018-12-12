#tool nuget:?package=NUnit.ConsoleRunner&version=3.8.0

// NOTE: For end-to-end tests:
//		* selenium server must be running ($ webdriver-manager start)
//		* IIS should be running the test site, which has access to the test database.
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Debug");
var framework = Argument("framework", "netcoreapp2.2");
var runtime = Argument("runtime", "win10-x64");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

var solutionName = "TimeIn";

// Define files and directories.
var buildDir = Directory("./bin") + Directory(configuration);
var clientUiDir = Directory("./ClientUi");
var protractorConfFile = Directory("./e2e") + File("protractor.conf.js");
var protractorCommand = @"C:\Users\otrip\AppData\Roaming\npm\protractor.cmd";
var ngCliCommand = @"C:\Users\otrip\AppData\Roaming\npm\ng.cmd";
var errorFormatMessage = "Task {0} failed";
var testPublishProfileName = "Test";
var finalPublishProfileName = "Production";
var msBuildDirsPattern = "./**/bin/" + configuration;
var msBuildObjDirsPattern = "./**/obj/" + configuration;
var testsAssemblyPath = "./" + solutionName + ".Test/bin/" + configuration + "/" + solutionName + ".Test.dll";
var solutionFile = Directory("./") + File(solutionName + ".sln");
var sqlResetTestDataFile = Directory("./") + File("reset_test_data.sql");

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Test-ClientUi")
    .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("test");
	arguments.Append("--watch=false");
	using(var process = StartAndReturnProcess(ngCliCommand,
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
	}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception(String.Format(errorFormatMessage, "Test-ClientUi"));
		}
	}
});

Task("Build-ClientUi-Production")
    .IsDependentOn("Test-ClientUi")
    .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("build");
	arguments.Append("--prod");
	using(var process = StartAndReturnProcess(ngCliCommand,
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
	}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception(String.Format(errorFormatMessage, "Build-ClientUi-Production"));
		}
	}
});

Task("Publish-ClientUi")
    .IsDependentOn("Build-ClientUi-Production")
    .Does(() =>
{
	CopyFiles("./ClientUi/dist/ClientUi/**/*.*", "D:/publish/TimeIn", true);
});

Task("Clean-Solution")
    .Does(() =>
{
    CleanDirectory(buildDir);
    CleanDirectories(msBuildDirsPattern);
    CleanDirectories(msBuildObjDirsPattern);
});

Task("Restore-NuGet-Packages")
    .IsDependentOn("Clean-Solution")
    .Does(() =>
{
    NuGetRestore("./" + solutionName + ".sln");
});

Task("Build-Solution")
    .IsDependentOn("Restore-NuGet-Packages")
    .Does(() =>
{
	MSBuild(solutionFile, settings =>
		settings.SetConfiguration(configuration));
});

Task("Test-Solution-UnitTests")
    .IsDependentOn("Build-Solution")
    .Does(() =>
{
    NUnit3(testsAssemblyPath, new NUnit3Settings {
        NoResults = false,
		OutputFile = new FilePath("./unitTestOutput.xml"),
	});
});

Task("Publish-Api-Test")
    .IsDependentOn("Test-Solution-UnitTests")
    .Does(() =>
{
	MSBuild("TimeIn.Api/TimeIn.Api.csproj", settings =>
		settings.SetConfiguration(configuration).
		WithProperty("DeployOnBuild", "true").
		WithProperty("PublishProfile", testPublishProfileName)
	);
});

Task("ResetTestData")
	.Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("-S LILU-WINDXPRO");
	arguments.Append("-i " + sqlResetTestDataFile.ToString());
	using(var process = StartAndReturnProcess("sqlcmd",
		new ProcessSettings{
			Arguments = arguments,
	}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception(String.Format(errorFormatMessage, "ResetTestData"));
		}
	}

});

Task("Test-EndToEnd")
    .IsDependentOn("Publish-Api-Test")
    .IsDependentOn("Publish-ClientUi")
    .IsDependentOn("ResetTestData")
   .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append(protractorConfFile.ToString());
	using(var process = StartAndReturnProcess(protractorCommand,
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
	}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception(String.Format(errorFormatMessage, "Test-EndToEnd"));
		}
	}
});

Task("Publish-Production")
    .IsDependentOn("Test-EndToEnd")
    .Does(() =>
{
	MSBuild("TimeIn.Api/TimeIn.Api.csproj", settings =>
		settings.SetConfiguration(configuration).
		WithProperty("DeployOnBuild", "true").
		WithProperty("PublishProfile", finalPublishProfileName)
	);
	CopyFiles("./ClientUi/dist/ClientUi/**/*.*", "D:/publish/TimeIn", true);
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Publish-Production");

//////////////////////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////
RunTarget(target);
