//更改昵称
document.getElementById("userInput").addEventListener("keydown", event => {
    if (event.keyCode == 13) {
        var cuser = $.cookie('username'); 
        if (cuser !== "") {  
            var user = document.getElementById("userInput").value;
            if (cuser != user) {
            	$.cookie('username', user, { expires: 7 });
                swal({
                    type: 'success',
                    title: "更改昵称：" + user,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }
});

//检查cookie 
function checkCookie() {  
    var user = $.cookie('username');
    if (user != "" && user != undefined && user != 'null') {  
        swal({
            type: 'success',
            title: user + " 欢迎回来 ",
            showConfirmButton: false,
            timer: 1000
        })
        document.getElementById("userInput").value = user;
    } else {
        swal({
            title: '请输入你的昵称',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: '确定',
            showLoaderOnConfirm: true,
            preConfirm: (user) => {
                if (user != "" && user != null) {  
                    $.cookie('username', user, { expires: 7 });
          	        document.getElementById("userInput").value = user;
                }
            } 
            });
    }  
}

checkCookie(); 

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    loop: 'none',
    fixed: true,
    lrcType: 1,
    listFolded: false,
    listMaxHeight: 90,
});
