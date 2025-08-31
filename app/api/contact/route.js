import axios from "axios";
import { NextResponse } from "next/server";

async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error(
      "Error sending Telegram message:",
      error.response?.data || error.message
    );
    return false;
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage, token: captchaToken } = payload;

    const verifyRes = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: captchaToken,
      })
    );

    if (!verifyRes.data.success) {
      return NextResponse.json(
        { success: false, message: "Captcha verification failed!" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          message: "Telegram token or chat ID is missing.",
        },
        { status: 400 }
      );
    }

    const message = `📩 New message\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message: ${userMessage}`;

    const telegramSuccess = await sendTelegramMessage(botToken, chatId, message);

    if (telegramSuccess) {
      return NextResponse.json(
        {
          success: true,
          message: "Message sent successfully!",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred.",
      },
      { status: 500 }
    );
  }
}
