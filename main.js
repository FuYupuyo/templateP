enchant();

var SIZE = 36;
var COL = 7;
var ROW = 9;
var KIND = 3;
var TOP = SIZE*2;
var MAP = 'Map.png';

window.onload = function(){
    game = new Game(SIZE*COL, SIZE*ROW+TOP);
    game.fps = 30;
    game.preload(MAP);

    game.onload = function(){
        gr = game.rootScene;
        gr.backgroundColor = 'black';
        makeMap(MAP);
        makeNext(MAP);
        touchEvent();
    };
    game.start();
};

function makeMap(PNG){
    map = new Map(SIZE,SIZE);
    field = new Array(ROW);
    for(var y=0; y<field.length; y++){
        var tempArray = [];
        for(var x=0; x<COL; x++){
            tempArray[x] = 0;
        }
        field[y] = tempArray;
    }
    map.image = game.assets[PNG];
    map.x=0;map.y=TOP;
    map.loadData(field);
    gr.addChild(map);
}

function makeNext(PNG){
    mapN = new Map(SIZE,SIZE);
    next = new Array(1);
    temp = new Array(COL);
    next[0] = temp;
    initNext();
    mapN.image = game.assets[PNG];
    mapN.x=0;mapN.y=0;
    mapN.loadData(next);
    gr.addChild(mapN);
    print("↑NEXT",10,SIZE+10);
}

function initNext(type){
    if(type == undefined){
        for(var n=0;n<COL;n++){
            next[0][n]=ran(KIND)+1;
        }
    }else{ //特殊なNextの生成
        next[0][0] = 1;
        for(var n=1;n<COL;n++){
            next[0][0]=nextOrderFunc(temp[n-1]);
        }
    }
}

function setNext(){
    for(var i=0; i<COL-1; i++){
        next[0][i] = next[0][i+1];
    }
    next[0][COL-1] = nextOrderFunc(next[0][COL-2]);
}

function nextOrderFunc(num){
    if(num == 3){
        return 1;
    }else {
        return num + 1;
    }
}

function mapRefresh(){
    map.loadData(field);
    gr.addChild(map);
    mapN.loadData(next);
    gr.addChild(mapN);
}

//map内をタッチした時にセルごとの処理を行う
function touchEvent(){
    gr.addEventListener("touchstart", function(touch){
        var touchX = Math.floor(touch.localX);
        var touchY = Math.floor(touch.localY);
        for(var y=0;y<ROW;y++){
            if(touchY>y*SIZE+TOP && touchY<(y+1)*SIZE+TOP){
                for(var x=0;x<COL;x++){
                    if(touchX>x*SIZE && touchX<(x+1)*SIZE){
                        field[y][x]=next[0][0];
                        setNext();
                        check();
                        mapRefresh();
                    }
                }
            }
        }
    });
}


function ran(n){
    return Math.floor(Math.random()*n);
}

function check(){
    for(var i=6;i>=4;i--){
        for(var y=0;y<ROW;y++){
            for(var x=0;x<COL;x++){
                if(x>0 && x<COL-1){
                    if(field[y][x-1] == i && field[y][x+1] == i && field[y][x] == 3)field[y][x]=i+1;
                }
                if(y>0 && y<ROW-1){
                    if(field[y-1][x] == i && field[y+1][x] == i && field[y][x] == 3)field[y][x]=i+1;
                }
            }
        }
    }
    for(var y=0;y<ROW;y++){
        for(var x=0;x<COL;x++){
            if(x>0 && x<COL-1){
                if(field[y][x-1] == 1 && field[y][x+1] == 2 && field[y][x] == 3)field[y][x]=4;
                if(field[y][x-1] == 2 && field[y][x+1] == 1 && field[y][x] == 3)field[y][x]=4;
            }
            if(y>0 && y<ROW-1){
                if(field[y-1][x] == 1 && field[y+1][x] == 2 && field[y][x] == 3)field[y][x]=4;
                if(field[y-1][x] == 2 && field[y+1][x] == 1 && field[y][x] == 3)field[y][x]=4;
            }
        }
    }
}


function print(str,x,y){
    string = new Label();
    string.x=x;
    string.y=y;
    string.color="red"
    string.text = str;
    gr.addChild(string);
}
