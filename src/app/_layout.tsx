import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { useColorScheme, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useUserStore } from "@/store/useUserStore";
import AppLoader from "../../components/AppLoader";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const initAuthListener = useUserStore((s) => s.initAuthListener);
  const isLoading = useUserStore((s) => s.isLoading);

  const [showLoader, setShowLoader] = useState(true);
  const hasHiddenSplash = useRef(false);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, [initAuthListener]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Esconde a splash e inicia o timer do loader assim que tudo estiver pronto
  useEffect(() => {
    if (loaded && !isLoading && !hasHiddenSplash.current) {
      hasHiddenSplash.current = true;

      SplashScreen.hideAsync();

      // ⏳ mantém loader por 800ms (efeito premium)
      setTimeout(() => {
        setShowLoader(false);
      }, 800);
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    return null;
  }

  if (showLoader) {
    return <AppLoader />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserStore();

  useEffect(() => {
    if (isLoading) return;

    const root = segments[0];

    if (!isAuthenticated) {
      if (root !== "login") {
        router.replace("/login");
      }
      return;
    }

    if (root === "login" || !root) {
      router.replace("/(tabs)/profile");
    }
  }, [isAuthenticated, segments, isLoading]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
