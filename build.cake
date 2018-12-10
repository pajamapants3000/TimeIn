#tool nuget:?package=NUnit.ConsoleRunner&version=3.8.0

// NOTE: For end-to-end tests:
//		* selenium server must be running ($ webdriver-manager start)
//		* IIS should be running the test site, which has access to the test database.
//		* ng serve should be running the ClientUi

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

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    CleanDirectory(buildDir);
    CleanDirectories(msBuildDirsPattern);
    CleanDirectories(msBuildObjDirsPattern);
});

Task("Restore-NuGet-Packages")
    .IsDependentOn("Clean")
    .Does(() =>
{
    NuGetRestore("./" + solutionName + ".sln");
});

Task("Build")
    .IsDependentOn("Restore-NuGet-Packages")
    .Does(() =>
{
	MSBuild(solutionFile, settings =>
		settings.SetConfiguration(configuration));
});

Task("UnitTests")
    .IsDependentOn("Build")
    .Does(() =>
{
    NUnit3(testsAssemblyPath, new NUnit3Settings {
        NoResults = false,
		OutputFile = new FilePath("./unitTestOutput.xml"),
	});
});

Task("Publish-Test")
    .IsDependentOn("UnitTests")
    .Does(() =>
{
	MSBuild(solutionFile, settings =>
		settings.SetConfiguration(configuration).
		WithProperty("PublishProfile", testPublishProfileName)
	);
});

Task("ClientUiBuild")
    .IsDependentOn("ClientUiTests")
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
			throw new Exception(String.Format(errorFormatMessage, "ClientUiBuild"));
		}
	}
});

Task("ClientUiTests")
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
			throw new Exception(String.Format(errorFormatMessage, "ClientUiTests"));
		}
	}
});

// ClientUi must be served in production mode (`--prod` flag passed to `ng serve`)
Task("EndToEndTests")
    .IsDependentOn("Publish-Test")
    .IsDependentOn("ClientUiBuild")
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
			throw new Exception(String.Format(errorFormatMessage, "EndToEndTests"));
		}
	}
});

Task("Publish")
    .IsDependentOn("EndToEndTests")
    .Does(() =>
{
	MSBuild(solutionFile, settings =>
		settings.SetConfiguration(configuration).
		WithProperty("PublishProfile", finalPublishProfileName)
	);
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Publish");

//////////////////////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////
RunTarget(target);
