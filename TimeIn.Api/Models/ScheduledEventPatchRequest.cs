using System;

namespace TimeIn.Api.Models
{
    public class ScheduledEventPatchRequest
    {
        public string name { get; set; }
        public string description { get; set; }
        public DateTime? when { get; set; }
        public int? durationInMinutes { get; set; }
    }
}
