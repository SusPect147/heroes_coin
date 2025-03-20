import asyncio
import os
from aiogram import Bot, Dispatcher, types
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardMarkup
from environs import Env

env = Env()
env.read_env()

bot = Bot(token=env.str("BOT_TOKEN"), default=DefaultBotProperties(parse_mode="MarkDownV2"))
dp = Dispatcher()

keyboard = InlineKeyboardMarkup(inline_keyboard=
                                [[InlineKeyboardButton(text="Click!", web_app=WebAppInfo(url=env.str("url")))]])


async def start(message: types.message):
    await message.answer("click\!", reply_markup=keyboard)


async def main():
    dp.message.register(start, CommandStart)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())