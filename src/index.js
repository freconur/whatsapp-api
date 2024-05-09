const express = require('express')
// const serverless = require('serverless-http')
const cors = require('cors')
const messageRouter = require('./routers/messageRouter')
const whatsappClient = require('./services/WhatsappClient')
whatsappClient.initialize()

const app = express()

// const whitelist = ['http://localhost:3001', 'http://localhost:3000', 'https://attendance-system-blond.vercel.app']
// const options = {
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('no permitido'));
//     }
//   }
// }
// app.use(cors())
app.use(cors(options))
app.use(express.json())
app.use(messageRouter)
app.listen(process.env.PORT || 3000)
// app.listen(3000, () => () => console.log(`Server is ready in on port ${process.env.PORT}`))
// module.exports.handler =  serverless(app)
