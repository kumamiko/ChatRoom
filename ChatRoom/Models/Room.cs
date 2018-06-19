using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatRoom.Models
{
    public class Room
    {
        [Key]
        public string RoomName { get; set; }

        //容量
        [Required]
        public int Capacity { get; set; }
    }
}
