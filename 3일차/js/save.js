class setting{ // setting
	constructor(){
		this.shape = [ { 
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
		this.plate = Array.from( Array(20) , _ => Array.from( Array(10) , r => r = { Block : false, color:""  } ) );
		this.BlockArr = this.BlockOrder().concat(this.BlockOrder());
		this.Life = true;
		this.s = 500;
		this.Element = document.getElementsByClassName("row");
		this.item,this.itemLen,this.itemColor,this.itemX,this.itemY,this.itemY2
		this.num,this.x,this.y,this.row,this.column,this.loop;
	}
	BlockOrder(result=[]){ // 블럭 순서 가져오는 메소드
		while(result.length != this.shape.length){
			let ran = Math.floor(Math.random()*this.shape.length)+0;
			result.indexOf(ran) == -1 ? result.push(ran) : false;
		}
		return result;
	}
	temp(){ // 블럭 len,color,x,y 를 가져옴
		this.item = this.shape[this.BlockArr[0]];
		this.itemColor = this.item.color;
		this.itemLen = Object.keys(this.item).length-1;
		this.itemX = 0, this.itemY = 0, this.itemY2 = 0;
		if( this.num == 1 || this.itemLen == 1 ){
			this.item = this.item.Num1;
			if( this.item[0].length == 2  ) this.itemX = 1 , this.itemY = -1;
			else if( this.item[0].length == 3  ) this.itemY = -1;
		}
		else if( this.num == 2 ){
			this.item = this.item.Num2;
			if( this.item[0].length == 1  ) this.itemX = 2 , this.itemY = -1 , this.itemY2 = 2;
			else if( this.item[0].length == 2  ) this.itemX = 1 , this.itemY = -1, this.itemY2 = 1;
		}
		else if( this.num == 3 ){
			this.item = this.itemLen == 2 ? this.item.Num1 : this.item.Num3;
			if( this.item[0].length == 3 && this.itemLen == 2) this.itemY = -1; 
			else if( this.item[0].length == 3 && this.itemLen == 4) this.itemY2 = 1; 

		}
		else if( this.num == 4 ){
			this.item = this.itemLen == 2 ? this.item.Num2 : this.item.Num4;
			if( this.item[0].length == 1  ) this.itemX = 1, this.itemY = -1, this.itemY2 = 2;
			else if( this.item[0].length == 2  ) this.itemY = -1 , this.itemY2 = 1;
		}
		this.row = this.item[0].length , this.column = this.item.length;
	}
	reset(){ // 아직 부딪치지 않은 블럭을 초기화 시킨다.
		this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( (r,ridx) =>{
			if( r.Block == "ㅁ" ){
				r.Block = false;
				r.color = "";
			}
		} ) )
	}
}
class Controller extends setting{
	constructor(parent){
		super(parent);
	}
	Block(){ // Block
		this.temp();
		this.reset();
		for(let c=0; c<this.column; c++){
			for(let r=0; r<this.row; r++){
				if(this.item[c][r] == "") continue;
				this.plate[this.itemY+this.y+c][this.itemX+this.x+r].Block = "ㅁ";
				this.plate[this.itemY+this.y+c][this.itemX+this.x+r].color = this.itemColor;
			}
		}
		this.update();
	}
	BlockStop(arrow){ // BlockStop
		if( arrow == "left"){
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					if( this.plate[this.itemY+this.y+c][this.itemX+this.x+r-1].Block == true ){
						return false;
					}
				}
			}
		}else if( arrow == "right"){
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					if( this.plate[this.itemY+this.y+c][this.itemX+this.x+r+1].Block == true ){
						return false;
					}
				}
			}
		}else{
			if(this.itemY2+this.y+1 >= 20 ) this.BlockEnd();
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					if( this.plate[this.itemY+this.y+c+1][this.itemX+this.x+r].Block == true ){
						this.BlockEnd();
					}
				}
			}
		}
		return true;
	}
	BlockEnd(){
		clearInterval(this.loop);
		this.BlockArr.splice(0,1);
		this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( r => {
			if( r.Block == "ㅁ") r.Block = true;
		}) );
		this.Core();
	}
	keydown(e){ // keydown
		switch(e.keyCode){
			case 38: // top
			this.num = this.num+1 > 4 ? 1 : this.num+1;
			this.Block();
			break;
			case 39: // right
			if( this.BlockStop("right")){
				this.x++;
				this.Block();
			}
			break;
			case 40: // bottom
			if( this.BlockStop() ){
				this.y++;
				this.Block();
			};
			break;
			case 37: // left
			if( this.BlockStop("left")){
				this.x--;
				this.Block();
			}
			break;
		}
	}
	update(){ // update
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
}

class init extends Controller{
	constructor(parent){
		super(parent);
		this.Event();
		this.Core();
	}
	Event(){
		document.addEventListener("keydown",this.keydown.bind(this));
	}
	Core(){
		if( !this.Life ) return false;
		if( this.BlockArr.length == this.shape.length ) this.BlockArr = this.BlockArr.concat(this.BlockOrder());
		this.Controller();
	}
	Controller(){
		this.num = 1, this.x = 3 , this.y = 1;
		this.Block();	
		this.loop = setInterval(()=>{
			if(this.BlockStop()){
				this.y++;
				this.Block();
			}
		},this.s);
	}
}
window.onload = _ => new init();