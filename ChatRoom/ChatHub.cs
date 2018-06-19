using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatRoom.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ChatRoom
{

    public class ChatHub : Hub
    {
        ChatContext _context;

        public ChatHub(ChatContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception e)
        {
            await base.OnDisconnectedAsync(e);
        }

        public async Task SendData(string roomName, string user, string type, string data)
        {
            if (type == "text")
            {
                _context.Histories.Add(new History
                {
                    RoomName = roomName,
                    UserName = user,
                    Content = data,
                    CreateTime = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                });
                _context.SaveChanges();
            }

            await Clients.Group(roomName).SendAsync("ReceiveData", user, type, data);
        }

        public async Task EnterRoom(string roomName, string user)
        {
            var room = _context.Rooms.Find(roomName);

            if (room != null)
            {
                //注册加入聊天室的addRoom方法  
                await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
                await Clients.Group(roomName).SendAsync("ReceiveData", user, "info", " 加入房间.");
            }
        }

        public async Task LeaveRoom(string roomName, string user)
        {
            var room = _context.Rooms.Find(roomName);
            if (room != null)
            {
                //退出聊天室 
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
                await Clients.Group(roomName).SendAsync("ReceiveData", user, "info", " 离开了房间.");
            }
        }
    }
}
