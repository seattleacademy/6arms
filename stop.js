const makePwmDriver = require('adafruit-i2c-pwm-driver')
const pwmDriver = makePwmDriver({address: 0x40, device: '/dev/i2c-1'})
off=0;
pwmDriver.setPWMFreq(40)
pwmDriver.setPWM(0,0,0) // channel, on , off 
pwmDriver.setPWM(1,0,off) // channel, on , off
pwmDriver.setPWM(2,0,off) // channel, on , off
pwmDriver.setPWM(3,0,off) // channel, on , off
pwmDriver.setPWM(4,0,off) // channel, on , off
pwmDriver.setPWM(5,0,off) // channel, on , off
