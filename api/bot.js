import TelegramBot from "node-telegram-bot-api";
import express from "express";
import { config } from "dotenv";
import serverless from "serverless-http";

config();

const bot = new TelegramBot(process.env.TOKEN, {
  webHook: true, // ✅ majuscule H
  request: {
    timeout: 300
  }
});

// ✅ Définir le webhook une seule fois au démarrage
bot.setWebHook(`${process.env.HOST}/api/bot${process.env.TOKEN}`)
  .then(() => console.log("✅ Webhook set"))
  .catch((error) => console.log("⚠️ Error setting webhook:", error.message));

bot.on("webhook_error", (error) => {
  console.log("Webhook error detected:", error);
});

const app = express();
app.use(express.json({ limit: "10mb" }));

// pour urlencoded
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// ✅ Endpoint qui reçoit les updates Telegram
app.post(`/api/bot${process.env.TOKEN}`, (req, res) => {
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
