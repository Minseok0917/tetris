

class App
{
	constructor(){
		//  shape
		this.shape= [
		{ num_1: [ ["","ㅁ","ㅁ"],["ㅁ","ㅁ",""] ], num_2: [ ["ㅁ",""], ["ㅁ","ㅁ"], ["","ㅁ"] ], color : "red"},
		{ num_1: [ ["ㅁ","ㅁ",""], ["","ㅁ","ㅁ"] ], num_2:[ ["","ㅁ"], ["ㅁ","ㅁ"], ["ㅁ",""] ], color : "orange"},
		{ num_1: [ ["ㅁ","",""], ["ㅁ","ㅁ","ㅁ"] ], num_2: [ ["ㅁ","ㅁ"], ["ㅁ",""], ["ㅁ",""] ], num_3: [ ["ㅁ","ㅁ","ㅁ"], ["","","ㅁ"] ], num_4: [ ["","ㅁ"], ["","ㅁ"], ["ㅁ","ㅁ"] ], color : "yellow"},
		{ num_1: [ ["","","ㅁ"], ["ㅁ","ㅁ","ㅁ"] ], num_2: [ ["ㅁ",""], ["ㅁ",""], ["ㅁ","ㅁ"] ], num_3: [ ["ㅁ","ㅁ","ㅁ"], ["ㅁ","",""] ], num_4: [ ["ㅁ","ㅁ"], ["","ㅁ"], ["","ㅁ"] ], color : "blue"},
		{ num_1: [ ["","ㅁ",""], ["ㅁ","ㅁ","ㅁ"] ], num_2: [ ["ㅁ",""], ["ㅁ","ㅁ"], ["ㅁ",""] ], num_3: [ ["ㅁ","ㅁ","ㅁ"], ["","ㅁ",""] ], num_4: [ ["","ㅁ"], ["ㅁ","ㅁ"], ["","ㅁ"] ], color : "skyblue"},
		{ num_1:[ ["ㅁ","ㅁ"], ["ㅁ","ㅁ"] ], color : "purple" },
		{ num_1:[ ["ㅁ","ㅁ","ㅁ","ㅁ"] ], num_2:[ ["ㅁ"], ["ㅁ"], ["ㅁ"], ["ㅁ"] ], color : "brown" }
		]
		// Tetris Array
		this.Tetris_left = 150;
		this.Tetris_top = 50;
		this.Tetris_column = 20;
		this.Tetris_row = 10;
		this.Tetris = Array(this.Tetris_column).fill(null).map( _=> Array(this.Tetris_row).fill(null).map( v => v = {shape : "" , color : ""} ));
		this.AfterArr = Array(3).fill(null).map( v => v = { arr : "" , color : "" }  );
		this.end = false;
		this.Score = 0;
		this.row_num = 0;
		this.holdNum = "";
		this.holdCheck = false;
		//  Canvas
		this.canvas = document.getElementById("Mycanvas");
		
		this.canvas.height = document.body.clientHeight;
		this.ctx = this.canvas.getContext("2d");
		// Core
		this.order = this.Block_Order().concat(this.Block_Order());
		// Controller
		this.num , this.temp , this.row , this.column , this.obj_len , this.x , this.y , this.sy ,this.loop;
		this.s = 1000;
		// Update
		this.rect = (this.canvas.height-this.Tetris_top*2)/this.Tetris_column;
		this.AfterRect;
		this.color;
		this.AfterColor;
		// Keydown Event
		this.space_start = true; //나중에 false

		//  Event Function
		this.Core();

		this.Update();
		this.Event();
	}

	//  Main Function
	Init(){ // start 
		this.Core();
	}
	Core(){ // Core
		if( this.end ) return false;
		if( this.order.length == this.shape.length ){
			this.order = this.order.concat(this.Block_Order());
			this.Controller();
		}else{
			this.Controller();
		}
	}
	Controller(){ // Controller
		this.num = 1 , this.x = 3 , this.y = 1 , this.sy = 1;
		this.Create_Block();
		this.loop = setInterval( ()=>{
			if( this.Block_stop() ){
				this.y++;
				this.Upload();
			}
		},this.s)
	}
	Upload(){ // Upload
		this.Temp_Setting();
		this.Block_delete();	
		if( this.row == 1 && this.column == 4 && this.y > 17  )  this.y = 17; 
		if( this.row == 2 && this.column == 3 && this.y > 18 )  this.y = 18;
		if( this.row == 4 && this.column == 1 && this.x < 0 || this.row == 3 && this.column == 2 && this.x<0 ) this.x = 0;
		if( this.num == 1 && this.x+this.row-1 > this.Tetris_row-1 || this.num == 3 && this.x+this.row-1 > this.Tetris_row-1  )  this.x = (this.Tetris_row-1)-(this.row-1);							
		
		this.AutoSpace();
		for(let y = 0; y<this.column; y++){
			for(let x = 0; x<this.row; x++){
				if( this.temp[y][x] != "ㅁ") continue;
				if( this.obj_len == 1){
					if(!this.Item(y,x,-1,1)) return false;
				}
				else if( this.num == 1 &&  this.row == 3 && this.column == 2 || this.obj_len == 2 &&  this.row == 3 && this.column == 2 ){
					if(!this.Item(y,x,-1,0)) return false;
				}
				else if( this.row == 4 && this.column == 1){
					if(!this.Item(y,x,0,0)) return false;
				}
				else if( this.obj_len == 2 && this.num == 2 && this.row == 1 && this.column == 4){
					if(!this.Item(y,x,-1,2)) return false;
				}
				else if( this.obj_len == 2 && this.num == 4 && this.row == 1 && this.column == 4){
					if(!this.Item(y,x,-1,1)) return false;
				}
				else if( this.num == 2 && this.row == 2 && this.column == 3){
					if(!this.Item(y,x,-1,1)) return false;
				}
				else if( this.num == 4 && this.row == 2 && this.column == 3){
					if(!this.Item(y,x,-1,0)) return false;
				}
				else if( this.obj_len == 4 && this.num == 3 && this.row == 3 && this.column == 2){
					if(!this.Item(y,x,0,0)) return false;
				}
			}
		}
		this.Tetris.forEach( (y,y_pos)=> {
			let i = this.Tetris[y_pos].every( x => x.shape == "ㅇ" )
			if ( i ) {
				this.row_num++;
				this.Tetris.splice(y_pos,1);				
				let row  = Array(1).fill(null).map( _=> Array(this.Tetris_row).fill(null).map( v => v = {shape : "" , color : ""} ));
				this.Tetris = row.concat(this.Tetris);
				return this.Upload();
			}
		} )
		this.Score_num();
		this.Update();
	}
	Event(){ // Event
		document.addEventListener("keydown",this.Keydown.bind(this));
	}
	Update(){ // Update
		this.After();
		// Clear
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		// Tetris
		this.Tetris.forEach( (y,y_pos)=> this.Tetris[y_pos].forEach( (x,x_pos)=>{
			this.ctx.beginPath();	
			this.ctx.fillStyle = "lightgray";
			this.ctx.fillRect(this.Tetris_left+(x_pos*this.rect),this.Tetris_top+(y_pos*this.rect),this.rect,this.rect);
			if( x.color == "") this.ctx.clearRect(this.Tetris_left+(x_pos*this.rect)+1,this.Tetris_top+(y_pos*this.rect)+1,this.rect-2,this.rect-2);
			else if( x.color != "" && x.shape != "ㅅ" ){
				this.ctx.fillStyle = x.color;
				this.ctx.fillRect(this.Tetris_left+(x_pos*this.rect)+1,this.Tetris_top+(y_pos*this.rect)+1,this.rect-2,this.rect-2);
			}else{
				this.ctx.fillStyle = x.color;
				this.ctx.fillRect(this.Tetris_left+(x_pos*this.rect),this.Tetris_top+(y_pos*this.rect),this.rect,this.rect);
				this.ctx.fillStyle = "#fff";
				this.ctx.fillRect(this.Tetris_left+(x_pos*this.rect)+2,this.Tetris_top+(y_pos*this.rect)+2,this.rect-4,this.rect-4);
			}
			this.ctx.closePath();
		} ) )
		// Big Stroke
		this.ctx.beginPath();
		this.ctx.lineWidth = 2.5;
		this.ctx.rect(this.Tetris_left ,this.Tetris_top,(this.Tetris_row*this.rect),(this.Tetris_column*this.rect) );
		this.ctx.stroke();
		this.ctx.closePath();
		// After
		this.AfterArr.forEach( (v,v_pos)=>{
			this.ctx.beginPath();
			this.ctx.lineWidth = 2;
			this.ctx.rect((this.Tetris_left+50) +(this.Tetris_row*this.rect),(this.Tetris_top+this.rect/2)+(120*v_pos), this.rect*2.5, this.rect*2.5 );
			this.ctx.stroke();
			this.ctx.closePath();
			v.arr.forEach( (y,y_pos) => {
				y.forEach( (x,x_pos)=>{
					if( x == "ㅁ"){
						this.ctx.beginPath();
						this.ctx.fillStyle = v.color;
						this.ctx.rect((this.Tetris_left+50)+(this.Tetris_row*this.rect)+(this.rect/1.7*x_pos), (this.Tetris_top+this.rect/2)+(this.rect/1.7*y_pos)+(120*v_pos), this.rect/1.7, this.rect/1.7 );
						this.ctx.fill();
						this.ctx.closePath();
					}
				} )
			} )
		} )
		// Score
		this.ctx.beginPath();
		this.ctx.fillStyle = "black";
		this.ctx.font = "24px Dotum";
		this.ctx.fillText(this.Score,(this.Tetris_left+50) +(this.Tetris_row*this.rect),(this.Tetris_top+this.rect/2)+(120*4));
		this.ctx.closePath();

		// hold big 
		this.ctx.beginPath();
		this.ctx.lineWidth = 2.5;
		this.ctx.rect(5,70,120,120);
		this.ctx.stroke();
		this.ctx.closePath();
		// hold 
		if( this.holdNum != ""){
			this.shape[this.holdNum].num_1.forEach( (y,y_pos) =>{
				y.forEach( (x,x_pos)=>{
					if( x == "ㅁ"){
						this.ctx.beginPath();
						this.ctx.fillStyle = this.shape[this.holdNum].color;
						this.ctx.rect(20 + ( x_pos*this.rect/1.7 ) , 70 + ( y_pos*this.rect/1.7 ) , this.rect/1.7 , this.rect/1.7 );
						this.ctx.fill();
						this.ctx.closePath();
					}
				} )
			} )
		}
		// end 
		if( this.end ){
			this.ctx.beginPath();
			this.ctx.fillStyle = "rgba(0,0,0,0.5)";
			this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fill();
			this.ctx.closePath();
			setTimeout( ()=>{ if(confirm("다시c 하실 거신가요?")) location.reload(); },500)			
		}


	}
	Block_stop(){ // Block_stop
		this.Temp_Setting();
		if( this.obj_len == 2 && this.num ==3 && this.y == this.Tetris_column-1 || this.obj_len == 4 && this.num == 3 && this.y+1 == this.Tetris_column-1 ){
			return this.stop();
		}
		if( this.num == 1 && this.y == this.Tetris_column-1  || this.num%2 == 0 && this.y+this.column-2 == this.Tetris_column-1  ){
			return this.stop();
		}else{
			for(let y=0; y<this.column; y++){
				for(let x = 0; x<this.row; x++){
					if( this.temp[y][x] != "ㅁ") continue;
					let x1 = 0, y1 = 0;
					if( this.obj_len == 1 ) x1 = 1;
					else if( this.row == 4 && this.column == 1 ) y1 = 1;
					else if( this.obj_len == 2 && this.num == 2 && this.row == 1 && this.column == 4) x1 = 2
						else if( this.obj_len == 2 && this.num == 4 && this.row == 1 && this.column == 4) x1 = 1
							else if( this.num == 2 && this.row == 2 && this.column == 3) x1 = 1;
						else if( this.obj_len == 4 && this.num == 3 && this.row == 3 && this.column == 2) y1 = 1;
						if( this.Tetris[this.y+y+y1][this.x+x+x1].shape == "ㅇ" ) return this.stop();
					}
				}
			}
			return true;
		}
	Keydown(e,key){ // Keydown
		key = e.keyCode;
		if( key == 32 && !this.space_start ){
			this.space_start = true;
		}else if( key == 32){
			this.KeySpace();
		}else if( key == 39){
			this.KeyRight();
		}else if( key == 37){
			this.KeyLeft();
		}else if( key == 40){
			this.KeyBottom();
		}else if( key == 38){
			this.KeyUp();
		}else if( key == 67){
			if(!this.holdCheck ) this.hold();
		}
	}
	// Sub Function 
	hold(temp){
		this.holdCheck = true;
		clearInterval(this.loop);
		this.Block_delete();
		temp = this.order[0];
		this.order.splice(0,1);
		if( this.holdNum != "" )  this.order.unshift(this.holdNum);
		this.holdNum = temp;
		this.Core();
	}
	AutoSpace(){ // AutoSpace
		this.Temp_Setting();
		for(let y = this.y; y<this.Tetris_column; y++){
			this.sy = y;
			if( !this.AutoStop() ) return false;
		}
	}
	AutoStop(){ // AutoStop
		this.Temp_Setting();
		if( this.obj_len == 2 && this.num ==3 && this.sy == this.Tetris_column-1 || this.obj_len == 4 && this.num == 3 && this.sy+1 == this.Tetris_column-1 ){
			return false;
		}
		if( this.num == 1 && this.sy == this.Tetris_column-1  || this.num%2 == 0 && this.sy+this.column-2 == this.Tetris_column-1  ){
			return false;
		}else{
			for(let y=0; y<this.column; y++){
				for(let x = 0; x<this.row; x++){
					if( this.temp[y][x] != "ㅁ") continue;
					let x1 = 0, y1 = 0;
					if( this.obj_len == 1 ) x1 = 1;
					else if( this.row == 4 && this.column == 1 ) y1 = 1;
					else if( this.obj_len == 2 && this.num == 2 && this.row == 1 && this.column == 4) x1 = 2
						else if( this.obj_len == 2 && this.num == 4 && this.row == 1 && this.column == 4) x1 = 1
							else if( this.num == 2 && this.row == 2 && this.column == 3) x1 = 1;
						else if( this.obj_len == 4 && this.num == 3 && this.row == 3 && this.column == 2) y1 = 1;
						if( this.Tetris[this.sy+y+y1][this.x+x+x1].shape == "ㅇ" ) return false;
					}
				}
			}
			return true;
		}
	stop(){ // stop
		clearInterval(this.loop);
		this.Upload();
		this.order.splice(0,1);
		this.End_Block();
		this.Core();
		this.holdCheck = false;
		return false;
	}
	End_Block(){ // End_Block
		this.Tetris.forEach( (y,y_pos) => this.Tetris[y_pos].forEach( (x,x_pos)=>{
			if( x.shape == "ㅁ" ) x.shape = "ㅇ";
		} ))
	}
	Block_delete(){ // Block_delete
		this.Tetris.forEach( (y,y_pos) => this.Tetris[y_pos].forEach( (x,x_pos)=> {
			if( x.shape == "ㅁ" ) x.shape = "" , x.color = "";
			if( x.shape == "ㅅ" ) x.shape = "" , x.color = "";
		}))
	}
	Create_Block(){ // Create_Block
		this.Temp_Setting();
		for(let y = 0; y<this.column; y++){
			for(let x = 0; x<this.row; x++){
				let temp = this.temp[y][x];
				if( this.temp[y][x] != "ㅁ" ) continue;
				if( this.obj_len == 1 ){
					if(!this.Item(y,x,-1,+1)){
						this.Block_delete();
						this.end = true;
						this.Update();
						this.Core();
						return false;
					} 
				}else if( this.row == 3 && this.column == 2){
					if(!this.Item(y,x,-1,0)){
						this.Block_delete();
						this.end = true;
						this.Update();
						this.Core();
						return false;
					}
				}else if( this.row == 4 && this.column == 1){
					if(!this.Item(y,x,0,0)){
						this.Block_delete();
						this.end = true;
						this.Update();
						this.Core();
						return false;
					}
				}
			}
		}
		this.Upload();
	}
	Item(y1,x1,y2,x2){ // Item
				// if( this.x+x2+this.row-1 > this.Tetris_row-1 || this.x+x2 < 0 ){
			// this.num--;
			// if( this.num == 0) this.num = 4;
			// this.Upload();
			// return false;
		// }else 
		if( this.Tetris[this.y+y1+y2][this.x+x1+x2].shape != "ㅇ" ){
			this.Tetris[this.sy+y1+y2][this.x+x1+x2].shape = "ㅅ";
			this.Tetris[this.sy+y1+y2][this.x+x1+x2].color = this.color;
			this.Tetris[this.y+y1+y2][this.x+x1+x2].shape = this.temp[y1][x1];
			this.Tetris[this.y+y1+y2][this.x+x1+x2].color = this.color;
			return true;
		}else{
			this.num--;
			console.log(this.num);
			if(this.num == 0) this.num = 4;					
			console.log(this.num);
			this.Upload();
			return false;
		}
	}
	Block_Order(result=[]){ // Block_Order
		while(result.length != this.shape.length){
			let ran = Math.floor(Math.random()*this.shape.length)+0;
			result.indexOf(ran) == -1 ? result.push(ran) : false;
		}
		return result;
	}
	Temp_Setting(){ // Temp_Setting
		this.temp = this.shape[this.order[0]];
		this.color = this.temp.color;
		this.obj_len = Object.keys(this.temp).length-1;
		if( this.obj_len == 1 || this.num == 1 ) this.temp = this.temp.num_1;
		else if( this.num == 2 )this.temp = this.temp.num_2;
		else if( this.obj_len == 2 && this.num == 3 ) this.temp = this.temp.num_1;
		else if( this.obj_len == 2 && this.num == 4 ) this.temp = this.temp.num_2;
		else if( this.obj_len == 4 && this.num == 3 ) this.temp = this.temp.num_3;
		else if( this.obj_len == 4 && this.num == 4 ) this.temp = this.temp.num_4;
		this.row = this.temp[0].length;
		this.column = this.temp.length;		
	}
	After(){ // After
		for(let a=0,b=1; a<3; a++,b++){
			this.AfterArr[a].arr = this.shape[this.order[b]].num_1;
			this.AfterArr[a].color = this.shape[this.order[b]].color;
		}
	}
	KeyUp(x3=0,xys=0){ // KeyUp
		// this.Temp_Setting();
		// for(let y=0; y<this.column; y++){
		// 	if( this.num == 2 ) xys = 2;
		// 	else if( this.num == 4 ) xys = 1;
		// 	if( this.x+xys == 0 && this.row == 1 && this.column == 4 && this.Tetris[this.y][this.x+xys+1].shape == "ㅇ" ){
		// 		return false;
		// 	}else if( this.x == 7 && this.row == 1 && this.column == 4 && this.Tetris[this.y][this.x+xys-1].shape == "ㅇ" || this.x == 8 && this.row == 1 && this.column == 4 && this.Tetris[this.y][this.x+xys-1].shape == "ㅇ" ){
		// 		return false;
		// 	}
		// }
		if(this.num++ >= 4 ) this.num = 1;
		// this.Temp_Setting();
		// if( this.row == 1 && this.column == 4 && this.y > 17  )  this.y = 17; 
		// if( this.row == 2 && this.column == 3 && this.y > 18 )  this.y = 18;
		// if( this.row == 4 && this.column == 1 && this.x < 0 || this.row == 3 && this.column == 2 && this.x<0 ) this.x = 0;
		// if( this.num == 1 && this.x+this.row-1 > this.Tetris_row-1 || this.num == 3 && this.x+this.row-1 > this.Tetris_row-1  )  this.x = (this.Tetris_row-1)-(this.row-1);							
		// if( this.obj_len == 1 ) x3 = 1;
		// else if( this.num == 2 && this.row == 2 && this.column == 3) x3 = 1;
		// else if( this.num == 2 && this.row == 1 && this.column == 4 ) x3 = 2;
		// else if( this.num == 4 && this.row == 1 && this.column == 4 ) x3 = 1;
		// if( this.Tetris[this.y][this.x+x3].shape == "ㅇ" ){
		// 	for(let x = this.x+x3; x<this.Tetris_row-1; x++){
		// 		if( this.Tetris[this.y][x].shape != "ㅇ" ){ 
		// 			if( x + Number(this.row-1) > this.Tetris_row-1 ) break;					
		// 			this.x = x;
		// 			break;
		// 		}
		// 	}
		// }else if( this.Tetris[this.y][this.x+this.row-1+x3].shape == "ㅇ" ){
		// 	for(let x = this.x+this.row-1+x3; x>0; x--){
		// 		if( this.Tetris[this.y][x].shape != "ㅇ" ){ 
		// 			if( (x-Number(this.row-1) ) < 0 ) break;
		// 			this.x = (x-Number(this.row-1) );
		// 			break;
		// 		}
		// 	}
		// }
		this.Upload();
	}
	KeySpace(){ // KeySpace
		this.Temp_Setting();
		for(let y = this.y; y<this.Tetris_column; y++){
			this.y = y;
			this.Score += 2;
			if( !this.Block_stop() ) return false;
		}
	}	
	KeyRight(){ // KeyRight
		this.Temp_Setting();
		for(let y=0; y<this.column; y++){
			for(let x=0; x<this.row; x++){
				let x1 = 0 , y1 = 0;
				if( this.temp[y][x] != "ㅁ") continue;
				if( this.obj_len == 1 ) y1 = -1, x1 = 2;
				else if( this.row == 3 && this.column == 2) y1 = -1, x1 = 1;
				else if( this.row == 4 && this.column == 1) x1 = 1

					else if( this.obj_len == 2 && this.num == 2 && this.row == 1 && this.column == 4) y1 = -1, x1 = 3;
				else if( this.obj_len == 2 && this.num == 4 && this.row == 1 && this.column == 4) y1 = -1, x1 = 2;
				else if( this.num == 2 && this.row == 2 && this.column == 3) y1 = -1,  x1 = 2
					else if( this.num == 4 && this.row == 2 && this.column == 3) y1 = -1,  x1 = 1
						else if( this.obj_len == 4 && this.num == 3 && this.row == 3 && this.column == 2) x1 = 1;

					if( this.x+x+x1 > this.Tetris_row-1 ) return false;
					if( this.Tetris[this.y+y+y1][this.x+x+x1].shape == "ㅇ" ) return false;
				}
			}
			this.x++;
			this.Upload();
		}
	KeyLeft(){ // KeyLeft
		this.Temp_Setting();		
		for(let y=0; y<this.column; y++){
			for(let x=0; x<this.row; x++){
				let x1 = 0, y1 = 0;
				if( this.temp[y][x] != "ㅁ") continue;
				if( this.obj_len == 1 ) y1 = -1;				
				else if( this.row == 3 && this.column == 2) y1 = -1 , x1 = -1;
				else if( this.row == 4 && this.column == 1) x1 = -1;

				else if( this.obj_len == 2 && this.num == 2 && this.row == 1 && this.column == 4) y1 = -1 , x1 = 1;
				else if( this.obj_len == 2 && this.num == 4 && this.row == 1 && this.column == 4) y1 = -1 , x1 = 0;

				else if( this.num == 2 && this.row == 2 && this.column == 3) y1 = -1, x1 = 0;
				else if( this.num == 4 && this.row == 2 && this.column == 3) y1 = -1, x1 = -1;

				else if( this.obj_len == 4 && this.num == 3 && this.row == 3 && this.column == 2) x1 = -1;

				if( this.x+x+x1 < 0 ) return false;
				if( this.Tetris[this.y+y+y1][this.x+x+x1].shape == "ㅇ" ) return false;
			}
		}
		this.x--;
		this.Upload();
	}
	KeyBottom(){ // KeyBottom
		if( !this.Block_stop() ) return false;		
		this.y++;
		this.Score += 1;
		this.Upload();
	}
	Score_num(){
		if(this.row_num == 1) this.Score+= 100; 
		else if(this.row_num == 2) this.Score+= 300; 
		else if( this.row_num == 3) this.Score += 500;
		else if( this.row_num == 4) this.Score += 800;
		this.row_num = 0;
	}
}


// 4 800
// 3 500
// 2 300
// 1 100


/*

위
옆
홀드

END 
스코어
미리보기 3 

*/
window.onload = function(){
	new App();
}