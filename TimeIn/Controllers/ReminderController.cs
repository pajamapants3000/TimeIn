﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using TimeIn.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TimeIn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReminderController : ControllerBase
    {
        private readonly ReminderContext _context;

        public ReminderController(ReminderContext context)
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

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult<Reminder>> Post([FromBody]Reminder newReminder)
        {
            _context.Reminder.Add(newReminder);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Post", newReminder);
        }
    }
}

