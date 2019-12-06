function Tetris(){
	let init = { // init
		Core:()=>{ // Core
			if( this.PlayOut ) return false;
			if( this.BlockArr.length == this.shape.length ) this.BlockArr = this.BlockArr.concat(Setting.order());
			init.Controller();
		},
		Controller:()=>{ // Controller
			this.num = 1, this.x = 3, this.y = 1;
			Setting.temp();
			Block.create();
			this.loop = setInterval(()=>{
				if(Block.Downcheck()){
					this.y++;
					Block.create();
				}else{
					Block.stop();	
				}
			},this.s)
		}
	}
	let Setting = { // settings
		temp:()=>{ // temp
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
		},
		reset:()=>{ // reset
			this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( (r,ridx) =>{
				if( r.Block == "ㅁ" ){
					r.Block = false;
					r.color = "";
				}
			} ) )
		},
		order:(result=[])=>{ // order
			while(result.length != this.shape.length){
				let ran = Math.floor(Math.random()*this.shape.length)+0;
				result.indexOf(ran) == -1 ? result.push(ran) : false;
			}
			return result;
		},
		clear:()=>{ // clear
			this.plate.forEach( (c,cidx)=> {
				if(this.plate[cidx].every( f => f.Block == true )){
					this.plate.splice(cidx,1);
					this.plate.unshift(Array.from(Array(10) , r => r = { Block : false, color:""  } ) );
					console.log(this.plate);
				}
			});
		}
	}
	let Block = {
		create:()=>{  // create
			Setting.temp();
			Setting.reset();
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					this.plate[this.itemY+this.y+c][this.itemX+this.x+r].Block = "ㅁ";
					this.plate[this.itemY+this.y+c][this.itemX+this.x+r].color = this.itemColor;
				}
			}
			Block.update();
		},
		Downcheck:()=>{ // check
			if(this.itemY2+this.y+1 >= 20 ) return false;
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					if( this.plate[this.itemY+this.y+c+1][this.itemX+this.x+r].Block == true ){
						return false;
					}
				}
			}
			return true;
		},
		Arrowcheck:(arrow)=>{
			let o = arrow == "left" ? -1 : 1;
			if( this.itemX+this.x+o < 0 || this.itemX+this.x+this.row+o > 10  ) return false;
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					if( this.plate[this.itemY+this.y+c][this.itemX+this.x+r+o].Block == true ){
						return false;
					}
				}
			}
			return true;
		},
		stop:()=>{ // stop
			clearInterval(this.loop);
			this.BlockArr.splice(0,1);
			this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( r => {
				if( r.Block == "ㅁ") r.Block = true;
			}) );
			init.Core();
		},		
		update:()=>{ // update
			Setting.clear();
			PreView.prev();
			this.plate.forEach( (c,cidx) =>{
				c.forEach( (r,ridx) =>{
					if( r.Block == false){
						this.Element[cidx].children[ridx].style.background = "transparent";
					}else{
						this.Element[cidx].children[ridx].style.background = r.color;
					}
				} )
			} )
			this.view.forEach( v =>{ // 나중에 
				v = v.Num1;
			
			} )
		}
	}
	let PreView ={ // preview
		prev:()=>{ // prev
			this.view = [this.shape[this.BlockArr[1]],this.shape[this.BlockArr[2]],this.shape[this.BlockArr[3]]];
		}
	}
	let event = {
		keydown:(e)=>{
			switch(e.keyCode){
			case 38: // top
			this.num = this.num+1 > 4 ? 1 : this.num+1;
			Block.create();
			break;
			case 39: // right
			if( Block.Arrowcheck("right")){
				this.x++;
				Block.create();
			}
			break;
			case 40: // bottom
			if( Block.Downcheck() ){
				this.y++;
				Block.create();
			}else{
				Block.stop();
			}
			break;
			case 37: // left
			if( Block.Arrowcheck("left")){
				this.x--;
				Block.create();
			}
			break;
		}
	}
}
this.BlockArr = Setting.order().concat(Setting.order());
document.addEventListener("keydown",event.keydown);
init.Core();
}
Tetris.prototype.shape = [ { 
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
Tetris.prototype.plate = Array.from( Array(20) , _ => Array.from( Array(10) , r => r = { Block : false, color:""  } ) );
Tetris.prototype.life = false;
Tetris.prototype.s = 1000;
Tetris.prototype.Element = document.getElementsByClassName("row");
Tetris.prototype.Element2 = document.getElementById("preview");

window.onload = _ => new Tetris();