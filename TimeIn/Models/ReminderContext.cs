using Microsoft.EntityFrameworkCore;

namespace TimeIn.Models
{
    public class ReminderContext : DbContext
    {
        public ReminderContext(DbContextOptions<ReminderContext> options)
            : base(options) { }

        public DbSet<Reminder> Reminder { get; set; }
    }
}
