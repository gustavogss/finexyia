import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserStore } from "@/store/useUserStore";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const loginGoogle = useUserStore((s) => s.loginGoogle);
  const t = useAppTheme();
  const router = useRouter();

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await loginGoogle();
      router.replace("/(tabs)/profile");
    } catch (error: any) {
      // Handle cancellation or error
      if (error.code !== "auth/popup-closed-by-user") {
        Alert.alert(
          "Erro no Login",
          "Não foi possível autenticar com o Google. Tente novamente.",
        );
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: t.isDark ? "#121212" : "#FFFFFF" },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.logoSlot}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: t.textPrimary }]}>
            Finexy<Text style={{ color: "#F97316" }}>IA</Text>
          </Text>
        </View>

        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: t.textPrimary }]}>
            Controle suas finanças de forma inteligente
          </Text>
          <Text style={[styles.subtitle, { color: t.textMuted }]}>
            Sua jornada para a liberdade financeira começa aqui com o auxílio da
            nossa IA.
          </Text>
        </View>

        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={[styles.googleButton, { borderColor: t.border }]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primary.DEFAULT} />
            ) : (
              <>
                <View style={styles.googleIconPlaceholder}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text
                  style={[styles.googleButtonText, { color: t.textPrimary }]}
                >
                  Entrar com Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.termsText, { color: t.textMuted }]}>
            Ao continuar, você concorda com nossos{"\n"}
            <Text style={{ textDecorationLine: "underline" }}>
              Termos de Serviço
            </Text>{" "}
            e{" "}
            <Text style={{ textDecorationLine: "underline" }}>Privacidade</Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSlot: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    letterSpacing: -0.5,
  },
  textGroup: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  actionGroup: {
    width: "100%",
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#EEEEEE",
    marginBottom: 24,
  },
  googleIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#EA4335",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleG: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  googleButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  termsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 18,
  },
});
