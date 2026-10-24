import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  AccessibilityInfo,
  AppState,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  createNavigationContainerRef,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { SessionProvider, useSession } from "./src/Session";
import { T } from "./src/theme";
import { Button, ErrorBox } from "./src/components/UI";
import {
  Welcome,
  Connection,
  AuthForm,
  Recovery,
  OwnerSetup,
} from "./src/screens/Auth";
import {
  Home,
  Workouts,
  Membership,
  Activity,
  Profile,
} from "./src/screens/Main";
import {
  WorkoutDetail,
  WorkoutSession,
  ProgressEntry,
  Classes,
} from "./src/screens/Training";
import { Plans, Checkout, Payments } from "./src/screens/Payments";
import {
  Settings,
  EditProfile,
  NotificationSettings,
  Security,
  Support,
  Policies,
  Updates,
} from "./src/screens/Settings";
import { Owner } from "./src/screens/Owner";
SplashScreen.preventAutoHideAsync().catch(() => {});
const Stack = createNativeStackNavigator(),
  Tab = createBottomTabNavigator(),
  nav = createNavigationContainerRef<any>();
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: T.bg,
    card: T.bg,
    text: T.text,
    border: T.line,
    primary: T.accent,
  },
};
function Launch() {
  const opacity = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!reduce) {
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 650,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.45,
              duration: 650,
              useNativeDriver: true,
            }),
          ]),
        );
        animation.start();
      }
    });
    return () => animation?.stop();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: T.bg,
        gap: 20,
      }}
    >
      <Animated.View
        style={{
          opacity,
          width: 100,
          height: 100,
          borderRadius: 30,
          backgroundColor: T.accent,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: T.bg, fontSize: 39, fontWeight: "900" }}>MD</Text>
      </Animated.View>
      <Text style={{ color: T.text, fontWeight: "800", letterSpacing: 3 }}>
        MUSCLE DYNAMICS
      </Text>
      <ActivityIndicator color={T.accent} />
      <Text style={{ color: T.muted, fontSize: 12 }}>
        Your stronger chapter.
      </Text>
    </View>
  );
}
function Tabs() {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Home: "home-outline",
    Workouts: "barbell-outline",
    Membership: "card-outline",
    Activity: "analytics-outline",
    Profile: "person-outline",
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: T.accent,
        tabBarInactiveTintColor: T.muted,
        tabBarStyle: {
          backgroundColor: T.bg,
          borderTopColor: T.line,
          paddingTop: 9,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Workouts" component={Workouts} />
      <Tab.Screen name="Membership" component={Membership} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
function Navigator() {
  const s = useSession(),
    [fonts, fontError] = useFonts(Ionicons.font),
    [reduce, setReduce] = useState(false);
  const pending = useRef<string | null>(null);
  const handledResponses = useRef(new Set<string>());
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
  }, []);
  useEffect(() => {
    if (fonts || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fonts, fontError]);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && s.user) s.load().catch(() => {});
    });
    return () => sub.remove();
  }, [s.user?.id]);
  function deliver(route: unknown) {
    if (
      typeof route !== "string" ||
      !["Membership", "Payments", "Workouts", "Updates", "Support"].includes(
        route,
      )
    )
      return;
    pending.current = route;
    if (s.user && nav.isReady()) {
      const r = pending.current;
      pending.current = null;
      if (r === "Membership" || r === "Workouts")
        nav.navigate("Tabs", { screen: r });
      else nav.navigate(r);
    }
  }
  useEffect(() => {
    function consume(x: Notifications.NotificationResponse | null) {
      if (!x) return;
      const id = x.notification.request.identifier;
      if (handledResponses.current.has(id)) return;
      handledResponses.current.add(id);
      deliver(x.notification.request.content.data?.route);
      Notifications.clearLastNotificationResponseAsync().catch(() => {});
    }
    const subscription =
      Notifications.addNotificationResponseReceivedListener(consume);
    Notifications.getLastNotificationResponseAsync()
      .then(consume)
      .catch(() => {});
    return () => subscription.remove();
  }, [s.user?.id]);
  useEffect(() => {
    if (s.user && pending.current) deliver(pending.current);
  }, [s.user?.id]);
  if (s.booting || (!fonts && !fontError)) return <Launch />;
  if (s.bootError)
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          gap: 20,
          backgroundColor: T.bg,
        }}
      >
        <ErrorBox message={s.bootError} retry={s.bootstrap} />
        <Button
          title="Sign out on this device"
          outline
          onPress={() => s.logout().then(() => s.bootstrap())}
        />
      </View>
    );
  return (
    <NavigationContainer
      ref={nav}
      theme={theme}
      linking={{
        prefixes: ["muscle-dynamics://"],
        config: { screens: { Reset: "reset" } },
      }}
      onReady={() => {
        if (pending.current) deliver(pending.current);
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: T.bg },
          headerTintColor: T.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: T.bg },
          animation: reduce ? "none" : "slide_from_right",
        }}
      >
        {s.user ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WorkoutDetail"
              component={WorkoutDetail}
              options={{ title: "Training plan" }}
            />
            <Stack.Screen
              name="WorkoutSession"
              component={WorkoutSession}
              options={{ title: "Your session" }}
            />
            <Stack.Screen
              name="ProgressEntry"
              component={ProgressEntry}
              options={{ title: "Log progress" }}
            />
            <Stack.Screen name="Classes" component={Classes} />
            <Stack.Screen name="Plans" component={Plans} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Payments" component={Payments} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ title: "Edit profile" }}
            />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettings}
              options={{ title: "Notifications" }}
            />
            <Stack.Screen name="Security" component={Security} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Updates" component={Updates} />
            {!!(s.user.role !== "MEMBER") && (
              <Stack.Screen name="Owner" component={Owner} />
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={AuthForm}
              options={{ title: "Log in" }}
            />
            <Stack.Screen
              name="SignUp"
              component={AuthForm}
              options={{ title: "Create account" }}
            />
            <Stack.Screen
              name="Forgot"
              component={Recovery}
              options={{ title: "Password recovery" }}
            />
            <Stack.Screen
              name="Connection"
              component={Connection}
              options={{ title: "Gym connection" }}
            />
            <Stack.Screen
              name="OwnerSetup"
              component={OwnerSetup}
              options={{ title: "First owner" }}
            />
          </>
        )}
        <Stack.Screen
          name="Reset"
          component={Recovery}
          options={{ title: "Reset password" }}
        />
        <Stack.Screen
          name="Policies"
          component={Policies}
          options={{ title: "Terms & privacy" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
class Boundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <View
        style={{
          flex: 1,
          backgroundColor: T.bg,
          padding: 24,
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Text style={{ color: T.text, fontSize: 22, fontWeight: "700" }}>
          Let's try that again.
        </Text>
        <Text style={{ color: T.muted }}>
          The screen could not load. Your server data has not been reset.
        </Text>
        <Button
          title="Retry screen"
          onPress={() => this.setState({ failed: false })}
        />
      </View>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Boundary>
        <SessionProvider>
          <Navigator />
        </SessionProvider>
      </Boundary>
    </SafeAreaProvider>
  );
}
