const express = require('express')
// const serverless = require('serverless-http')
const cors = require('cors')
const messageRouter = require('./routers/messageRouter')
const whatsappClient = require('./services/WhatsappClient')
whatsappClient.initialize()

const app = express()

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://attendance-system-blond.vercel.app'],
  methods: ["GET", "POST"]
}


app.use(cors(corsOptions))
// app.use(cors())
app.use(express.json())
app.use(messageRouter)
app.listen(process.env.PORT || 3000)
// app.listen(3000, () => () => console.log(`Server is ready in on port ${process.env.PORT}`))
// module.exports.handler =  serverless(app)