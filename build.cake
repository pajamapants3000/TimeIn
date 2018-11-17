#tool nuget:?package=NUnit.ConsoleRunner&version=3.8.0
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Debug");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

var solutionName = "TimeIn";

// Define directories.
var buildDir = Directory("./bin") + Directory(configuration);
var msBuildDirsPattern = "./**/bin/" + configuration;
var msBuildObjDirsPattern = "./**/obj/" + configuration;
var testsAssemblyPath = "./" + solutionName + ".Test/bin/" + configuration + "/" + solutionName + ".Test.dll";

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
      MSBuild("./" + solutionName + ".sln", settings =>
        settings.SetConfiguration(configuration));
    }
    else
    {
      // Use XBuild

      XBuild("./" + solutionName + ".sln", settings =>
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

Task("Run-AcceptanceTests")
    .IsDependentOn("Run-UnitTests")
    .Does(() =>
{
	using(var process = StartAndReturnProcess("consoleUi.Test.ps1"))
	{
		process.WaitForExit();
		if (process.GetExitCode() != 0)
		{
			throw new Exception("Acceptance tests failed.");
		}
	}
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

Task("Default")
    .IsDependentOn("Run-AcceptanceTests");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);
