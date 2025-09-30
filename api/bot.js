import TelegramBot from "node-telegram-bot-api";
import express from "express";
import serverless from "serverless-http";
import { TOKEN } from "../env.js";
import bodyParser from "body-parser";
console.log("Bot is starting...");
const bot = new TelegramBot(TOKEN, {
  webHook: true, // ✅ majuscule H
});

bot.on("webhook_error", (error) => {
  console.log("Webhook error detected:", error);
});

const app = express();
app.use(express.json());

app.use(bodyParser.json())
// ✅ Endpoint qui reçoit les updates Telegram
app.post(`/api/bot${TOKEN}`, (req, res) => {
  console.log("Hi receive update ! ")
  bot.processUpdate(req.body);
  res.sendStatus(200);
}); 

// ✅ Petit endpoint test
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Exemple handler de commande
bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(msg.chat.id, "Welcome to the bot! 🚀");
});

export const handler = serverless(app);
export default handler;
