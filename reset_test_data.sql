-- Reset data for testing in TimeIn_01_Test
USE [TimeIn.Dev_01_Test]
GO

PRINT 'Begin TRUNCATE TABLE REMINDER'
TRUNCATE TABLE REMINDER
PRINT 'End TRUNCATE TABLE REMINDER'
GO

PRINT 'Begin inserting test data'
SET IDENTITY_INSERT [Reminder] ON;
INSERT [Reminder] (id, value)
    SELECT id, value FROM OPENROWSET (BULK 'G:\GoogleDrive-otripleg\Workspace\TimeIn\testData.json', SINGLE_CLOB) as j
    CROSS APPLY OPENJSON(BulkColumn, '$."Reminder"')
        WITH
        (
            id int,
            value varchar(100)
        )
SET IDENTITY_INSERT [Reminder] OFF;
PRINT 'End inserting test data'
GO

PRINT 'Database is ready for testing!'
GO
