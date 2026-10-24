import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export async function registerPush(
  api: <T>(p: string, m?: string, b?: object) => Promise<T>,
) {
  if (!Device.isDevice)
    throw Error(
      "Push registration requires a physical device and a correctly configured native build.",
    );
  const projectId =
    Constants.easConfig?.projectId ||
    Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId)
    throw Error(
      "Push project is not configured yet. Add the real Expo project ID and native FCM/APNs credentials before device testing.",
    );
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("gym-updates", {
      name: "Gym updates",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  let p = await Notifications.getPermissionsAsync();
  if (p.status !== "granted") p = await Notifications.requestPermissionsAsync();
  if (p.status !== "granted")
    throw Error(
      "Notification permission was not granted. You can enable it in system Settings.",
    );
  const result = await Notifications.getExpoPushTokenAsync({ projectId });
  await api("devices", "PUT", { token: result.data, platform: Platform.OS });
  await SecureStore.setItemAsync("md_push_token_v2", result.data);
  return true;
}
