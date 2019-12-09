let c = console;
function Tetris(){
	let init = { // init
		Core:()=>{ // Core
			if( this.PlayOut ) return false;
			if( this.BlockArr.length == this.shape.length ) this.BlockArr = this.BlockArr.concat(Setting.order());
			init.Controller();
		},
		Controller:()=>{ // Controller
			this.num = 1, this.x = 3, this.y = 1;
			NextBlockPreView.package();
			Block.create();
			this.loop = setInterval(()=>{
				if(Block.Downcheck(this.y)){
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
				if( r.Block == "ㅁ" || r.Block == "space"){
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
			let count = 0;
			this.plate.forEach( (c,cidx)=> {
				if(this.plate[cidx].every( f => f.Block == true )){
					count++;
					this.plate.splice(cidx,1);
					this.plate.unshift(Array.from(Array(10) , r => r = { Block : false, color:""  } ) );
				}
			});
			if( count == 1 ){
				this.score += 200;
			}else if( count == 2){
				this.score += 500;
			}else if( count == 3){
				this.score += 900;
			}else if( count ==  4){
				this.score += 1400;
			}
		}
	}
	let Block = { // Block
		create:()=>{  // create
			Setting.temp();
			Setting.reset();
			SpacePreView.Controller();
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					this.plate[this.itemY+this.y+c][this.itemX+this.x+r].Block = "ㅁ";
					this.plate[this.itemY+this.y+c][this.itemX+this.x+r].color = this.itemColor;
				}
			}
			Block.update();
		},
		Downcheck:(y)=>{ // check
			if(this.itemY2+y+1 >= 20 ) return false;
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;
					if( this.plate[this.itemY+y+c+1][this.itemX+this.x+r].Block == true ){
						return false;
					}
				}
			}
			return true;
		},
		Arrowcheck:(arrow)=>{ // check
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
		stop:()=>{ // this.stop
			clearInterval(this.loop);
			this.BlockArr.splice(0,1);
			this.plate.forEach( (c,cidx) => this.plate[cidx].forEach( r => {
				if( r.Block == "ㅁ") r.Block = true;
			}) );
			this.storageCheck = true;
			init.Core();
		},		
		update:()=>{ // update
			Setting.clear();
			ScoreBoard.input();
			this.plate.forEach( (c,cidx) =>{ // block
				c.forEach( (r,ridx) =>{   
					if(!r.Block){
						this.Element[cidx].children[ridx].style.removeProperty("background");
						this.Element[cidx].children[ridx].style.removeProperty("border");
					}else{
						this.Element[cidx].children[ridx].style.background = r.color;
						this.Element[cidx].children[ridx].style.removeProperty("border");
						if( r.Block == "space"){
							this.Element[cidx].children[ridx].style.border = `3px solid ${r.color}`;
							this.Element[cidx].children[ridx].style.removeProperty("background");
						}
					}

				} )
			} )
		}
	}
	let NextBlockPreView ={ // preview
		prev:()=>{ // prev
			this.view = [this.shape[this.BlockArr[1]],this.shape[this.BlockArr[2]],this.shape[this.BlockArr[3]]];
		},
		view:()=>{ // view
			this.view.forEach( (v,vidx) =>{ 
				v2 = v.Num1;
				let div = this.Element2.getElementsByClassName("box")[vidx];
				div.innerHTML = "";
				let ul = document.createElement("ul");
				v2.forEach( (c,cidx) => {
					let li = document.createElement("li");
					c.forEach( (r,ridx) => {
						let span = document.createElement("span");
						if( r != "" ) span.style.background = v.color;
						li.append(span);
					} )
					ul.append(li);
				} )
				div.append(ul);
			} )
		},
		clear:()=>{ // claer
			Array.from(this.Element2.getElementsByTagName("span")).forEach( v =>{
				v.style.removeProperty("background");
			} )
		}, 
		package:()=>{ // package
			NextBlockPreView.clear();
			NextBlockPreView.prev();
			NextBlockPreView.view();
		}
	}
	let ScoreBoard = { // score
		input:()=>{
			this.Element4.textContent = this.score;
		}
	}
	let SpacePreView = { // space
		Controller:()=>{ // Controller
			this.y2 = this.y;
			while(Block.Downcheck(this.y2)) this.y2++;
			for(let c=0; c<this.column; c++){
				for(let r=0; r<this.row; r++){
					if(this.item[c][r] == "") continue;															
					this.plate[this.itemY+this.y2+c][this.itemX+this.x+r].Block = "space";
					this.plate[this.itemY+this.y2+c][this.itemX+this.x+r].color = this.itemColor;
				}
			}
		}		
	}
	let BlockStorage = { // Storage
		change:()=>{ // change
			if( this.storage == ""){
				this.storage = this.shape[this.BlockArr[0]];
				this.BlockArr.splice(0,1);
			}else{
				let temp = this.storage;
				this.storage = this.shape[this.BlockArr[0]];
				this.shape[this.BlockArr[0]] = temp;
			}
			clearInterval(this.loop);
		},
		view:()=>{ // view
			this.Element3.innerHTML = "";
			let ul = document.createElement("ul");
			this.storage.Num1.forEach( (c,cidx) =>{
				let li = document.createElement("li");
				c.forEach( (r,ridx) =>{
					let span = document.createElement("span");
					if( r != "" ) span.style.background = this.storage.color;
					li.append(span);
				} )
				ul.append(li);
			} )
			this.Element3.append(ul);
		},
		package:()=>{ // package
			if ( this.storageCheck ){
				BlockStorage.change();
				BlockStorage.view();
				init.Core();
				this.storageCheck = false;
			}
		}
	}
	let event = { // event
		keydown:(e)=>{ // keydown
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
				if( Block.Downcheck(this.y) ){
					this.y++;
					this.score+=1;
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
				case 32: // space
				while(Block.Downcheck(this.y)){
					this.y++;
					this.score+=2;
				}
				Block.create();
				Block.stop();
				break;
			}
		},
		keyup:(e)=>{ // keyup
			switch(e.keyCode){
				case 67:
				BlockStorage.package();
				break;
			}

		}
	}
	this.score = 0;
	this.storage = "";
	this.storageCheck = true;
	this.BlockArr = Setting.order().concat(Setting.order());
	this.Element = document.getElementsByClassName("row");
	this.Element2 = document.getElementById("preview");
	this.Element3 = document.getElementById("storage");
	this.Element4 = document.getElementById("score_txt");
	document.addEventListener("keydown",event.keydown);
	document.addEventListener("keyup",event.keyup);
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
	color : "lightseagreen" 
},
{
	Num1:[ ["ㅁ","ㅁ","ㅁ","ㅁ"] ], Num2:[ ["ㅁ"], ["ㅁ"], ["ㅁ"], ["ㅁ"] ],
	color : "lightpink" 
} ];
Tetris.prototype.plate = Array.from( Array(20) , _ => Array.from( Array(10) , r => r = { Block : false, color:""  } ) );
Tetris.prototype.life = false;
Tetris.prototype.s = 1000;

window.onload = _ =>{
	new Tetris();
}