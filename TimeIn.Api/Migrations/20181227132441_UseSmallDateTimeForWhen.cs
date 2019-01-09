using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TimeIn.Api.Migrations
{
    public partial class UseSmallDateTimeForWhen : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "when",
                table: "ScheduledEvent",
                type: "smalldatetime",
                nullable: false,
                oldClrType: typeof(DateTime));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "when",
                table: "ScheduledEvent",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "smalldatetime");
        }
    }
}
