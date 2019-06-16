using ChatRoom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ChatRoom.Controllers
{
    public class RoomController : Controller
    {
        ChatContext _context;
        public RoomController(ChatContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Get(string name)
        {
            var room = await _context.Rooms.FindAsync(name);
            if (room != null)
            {
                return Json(new { code = 0, msg = "", data = room });
            }
            else {
                return Json(new { code = 1, msg = "房间不存在" });
            }
        }

        public async Task<IActionResult> List()
        {
            var rooms = await _context.Rooms
                    .AsNoTracking()
                    .ToListAsync();
            return Json(new { code = 0, msg = "", count = rooms.Count, data = rooms });
        }


        [HttpPost]
        public IActionResult Add(string name, string host, string capacity)
        {
            try
            {

                if (_context.Rooms.Any(t => t.RoomName == name))
                {
                    return Json(new { code = 1, msg = "房间名不能重复" });
                }

                Room newRoom = new Room
                {
                    RoomName = name,
                    Capacity = int.Parse(capacity)
                };
                _context.Rooms.Add(newRoom);
                _context.SaveChanges();
                return Json(new { code = 0, msg = "OK" });
            }
            catch (Exception ex)
            {
                return Json(new { code = 1, msg = ex.ToString() });
            }
        }

        public IActionResult Delete(string name)
        {
            try
            {
                _context.Rooms.Remove(_context.Rooms.Find(name));
                _context.SaveChanges();
                return Json(new { code = 0, msg = "OK" });
            }
            catch (Exception)
            {
                return Json(new { code = 1, msg = "删除失败" });
            }
        }

        public IActionResult Exist(string name)
        {
            try
            {
                var room = _context.Rooms.Find(name);
                if (room != null)
                    return Json(new { code = 0 });
                else
                    return Json(new { code = 1, msg = "房间不存在" });
            }
            catch (Exception)
            {
                return Json(new { code = 1, msg = "查询失败" });
            }
        }
    }
}