const express = require('express')
const { toString } = require('qrcode')
var QRCode = require('qrcode')
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const { readFileSync, writeFileSync } = require('fs')

const router = new express.Router()
const whatsappClient = require('../services/WhatsappClient')
const client = new Client(
  {
    puppeteer: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      authStrategy: new LocalAuth() // what ever authStrategy you are using
    },
  }
)

// router.get('/', async (req, res) => {
//   whatsappClient.on("qr", async (qr) => {
//     // const rta = qrcode.generate(qr, { small: true })
//     // console.log(qr.toString())
//       const canvas = document.getElementById('qrcode')
//       QRCode.toCanvas(canvas, qr, function (error) {
//         if (error) console.error(error)
//         console.log('success!');
//     })
//     // let qr = await new Promise((resolve, reject) => {
//     //   whatsappClient.on('qr', (qr) => resolve(qr.toString()))
//     // })

//     // toString(rta,
//     //   {
//     //     type: 'svg'
//     //   },
//     //   (error, data) => {
//     //     if (error) {
//     //       console.log('error', error)
//     //     }
//     //     var web = readFileSync('./qrimage.html', { encoding: 'utf-8' }).replace('[QR CODE]', data)
//     //     console.log('web', web)
//     //     // Print(web)
//     //   }
//     // )

//   })
//   res.sendField('./qrimage.html', { root: __dirname })
//   // const rta =  qrcode.generate(qr, { small: true })
// })

router.post('/message', (req, res) => {
  whatsappClient.sendMessage(req.body.phoneNumber, req.body.message)
  res.send()
})
module.exports = router