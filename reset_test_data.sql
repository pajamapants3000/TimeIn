-- Reset data for testing in TimeIn_01_Test
USE [TimeIn.Dev_01_Test]
GO

PRINT 'Begin TRUNCATE TABLE REMINDER'
TRUNCATE TABLE REMINDER
PRINT 'End TRUNCATE TABLE REMINDER'
GO

PRINT 'Begin inserting test data'
SET IDENTITY_INSERT [Reminder] ON;
INSERT INTO [Reminder] ([id], [value])
    VALUES
        (1, N'Reminder One'),
        (2, N'Reminder Two'),
        (3, N'Reminder Three'),
        (4, N'Reminder Four');
SET IDENTITY_INSERT [Reminder] OFF;
PRINT 'End inserting test data'
GO

PRINT 'Database is ready for testing!'
GO
