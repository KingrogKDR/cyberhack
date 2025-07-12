import { elasticClient } from "../lib/elastic.js";
import {
  getAnomalyQuery,
  getAlertsQuery,
  getAlertExistsQuery,
} from "../queries/elasticQueries.js";

// Fetch aggregated anomalies from the vaultguard-logs index.
export async function getAnomalies({
  index = "vaultguard-logs",
  threshold = 10,
  windowMinutes = 5,
}) {
  const query = getAnomalyQuery(index, threshold, windowMinutes);
  const response = await elasticClient.search(query);

  const buckets = response.aggregations?.user_field?.buckets || [];
  return buckets.map((b) => ({
    userId: b.key.user,
    field: b.key.field,
    appId: b.key.appId,
    count: b.request_count.value,
  }));
}

//  Fetch alerts from the 'alerts' index. - Conditional filter by userId
export async function getAlerts(index = "alerts", userId = null) {
  const exists = await elasticClient.indices.exists({ index });
  if (!exists) {
    await elasticClient.indices.create({ index });
    console.log(`[+] Created new index: ${index}`);
  }

  const query = getAlertsQuery(index, userId);

  const response = await elasticClient.search(query);
  return response.hits.hits.map((hit) => hit._source);
}

// Check if an alert exists for a specific userId, field, and appId
export async function checkAlertExists({
  userId,
  field,
  appId,
  index = "alerts",
}) {
  const exists = await elasticClient.indices.exists({ index });
  if (!exists) {
    await elasticClient.indices.create({ index });
    console.log(`[+] Created new index: ${index}`);
  }

  const query = getAlertExistsQuery({ userId, field, appId, index });
  const response = await elasticClient.search(query);
  return response.hits.total.value > 0;
}

// Add an alert to the 'alerts' index
``
export async function createAlert(alert, index = "alerts") {
  try {
    // Check if index exists
    const exists = await elasticClient.indices.exists({ index });
    if (!exists) {
      await elasticClient.indices.create({ index });
      console.log(`[+] Created new index: ${index}`);
    }

    // Insert the alert document
    const response = await elasticClient.index({
      index,
      document: alert,
    });
  } catch (err) {
    console.error("Failed to create alert:", err);
    throw err;
  }
}
