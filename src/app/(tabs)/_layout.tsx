import { AppHeader } from "@/components/AppHeader";
import { useThemeStore } from "@/store/useThemeStore";
import { colors } from "@/theme/colors";
import { Tabs } from "expo-router";
import {
  Gift,
  LayoutDashboard,
  ReceiptText,
  User,
  Wallet,
} from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === "dark";

  const pageBg = isDark ? "#121212" : "#FFFFFF";

  return (
    <View style={{ flex: 1, backgroundColor: pageBg }}>
      {/* Header fixo no topo de todas as tabs */}
      <AppHeader />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.neutral[400],
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.neutral[200],
            backgroundColor: "#FFFFFF",
            height: 64,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: "Inter_500Medium",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard size={size} {...{ color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Transações",
            tabBarIcon: ({ color, size }) => (
              <ReceiptText size={size} {...{ color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Carteira",
            tabBarIcon: ({ color, size }) => (
              <Wallet size={size} {...{ color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="rewards"
          options={{
            title: "Recompensas",
            tabBarIcon: ({ color, size }) => (
              <Gift size={size} {...{ color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <User size={size} {...{ color }} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
