const express = require('express')
const cors = require('cors')
import { PORT } from './config'
const messageRouter = require('./routers/messageRouter')
const whatsappClient = require('./services/WhatsappClient')
whatsappClient.initialize()
const whitelist = [
  "http://localhost:3001", "http://localhost:3000"
]
const app = express()
app.use(express.json())
app.use(cors({origin:whitelist}))
app.use(messageRouter)
app.listen(PORT)
// app.listen(3000, () => () => console.log(`Server is ready in on port ${process.env.PORT}`))