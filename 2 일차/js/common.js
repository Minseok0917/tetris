const Shape = [ { 
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
}
function Tetris(){
	let setting = { // settings
		temp:()=>{ // 4. 블럭의 정보를 가져오는 함수
			this.temp = Shape[this.BlockNumber[0]]; // 랜덤값에 제일 앞에 걸 가져오고 그 랜덤 위치에 있는 블럭을 가져옴
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
		},
		reset:()=>{ // 9. 이미 있는 값을 초기화 한다.
			this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( (r,ridx) =>{
				if( r.Block == "ㅁ" ){
					r.Block = false;
					r.color = "";
				}
			} ) )
		},
		BlockOrder:(result=[])=>{ // 2. 1~9 까지 랜덤값 나열한 배열을 가져온다.
			while(result.length != Shape.length){
				let ran = Math.floor(Math.random()*Shape.length)+0;
				result.indexOf(ran) == -1 ? result.push(ran) : false;
			}
			return result;
		}
	};
	let event = {
		keydown:(e)=>{
			switch(e.keyCode){
				case 39: // right
				if( Block.BlockStop("right")) this.x +=1;
				break;
				case 37: // left
				if( Block.BlockStop("left")) this.x -=1;
				// this.x -= 1;
				break;	
				case 38: // right rotate 
				this.num = this.num%4 == 0 ? 1 : this.num+1;
				break;
				case 40:// down
				if( Block.BlockStop()) this.y+=1;
				else Block.BlockEnd();
				break;
			}
			Block.upload();
		}
	}
	let Block = { // Block
		CreateBlock:()=>{ // 5. 시작하는 블럭을 만든다.
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					let x = 0, y = 0;
					if(this.temp[c][r] == "") continue;
					if( this.row == 2 ) x = 1 , y = -1;
					else if( this.row == 3 ) y = -1;
					this.plate[this.y+c+y][this.x+r+x].Block = "ㅁ";	
					this.plate[this.y+c+y][this.x+r+x].color = this.BlockColor;	
				}
			}
			Block.update();
		},
		upload:()=>{ // 8. 기존 배열을 초기화 하고 다음 위치 블럭을 추가한다.
			setting.temp();
			setting.reset();
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					let x = 0, y =0;
					if(this.temp[c][r] == "") continue;
					if( this.num == 1 || this.BlockLen == 1){
						if( this.row == 2 ) x = 1 , y = -1;
						else if( this.row == 3 ) y = -1;
					}else if( this.num == 2){
						if( this.row == 2 ) x = 1 , y = -1;
						else if( this.row == 1 ) x = 2 , y = -1; 
					}else if( this.num == 3){
						if( this.row == 3 && this.BlockLen == 2 ) y = -1;
					}else if( this.num == 4){
						if( this.row == 2 ) y = -1;
						if( this.row == 1 ) x = 1 , y = -1;
					}
					if( this.x+r+x < 0 || this.x+r+x >= 10){
						this.num = this.num-1 < 1 ? 4 : this.num-1;
						Block.upload();
						break;
					}
					this.plate[this.y+c+y][this.x+r+x].Block = "ㅁ";
					this.plate[this.y+c+y][this.x+r+x].color = this.BlockColor;
				}
			}	
			Block.update();
		},
		update:()=>{ // 6. 배열을 브라우저로 확인해본다.
			this.plate.forEach( (c,cidx) =>{
				c.forEach( (r,ridx) =>{
					if( r.Block == false){
						this.Element[cidx].children[ridx].style.background = "transparent";
					}else{
						this.Element[cidx].children[ridx].style.background = r.color;
					}
				} )
			} )
		},
		BlockStop:(arrow)=>{
			let x = 0 , y = 0 , y2 = 0;
			if( this.num == 1 || this.BlockLen == 1 ){
				if( this.row == 2) x = 1,y2=-1;
				else if( this.row == 3) y2=-1;
			}else if( this.num == 2){
				if( this.row == 2) x = 1 ,y = 1  ,y2=-1;
				else if( this.row == 1) x = 2,y = 2 ,y2=-1;
			}else if( this.num == 3){
				if( this.row == 3 && this.BlockLen == 4) y = 1;
				else if( this.row ==3 && this.BlockLen == 2) y2=-1;
			}else if( this.num == 4){
				if( this.row == 2) y = 1, y2=-1;
				else if( this.row == 1) x = 1,y = 2, y2=-1;
			}
			if( arrow == "right"){
				if( this.x+x+this.row+1 > 10) return false;
				for(let c=0; c<this.column; c++){
				if( this.y+c+1 >= 20) break;
					for(let r=0; r<this.row; r++){
						if( this.temp[c][r] == "" ) continue;
						if( this.plate[this.y+y2+c][this.x+r+x+1].Block == true ){
							return false;
						}
					}
				}
			}else if( arrow == "left" ){
				if( this.x+x-1 < 0) return false;
				for(let c=0; c<this.column; c++){
				if( this.y+c+1 >= 20) break;
					for(let r=0; r<this.row; r++){
						if( this.temp[c][r] == "" ) continue;
						if( this.plate[this.y+y2+c][this.x+r+x-1].Block == true ){
							return false;
						}
					}
				}
			}
			if( this.y+y+1 >= 20 ) return false;
			for(let c=0; c<this.column; c++){
				if( this.y+c+1 >= 20) break;
				for(let r=0; r<this.row; r++){
					if( this.temp[c][r] == "" ) continue;
					if( this.plate[this.y+y2+c+1][this.x+r+x].Block == true ){
						return false;
						break;
					}
				}
			}
			
			
			return true;
		},
		BlockEnd:()=>{
			clearInterval(this.loop);
			this.BlockNumber.splice(0,1);
			this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( r => {
				if( r.Block == "ㅁ") r.Block = true;
			}) );
			init.Core();
		}
	};
	let init = {
		Core:()=>{
			if( this.PlayOut ) return false;
			if( this.BlockNumber.length == Shape.length ) this.BlockNumber = this.BlockNumber.concat(setting.BlockOrder());
			init.Controller();
		},
		Controller:()=>{
			this.num = 1, this.x = 3, this.y = 1;
			setting.temp();
			Block.CreateBlock();
			this.loop = setInterval(()=>{
				if(Block.BlockStop()){
					this.y++;
					Block.upload();
				}else{
					Block.BlockEnd();	
				}
			},this.s)
		}
	}
	this.BlockNumber = setting.BlockOrder().concat(setting.BlockOrder());
	document.addEventListener("keydown",event.keydown);
	init.Core();
}

Tetris.prototype.plate = Array.from( Array(20) , _ => Array.from( Array(10) , r => r = { Block : false, color:""  } ) );
Tetris.prototype.Playout = false;
Tetris.prototype.s = 5000;
Tetris.prototype.Element = document.getElementsByClassName("row");


window.onload = _ => init();