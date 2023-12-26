const express = require('express')
const cors = require('cors')
const messageRouter = require('./routers/messageRouter')
const whatsappClient = require('./services/WhatsappClient')
whatsappClient.initialize()
const whitelist = [
  "http://localhost:3001", "http://localhost:3000", "https://whatsapp-api-attendance.up.railway.app","http://whatsapp-api-attendance.up.railway.app"
]

const app = express()
app.use(express.json())
app.use(cors({origin:whitelist}))
// app.use(cors({origin:whitelist}))
app.use(messageRouter)
app.listen(process.env.PORT || 3000)
// app.listen(3000, () => () => console.log(`Server is ready in on port ${process.env.PORT}`))
// module.exports.handler =  serverless(app)