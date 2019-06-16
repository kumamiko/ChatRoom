using Microsoft.AspNetCore.Mvc;

namespace ChatRoom.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewBag.Message = "使用SignalR";

            return View();
        }
    }
}
