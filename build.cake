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
var publishDir = Directory(@"D:\publish") + Directory(solutionName);
var clientUiDir = Directory("./ClientUi");
var e2eTestPath = clientUiDir + Directory("e2e") + File("protractor.conf.js");
var msBuildDirsPattern = "./**/bin/" + configuration;
var msBuildObjDirsPattern = "./**/obj/" + configuration;
var testsAssemblyPath = "./" + solutionName + ".Test/bin/" + configuration + "/" + solutionName + ".Test.dll";
var solutionFile = Directory("./") + File(solutionName + ".sln");
var appSettingsTestFilename = "appsettings.test.json";

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
    if(IsRunningOnWindows())
    {
      // Use MSBuild
      MSBuild(solutionFile, settings =>
        settings.SetConfiguration(configuration));
    }
    else
    {
      // Use XBuild

      XBuild(solutionFile, settings =>
        settings.SetConfiguration(configuration));
    }
});

Task("Run-UnitTests")
    .IsDependentOn("Build")
    .Does(() =>
{
    NUnit3(testsAssemblyPath, new NUnit3Settings {
        NoResults = false,
		OutputFile = new FilePath("./unitTestOutput.xml"),
        });
});

Task("Publish-Test")
    .IsDependentOn("Run-UnitTests")
    .Does(() =>
{
    if(IsRunningOnWindows())
    {
      // Use MSBuild
      MSBuild(solutionFile, settings =>
        settings.SetConfiguration(configuration).
		WithProperty("PublishProfile", "Test")
		);
    }
    else
    {
      // Use XBuild

      XBuild(solutionFile, settings =>
        settings.SetConfiguration(configuration).
		WithProperty("PublishProfile", "Test")
		);
    }
});

Task("Run-ClientUiBuild")
    .IsDependentOn("Run-ClientUiTests")
    .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("build");
	arguments.Append("--prod");
	using(var process = StartAndReturnProcess(@"C:\Users\otrip\AppData\Roaming\npm\ng.cmd",
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
		}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception("ClientUi build failed.");
		}
	}
});

Task("Run-ClientUiTests")
    .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("test");
	arguments.Append("--watch=false");
	using(var process = StartAndReturnProcess(@"C:\Users\otrip\AppData\Roaming\npm\ng.cmd",
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
		}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception("ClientUi tests failed.");
		}
	}
});

Task("Run-EndToEndTests")
    .IsDependentOn("Publish-Test")
    .IsDependentOn("Run-ClientUiBuild")
   .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append(@"e2e\protractor.conf.js");
	using(var process = StartAndReturnProcess(@"C:\Users\otrip\AppData\Roaming\npm\protractor.cmd",
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
		}))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception("End-to-End tests failed.");
		}
	}
});

Task("Publish")
    .IsDependentOn("Run-EndToEndTests")
    .Does(() =>
{
    if(IsRunningOnWindows())
    {
      // Use MSBuild
      MSBuild(solutionFile, settings =>
        settings.SetConfiguration(configuration).
		WithProperty("PublishProfile", "Production")
		);
    }
    else
    {
      // Use XBuild

      XBuild(solutionFile, settings =>
        settings.SetConfiguration(configuration).
		WithProperty("PublishProfile", "Production")
		);
    }
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Publish");

//////////////////////////////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////////////////////////////
Action<string> stopAppPool = appPoolName =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("stop");
	arguments.Append("apppool");
	arguments.Append("/apppool.name: " + appPoolName);
	using(var process = StartAndReturnProcess(@"C:\Windows\System32\inetsrv\appcmd",
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
		}))
	{
		process.WaitForExit();
	}
};

Action<string> startAppPool = appPoolName =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("start");
	arguments.Append("apppool");
	arguments.Append("/apppool.name: " + appPoolName);
	using(var process = StartAndReturnProcess(@"C:\Windows\System32\inetsrv\appcmd",
		new ProcessSettings{
			Arguments = arguments,
			WorkingDirectory = clientUiDir,
		}))
	{
		process.WaitForExit();
	}
};

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////
RunTarget(target);
