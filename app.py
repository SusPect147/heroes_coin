import asyncio
import os

from aiogram.fsm.state import StatesGroup, State
import aiogram.utils.markdown as md
from sqlitestorage import SQLiteStorage
from aiogram import Bot, Dispatcher, types, F
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import InlineKeyboardButton, WebAppInfo, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardMarkup
from environs import Env
import re


def escape_md(text: str | int) -> str:
    escape_chars = r"_*[]()~`>#+-=|{}.!"
    return re.sub(r'([{}])'.format(re.escape(escape_chars)), r'\\\1', str(text))

env = Env()
env.read_env()

bot = Bot(token=env.str("BOT_TOKEN"), default=DefaultBotProperties(parse_mode="MarkDownV2"))
dp = Dispatcher(storage = SQLiteStorage(env.str("DB_PATH")))

class St(StatesGroup):
    support = State()

keyboard = InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="🚀 Play", web_app=WebAppInfo(url=env.str("url")))],
                    [InlineKeyboardButton(text="📰 Join community", url=env.str("url_community"))],
                    [InlineKeyboardButton(text="👤 Invite", callback_data="invite")],
                    [InlineKeyboardButton(text="🛂 Tech support", callback_data="support")]
                                ])


@dp.message(F.text.startswith("/start"))
async def start(message: types.message):
    ref_from_id = message.text.split(maxsplit=1)
    if len(ref_from_id) == 2 and ref_from_id[1].isdigit():
        print(ref_from_id)
    await message.answer(f"text", reply_markup=keyboard)


@dp.message(F.text == "/stop")
async def stop_command(message: types.Message, state: FSMContext):
    if await state.get_state() == "support":
        await state.clear()
        await message.answer("You have ended the support chat\.")
    else:
        await message.answer("You are not currently in a support chat\.")


@dp.message(St.support)
async def handle_to_support_message(message: types.Message):
    support_id = env.int("SUPPORT_ID")
    # User sending a message to support
    await bot.send_message(
        support_id,
        f"Message from user `{message.chat.id}`:\n{escape_md(message.text)}",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="User", url=f"tg://user?id={message.from_user.id}")],
            [InlineKeyboardButton(text="Ready✔", callback_data=f"delete_message")]
        ]))

    await message.answer(
        "Successfully sent to support",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🛑 Stop Chat", callback_data=f"stop_support:{message.chat.id}")]
        ]))


@dp.message(F.reply_to_message, F.from_user.id == env.int("SUPPORT_ID"))
async def handle_support_message(message: types.Message):
    # Support responding to a user
    user_id = int(message.reply_to_message.text.split()[3].replace(":", ""))
    await bot.send_message(
        user_id,
        f"Support: {escape_md(message.text)}",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🛑 Stop Chat", callback_data=f"stop_support:{user_id}")]
        ])
    )


@dp.callback_query(F.data == "invite")
async def invite(call: types.CallbackQuery):
    message = call.message
    referral_link = f"https://t.me/{env.str('BOT_USERNAME')}?start={call.from_user.id}"
    await message.answer(
        f"Invite your friends using this link: {escape_md(referral_link)}\n\nGet ?? gems from each invited friend",
    reply_markup=InlineKeyboardMarkup(inline_keyboard=
                                      [[InlineKeyboardButton(text="123",
                                                 switch_inline_query=f"Join to game!\n"
                                                                     f"Click on this link: {referral_link}")]]
                                      ))


@dp.callback_query(F.data == "delete_message")
async def delete_message(call: types.CallbackQuery):
    try:
        await call.message.delete()
    except:
        pass
    

@dp.callback_query(F.data == "support")
async def support(call: types.CallbackQuery, state: FSMContext):
    await call.message.answer("You are now connected to technical support\. Please write your message\.")
    await state.set_state(St.support)


@dp.callback_query(F.data.startswith("stop_support"))
async def stop_support(call: types.CallbackQuery, state: FSMContext):
    user_id = int(call.data.split(":")[1])
    if call.from_user.id == user_id or call.from_user.id == env.int("SUPPORT_ID"):
        await state.clear()
        await call.message.answer("The support chat has been ended\.")
    else:
        await call.answer("You are not authorized to end this chat\.", show_alert=True)
    await call.message.delete()


async def main():
    await bot.set_my_commands([
                types.BotCommand(WebAppInfo(url=env.str("url")))
            ])
    # dp.message.register(start, CommandStart)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())