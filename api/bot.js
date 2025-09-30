import TelegramBot from "node-telegram-bot-api"
import express from "express"
import {config} from "dotenv"
import serverless from "serverless-http"
import bodyParser from "body-parser"
config()
const bot = new TelegramBot(process.env.TOKEN, {
    webhook: true,
    request: {
        timeout: 1,
    }
})
bot.deleteWebHook().then(() => {
    console.log("❌ Wenbhook deleted !")
})
bot.setWebHook(`${process.env.HOST}/bot${process.env.TOKEN}`).then(() => {
    console.log("✅ webhook set")
}).catch((error) => {
    console.log("⚠️Error set wehbook: ",e.message)
})

bot.on('webhook_error',(error)=> {
    console.log('Webhook error detected: ',error)
})
const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))

app.post(`/bot${process.env.TOKEN}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})
app.get("/", (req, res) => {
    res.send("Hello World!")
})
bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, "Welcome to the bot!")
})
export const handler = serverless(app)
export default handler