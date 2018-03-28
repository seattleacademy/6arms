const makePwmDriver = require('adafruit-i2c-pwm-driver')
const pwmDriver = makePwmDriver({address: 0x40, device: '/dev/i2c-1'})
var freq = 40;
pwmDriver.setPWMFreq(freq);

function angleToOff(angle){
    var cycle = 1000/freq;
    var tickTime = 1000 * cycle / 4096;
    var ms = (angle * 100 / 9) + 500;
    return ms / tickTime;
}




var xPos = 10;
var yPos = 9;





pwmDriver.setPWM(0,0,1500);
pwmDriver.setPWM(1,0,1500);
pwmDriver.setPWM(2,0,1500);
pwmDriver.setPWM(3,0,1500);
pwmDriver.setPWM(4,0,1500);
pwmDriver.setPWM(5,0,1500);





//pwmDriver.setPWM(1,0,off) // channel, on , off
//pwmDriver.setPWM(2,0,off) // channel, on , off
//pwmDriver.setPWM(3,0,off) // channel, on , off
//pwmDriver.setPWM(4,0,off) // channel, on , off
//pwmDriver.setPWM(5,0,off) // channel, on , off
