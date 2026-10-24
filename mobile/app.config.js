module.exports = ({ config }) => ({
  ...config,
  platforms:
    process.env.MD_WEB_QA === "true"
      ? ["android", "ios", "web"]
      : ["android", "ios"],
  android: {
    ...config.android,
    ...(process.env.GOOGLE_SERVICES_FILE
      ? { googleServicesFile: process.env.GOOGLE_SERVICES_FILE }
      : {}),
  },
  extra: {
    ...config.extra,
    ...(process.env.EXPO_PUBLIC_EAS_PROJECT_ID
      ? { eas: { projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID } }
      : {}),
  },
});
