// console.log($('#distribution').val());
let playerArr = $('#distribution').val().split('#');
let player1_Id = playerArr[0].split('@')[1];
let player2_Id = playerArr[1].split('@')[1];

let playerNameArr = $('#distributionUsername').val().split('#');

let player1_name = playerNameArr[0].split('@')[1];
let player2_name = playerNameArr[1].split('@')[1];

let nowPlayer = player2_Id;

$(document).ready(function () {
    $('#chat_content').val("");
});


let timeLeft = 15;

setInterval(function () {
    if (nowPlayer === player1_Id){
        $('#player2_chance').text("");
        if (timeLeft === 0){
            nowPlayer = player2_Id;
            $('#player1_chance').text("");
            changeChance();
            $('#player1_chance').text("");
        }
        $('#player1_chance').text(timeLeft--);
    }else {
        $('#player1_chance').text("");
        if (timeLeft === 0){
            nowPlayer = player1_Id;
            $('#player2_chance').text("");
            changeChance();
            $('#player2_chance').text("");
        }
        $('#player2_chance').text(timeLeft--);
    }
},1000);



$('#player1_name').text(player1_name);
$('#player2_name').text(player2_name);

let socket = null;
if (typeof (WebSocket) === undefined) {
    console.log("浏览器不支持websocket");
} else {
    if ($('#userid').val() !== '') {
        let socketUrl = "ws://121.37.153.241/ws/" + $('#userid').val()+"/game";
        // let socketUrl = "ws://www.cmonlineide.top/ws/" + $('#userid').val()+"/game";
        // let socketUrl = "ws://www.shaoming.online/ws/" + $('#userid').val()+"/game";
        // let socketUrl = "ws://localhost/ws/" + $('#userid').val()+"/game";
        socket = new WebSocket(socketUrl);
        // socket.onopen = function () {
            // console.log("websocket 打开！user=" + $('#userid').val());
        // };
        
        // 接收信息
		let infoArr ;
		socket.onmessage = function (info) {
            let msg = info.data;
            // console.log(msg);
            if (msg.startsWith('@')) {
				// console.log(msg);
				infoArr = msg.split(',');
                //  id
                let nowPy = infoArr[0].split(':')[1];
                let step = infoArr[1].split(':')[1];
				//  id
                let nextPy = infoArr[2].split(':')[1];
                otherPlayerMove(nowPy,step);
                nowPlayer = nextPy;
				// console.log(nowPlayer);
            }else if (msg.startsWith('#')){
                let oldText = $('#chat_content').val();
                $('#chat_content').val(oldText+msg.substring(1));
            }else if (msg.startsWith('outline:out')){
                layui.use('layer',function () {
                    let layer = layui.layer;
                    layer.msg('对方玩家已经断线或离开房间.......', {
                        time: 10000, //20s后自动关闭
                        btn: ['好的'],
                        shade:0.8,
                        btn1:function () {
                            window.location.href = '/';
                        }
                    });
                })
            }
        };

        socket.onclose = function () {
            console.log("websocket关闭！");
        };

        socket.onerror = function () {
            console.log("websocket发生错误！");
        };
    }
}


//聊天信息实现
$('#chat_msg').keyup(function (e) {
    let keyCode = e.which;
    if (keyCode === 13){
        let myMsg = $('#username').val() + '说:\n' + $('#chat_msg').val() + '\n';
        // console.log('{"targetUser":"' + $('#target').val() + '","contentText":"#' + myMsg + '"}');
        socket.send('{"targetUser":"' + $('#target').val() + '","contentText":"#' + myMsg + '"}');
        $('#chat_msg').val("");
        let oldText = $('#chat_content').val();
        $('#chat_content').val(oldText+myMsg);
    }
});


$(window).bind('beforeunload', function(e){
    socket.send('{"targetUser":"' + $('#target').val() + '","contentText":"outline:out"}');
    // return e.returnValue = "数据尚未保存，离开后可能会导致数据丢失\\n\\n您确定要离开吗？";
});


// console.log("player1_Id" + player1_Id);
// console.log("player2_Id" + player2_Id);

function sendRandom(random_step) {
	random_step = Number(random_step);
    if (random_step === 6) {
        socket.send('{"targetUser":"' + $('#target').val() + '","contentText":"@nowPlayer:' + $('#userid').val() + ',step:' + random_step + ',nextPlayer:' + $('#userid').val() + '"}');
        layui.use('layer',function () {
            let layer = layui.layer;
            layer.msg("摇到6还可以摇一次哦！");
        });
    } else {
        socket.send('{"targetUser":"' + $('#target').val() + '","contentText":"@nowPlayer:' + $('#userid').val() + ',step:' + random_step + ',nextPlayer:' + $('#target').val() + '"}');
    	nowPlayer = $('#target').val();
    }
}


let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');


//边框大小
let size = 644;

canvas.width = size;
canvas.height = size;


//函数

/**该方法用来绘制一个有填充色的圆角矩形
 *@param cxt:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param fillColor:填充颜色
 **/
function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
    //圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
        return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值
    cxt.fill();
    cxt.restore();
}


/**该方法用来绘制圆角矩形
 *@param cxt:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param lineWidth:线条粗细
 *@param strokeColor:线条颜色
 **/
function strokeRoundRect(cxt, x, y, width, height, radius, /*optional*/ lineWidth, /*optional*/ strokeColor) {
    //圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
        return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边
    drawRoundRectPath(cxt, width, height, radius);
    cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2
    cxt.strokeStyle = strokeColor || "#000";
    cxt.stroke();
    cxt.restore();
}

function drawRoundRectPath(cxt, width, height, radius) {
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //上边线
    cxt.lineTo(width - radius, 0);

    //右上角圆弧
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}

//蛇形数组
let arr = [];
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 1) {
        for (let j = i * 10 - 9; j <= i * 10; j++) {
            arr[j - 1] = j;
        }
    } else {
        for (let j = i * 10, k = i * 10 - 9; j >= i * 10 - 9, k <= i * 10; j--, k++) {
            arr[k - 1] = j;
        }
    }
}

for (let i = 0; i < 10; i++) {
    for (let j = i * 10, k = i * 10 + 9; j < i * 10 + 5, k > i * 10 + 4; j++, k--) {
        let tmp = arr[j];
        arr[j] = arr[k];
        arr[k] = tmp;
    }
}

//映射数组
let map = [];
for (let i = 0; i < 100; i++) {
    map.push(i + 1);
}

//陷阱设置
map[93] = -58;
map[91] = -2;
map[12] = -3;
map[31] = -5;
map[41] = -24;
map[67] = -20;
map[71] = -21;
map[34] = -30;

//梯子设置
map[23] = 63;
map[7] = 14;
map[82] = 98;
map[40] = 80;
map[73] = 93;
map[65] = 85;

//圆角矩形
let x = 8;
let y = 8;
let width = 60;
let height = 60;
let radirus = 10;
let colors = ['#ffcc77', '#ff9933'];
let color;
let count = 1;

// 设置字体
ctx.font = "18px lighter Arial";
// 设置颜色
ctx.fillStyle = "#000000";
// 设置水平对齐方式
ctx.textAlign = "right";
// 设置垂直对齐方式
ctx.textBaseline = "middle";
// 绘制文字（参数：要写的字，x坐标，y坐标）


//加载图片
var crown = new Image();
var dinosaur1 = new Image();
var dinosaur2 = new Image();

//皇冠
crown.src = "/static/images/game/crown.png";
//玩家1
dinosaur1.src = "/static/images/game/dinosaur1.png";
//玩家2
dinosaur2.src = "/static/images/game/dinosaur2.png";


let d1 = $('#dinosaur1');
let d2 = $('#dinosaur2');


//绘制方格背景
//边框
strokeRoundRect(ctx, 0, 0, size, size, 20, 10, "orange");
// 填充格子
for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
        if (count % 2 === 1) {
            color = colors[0];
        } else {
            color = colors[1];
        }
        fillRoundRect(ctx, x, y, width, height, radirus, color);

        ctx.fillText(arr[100 - count], x + 53, y + 49);
        count++;
        x += (width + 3)
    }
    let tmp = colors[0];
    colors[0] = colors[1];
    colors[1] = tmp;
    x = 8;
    y += (height + 3);
}
crown.onload = function () {
    ctx.drawImage(crown, 12, 17, 55, 46);
}





//移动控制区  计算起点与终点坐标

let player1_pos = 1;
let player2_pos = 1;
let trapPos_1 = -1;
let ladderPos_1 = -1;
let trapPos_2 = -1;
let ladderPos_2 = -1;
let backFlag_1 = false;
let backFlag_2 = false;
let trapFlag_1 = false;
let trapFlag_2 = false;
let ladderBottomPos_1 = -1;
let ladderBottomPos_2 = -1;

let last_pos_1 = -1;
let last_pos_2 = -1;

function random(random_step, dinosaur) {
	// console.log("random_step:"+random_step);
	random_step = Number(random_step);
    if (dinosaur.attr('name') === 'play1') {
        last_pos_1 = player1_pos;
        if (player1_pos + random_step < 100) {
            if (map[player1_pos + random_step - 1] > 0) {
                //遇到梯子格子
                if (map[player1_pos + random_step - 1] > player1_pos + random_step) {
                    ladderPos_1 = map[player1_pos + random_step - 1];
                    ladderBottomPos_1 = player1_pos + random_step;
                } else { //普通格子
                    player1_pos += random_step;
                }
            } else {
                //有陷阱
                trapFlag_1 = true;
                trapPos_1 = player1_pos + random_step;
                player1_pos = player1_pos + random_step + map[player1_pos + random_step - 1];
                while (map[player1_pos - 1] < 0) {
                    trapPos_1 = player1_pos;
                    player1_pos += map[player1_pos - 1];
                }
            }
            if (player1_pos < 0) {
                player1_pos = 1;
            }
        } else if (player1_pos + random_step === 100) {

            player1_pos = 100;
            // window.location.reload();
        } else {
            //需要后退
            backFlag_1 = true;
            player1_pos = 100 - (random_step - (100 - player1_pos));
        }
        // console.log("now position = " + player1_pos);
        //last_pos 上次的位置  player1_pos 本次目标位置
        moveToPos(last_pos_1, player1_pos, dinosaur);
    } else {
        last_pos_2 = player2_pos;
        if (player2_pos + random_step < 100) {
            if (map[player2_pos + random_step - 1] > 0) {
                //遇到梯子格子
                if (map[player2_pos + random_step - 1] > player2_pos + random_step) {
                    ladderPos_2 = map[player2_pos + random_step - 1];
                    ladderBottomPos_2 = player2_pos + random_step;
                } else { //普通格子
                    player2_pos += random_step;
                }
            } else {
                //有陷阱
                trapFlag_2 = true;
                trapPos_2 = player2_pos + random_step;
                player2_pos = player2_pos + random_step + map[player2_pos + random_step - 1];
                while (map[player2_pos - 1] < 0) {
                    trapPos_2 = player2_pos;
                    player2_pos += map[player2_pos - 1];
                }
            }
            if (player2_pos < 0) {
                player2_pos = 1;
            }
        } else if (player2_pos + random_step === 100) {

            player2_pos = 100;
            // window.location.reload();
        } else {
            //需要后退
            backFlag_2 = true;
            player2_pos = 100 - (random_step - (100 - player2_pos));
        }
        // console.log("now position = " + player2_pos);
        //last_pos 上次的位置  player2_pos 本次目标位置
        moveToPos(last_pos_2, player2_pos, dinosaur);
    }

}


//是否向右
let rightDirect = true;
// 统计100步 先遍历一遍地图获取坐标
var countStep = 1;

//像素点坐标
var pos = [{
    'margin-left': '8px',
    'margin-top': '580px',
    'transform': 'matrix(1, 0, 0, 1, 0, 0)'
}];


//动画
function moveOneStep() {
    var css;
    let left = d1.css('margin-left');
    let top = d1.css('margin-top');
    let transform = d1.css('transform');
    let vl = parseInt(left);
    let vt = parseInt(top);
    // console.log("("+left+","+top+")");
    if (countStep <= 100) {
        pos.push({
            'margin-left': left,
            'margin-top': top,
            'transform': transform
        });
    }
    if (vl < 72 && vt === 13) {
        css = {
            'margin-left': '8px',
            'margin-top': '580px',
            'transform': 'matrix(1, 0, 0, 1, 0, 0)'
        };
        d1.css(css);
        rightDirect = true;
    } else {
        if (rightDirect) {
            if (vl > 520) {
                css = {
                    'margin-top': (vt - 63) + 'px',
                    'transform': 'matrix(-1, 0, 0, 1, 0, 0)'
                }
                rightDirect = false;
            } else {
                css = {
                    'margin-left': (vl + 64) + 'px'
                }
            }
        } else {
            if (vl < 72) {
                css = {
                    'margin-top': (vt - 63) + 'px',
                    'transform': 'matrix(1, 0, 0, 1, 0, 0)'
                }
                rightDirect = true;
            } else {
                css = {
                    'margin-left': (vl - 64) + 'px'
                }
            }
        }
        d1.css(css);
        countStep++;
    }
}

//初始化pos坐标信息

for (let i = 0; i < 100; i++) {
    moveOneStep();
}

//动画延时 ms
let delayTime = 1;
//动画移动速度 ms
let moveSpeed = 250;

//当前位置移动到指定位置
function movePointToPoint(toPoint, dinosaur) {
    if (dinosaur.attr("name") === "play1") {
        setTimeout(function () {
            d1.animate({
                marginLeft: pos[toPoint]["margin-left"],
                marginTop: pos[toPoint]["margin-top"]
            }, function () {
                d1.css('transform', pos[toPoint]["transform"]);
            });
        }, delayTime);
        player1_pos = toPoint;
    } else {
        setTimeout(function () {
            d2.animate({
                marginLeft: pos[toPoint]["margin-left"],
                marginTop: pos[toPoint]["margin-top"]
            }, function () {
                d2.css('transform', pos[toPoint]["transform"]);
            });
        }, delayTime);
        player2_pos = toPoint;
    }

}

// 从某一位置移动到另一位置
function moveToPos(fromPos, toPos, dinosaur) {
    // console.log(dinosaur.attr("name") + ":" + fromPos + "->" + toPos);
    if (dinosaur.attr("name") === "play1") {
        //前进
        if (toPos >= fromPos && backFlag_1 === false && trapFlag_1 === false) {
            //还差几步走向终点
            if (toPos === 100 && fromPos !== 100) {
                for (let i = fromPos; i <= toPos; i++) {
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        d1.animate({
                            marginLeft: pos[i]["margin-left"],
                            marginTop: pos[i]["margin-top"]
                        }, moveSpeed, function () {
                            d1.css('transform', pos[i]["transform"]);
                        });
                        // console.log(pos[i]);
                    }, delayTime);
                }
                ///
                winner(dinosaur);
                movePointToPoint(0, dinosaur);
                // player1_pos = 1;
            } else {
                //遇到梯子
                var audioElement = document.createElement('audio');
                if (ladderPos_1 !== -1 && ladderBottomPos_1 !== -1) {
                    for (let i = fromPos; i <= ladderBottomPos_1; i++) {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            d1.animate({
                                marginLeft: pos[i]["margin-left"],
                                marginTop: pos[i]["margin-top"]
                            }, moveSpeed, function () {
                                d1.css('transform', pos[i]["transform"]);
                            });
                            // console.log(pos[i]);
                        }, delayTime);
                    }
                    movePointToPoint(ladderPos_1, dinosaur);
                    ladderPos_1 = -1;
                    ladderBottomPos_1 = -1;
                    setTimeout(function () {
                        audioElement.setAttribute('src', '/static/sound/ladder.mp3');
                        audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
                        audioElement.load()
                        $.get();
                        audioElement.addEventListener("load", function () {
                            audioElement.play();
                        }, true);
                        audioElement.play();
                    }, playDelayTime);

                } else {
                    for (let i = fromPos; i <= toPos; i++) {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            d1.animate({
                                marginLeft: pos[i]["margin-left"],
                                marginTop: pos[i]["margin-top"]
                            }, moveSpeed, function () {
                                d1.css('transform', pos[i]["transform"]);
                            });
                            // console.log(pos[i]);
                        }, delayTime);
                    }
                }
            }
            //后退
        } else {
            if (fromPos > 94) {
                for (let i = fromPos; i <= 100; i++) {
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        d1.animate({
                            marginLeft: pos[i]["margin-left"],
                            marginTop: pos[i]["margin-top"]
                        }, moveSpeed, function () {
                            d1.css('transform', pos[i]["transform"]);
                        });
                    }, delayTime);
                }
                for (let i = 100; i >= toPos; i--) {
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        d1.animate({
                            marginLeft: pos[i]["margin-left"],
                            marginTop: pos[i]["margin-top"]
                        }, moveSpeed, function () {
                            d1.css('transform', pos[i]["transform"]);
                        });
                    }, delayTime);
                }
                backFlag_1 = false;
                //陷阱后退
            } else {

                // console.log("后退！");
                // console.log(fromPos + ":" + trapPos);
                var audioElement = document.createElement('audio');
                if (trapPos_1 !== -1) {
                    for (let i = fromPos; i <= trapPos_1; i++) {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            d1.animate({
                                marginLeft: pos[i]["margin-left"],
                                marginTop: pos[i]["margin-top"]
                            }, moveSpeed, function () {
                                d1.css('transform', pos[i]["transform"]);
                            });
                            // console.log(pos[i]);
                        }, delayTime);
                    }
                    trapPos_1 = -1;
                }
                movePointToPoint(toPos, dinosaur);
                setTimeout(function () {
                    audioElement.setAttribute('src', '/static/sound/trap.mp3');
                    audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
                    audioElement.load()
                    $.get();
                    audioElement.addEventListener("load", function () {
                        audioElement.play();
                    }, true);
                    audioElement.play();
                }, playDelayTime);
                trapFlag_1 = false;
            }
        }
    } else {
        //前进
        if (toPos >= fromPos && backFlag_2 === false && trapFlag_2 === false) {
            //还差几步走向终点
            if (toPos === 100 && fromPos !== 100) {
                for (let i = fromPos; i <= toPos; i++) {
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        d2.animate({
                            marginLeft: pos[i]["margin-left"],
                            marginTop: pos[i]["margin-top"]
                        }, moveSpeed, function () {
                            d2.css('transform', pos[i]["transform"]);
                        });
                        // console.log(pos[i]);
                    }, delayTime);
                }
                ///
                winner(dinosaur);
                movePointToPoint(0, dinosaur);
                // player1_pos = 1;
            } else {
                //遇到梯子
                var audioElement = document.createElement('audio');
                if (ladderPos_2 !== -1 && ladderBottomPos_2 !== -1) {
                    for (let i = fromPos; i <= ladderBottomPos_2; i++) {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            d2.animate({
                                marginLeft: pos[i]["margin-left"],
                                marginTop: pos[i]["margin-top"]
                            }, moveSpeed, function () {
                                d2.css('transform', pos[i]["transform"]);
                            });
                            // console.log(pos[i]);
                        }, delayTime);
                    }
                    movePointToPoint(ladderPos_2, dinosaur);
                    ladderPos_2 = -1;
                    ladderBottomPos_2 = -1;
                    setTimeout(function () {
                        audioElement.setAttribute('src', '/static/sound/ladder.mp3');
                        audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
                        audioElement.load()
                        $.get();
                        audioElement.addEventListener("load", function () {
                            audioElement.play();
                        }, true);
                        audioElement.play();
                    }, playDelayTime);

                } else {
                    for (let i = fromPos; i <= toPos; i++) {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            d2.animate({
                                marginLeft: pos[i]["margin-left"],
                                marginTop: pos[i]["margin-top"]
                            }, moveSpeed, function () {
                                d2.css('transform', pos[i]["transform"]);
                            });
                            // console.log(pos[i]);
                        }, delayTime);
                    }
                }
            }
            //后退
        } else {
            if (fromPos > 94) {
                for (let i = fromPos; i <= 100; i++) {
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        d2.animate({
                            marginLeft: pos[i]["margin-left"],
                            marginTop: pos[i]["margin-top"]
                        }, moveSpeed, function () {
                            d2.css('transform', pos[i]["transform"]);
                        });
                    }, delayTime);
                }
                for (let i = 100; i >= toPos; i--) {
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        d2.animate({
                            marginLeft: pos[i]["margin-left"],
                            marginTop: pos[i]["margin-top"]
                        }, moveSpeed, function () {
                            d2.css('transform', pos[i]["transform"]);
                        });
                    }, delayTime);
                }
                backFlag_2 = false;
                //陷阱后退
            } else {
                // console.log("后退！");
                // console.log(fromPos + ":" + trapPos);
                var audioElement = document.createElement('audio');
                if (trapPos_2 !== -1) {
                    for (let i = fromPos; i <= trapPos_2; i++) {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            d2.animate({
                                marginLeft: pos[i]["margin-left"],
                                marginTop: pos[i]["margin-top"]
                            }, moveSpeed, function () {
                                d2.css('transform', pos[i]["transform"]);
                            });
                            // console.log(pos[i]);
                        }, delayTime);
                    }
                    trapPos_2 = -1;
                }
                movePointToPoint(toPos, dinosaur);
                setTimeout(function () {
                    audioElement.setAttribute('src', '/static/sound/trap.mp3');
                    audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
                    audioElement.load()
                    $.get();
                    audioElement.addEventListener("load", function () {
                        audioElement.play();
                    }, true);
                    audioElement.play();
                }, playDelayTime);
                trapFlag_2 = false;
            }
        }
    }


}


function winner(dinosaur) {
    alert('恭喜玩家' + (dinosaur.attr('name') === 'play1' ? $('#player1_name').text() : $('#player2_name').text()) + '赢了!');
    window.location.reload();
}

//掷骰子

function toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
}

//点击触发时间范围
let clickDelayTime = 0;
let playDelayTime = 1;



$('#player2_chance').css('background-color', 'cornflowerblue');


$("#roll-button").click(function () {
	if (clickDelayTime === 0) {
		clickDelayTime = 25;
		let index = setInterval(function () {
			clickDelayTime--;
			if (clickDelayTime === 0) {
				clearInterval(index);
			}
		}, 100);
		//轮到当前用户
		if (nowPlayer === $('#userid').val()) {
			playerMove(nowPlayer, Math.floor(Math.random() * 6) + 1);
		}else {
		    layui.use('layer',function () {
                let layer = layui.layer;
                layer.msg("别急,还没到你哦！");
            });
        }
	}
});

function playerMove(player,step) {
    //加载音效
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/static/sound/dice.mp3');
    audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
    audioElement.load();
	$.get();
    audioElement.addEventListener("load", function () {
        audioElement.play();
    }, true);
    audioElement.play();

    //摇骰子
    const dice = [...document.querySelectorAll(".die-list")];
    dice.forEach(die => {
        toggleClasses(die);
        die.dataset.roll = step;
    });
    setTimeout(function () {
        if (player === player1_Id) {
            sendRandom(step);
            random(step, d1);
            changeProgress()
        } else {
            sendRandom(step);
            random(step, d2);
            changeProgress()
        }
        if (step > 3) {
            playDelayTime = 1550;
        } else {
            playDelayTime = 600;
        }
    }, 1250);
    setTimeout(function () {
        audioElement.setAttribute('src', '/static/sound/' + step + 'step.mp3');
        audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
        audioElement.load()
        $.get();
        audioElement.addEventListener("load", function () {
            audioElement.play();
        }, true);
        audioElement.play();
        changeChance();
    }, 1550);
}

function otherPlayerMove(player,step) {
	//加载音效
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', '/static/sound/dice.mp3');
	audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
	audioElement.load()
	$.get();
	audioElement.addEventListener("load", function () {
		audioElement.play();
	}, true);
	audioElement.play();

	//摇骰子
	const dice = [...document.querySelectorAll(".die-list")];
	dice.forEach(die => {
		toggleClasses(die);
		die.dataset.roll = step;
	});
	setTimeout(function () {
		if (player === player1_Id) {
			random(step, d1);
			changeProgress()
		} else {
			random(step, d2);
			changeProgress()
		}
		if (step > 3) {
			playDelayTime = 1550;
		} else {
			playDelayTime = 600;
		}
	}, 1250);
	setTimeout(function () {
		audioElement.setAttribute('src', '/static/sound/' + step + 'step.mp3');
		audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
		audioElement.load()
		$.get();
		audioElement.addEventListener("load", function () {
			audioElement.play();
		}, true);
		audioElement.play();
		changeChance();
	}, 1550);
}

function changeChance() {
    if (nowPlayer === player1_Id) {
        $('#player2_chance').text('');
        timeLeft = 15;
        $('#player1_chance').css('background-color', 'cornflowerblue');
        $('#player2_chance').css('background-color', '')
    } else {
        $('#player1_chance').text('');
        timeLeft = 15;
        $('#player1_chance').css('background-color', '');
        $('#player2_chance').css('background-color', 'cornflowerblue');
    }
}

function changeProgress() {
    let p1_progress = player1_pos + '%';
    let p2_progress = player2_pos + '%';
    $('#p1_progress').attr('lay-percent', p1_progress);
    $('#p1_progress').css('width', p1_progress);
    $('#p1_progress').children('span').text(p1_progress);

    $('#p2_progress').attr('lay-percent', p2_progress);
    $('#p2_progress').css('width', p2_progress);
    $('#p2_progress').children('span').text(p2_progress);
}
