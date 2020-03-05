var game = {
	ctx: undefined,
	width: 640,
	height: 640,
	amount_line: 7,          //количесвто блоков в строке 
	amount_col: 5,          //количество блоков в столбце
	running: true,
	score: 0,
	model: {
		background: undefined,
		platform: undefined,
		ball: undefined,
		block: undefined,
	},
	blocks: [],
	create_block: function(){
		for(var col = 0; col<this.amount_col; col++){
			for(var line = 0; line<this.amount_line; line++){
				this.blocks.push({
					x: 87.5*line+20,
					y: 36*col+70,
					width: 75,
					height: 30,
					exist: true,
				});
			}
		}
	},
	
	start: function(){           //запуск игры
		this.init();
		this.load_image();
		this.create_block();
		this.run();
	},
	init: function(){
		var canvas = document.getElementById("mycanvas");
		this.ctx = canvas.getContext("2d");
		window.addEventListener("mousemove", function(e){          
			if(e.clientX<=320){
					game.platform.dx = -game.platform.v;
			} else if(e.clientX>320){
					game.platform.dx = game.platform.v;
			} else if (timeout) {
				clearTimeout(timeout);
	  			timeout = setTimeout(game.platform.stop, 75);
	  		} window.addEventListener("click", function(event){
	  			if(event.which == 1){
	  				game.platform.realiseBall();
	  			}
  			})
  		},
  	)},
	load_image: function(){
		this.model.background = new Image();     //создание картинки
		this.model.background.src = "background.png"; //загрузка картинки
		this.model.platform = new Image();     
		this.model.platform.src = "platform.png"; 
		this.model.ball = new Image();     
		this.model.ball.src = "ball.png";
		this.model.block = new Image();     
		this.model.block.src = "block.png";  
	},
	render: function(){
		this.ctx.clearRect(0,0, this.width, this.height);
		this.ctx.drawImage(this.model.background, 0, 0);
		this.ctx.drawImage(this.model.platform, this.platform.x, this.platform.y);
		this.ctx.drawImage(this.model.ball, this.ball.x, this.ball.y);
		this.blocks.forEach(function(element){ 
			if(element.exist){
				this.ctx.drawImage(this.model.block, element.x, element.y);
			}
		}, this);
		this.ctx.fillText("SCORE:" + this.score, 10, 630);
	},
	controller: function(){
		if(this.ball.collision(this.platform)){
			this.ball.bumpPlatform(this.platform);
		}
		if(game.platform.dx){
			this.platform.move();
		} this.platform.stop();
		if(this.ball.dx || this.ball.dy){
			this.ball.move();
		}
		this.blocks.forEach(function(element){
			if(element.exist){
				if(this.ball.collision(element)){
					this.ball.bumpBlock(element);
				}
			}
		}, this);
		this.platform.checkBorder();
		this.ball.checkBorder();
	},
	run: function(){
		this.controller();
		this.render();
		if(this.running){
			window.requestAnimationFrame(function(){
				game.run();
			})
		}

	},
	over: function(text){
		alert(text);
		this.running = false;
		window.location.reload();                    //перезагрузка страницы
	},
};
game.ball = {
		width: 51,
		height: 51,
		x: 293,
		y: 518,
		dx: 0,
		dy: 0,
		v: 5,
		jump: function(){
			this.dy = -this.v;
			this.dx = -this.v;
		},
		move: function(){
			this.x += this.dx;
			this.y += this.dy;
		},
		collision: function(element){                       //столкновение с блоком
			var x = this.x + this.dx;                       //координаты мяча на следующем кадре
			var y = this.y + this.dy;
			if(x + this.width > element.x &&                 //правая сторона мяча и левая сторона блока
				x < element.x + element.width &&
				y + this.height > element.y &&
				y < element.y + element.height){

				return true;
			}
		return false;
		},
		bumpBlock: function(block){                              //отталкивание от блока
			this.dy *= -1;
			block.exist = false;
			++game.score;
			if(game.score >= game.amount_line * game.amount_col){
				game.over("Congratulations, you won!");
			}
		},
		bumpPlatform: function(platform){                              //отталкивание от блока
			this.dy = -this.v;
		},
		checkBorder: function(){
			var x = this.x + this.dx;                    
			var y = this.y + this.dy;
			if(x<0){
				this.x = 0;
				this.dx = this.v;
			} else if (x + this.width > game.width){
				this.x = game.width - this.width;
				this.dx = -this.v;
			} else if (y < 0) {
				this.y = 0;
				this.dy = this.v;
			} else if (y + this.height > game.height){
				game.over("Game over...");
			}
		}
	};         

game.platform = {
			x: 220,
			y: 570,
			v:12,          //максимальная скорость движения платформы
			dx: 0,
			width: 200,
			height: 40,
			ball: game.ball,
			realiseBall: function(){
				if(this.ball){
					this.ball.jump();
					this.ball = false;
				}
			},
			move: function(){
					this.x += this.dx;
					if(this.ball){              //мяч на платформе?
						this.ball.x += this.dx;
					}
			},
			stop: function(){
				this.dx = 0;
				if(this.ball){              
					this.ball.dx = 0;
				}
			},
			checkBorder: function(){
				var x = this.x + this.dx;                    
				if(x<0){
				this.x = 0;
				this.dx = this.v;
			} else if (x + this.width > game.width){
				this.x = game.width - this.width;
				this.dx = -this.v;
			}
		}
		}; 
window.addEventListener("load", function(){           //загрузка изображения после загрузки html
	game.start();
});