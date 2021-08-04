// document.write("<script language=javascript th:src='@{/static/layui/layui.js}'></script>");


let layer ;
let socket;

window.onload = function () {
    layer = layui.layer;
}

// layer.msg($('#user-val').val());
let user = $("#user-val").val();
function openSocket() {
    if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        // console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        let socketUrl;
        if (user!=='' || user !== undefined){
            socketUrl = "http://localhost/ws/" + user;
        }else {
            socketUrl = "http://localhost/ws/null"
        }
        socketUrl = socketUrl.replace("https", "ws").replace("http", "ws");
        console.log(socketUrl);
        if (socket != null) {
            socket.close();
            socket = null;
        }
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
            console.log("websocket已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function (msg) {
            alert((msg.data));
            // console.log(msg.data);
            //发现消息进入    开始处理前端触发逻辑
        };
        //关闭事件
        socket.onclose = function () {
            console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
            console.log("websocket发生了错误");
        }
    }
}

function sendMessage() {
    if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    } else {
        // console.log("您的浏览器支持WebSocket");
        // console.log('{"targetUser":"'+$("#targetUser").val()+'","contentText":"'+$("#contentText").val()+'"}');
        // socket.send('{"targetUser":"' + $("#targetUser").val() + '","contentText":"' + $("#contentText").val() + '"}');
        socket.send('{"targetUser":"201821096007"' + ',"contentText":"Hello! I am ' + user + '"}');
    }
}
// openSocket()