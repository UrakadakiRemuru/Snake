var canv = document.getElementById('canvas');
var ctx = canv.getContext('2d');


var maxX = 30;
var maxY = 30;
var cellSize = 10;


var upPanelSize = 100;
var borderSize = 5;

canv.width = maxX*cellSize;
canv.height = maxY*cellSize + upPanelSize;

var initialInterval = 200;
var currentInterval = initialInterval;
var minusInterval = 30; 

var score = 0;

var snake = [{x:canvas.width*cellSize,y:5*cellSize+upPanelSize}]; 
var direction = 0; 
var isSnakeMoved = false;

var steps = 40; 
var apple = {x: -1, y: -1, remainingSteps: steps};
var eatenApples = 0; 

var callDraw = setInterval(draw, currentInterval); 

var input = document.getElementById("numberOfRemainingSteps");

var remaininSteps_text = document.getElementById("steps");
input.value = steps;

var isStarted = false;
var buttonStatus = "Start";

window.onload = function(){
	document.addEventListener('keydown', onKeyPressed);
} 


function draw()
{
	ctx.fillStyle = 'black';
  	ctx.fillRect(0, 0, canv.width, canv.height);
  	ctx.fillStyle = "#FF8C00";
  	ctx.fillRect(0, upPanelSize-borderSize, canv.width, borderSize); //рамка
  	ctx.fillRect(canv.width/2, borderSize, canv.width/2-borderSize, 40); // кнопка
  	ctx.fillStyle = 'white';
    ctx.font = "italic 14pt Arial";
    if(isStarted)
    	ctx.fillText("Restart", canv.width-110, 30);
    else
    	ctx.fillText("Start", canv.width-100, 30);
    ctx.fillText("Steps: " + apple.remainingSteps, 5, 20);
    ctx.fillText("Score: " + score, 5, 40);


  	

	if(!isStarted)
		return;
	 
	//remaininSteps_text.innerHTML = "Remaining steps: " + apple.remainingSteps;
	steps = input.value;
	
  	apple.remainingSteps--; 
  	spawnApple();
	for(var i = snake.length-1; i >= 0; i--)
	{
		if(i == 0){
			if(direction == 0)		
			{
				snake[0].y -= cellSize;
			}else if(direction == 1)
			{
				snake[0].x += cellSize;
			}else if(direction == 2){
				snake[0].y += cellSize;
			}else if(direction == 3){
				snake[0].x -= cellSize;
			}

			isSnakeMoved = true;

			if(snake[0].x == apple.x && snake[0].y == apple.y) 
			{
				apple.x = -1;
				apple.y = -1;
				apple.remainingSteps = 0;
				snake.push({x: snake[snake.length-1].x, y: snake[snake.length-1].y}); 
				eatenApples++;
				score++;
				if(eatenApples == 5 && currentInterval - minusInterval > 0){ 
					currentInterval -= minusInterval; 
					eatenApples = 0; 
					clearInterval(callDraw);
					callDraw = setInterval(draw, currentInterval); 

				}
			}

			
			if(snake[0].x < 0) 
				snake[0].x = (maxX-1)*cellSize;
			else if(snake[0].x > (maxX-1)*cellSize) 
				snake[0].x = 0;
			else if(snake[0].y < upPanelSize) 
				snake[0].y = (maxY-1)*cellSize + upPanelSize;
			else if(snake[0].y > (maxY-1)*cellSize + upPanelSize)
				snake[0].y = upPanelSize;

		}else{
			if(snake[i].x == snake[0].x && snake[i].y == snake[0].y && i != 1){ 
				alert("Вы проиграли!");
				RestartGame();
				return;
			}
			if(snake[i].x == snake[i-1].x && snake[i].y == snake[i-1].y) 
				continue;
			else
			{
				snake[i].x = snake[i-1].x; 
				snake[i].y = snake[i-1].y;
			}
		}
	ctx.fillStyle =  'lime';
    ctx.fillRect(snake[i].x, snake[i].y, cellSize, cellSize); 
	}
}


function onKeyPressed(evt){
	if(!isSnakeMoved)
		return;

	if(evt.keyCode == 37 && direction != 1) 
	{
		direction = 3; 
	}else if(evt.keyCode == 38 && direction != 2) 
	{
		direction = 0; 
	}else if(evt.keyCode == 39 && direction != 3)
	{
		direction = 1;
	}else if(evt.keyCode == 40 && direction != 0){
		direction = 2;
	}
	isSnakeMoved = false;
}

canvas.onclick = function(evt)
{
	if(evt.pageX > 164 && evt.pageX < 308 && evt.pageY > 18 && evt.pageY < 58)
		onBtnClick();
	
}

function spawnApple(){
	if(apple.x == -1 || apple.remainingSteps == 0){ 
		while(true){  
			apple.x = Math.floor(Math.random() * maxX) * cellSize; 
			apple.y = Math.floor(Math.random() * maxY) * cellSize + upPanelSize;
			apple.remainingSteps = steps;
			var isAppleInSnake = false;
			for(var i = 0; i < snake.length; i++){ 
				if(snake[i].x == apple.x  && snake[i].y == apple.y){
					apple.x = -1;
					apple.y = -1;
					isAppleInSnake = true;
				}

			}
			if(!isAppleInSnake){ 
				ctx.fillStyle = "red";
				ctx.fillRect(apple.x, apple.y, cellSize, cellSize);
				break;
			}

		}
	} else{ 

		ctx.fillStyle = "red";
		ctx.fillRect(apple.x, apple.y, cellSize, cellSize);
	}
}

function RestartGame()
{
	buttonStatus = "Start";
	while(snake.length != 1){ 
		snake.pop();
	}
	
	currentInterval = initialInterval;
	clearInterval(callDraw);
	callDraw = setInterval(draw, currentInterval); 
	isStarted = false;
	score = 0;
	apple.remainingSteps = 0;
	apple.x = -1;
	apple.y = -1;
	snake[0].x = canvas.width*cellSize;
	snake[0].y = 5*cellSize+upPanelSize;
}

function onBtnClick()
{
	if(buttonStatus == "Start"){
	isStarted = true; 
	buttonStatus = 'Restart';
	}else
		RestartGame();
}