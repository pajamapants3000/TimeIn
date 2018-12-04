#tool nuget:?package=NUnit.ConsoleRunner&version=3.8.0
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Debug");
var framework = Argument("framework", "netcoreapp2.0");
var runtime = Argument("runtime", "win10-x64");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

var solutionName = "TimeIn";

// Define files and directories.
var buildDir = Directory("./bin") + Directory(configuration);
var clientUiDir = Directory("./ClientUi");
var e2eTestPath = clientUiDir + Directory("e2e") + File("protractor.conf.js");
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

Task("Run-EndToEndTests")
    .IsDependentOn("Run-UnitTests")
    .IsDependentOn("Run-ClientUiTests")
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

Task("Run-ClientUiTests")
    .IsDependentOn("Run-ClientUiBuild")
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

Task("Run-ClientUiBuild")
    .Does(() =>
{
	var arguments = new ProcessArgumentBuilder();
	arguments.Append("build");
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

Task("Publish")
    .IsDependentOn("Run-EndToEndTests")
    .Does(() =>
{
	var settings = new DotNetCorePublishSettings
        {
            Framework = framework,
            Configuration = configuration,
            OutputDirectory = "./publish/",
            Runtime = runtime
        };
 
        DotNetCorePublish(solutionFile, settings);
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Publish");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);
