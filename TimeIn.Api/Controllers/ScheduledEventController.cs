using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TimeIn.Api.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TimeIn.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ScheduledEventController : ControllerBase
    {
        private readonly ModelContext _context;

        public ScheduledEventController(ModelContext context)
        {
            _context = context;

            if (_context.ScheduledEvent.Count() == 0)
            {
                _context.ScheduledEvent.Add(new ScheduledEvent
                {
                    name = "ScheduledEvent1",
                    description = "Seeded scheduled event",
                    when = DateTime.UtcNow,
                    durationInMinutes = 60,
                });
                _context.SaveChanges();
            }
        }

        // GET: api/<controller>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduledEvent>>> Get()
        {
            return await _context.ScheduledEvent.ToListAsync();
        }

        // GET: api/<controller>/<id>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ScheduledEvent>> Get([FromRoute]int id)
        {
            return await _context.ScheduledEvent.FirstOrDefaultAsync(se => se.id == id);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult<ScheduledEvent>> Post([FromBody]ScheduledEvent newScheduledEvent)
        {
            _context.ScheduledEvent.Add(newScheduledEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Post", newScheduledEvent);
        }

        // PATCH api/<controller>/<id>
        [HttpPatch("{id:int}")]
        public async Task<ActionResult<ScheduledEvent>> Patch([FromRoute] int id, [FromBody] ScheduledEventPatchRequest scheduledEventPatchRequest)
        {
            ScheduledEvent scheduledEventToPatch = _context.ScheduledEvent.FirstOrDefault(se => se.id == id);

            if (scheduledEventToPatch == null)
            {
                return NotFound();
            }
            else
            {
                scheduledEventToPatch.name = (scheduledEventPatchRequest.name ?? scheduledEventToPatch.name);
                scheduledEventToPatch.description = (scheduledEventPatchRequest.description ?? scheduledEventToPatch.description);
                scheduledEventToPatch.when = (scheduledEventPatchRequest.when.HasValue ?
                    scheduledEventPatchRequest.when.Value :
                    scheduledEventToPatch.when);
                scheduledEventToPatch.durationInMinutes = (scheduledEventPatchRequest.durationInMinutes.HasValue ?
                    scheduledEventPatchRequest.durationInMinutes.Value :
                    scheduledEventToPatch.durationInMinutes);

                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}

