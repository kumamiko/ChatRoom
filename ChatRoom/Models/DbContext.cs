using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ChatRoom.Models
{
    public class ChatContext :DbContext
    {
        public ChatContext(DbContextOptions<ChatContext> options)
        : base(options) { }

        public ChatContext() { }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<History> Histories { get; set; }

        public static void SeedData(IServiceProvider serviceProvider)
        {

            using (var serviceScope = serviceProvider
                .GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<ChatContext>();

                context.Database.EnsureCreated();

                if (!context.Rooms.Any())
                    context.Rooms.Add(new Room { RoomName = "test" , Capacity = 10});
                if (!context.Histories.Any())
                    context.Histories.Add(new History { RoomName = "test", UserName = "test", Content = "测试内容", CreateTime = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") });
                context.SaveChanges();
            }
        }
    }
}
