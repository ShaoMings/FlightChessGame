//获得画布
// const canvas = $('#canvas').get(0);
// const ctx = canvas.getContext('2d');  //获得上下文
//
// canvas.width = 900;     //设置标签的属性宽高
// canvas.height = 600;    //千万不要用 canvas.style.height
// canvas.style.border = "1px solid #000";
//
// //绘制三角形
// ctx.beginPath();        //开始路径
// ctx.moveTo(100,100);    //三角形，左顶点
// ctx.lineTo(300, 100);   //右顶点
// ctx.lineTo(300, 300);   //底部的点
// ctx.closePath();        //结束路径
// ctx.stroke();           //描边路径

let arr = [];
let map = [];
let trapIndex;
//蛇形数组
// for (let i=1;i<=10;i++){
//        if (i%2 === 1){
//            for (let j = i*10-9;j<=i*10;j++){
//                arr[j-1] = j;
//            }
//        }else {
//            for (let j = i*10,k=i*10-9;j>=i*10-9,k<=i*10;j--,k++){
//                arr[k-1] = j;
//            }
//        }
// }


for (let i=0;i<100;i++){
    map.push(i+1);
}

noRepeatRandomNum(20,99);
//No repeat random number
function noRepeatRandomNum(number,oneToEnd){
    let range_arr = [];
    trapIndex = [];
    for (let i = 0;i<oneToEnd;i++){
        range_arr.push(i+1);
    }
    let index = -1;
    for (let i =0;i<number;i++){
        index = Math.floor(Math.random()*(oneToEnd-i));
        trapIndex[i] = range_arr[index];
        let num = range_arr[index];
        range_arr[index] = range_arr[oneToEnd-i-1];
        range_arr[oneToEnd-i-1] = num;
    }
    setRandomTrap();
}



function setRandomTrap() {
    for (let i = 0;i<trapIndex.length;i++){
        map[trapIndex[i]]=-(Math.floor(Math.random()*10+1));
    }
}

let player1_pos = 1;
function random() {
    let random_step = Math.floor(Math.random()*6) +1;
    console.log(random_step);
    if (player1_pos+random_step<100){
        if (map[player1_pos+random_step-1]>0) {
            player1_pos += random_step;
        }else {
            player1_pos=player1_pos+random_step + map[player1_pos+random_step-1];
            while (map[player1_pos-1]<0){
                player1_pos+=map[player1_pos-1];
            }
        }
        if (player1_pos < 0){
            player1_pos = 1;
        }
    }else if (player1_pos+random_step ===100){
        alert("winner");
        player1_pos = 1;
    } else {
        // 99(3) 100 99 98
        player1_pos = 100 - (random_step- (100-player1_pos));
    }
    console.log("now position = "+player1_pos);

}
// console.log(map)
