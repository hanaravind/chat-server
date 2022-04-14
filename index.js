const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const messageServiceSid = process.env.TWILIO_MESSAGING_SID
const twilioClient = require('twilio')(accountSid, authToken)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World! ')
})

app.post('/', (req, res) => {
    const { message, user:sender, members } = req.body
    if(type === 'message.new') {
        members
        .filter((member) => member.user_id !== sender.id)
        .forEach(({ user }) => {
            if(!user.online) {
                twilioClient.messages.create({
                    body: `You have a new message from ${message.user.fulllName} - ${message.text}`,
                    messagingServiceSid: messageServiceSid,
                    to: user.phoneNumber
                }).then(() => {
                    console.log('Message Sentd')
                }).catch((error) => {
                    console.log(error)
                })
            }
        })
        return res.status(200).send('Message Sent')
    }
    return res.status(200).send('Not a new Message Request')
})

app.use('/auth', authRoutes)

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})