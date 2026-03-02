board = document.getElementById('boardid');
pen = board.getContext('2d');
// sizes will adapt to viewport; keep snake segment size fixed
width = 30; // snake width
snake_speed = 100; // game loop refresh interval (ms)

function resizeBoard() {
    // leave 10% horizontal margin and room for nav/controls vertically
    const navHeight = document.querySelector('.nav-bar')?.offsetHeight || 0;
    const controlsHeight = document.querySelector('.controls-container')?.offsetHeight || 0;

    board_width = board.width = Math.max(300, window.innerWidth * 0.95);
    board_height = board.height = Math.max(300, window.innerHeight - navHeight - controlsHeight - 40);

    end_row = Math.round(board_height / width);
    end_col = Math.round(board_width / width);
}

window.addEventListener('resize', resizeBoard);
resizeBoard();

start_pressed = false;
first_game = true;
game_over = false;
score = 0;
food_img = new Image();
food_img.src = "images/apple.png";
food = getRandomFood();

// Function to set direction from on-screen buttons
function setDirection(direction) {
	if (start_pressed) {
		snake.direction = direction;
	}
}

/*-------------------------------------------- START -----------------------------------------------*/
//triggered when Enter is pressed or Start button clicked
function start(){
	start_pressed = true;
	console.log("clicked");
	score = 0;
	game_over=false;
	if(!first_game){
		food = getRandomFood();
	}
	first_game = false;
	snake.snakeArray = [{x:0,y:end_row-1},{x:1,y:end_row-1},{x:2,y:end_row-1}];
	snake.direction = "right";
	document.getElementById("message3").textContent ="Game started! Use controls or arrow keys!";
}
function getRandomFood(){
	var foodX = Math.round(Math.random()*(board_width-width)/width);
	var foodY = Math.round(Math.random()*(board_height-width)/width);
	var food = { x:foodX, y:foodY, color:"red" } //food class with 3 properties
	return food
}

/*-------------------------------------------- GAME LOOP ---------------------------------------------*/
//gameloop refresh interval

setInterval(gameloop, snake_speed);

function gameloop(){
	if(game_over==true){
		document.getElementById("message3").textContent = "Game Over! Press Start to play again.";
		return;
	}
	//erase the old snake and draw new one at updated position
	pen.clearRect(0,0,board_width,board_height);
	snake.drawSnake();
	
	//draw food in new frame
	pen.fillStyle = food.color;
	pen.drawImage(food_img, food.x*width-5, food.y*width-5, 40, 40); //40,40 represent size of apple


	//don't update the snake until Enter is pressed
	if(start_pressed){
		snake.updateSnake();
	}
	
	document.getElementById("message1").textContent = Highest_score;
	document.getElementById("message2").textContent = score;
	localStorage["Highest_score_key"] = Highest_score; //caching
}



/*--------------------------------------------- SNAKE CLASS --------------------------------------------*/
//SNAKE CLASS
snake = {
	color:"blue",
	snakeArray: [{x:0,y:end_row-1},{x:1,y:end_row-1},{x:2,y:end_row-1}],
	direction:"",

	//draw snake according to current 
	//x and y coordintes of the snakeArray
	drawSnake:function(){
		for(var i=0;i<this.snakeArray.length;i++){
			pen.fillStyle = this.color;
			pen.fillRect(this.snakeArray[i].x*width,this.snakeArray[i].y*width,width-3,width-3);
		}
	},

	//update snakeArray based on direction
	//and whether food is eaten or not
	updateSnake:function(){
		var headX = this.snakeArray[0].x;
		var headY = this.snakeArray[0].y;

		if(headX==food.x && headY==food.y){
			console.log("Food eaten");
			food = getRandomFood();
			score++;
			//update highscore
			if(score > Highest_score){
				Highest_score = score;
			}
		} else{
			this.snakeArray.pop();
		}

		var nextX,nextY;
		if(this.direction=="right"){
			nextX = headX + 1;
			nextY = headY;
		} else if(this.direction=="left"){
			nextX = headX - 1;
			nextY = headY;
		} else if(this.direction=="down"){
			nextX = headX;
			nextY = headY + 1;
		} else if(this.direction=="up"){
			nextX = headX;
			nextY = headY - 1;
		} else{
			//during start direction = ""
			nextX = headX;
			nextY = headY;
		}
		this.snakeArray.unshift({x: nextX,y:nextY});

		// game over if the snake hits the wall
		if(this.snakeArray[0].y<0 || this.snakeArray[0].x < 0 || this.snakeArray[0].x > end_col || this.snakeArray[0].y > end_row){
			game_over = true;
			start_pressed = false;
		}
	}
};

/*------------------------------------------- EVENT LISTENER ---------------------------------------------*/
//Add a Event Listener on the Document Object to detect keyboard keypresses
document.addEventListener('keydown',keyPressed);
function keyPressed(e){
	if(e.key=="ArrowRight"){
		snake.direction = "right";
	}
	else if(e.key=="ArrowLeft"){
		snake.direction = "left";
	}
	else if(e.key=="ArrowDown"){
		e.preventDefault();
		// to prevent webpage scrolling using arrow key
		snake.direction = "down";
	}
	else if(e.key=="ArrowUp"){
		e.preventDefault(); 
		// to prevent webpage scrolling using arrow key
		snake.direction = "up";
	}
	//starting game on pressing enter
	else if(e.key=="Enter"){
		start();
	}
	console.log(snake.direction);
}



/*-------------------------------------------------- CACHING ----------------------------------------------*/
//caching highest score
// localStorage['myKey'] = 'somestring'; // only strings //write
// var myVar = localStorage['myKey'] || 'defaultValue'; //read

// localStorage['myKey'] = JSON.stringify(myVar); //write
// var stored = localStorage['myKey']; //read
// if (stored) myVar = JSON.parse(stored);
// else myVar = {a:'test', b: [1, 2, 3]};
if (localStorage.getItem("Highest_score_key") === null) {
	localStorage["Highest_score_key"] = JSON.stringify(0);
}
stored = localStorage["Highest_score_key"]; //read
console.log(`stored: ${stored}`);
Highest_score = JSON.parse(stored);

// show initial high score in navbar
if(document.getElementById("message1")) {
    document.getElementById("message1").textContent = Highest_score;
}