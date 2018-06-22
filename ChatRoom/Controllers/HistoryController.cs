using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatRoom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatRoom.Controllers
{
    public class HistoryController : Controller
    {
        ChatContext _context;
        public HistoryController(ChatContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> List(string name, int limit, int page)
        {
            var histories = await _context.Histories
                    .Where(t => t.RoomName == name)
                    .AsNoTracking()
                    .OrderByDescending(t => t.Id)
                    .Skip((page - 1) * limit).Take(limit)
                    .ToListAsync();
            return Json(new { code = 0, msg = "", data = histories });
        }

        public async Task<IActionResult> PastList(string name, int limit, int id)
        {
            var histories = await _context.Histories
                    .Where(t => t.RoomName == name && t.Id < id)
                    .AsNoTracking()
                    .OrderByDescending(t => t.Id)
                    .Take(limit)
                    .ToListAsync();
            return Json(new { code = 0, msg = "", data = histories });
        }

        public async Task<IActionResult> Clear(string name)
        {
            var room = await _context.Rooms.FindAsync(name);
            if (room!=null)
            {
                var histories = _context.Histories.Where(t => t.RoomName == name).ToList();
                _context.Histories.RemoveRange(histories);
                _context.SaveChanges();
                return Json(new { code = 0, msg = "OK" });
            }
            else
            {
                return Json(new { code = 1, msg = "房间不存在" });
            }
        }
    }
}