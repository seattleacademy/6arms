const makePwmDriver = require('adafruit-i2c-pwm-driver')
const pwmDriver = makePwmDriver({address: 0x40, device: '/dev/i2c-1'})

//Constants
var xPosStart = 0;
var yPosStart = 2.75;
var l1 = 10.4;
var l2 = 9.85;
var l3 = 17.3;
var freq = 40;

var deltaTime = 1000;

pwmDriver.setPWMFreq(freq);

//List positions
var positions = [];
positions.push(Pos(12.7, 12.2, deltaTime, false));
positions.push(Pos(12.7, 12.2, deltaTime, true));
positions.push(Pos(13, 11.8, deltaTime, true));
positions.push(Pos(14, 11.4, deltaTime, true));
positions.push(Pos(14.5, 11, deltaTime, true));
positions.push(Pos(15, 10.5, deltaTime, true));
positions.push(Pos(15, 9.8, deltaTime, true));
positions.push(Pos(14, 9.4, deltaTime, true));
positions.push(Pos(13, 9, deltaTime, true));
positions.push(Pos(14, 8.5, deltaTime, true));
positions.push(Pos(15, 8, deltaTime, true));
positions.push(Pos(16, 7.5, deltaTime, true));
positions.push(Pos(16.5, 7.5, deltaTime, true));
positions.push(Pos(16.7, 6, deltaTime, true));
positions.push(Pos(16.5, 5, deltaTime, true));
positions.push(Pos(16, 4, deltaTime, true));
positions.push(Pos(15, 3.2, deltaTime, true));
positions.push(Pos(14, 3, deltaTime, true));
positions.push(Pos(13, 2.7, deltaTime, true));
positions.push(Pos(12, 2.5, deltaTime, true));
positions.push(Pos(11, 2.2, deltaTime, true));
positions.push(Pos(10, 2, deltaTime, true));
positions.push(Pos(9, 2, deltaTime, true));
positions.push(Pos(8, 3.3, deltaTime, true));
positions.push(Pos(7, 4.5, deltaTime, true));
positions.push(Pos(6.6, 5.3, deltaTime, true));
positions.push(Pos(8, 5.3, deltaTime, true));
positions.push(Pos(9, 5.2, deltaTime, true));
positions.push(Pos(10, 5.8, deltaTime, true));
positions.push(Pos(12, 6.3, deltaTime, true));
positions.push(Pos(11, 6.8, deltaTime, true));
positions.push(Pos(10, 7, deltaTime, true));
positions.push(Pos(9, 7.3, deltaTime, true));
positions.push(Pos(8, 7.8, deltaTime, true));
positions.push(Pos(7, 9, deltaTime, true));
positions.push(Pos(8, 10.5, deltaTime, true));
positions.push(Pos(9, 11.2, deltaTime, true));
positions.push(Pos(10, 11.5, deltaTime, true));
positions.push(Pos(11, 11.8, deltaTime, true));
positions.push(Pos(12, 12, deltaTime, true));
positions.push(Pos(12, 12, deltaTime, true));

function Pos(x, y, dt, draw){
	newPos = {};
	newPos.x = x;
	newPos.y = y;
	newPos.dt = dt;
	newPos.draw = draw;
	return newPos;
}

//Servo Angles
var angle0 = 90; //Either xx or yy if line movement is a drawn line or not
var angle1 = 90; //Calculated by PositionToAngles
var angle2 = 135; //Calculated by PositionToAngles
var angle3 = 135; //Calculated by PositionToAngles
var angle4 = 20; //Constant if drawing
var angle5 = 115; //Constant if drawing

//Convert an angle to pwm off value
function AngleToOff(angle){
    var cycle = 1000/freq;
    var tickTime = 1000 * cycle / 4096;
    var ms = (angle * 100 / 9) + 500;
    return ms / tickTime;
}

//Convert an x, y position to a set of 3 angles for the arm
function PositionToAngles(xIn, yIn){
	var xPosEnd = xIn - xPosStart; //Convert global x to local x
	var yPosEnd = yIn - yPosStart; //Convert global y to local y

	var angle3Search = 0; //Value to search through angles around the final point to conect back from
	var xPos3 = -Math.sin(angle3Search/180*Math.PI)*l3 + xPosEnd; //The x based on angle3Search
	var yPos3 = Math.cos(angle3Search/180*Math.PI)*l3 + yPosEnd; //the y based on angle3Search
	var h = Math.sqrt((xPos3*xPos3)+(yPos3*yPos3)); //The distance from the x, y just calculated to the origin
	while(h>(l1+l2-3)){ //Keep searching for better angles until it is close enough to the origin
		angle3Search++; //incriment the searching angle
		xPos3 = -Math.sin(angle3Search/180*Math.PI)*l3 + xPosEnd; //recalculate
		yPos3 = Math.cos(angle3Search/180*Math.PI)*l3 + yPosEnd; //recalculate
		h = Math.sqrt((xPos3*xPos3)+(yPos3*yPos3)); //recalculate
		if(angle3Search > 360){ //if we have done a full circle STOP!!
			console.log("ERROR: Position unreachable");
			return;
		}
	}
	var angle3Global = angle3Search - 90; //Convert the search angle to the angle above the x axis of the other end of the joint
	var hangle = Math.atan2(yPos3, xPos3) * 180 / Math.PI; //The angle above the x axis that the line between the 3rd point and the origin make
	var a1 = Math.acos((l2*l2-l1*l1-h*h)/(-2*l1*h))  * 180 / Math.PI; //Internal angle next to point 1 of the triangle between joint 1, 2 and the line between the 3rd point and the origin
	var a2 = Math.acos((h*h-l1*l1-l2*l2)/(-2*l1*l2))  * 180 / Math.PI;//Internal angle next to point 2 angle of the triangle between joint 1, 2 and the line between the 3rd point and the origin
	angle1 = a1 + hangle; //Calculate the angle value of servo 1
	angle2 = a2 - 45; //Calculate the angle value of servo 2
	angle3 = angle3Global + 135 - (angle2 - 135 + angle1); //Calculate the angle value of servo 3
}

//Sets the timeout for all of the movements
function DrawPicture(){
	var t = 0;
	for(var i = 0; i < positions.length; i++){
		//console.log(positions[i].x, positions[i].y);
		setTimeout(MoveArm, t, positions[i].x, positions[i].y, positions[i].draw);
		t += positions[i].dt;
	}
}

//Uses PositionToAngles and AngleToOff to set the servos' position
function MoveArm(x, y, draw){
	PositionToAngles(x, y);
	if(draw){ angle0 = 90; }
	else{ angle0 = 120; }
	console.log(angle1, angle2, angle3);
	pwmDriver.setPWM(0, 0, AngleToOff(angle0));
	pwmDriver.setPWM(1, 0, AngleToOff(angle1));
	pwmDriver.setPWM(2, 0, AngleToOff(angle2));
	pwmDriver.setPWM(3, 0, AngleToOff(angle3));
	pwmDriver.setPWM(4, 0, AngleToOff(angle4));
	pwmDriver.setPWM(5, 0, AngleToOff(angle5));
}

//Begin drawing the picture
DrawPicture();