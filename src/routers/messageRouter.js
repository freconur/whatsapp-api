const express = require('express')
const router = new express.Router()
const whatsappClient = require('../services/WhatsappClient')

router.get('/',(req, res) => {
  res.send('holis')
})
router.post('/message', (req, res) => {
  // res.header('Access-Control-Allow-Origin','*')
  whatsappClient.sendMessage(req.body.phoneNumber, req.body.message)
  res.send()
})
module.exports = router