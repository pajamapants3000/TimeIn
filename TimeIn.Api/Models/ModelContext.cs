using Microsoft.EntityFrameworkCore;

namespace TimeIn.Api.Models
{
    public class ModelContext : DbContext
    {
        public ModelContext(DbContextOptions<ModelContext> options)
            : base(options) { }

        public DbSet<Reminder> Reminder { get; set; }
        public DbSet<ScheduledEvent> ScheduledEvent { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
