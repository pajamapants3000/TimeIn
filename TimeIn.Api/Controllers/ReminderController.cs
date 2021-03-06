﻿using System;
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
    public class ReminderController : ControllerBase
    {
        private readonly ModelContext _context;

        public ReminderController(ModelContext context)
        {
            _context = context;

            if (_context.Reminder.Count() == 0)
            {
                _context.Reminder.Add(new Reminder { value = "Reminder1" });
                _context.SaveChanges();
            }
        }

        // GET: api/<controller>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reminder>>> Get()
        {
            return await _context.Reminder.ToListAsync();
        }

        // GET: api/<controller>/<id>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Reminder>> Get([FromRoute]int id)
        {
            return await _context.Reminder.FirstOrDefaultAsync(rem => rem.id == id);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult<Reminder>> Post([FromBody]Reminder newReminder)
        {
            _context.Reminder.Add(newReminder);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Post", newReminder);
        }

        // PATCH api/<controller>/<id>
        [HttpPatch("{id:int}")]
        public async Task<ActionResult<Reminder>> Patch([FromRoute] int id, [FromBody] ReminderPatchRequest reminderPatchRequest)
        {
            Reminder reminderToPatch = _context.Reminder.FirstOrDefault(rem => rem.id == id);

            if (reminderToPatch == null)
            {
                return NotFound();
            }
            else
            {
                reminderToPatch.value = (reminderPatchRequest.value ?? reminderToPatch.value);
                reminderToPatch.isCompleted = (reminderPatchRequest.isCompleted.HasValue ?
                    reminderPatchRequest.isCompleted.Value :
                    reminderToPatch.isCompleted);

                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}

