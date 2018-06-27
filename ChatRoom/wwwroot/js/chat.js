﻿// The following sample code uses modern ECMAScript 6 features 
// that aren't supported in Internet Explorer 11.
// To convert the sample for environments that do not support ECMAScript 6, 
// such as Internet Explorer 11, use a transpiler such as 
// Babel at http://babeljs.io/. 
//
// See Es5-chat.js for a Babel transpiled version of the following code:

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();


//接收数据（文字，音乐，图片，链接）
connection.on("ReceiveData", (user, type, data) => {
    if (type === "text") {
        const msg = data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg;
        var username = document.getElementById("userInput").value;
        if (username == user) {
            encodedMsg = "<div class=\"msg self bounce\"><pre>" + user + " : " + msg + "</pre></div>";
        } else {
            encodedMsg = "<div class=\"msg others bounce\">" + user + " : " + msg + "</div>";
        }
        $("#messagesList").prepend("<li>" + encodedMsg + "</li>");
    } else if (type === "music") {
        var dataObj = JSON.parse(data)
        encodedMsg = "<div class=\"msg music bounce\">" + user + " 点播了 " + dataObj.name + "</div>";
        $("#messagesList").prepend("<li>" + encodedMsg + "</li>");

        ap.list.show();
        ap.list.add([{
            name: dataObj.name,
            artist: dataObj.artist,
            url: dataObj.url,
            cover: dataObj.cover + '?param=80x80',
            lrc: dataObj.lyric
        }]);
        //ap.skipForward();
        ap.list.switch(ap.list.audios.length - 1);
        ap.play();
    } else if (type === "image") {
      //图片添加放大事件
        encodedMsg = "<div>" + user + "发送了图片<br><br><a data-fancybox=\"gallery\" href="+ data +"><img class=\"msg image bounce\" src='" + data + "' ></div>";
        $("#messagesList").prepend("<li>" + encodedMsg + "</li>");
    } else if (type === "link") {
        encodedMsg = "<div>" + user + "发送了链接<br><a class=\"msg music bounce\" target='view_window' href='" + data + "'>" + data + "</a></div>";
        $("#messagesList").prepend("<li>" + encodedMsg + "</li>");
    }else if (type === "bili") {
        layui.use('layer', function(){
            var layer = layui.layer;
  
            layer.open({
                type: 2,
                title: data,
                shadeClose: true,
                shade: false,
                maxmin: true, //关闭最大化最小化按钮
                area: ['893px', '600px'],
                content: data,
                resizing: function(layero) {
					var index = layero[0].id.substr(layero[0].id.length-1,1);
                    var iframeId = "layui-layer-iframe" + index;
                    var layerId = "layui-layer" + index;
                    var iframe=document.getElementById(iframeId); 
                    var layer =document.getElementById(layerId);
                    iframe.style.height = (parseInt(layer.style.height) - 45) + "px";
                }
            });
        });     
    }else if (type === "info") {
        encodedMsg = "<div class=\"msg music bounce\">" + user + data + "</div>";
        $("#messagesList").prepend("<li>" + encodedMsg + "</li>");
    }
});

connection.start().catch(err => console.error(err.toString()));

//发送消息
document.getElementById("messageInput").addEventListener("keydown", event => {
    if (event.keyCode == 13) {
         const roomName = $("#roomName").text();
         if(roomName=="") return;
         const user = document.getElementById("userInput").value;
         const data = document.getElementById("messageInput").value;
         const type = "text";
         if (data != "") {
             connection.invoke("SendData", roomName, user, type, data).catch(err => console.error(err.toString()));
             event.preventDefault();
             $("#messageInput").val('');
         }
    }
});

//发送音乐
$("#btnMusic").click(function () {
    swal({
        title: '请输入歌曲名称/(网易)歌曲ID',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        animation: false,
        showCancelButton: true,
        confirmButtonText: '发送',
        cancelButtonText:"取消",
        showLoaderOnConfirm: true,
        preConfirm: (musicid) => {
            const user = document.getElementById("userInput").value;
            if(roomName=="") return;
            if (musicid!="") {
                $.get("music/get", { id: musicid }, function (result) { 
                    if (result.code === 0) {
                        const type = "music";
                        const roomName = $("#roomName").text();
                        const user = document.getElementById("userInput").value;
                        var jsonObj = { name: result.name, artist: result.artist, url: result.url, cover: result.cover, lyric: result.lyric };
                        const data = JSON.stringify(jsonObj);
                        //发送音乐链接
                        connection.invoke("SendData", roomName, user, type, data).catch(err => console.error(err.toString()));
                    } else {
                        swal({
                            type: 'error',
                            title: 'Oops...',
                            text: result.msg
                        });
                    }
                });
            }
        } 
    });
});

//发图片
$("#btnPic").click(function () {
    swal({
        title: '请输入图片链接',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        animation: false,
        showCancelButton: true,
        confirmButtonText: '发送',
        cancelButtonText:"取消",
        showLoaderOnConfirm: true,
        preConfirm: (data) => {
            const roomName = $("#roomName").text();
            if(roomName=="") return;
            const type = "image";
            const user = document.getElementById("userInput").value;
            connection.invoke("SendData", roomName, user, type, data).catch(err => console.error(err.toString()));
        } 
    });
});

//发链接
$("#btnLink").click(function () {
    swal({
        title: '请输入链接地址',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        animation: false,
        showCancelButton: true,
        confirmButtonText: '发送',
        cancelButtonText:"取消",
        showLoaderOnConfirm: true,
        preConfirm: (data) => {
            const roomName = $("#roomName").text();
            if(roomName=="") return;
            const type = "link";
            const user = document.getElementById("userInput").value;
            connection.invoke("SendData", roomName, user, type, data).catch(err => console.error(err.toString()));
        } 
    });
});

$("#btnBili").click(function () {
    swal({
        title: '请输入链接',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        animation: false,
        showCancelButton: true,
        confirmButtonText: '发送',
        cancelButtonText:"取消",
        showLoaderOnConfirm: true,
        preConfirm: (link) => {
            const roomName = $("#roomName").text();
            if(roomName=="") return;
            const type = "bili";
            const user = document.getElementById("userInput").value;
            if (link != null && link != "") {
                connection.invoke("SendData", roomName, user, type, link).catch(err => console.error(err.toString()));
                return;
            }
        } 
    });
});

//建房间
$("#btnCreate").click(async function () {
    const { value: formValues } = await swal({
        title: '创建房间',
        html:
            '<input id="swal-input1" placeholder="房间名称" class="layui-input"><br>' +
            '<input id="swal-input2" placeholder="总人数" class="layui-input">',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText:"取消",
        confirmButtonText: '确定',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-input1').value,
                capacity: document.getElementById('swal-input2').value
            }
        }
    });
    if (formValues) {
            //swal(JSON.stringify(formValues));
            var user = $.cookie('username'); 
            if( formValues.capacity <= 0 )
            {  swal({
                type: 'error',
                title: '房间人数不得小于1',
              });
             return;
            }
            if( formValues.capacity > 50 )
            {  swal({
                type: 'error',
                title: '房间人数不得大于50',
              });
             return;
            }
            if (formValues.name != "" && formValues.capacity != "") {
                $.post("/room/add", { name: formValues.name, host: user, capacity: formValues.capacity }, function (result) { 
                    if (result.code === 0) {
                        layui.use('table', function () {
                            var table = layui.table;
                            table.reload("roomList");
                        });
                        swal({
                            type: 'success',
                            title: '房间已建立',
                            showConfirmButton: false,
                            timer: 1000
                        });
                    } else {
                        swal({
                            type: 'error',
                            title: 'Oops...',
                            text: result.msg
                        });
                    }
                });
            }
        }
});

//进房间
$("#btnEnter").click(function () {
    swal({
        title: '请输入房间名称',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: '进入',
        cancelButtonText:"取消",
        showLoaderOnConfirm: true,
        preConfirm: (roomName) => {
                var user = $.cookie('username'); 
                if (roomName != "") {
                    $.get("/room/exist", { name: roomName }, function (result) {
                        if (result.code === 0) {
                            $("#roomName").text(roomName); 
                            $.get("/room/get", { name: roomName }, function (result) {
                                if (result.code === 0) {
                                    $("#roomCapacity").text(result.data.capacity);
                                }
                            });
                    		$.get("/history/list",{name:roomName,limit:20, page:1}, function(result){ 
                    			if(result.code=== 0){
                                    var html = '';
                                    for(var o in result.data){
                                      html+="<li><div class=\"msg others bounce\"><pre>"+result.data[o].createTime+"  "+result.data[o].userName+" : "+result.data[o].content+"</pre></div></li>";
                                    }
                                    $("#messagesList").prepend(html);
                                    $("#historyId").text(result.data[result.data.length-1].id);
                                }
                    		});
                   		    $("#btnCreate").hide();
                            $("#btnEnter").hide();
                            $("#btnRoomList").hide();
                            $("#btnLeave").show();
                   		    connection.invoke("EnterRoom", roomName, user).catch(err => console.error(err.toString()));
                        } else {
                            swal({
                                type: 'error',
                                title: '房间不存在',
                            });
                        }
                    });
          		  }
       	 } 
    });
});

//离开房间
$("#btnLeave").click(function () {
   if($("#roomName").text()==""){
     swal({
       type: 'info',
       title: '当前不在任何房间',
       showConfirmButton: false,
       timer: 1000
     });
     return;
   }
    swal({
        title: '确定退出?',
        type: 'warning',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText:"让我再考虑一下…",
    }).then((result) => {
        if (result.value) {
            var user = $.cookie('username'); 
            const roomName = $("#roomName").text();
            connection.invoke("LeaveRoom", roomName, user).catch(err => console.error(err.toString()));
            swal({
                type: 'success',
                title: '已退出',
                showConfirmButton: false,
                timer: 1000
            });
	        $("#btnCreate").show();
            $("#btnEnter").show();
            $("#btnRoomList").show();
            $("#btnLeave").hide();
            $("#roomName").text("");
            $("#roomCapacity").text("0");
            $("#linkMore").text("更多历史记录");
            document.getElementById("messagesList").innerHTML = "";
        }
    })
});

//房间信息
$("#btnRoomList").click( function () {
    $.get("/room/list", function (result) {
        if (result.code === 0) {
            var roomInfo = "";
            for (var o in result.data) {
                roomInfo += "<div class=\"msg music bounce\">" +
                    result.data[o].roomName + " / " + result.data[o].capacity +
                    "</div>";
            }
            swal({
                title: '房间总数: '+ result.count,
                html: roomInfo,
                animation: false,
                showConfirmButton: false
            })
        } 
    });
});

//获取历史
$("#linkMore").click(function () {
    if ($("#linkMore").text() === "没有更多历史记录") return;
    const currentid = $("#historyId").text();
    const roomName = $("#roomName").text(); 
    $.get("/history/pastList",{name:roomName,limit:20, id:currentid}, function(result){ 
        if(result.code=== 0){
            var html = '';
            if (result.data.length > 0) {
                for (var o in result.data) {
                    html += "<li><div class=\"msg others bounce\"><pre>" + result.data[o].createTime + "  " + result.data[o].userName + " : " + result.data[o].content + "</pre></div></li>";
                }
                $("#messagesList").append(html);
                $("#historyId").text(result.data[result.data.length - 1].id);
            } else {
                $("#linkMore").text("没有更多历史记录");
            }
        }
    });
});