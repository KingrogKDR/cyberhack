export const consentTemplates: Record<string, {
  dataFields: string[];
  purpose: string;
  duration: string;
}> = {
  app1: {
    dataFields: ["amount", "date"],
    purpose: "budgeting",
    duration: "30d",
  },
  app2: {
    dataFields: ["investment_history"],
    purpose: "investment analytics",
    duration: "90d",
  }
};
