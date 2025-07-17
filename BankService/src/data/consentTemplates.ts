export const consentTemplates: Record<string, {
  dataFields: string[];
  purpose: string;
  duration: string;
}> = {
  "budget-app": {
    dataFields: ["balance", "date"],
    purpose: "budgeting",
    duration: "2m",
  },
  app2: {
    dataFields: ["investment_history"],
    purpose: "investment analytics",
    duration: "90d",
  }
};
