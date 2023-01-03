import * as functions from "firebase-functions";
const fetch = require("node-fetch");
const admin = require("firebase-admin");
admin.initializeApp();

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

function getMostFrequent(arr: any[]) {
  const hashmap = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(hashmap).reduce((a, b) => (hashmap[a] > hashmap[b] ? a : b));
}

async function deleteCollection(db: any, collectionPath: string, batchSize: number) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db: any, query: any, resolve: any) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

exports.onVoteCreate = functions.firestore.document("/GALLEON/{documentId}").onCreate(async (snap, _) => {
  const id = `${snap.id.slice(0, 6)}...${snap.id.slice(snap.id.length - 4, snap.id.length)}`;
  const sentiment = snap.data().isBullish;

  functions.logger.log("New vote alert", id, sentiment);

  const message = `🚨 Deckhand ${id} has just voted that they are **${
    sentiment ? "Bullish" : "Bearish"
  }** in the Royal Fortune Fund 🚨`;

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
  }** to **${newSentiment ? "Bullish" : "Bearish"}** in the Royal Fortune Fund 🚨`;

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

exports.onControlCreate = functions.firestore.document("/CONTROL/{documentId}").onCreate(async (snap, _) => {
  const sentiment = snap.data().isBullish;
  const account = snap.data().account;
  const id = `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`;

  functions.logger.log("New Control Point alert", id, sentiment);

  const message = `🚨 Deckhand ${id} has taken the control point with a **${
    sentiment ? "Bullish" : "Bearish"
  }** sentiment! 🚨`;

  try {
    const response = await postMessageToDiscord("Cursed Fund Overseer", message);
    if (response.ok) {
      functions.logger.info(`Posted Control Point for ${id} to Discord`, sentiment);
    } else {
      // @ts-ignore
      throw new Error(response.error);
    }
  } catch (error) {
    functions.logger.error(`Unable to post Control Point for ${id}`, error);
  }
});

exports.scheduledControlWinner = functions.pubsub
  .schedule("0 12 * * 0")
  .timeZone("UTC")
  .onRun(async (_) => {
    const accountData = await admin
      .firestore()
      .collection("CONTROL")
      .get()
      .then((querySnapshot: any) => {
        return querySnapshot.docs.map((doc: any) => doc.data());
      });

    const accountNames = accountData.map((data: any) => data.account);
    const winner = getMostFrequent(accountNames);
    const id = `${winner.slice(0, 6)}...${winner.slice(winner.length - 4, winner.length)}`;

    const sentiment = accountData
      .filter((data: any) => data.account === winner)
      .sort( (x: any, y: any) => {
        return x.timestamp - y.timestamp;
      })
      .pop().isBullish;

    await admin.firestore().collection("CONTROL_WINNERS").add({
      account: winner,
      isBullish: sentiment,
      timestamp: Date.now(),
    });

    const message = `🚨 Deckhand ${id} has been crowned the Control Point winner with a **${
      sentiment ? "Bullish" : "Bearish"
    }** sentiment! 🚨`;

    try {
      const response = await postMessageToDiscord("Cursed Fund Overseer", message);
      if (response.ok) {
        functions.logger.info(`Posted Control Point for ${id} to Discord`, sentiment);
      } else {
        // @ts-ignore
        throw new Error(response.error);
      }
    } catch (error) {
      functions.logger.error(`Unable to post Control Point for ${id}`, error);
    }

    await deleteCollection(admin.firestore(), "CONTROL", 100);
  });
