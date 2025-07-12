import {
  checkAlertExists,
  getAnomalies,
  createAlert,
} from "./services/elastic.js";
import { sleep } from "./lib/utils.js";
import { getEmail } from "./services/db.js";
import { sendEmail } from "./services/mailer.js";
import dotenv from "dotenv";
dotenv.config();

async function job() {
  // get anomalies
  const anomalies = await getAnomalies({
    index: "vaultguard-logs",
    threshold: 5,
    windowMinutes: 5,
  });

  console.log("Anomalies found:", anomalies);

  // for each anomaly send alerts
  for (const anomaly of anomalies) {
    const userId = anomaly.userId;
    const field = anomaly.field;
    const appId = anomaly.appId;
    const count = anomaly.count;

    await sendAlerts({ userId, field, appId, count });
  }

  async function sendAlerts({ userId, field, appId, count }) {
    // check if alert already exists (meaning email previously sent)
    const alertExists = await checkAlertExists({
      userId,
      field,
      appId,
    });
    if (alertExists) {
      console.log(
        `Alert already exists for user ${userId} and field ${field}. Skipping email.`
      );
      return;
    }

    // send email to user if not sent before
    console.log(
      `Sending alert email to user ${userId} for field ${field} with count ${count}.`
    );
    const userEmail = await getEmail(userId);
    if (!userEmail) {
      console.error(`No email found for user ${userId}. Skipping email.`);
    } else {
      sendEmail(
        userEmail,
        "Anomalous activity detected for your account",
        `
        Anomalous activity was detected for your account.
        ${appId} tried to access your ${field} quite a few times (${count} times) in the recent time.
        If this was initiated by you, please ignore this email.

        Otherwise, you can access your VaultGuard dashboard to review the activity and take necessary actions.
        `
      );
    }

    // Store alert in elastic
    console.log(`Storing alert for user ${userId} and field ${field}.`);
    await createAlert({
      userId,
      field,
      appId,
      count,
      timestamp: new Date().toISOString(),
    });
  }
}

(async () => {
  let i = 1;
  while (true) {
    console.log("Iteration: ", i);
    await job();
    await sleep(1000);
    i++;
  }
})();
