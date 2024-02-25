/** import telegraf module */
const { Telegraf } = require("telegraf");
/** initialize dotenv */
require("dotenv").config();
/** create new bot instants from telegraf */
const bot = new Telegraf(process.env.BOT_TOKEN);
/** import axios module */
const { default: axios } = require("axios");

/**
 * define bot's behavior for start command
 */
bot.start((ctx) => {
	const replay =
		"Welcome to crypto pricing bot.\n\n" +
		"This bot will retrieve the USDT price of cryptocurrencies.\n\n" +
		`<b>Usage:</b>\n` +
		"You can start using this bot by sending /menu command.";

	ctx.replyWithHTML(replay);
});

/**
 * define a custom command to display the main
 * menu for cryptocurrency-related options.
 */
bot.command("menu", (ctx) => {
	bot.telegram.sendMessage(
		/** chat id */
		ctx.chat.id,
		/** message text */
		"Main menu: ",
		/** message options */
		{
			reply_to_message_id: ctx.message.message_id,
			reply_markup: {
				/** Inline keyboard for selecting cryptocurrencies */
				inline_keyboard: [
					/** button for viewing currency prices */
					[{ text: "Currencies price", callback_data: "pricing" }],
					[
						{
							/** text for the button */
							text: "CoinList (cryptoCompare)",
							/** URL to open when the button is clicked */
							url: "https://www.binance.com/en/markets/overview",
						},
					],
				],
			},
		}
	);
});

/**
 * define a custom command to display a list of
 * cryptocurrencies for selection.
 */
bot.action("pricing", (ctx) => {
	/** acknowledge the callback query */
	ctx.answerCbQuery();
	/** delete the original message that triggered the callback query */
	ctx.deleteMessage();
	/** send a message with cryptocurrency options for pricing */
	bot.telegram.sendMessage(
		/** chat id */
		ctx.chat.id,
		/** message text */
		"Chose one of the crypto currencies bellow",
		/** message options */
		{
			reply_markup: {
				/** Inline keyboard for selecting cryptocurrencies */
				inline_keyboard: [
					[
						/** Button for cryptocurrency BTC */
						{ text: "BTC", callback_data: "BTCUSDT" },
						/** Button for cryptocurrency ETH */
						{ text: "ETH", callback_data: "ETHUSDT" },
					],
					[
						/** Button for cryptocurrency BNB */
						{ text: "BNB", callback_data: "BNBUSDT" },
						/** Button for cryptocurrency BUSD */
						{ text: "BUSD", callback_data: "BUSDUSDT" },
					],
					/** Button for main menu */
					[{ text: "Main menu", callback_data: "main_menu" }],
				],
			},
		}
	);
});

/**
 * define a event listener for the time when the user
 * has pressed the bottom of a cryptocurrency
 */
bot.action(["BTCUSDT", "ETHUSDT", "BNBUSDT", "BUSDUSDT"], async (ctx) => {
	try {
		/** define the API URL to retrieve cryptocurrency price data */
		const apiURL = `https://api.binance.com/api/v3/ticker/price?symbols=["${ctx.match}"]`;
		/** retrieve data using axios module to make a API call */
		const data = await axios.get(apiURL).then((res) => res.data);
		/** replay to user with the price of the selected cryptocurrency in USD */
		ctx.reply(`${data?.[0]?.symbol}: ${data?.[0]?.price}`);
	} catch (error) {
		ctx.reply(error.message);
	}
	/** acknowledge the callback query */
	ctx.answerCbQuery();
});

/**
 * define a event listener for the time when the user
 * has pressed the main menu bottom
 */
bot.action("main_menu", (ctx) => {
	/** acknowledge the callback query */
	ctx.answerCbQuery();
	/** delete the original message that triggered the callback query */
	ctx.deleteMessage();
	/** sent a response to user message */
	bot.telegram.sendMessage(
		/** chat id */
		ctx.chat.id,
		/** message text */
		"Main menu",
		/** message options */
		{
			// reply_to_message_id: ctx.message.message_id,
			reply_markup: {
				/** Inline keyboard for selecting cryptocurrencies */
				inline_keyboard: [
					/** button for viewing currency prices */
					[{ text: "Currencies price", callback_data: "pricing" }],
					[
						{
							/** text for the button */
							text: "CoinList (cryptoCompare)",
							/** URL to open when the button is clicked */
							url: "https://www.binance.com/en/markets/overview",
						},
					],
				],
			},
		}
	);
});

/** launch the bot */
bot.launch();
