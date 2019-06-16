using ChatRoom.Services.NeteaseMusic;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace ChatRoom.Controllers
{
    public class MusicController : Controller
    {

        public IActionResult Get(string type, string id)
        {
            try
            {
                string json = MusicApi.Search(id, 1, 0, 1);
                var jsonObj = JsonConvert.DeserializeObject<dynamic>(json);
                var result = jsonObj.result;
                if (result != null)
                {
                    var songs = result.songs;
                    if (songs != null)
                    {
                        string musicId = songs[0].id;
                        string detailjson = MusicApi.Detail(musicId);
                        var detailjsonObj = JsonConvert.DeserializeObject<dynamic>(detailjson);
                        string lyricjson = MusicApi.Lyric(musicId);
                        var lyricjsonObj = JsonConvert.DeserializeObject<dynamic>(lyricjson);
                        string lyric = string.Empty;
                        if (lyricjsonObj.nolyric == null && lyricjsonObj.uncollected == null) lyric = lyricjsonObj.lrc.lyric;
                        var url = $"http://music.163.com/song/media/outer/url?id={musicId}.mp3";
                        var name = songs[0].name;
                        var artist = songs[0].artists[0].name;
                        var cover = detailjsonObj.songs[0].album.picUrl;
                        return Json(new { code = 0, url = url, name = name, artist = artist, cover = cover, lyric = lyric, msg = "" });
                    }
                }
                return Json(new { code = 1,  msg = "获取音乐链接失败" });
            }
            catch (Exception ex)
            {
                return Json(new { code = 1,  msg = ex.ToString() }) ;
            }
        }
    }
}