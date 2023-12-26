const express = require('express')
const cors = require('cors')
const router = new express.Router()
const whatsappClient = require('../services/WhatsappClient')

router.get('/',(req, res) => {
  res.send('holis')
})
router.post('/message',cors(), (req, res) => {
  // res.header('Access-Control-Allow-Origin','https://attendance-system-blond.vercel.app')
  whatsappClient.sendMessage(req.body.phoneNumber, req.body.message)
  res.send()
})
module.exports = router