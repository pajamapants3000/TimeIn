-- Reset data for testing in TimeIn_01_Test
USE [TimeIn.Dev_01_Test]
GO

PRINT 'Begin TRUNCATE TABLE Reminder'
TRUNCATE TABLE Reminder
PRINT 'End TRUNCATE TABLE Reminder'
GO

PRINT 'Begin TRUNCATE TABLE ScheduledEvent'
TRUNCATE TABLE ScheduledEvent
PRINT 'End TRUNCATE TABLE ScheduledEvent'
GO

PRINT 'Begin inserting test data'
SET IDENTITY_INSERT [Reminder] ON;
INSERT [Reminder] (id, value, isCompleted)
    SELECT id, value, isCompleted FROM OPENROWSET (BULK 'G:\GoogleDrive-otripleg\Workspace\TimeIn\testData.json', SINGLE_CLOB) as j
    CROSS APPLY OPENJSON(BulkColumn, '$."Reminder"')
        WITH
        (
            id int,
            value varchar(100),
            isCompleted bit
        )
SET IDENTITY_INSERT [Reminder] OFF;

SET IDENTITY_INSERT [ScheduledEvent] ON;
INSERT [ScheduledEvent] (id, name, description, [when], durationInMinutes)
    SELECT id, name, description, [when], durationInMinutes FROM OPENROWSET (BULK 'G:\GoogleDrive-otripleg\Workspace\TimeIn\testData.json', SINGLE_CLOB) as j
    CROSS APPLY OPENJSON(BulkColumn, '$."ScheduledEvent"')
        WITH
        (
            id int,
            name varchar(100),
            description varchar(1000),
            [when] datetime,
            durationInMinutes int
        )
SET IDENTITY_INSERT [ScheduledEvent] OFF;
PRINT 'End inserting test data'
GO

PRINT 'Database is ready for testing!'
GO
