
//Variable declarations
var canvas, canvasContext;
var x_position = 50;
var y_position = 50;
var x_speed = 6;
var y_speed = 4;

var player_1 = 0;
var player_2 = 0;

var pad1 = 250;
var pad2 = 250;
const PAD_HEIGHT = 100;
const PAD_THICKNESS = 20;
const FINAL_SCORE = 5;

var end_of_game = false;

// end

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();//canvas area
	var rt = document.documentElement;
	var mouseX = evt.clientX - rect.left - rt.scrollLeft;//x position 
	var mouseY = evt.clientY - rect.top - rt.scrollTop;//y position
	return {
		x: mouseX,
		y: mouseY
	};
}
function handleMouseClick(evt) {
	if (end_of_game) {
		player_1 = 0;
		player_2 = 0;
		end_of_game = false;
	}
}
window.onload = function () {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 40;
	setInterval(function () {
		moveEverything();
		drawEverything();
	}, 1000 / framesPerSecond);

	canvas.addEventListener('mousemove', function (evt) {
		var mousePos = calculateMousePos(evt);
		pad1 = mousePos.y - (PAD_HEIGHT / 2);
	});
	canvas.addEventListener('mousedown', handleMouseClick);
}
function computerMovement() {
	var pad2Center = pad2 + (PAD_HEIGHT / 2);
	if (pad2Center < y_position - 35) { //move the paddle down if it is  above the ball
		pad2 += 6;
	}
	else if (pad2Center < y_position + 35) { //move the paddle below if it is above the ball
		pad2 -= 6;
	}
}
function moveEverything() {
	if (end_of_game) {
		return;
	}
	computerMovement();
	x_position += x_speed;
	y_position += y_speed;
	if (x_position > canvas.width) {
		if (y_position > pad2 && y_position < pad2 + PAD_HEIGHT) { 
			x_speed = -x_speed;
			var deltaY = y_position - (pad2 + PAD_HEIGHT / 2);
			y_speed = deltaY * 0.35
		}
		else {
			player_1++; //icrement must  be before ballReset()
			ballReset();
		}
	}
	if (x_position < 0) {
		if (y_position > pad1 && y_position < pad1 + PAD_HEIGHT) {
			x_speed = -x_speed;
			var deltaY = y_position - (pad1 + PAD_HEIGHT / 2);
			y_speed = deltaY * 0.35;
		}
		else {
			player_2++; //icrement must be before ballReset()
			ballReset();
		}
	}
	if (y_position < 0) {
		y_speed = -y_speed;
	}
	if (y_position > canvas.height) {
		y_speed = -y_speed;
	}

}
function drawNet() {
	for (var i = 0; i < canvas.height; i += 40) {
		colorRect(canvas.width / 2 - 1, i, 2, 20, 'pink');
	}
}
function drawEverything() {
	colorRect(0, 0, canvas.width, canvas.height, '#51595F'); //blank
	if (end_of_game) {
		canvasContext.fillStyle = 'white';
		if (player_1 >= FINAL_SCORE) {
			canvasContext.fillText("Player 1 Won", 350, 200);
		} else if (player_2 >= FINAL_SCORE) {
			canvasContext.fillText("Player 2 Won", 350, 200);
		}
		canvasContext.fillText("Play Again", 350, 500);
		return;
	}
	drawNet();
	colorRect(0, pad1, PAD_THICKNESS, PAD_HEIGHT, 'pink'); //user paddle
	colorRect(canvas.width - PAD_THICKNESS, pad2, PAD_THICKNESS, PAD_HEIGHT, 'pink'); //computer paddle
	colorCircle(x_position, y_position, 10, 'white');//create the ball
	canvasContext.fillText(player_1, 100, 100);
	canvasContext.font = "40px Comic Sans";
	canvasContext.fillText(player_2, canvas.width - 100, 100);

}
function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
function ballReset() {
	if (player_1 >= FINAL_SCORE || player_2 >= FINAL_SCORE) {
		end_of_game = true;
	}
	x_speed = -x_speed;//will reverse the direction of movement when ball touches the left wall
	x_position = canvas.width / 2;
	y_position = canvas.height / 2;
}