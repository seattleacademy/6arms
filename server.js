const express = require('express')
const app = express()
const port = 6001
app.use(express.static('public'))
const makePwmDriver = require('adafruit-i2c-pwm-driver')
const pwmDriver = makePwmDriver({address: 0x40, device: '/dev/i2c-1'})
pwmDriver.setPWMFreq(50)

app.get('/channel/:channel/on/:on/off/:off/freq/:freq', function (req, res) {
  res.send(req.params)
  channel = req.params.channel;
  on = req.params.on;
  off = req.params.off;
  freq = req.params.freq;
  console.log(channel,on,off,freq);
  pwmDriver.setPWMFreq(freq)
pwmDriver.setPWM(channel,on,off) // channel, on , off 

})

app.listen(port, () => console.log('Example app listening on port: ' + port ))