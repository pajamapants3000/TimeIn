namespace TimeIn.Api.Models
{
    public class ReminderPatchRequest
    {
        public string value { get; set; }
        public bool? isCompleted { get; set; }
    }
}
