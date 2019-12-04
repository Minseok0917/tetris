const Block = [ { 
	Num1: [ ["","ㅁ","ㅁ"],["ㅁ","ㅁ",""] ], Num2: [ ["ㅁ",""], ["ㅁ","ㅁ"], ["","ㅁ"] ],
	color : "lightgreen"
},
{ 
	Num1: [ ["ㅁ","ㅁ",""], ["","ㅁ","ㅁ"] ], Num2:[ ["","ㅁ"], ["ㅁ","ㅁ"], ["ㅁ",""] ], 
	color : "lightcoral"
},
{ 
	Num1: [ ["ㅁ","",""], ["ㅁ","ㅁ","ㅁ"] ], Num2: [ ["ㅁ","ㅁ"], ["ㅁ",""], ["ㅁ",""] ], Num3: [ ["ㅁ","ㅁ","ㅁ"], ["","","ㅁ"] ], Num4: [ ["","ㅁ"], ["","ㅁ"], ["ㅁ","ㅁ"] ], 
	color : "lightblue"
},
{
	Num1: [ ["","","ㅁ"], ["ㅁ","ㅁ","ㅁ"] ], Num2: [ ["ㅁ",""], ["ㅁ",""], ["ㅁ","ㅁ"] ], Num3: [ ["ㅁ","ㅁ","ㅁ"], ["ㅁ","",""] ], Num4: [ ["ㅁ","ㅁ"], ["","ㅁ"], ["","ㅁ"] ],
	color : "lightslategray"
},
{
	Num1: [ ["","ㅁ",""], ["ㅁ","ㅁ","ㅁ"] ], Num2: [ ["ㅁ",""], ["ㅁ","ㅁ"], ["ㅁ",""] ], Num3: [ ["ㅁ","ㅁ","ㅁ"], ["","ㅁ",""] ], Num4: [ ["","ㅁ"], ["ㅁ","ㅁ"], ["","ㅁ"] ],
	color : "lightsalmon"
},
{
	Num1:[ ["ㅁ","ㅁ"], ["ㅁ","ㅁ"] ],
	color : "lightyellow" 
},
{
	Num1:[ ["ㅁ","ㅁ","ㅁ","ㅁ"] ], Num2:[ ["ㅁ"], ["ㅁ"], ["ㅁ"], ["ㅁ"] ],
	color : "lightpink" 
} ];
function init(){
	let tetris1 = new Tetris();
	console.log(tetris1);
}
function Tetris(){
	this.BlockNumber = this.BlockOrder().concat(this.BlockOrder());
	this.Core();
}

Tetris.prototype.plate = Array.from( Array(20) , _ => Array.from( Array(10) , r => r = { Block : false, color:""  } ) )
Tetris.prototype.Playout = false;
Tetris.prototype.s = 20;
Tetris.prototype.Element = document.getElementsByClassName("row");
Tetris.prototype.Core = function(){ // 1. 게임이 끝났는지 안끝났는지 검사 , 블럭이 7개면 다음 블럭이 보일수 있게 랜덤 블럭 7개를 더 가져옴
	if( this.PlayOut ) return false;
	if( this.BlockNumber.length == Block.length ) this.BlockNumber = this.BlockNumber.concat(this.BlockOrder());
	this.Controller();
}
Tetris.prototype.Controller = function(){ // 3. 블럭이 내려가는걸 지속적으로 하면서 체크한다.
	this.num = 1, this.x = 3, this.y = 1;
	this.BlockSetting();
	this.CreateBlock();
	this.loop = setInterval(()=>{
		if(this.BlockStop()){
			this.y++;
			this.upload();
		}else{
			clearInterval(this.loop);
			this.BlockNumber.splice(0,1);
			this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( r => {
				if( r.Block == "ㅁ") r.Block = true;
			}) );
			this.Core();
		}
	},this.s)
}
Tetris.prototype.CreateBlock = function(){ // 5. 시작하는 블럭을 만든다.
	console.log(this.temp);
	for(let c=0; c<this.column; c++){
		for(let r=0; r<this.row; r++){
			if(this.temp[c][r] == "") continue;
			if( this.row == 2 )
				this.item(r+this.x,c+this.y,1,-1);
			else if( this.row == 3 )
				this.item(r+this.x,c+this.y,0,-1);
			else if( this.row == 4)
				this.item(r+this.x,c+this.y,0,0);
		}
	}
	this.update();
}
Tetris.prototype.upload = function(){ // 8. 기존 배열을 초기화 하고 다음 위치 블럭을 추가한다.
	this.reset();
	for(let c=0; c<this.column; c++){
		for(let r=0; r<this.row; r++){
			if(this.temp[c][r] == "") continue;
			if( this.num == 1){
				if( this.row == 2 )
					this.item(r+this.x,c+this.y,1,-1);
				else if( this.row == 3 )
					this.item(r+this.x,c+this.y,0,-1);
				else if( this.row == 4)
					this.item(r+this.x,c+this.y,0,0);
			}
		}
	}
	this.update();
}
Tetris.prototype.update = function(){ // 6. 배열을 브라우저로 확인해본다.
	this.plate.forEach( (c,cidx) =>{
		c.forEach( (r,ridx) =>{
			if( r.Block == false){
				this.Element[cidx].children[ridx].style.background = "transparent";
			}else{
				this.Element[cidx].children[ridx].style.background = r.color;
			}
		} )
	} )
}
Tetris.prototype.BlockStop = function(){ // 10. 블럭이 중복되지 않게 체크한다.
	let x = 0 , y = 0;
	if( this.num == 1 ){
		if( this.row == 2) x = 1;
	}
	if( this.y+y+1 > 19 ) return false;
	return true;
}
Tetris.prototype.reset = function(){ // 9. 이미 있는 값을 초기화 한다.
	this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( (r,ridx) =>{
		if( r.Block == "ㅁ" ){
			r.Block = false;
			r.color = "";
		}
	} ) )
}
Tetris.prototype.item = function(x,y,r,c){ // 7. 값을 넣어준다.
	this.plate[y+c][x+r].Block = "ㅁ";
	this.plate[y+c][x+r].color = this.BlockColor;
}
Tetris.prototype.BlockSetting = function(){ // 4. 블럭의 정보를 가져오는 함수
	this.temp = Block[this.BlockNumber[0]]; // 랜덤값에 제일 앞에 걸 가져오고 그 랜덤 위치에 있는 블럭을 가져옴
	this.BlockColor = this.temp.color; // 컬러를 가져옴
	this.BlockLen = Object.keys(this.temp).length-1; // 블럭이 몇번 돌아갈 수 있는지 경우의 수를 봄 오브젝트 안에 컬러도 있게 때문에 -1

	if( this.BlockLen == 1 || this.num == 1) this.temp = this.temp.Num1; // 첫번째 비교
	else if( this.num == 2  ) this.temp = this.temp.Num2;
	else if( this.BlockLen == 2 && this.num == 3 ) this.temp = this.temp.Num1;
	else if( this.BlockLen == 2 && this.num == 4 ) this.temp = this.temp.Num2;
	else if( this.BlockLen == 4 && this.num == 3 ) this.temp = this.temp.Num3;
	else if( this.BlockLen == 4 && this.num == 4 ) this.temp = this.temp.Num4;
	// 가로 , 세로 길이 구함
	this.row = this.temp[0].length , this.column = this.temp.length;
}
Tetris.prototype.BlockOrder = function(result=[]){ // 2. 1~9 까지 랜덤값 나열한 배열을 가져온다.
	while(result.length != Block.length){
		let ran = Math.floor(Math.random()*Block.length)+0;
		result.indexOf(ran) == -1 ? result.push(ran) : false;
	}
	return result;
}

window.onload = _ => init();