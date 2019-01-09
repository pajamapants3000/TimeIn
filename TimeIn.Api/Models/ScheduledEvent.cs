using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeIn.Api.Models
{
    public class ScheduledEvent
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        [Column(TypeName="smalldatetime")]
        [Range(typeof(DateTime), "1/1/1900", "6/6/2079")]
        public DateTime when { get; set; }
        public int durationInMinutes { get; set; }
    }
}
