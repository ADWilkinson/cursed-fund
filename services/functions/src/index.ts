import * as functions from "firebase-functions";
const fetch = require("node-fetch");

async function postMessageToDiscord(botName: string, messageBody: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error(
      "No webhook URL found. Set the Discord Webhook URL before deploying. Learn more about Discord webhooks here: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
    );
  }

  return fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: messageBody,
      username: botName,
    }),
  });
}

exports.onVoteCreate = functions.firestore.document("/GALLEON/{documentId}").onCreate(async (snap, _) => {
  const id = `${snap.id.slice(0, 6)}...${snap.id.slice(snap.id.length - 4, snap.id.length)}`;
  const sentiment = snap.data().isBullish;

  functions.logger.log("New vote alert", id, sentiment);

  const message = `🚨 Deckhand ${id} has just voted that they are **${sentiment ? "Bullish" : "Bearish"}** 🚨`;

  try {
    const response = await postMessageToDiscord("Cursed Fund Overseer", message);
    if (response.ok) {
      functions.logger.info(`Posted vote for ${id} to Discord`, sentiment);
    } else {
      // @ts-ignore
      throw new Error(response.error);
    }
  } catch (error) {
    functions.logger.error(`Unable to post vote for ${id}`, error);
  }
});

exports.onVoteUpdate = functions.firestore.document("/GALLEON/{documentId}").onUpdate(async (change, _) => {
  const id = `${change.after.id.slice(0, 6)}...${change.after.id.slice(
    change.after.id.length - 4,
    change.after.id.length
  )}`;
  const newSentiment = change.after.data().isBullish;
  const previousSentiment = change.before.data().isBullish;

  functions.logger.log("Updated vote alert", id, newSentiment);

  const message = `🚨 Deckhand ${id} has just changed their vote from **${
    previousSentiment ? "Bullish" : "Bearish"
  }** to **${newSentiment ? "Bullish" : "Bearish"}** 🚨`;

  try {
    const response = await postMessageToDiscord("Cursed Fund Overseer", message);
    if (response.ok) {
      functions.logger.info(`Posted updated vote for ${id} to Discord`, newSentiment);
    } else {
      // @ts-ignore
      throw new Error(response.error);
    }
  } catch (error) {
    functions.logger.error(`Unable to post updated vote for ${id}`, error);
  }
});
