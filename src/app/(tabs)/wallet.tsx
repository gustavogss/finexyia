import { useAppTheme } from "@/hooks/useAppTheme";
import { colors } from "@/theme/colors";
import {
  ArrowRight,
  ChevronDown,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Period = "1_ano" | "5_anos" | "10_anos";
type Profile = "conservador" | "moderado" | "arrojado";

const PERIODS: { key: Period; label: string }[] = [
  { key: "1_ano", label: "1 ANO" },
  { key: "5_anos", label: "5 ANOS" },
  { key: "10_anos", label: "10 ANOS" },
];

const PROFILES: { key: Profile; label: string; desc: string; icon: any }[] = [
  {
    key: "conservador",
    label: "CONSERVADOR",
    desc: "Foco em segurança e baixo risco.",
    icon: ShieldCheck,
  },
  {
    key: "moderado",
    label: "MODERADO",
    desc: "Equilíbrio entre risco e retorno.",
    icon: Scale,
  },
  {
    key: "arrojado",
    label: "ARROJADO",
    desc: "Busca alto retorno e aceita volatilidade.",
    icon: TrendingUp,
  },
];

export default function WalletScreen() {
  const [initialValue, setInitialValue] = useState("1000");
  const [monthlyValue, setMonthlyValue] = useState("100");
  const [period, setPeriod] = useState<Period>("1_ano");
  const [months, setMonths] = useState(12);
  const [profile, setProfile] = useState<Profile>("moderado");
  const t = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: t.textPrimary }]}>
          Carteira Inteligente
        </Text>
        <Text style={[styles.headerSubtitle, { color: t.textSecondary }]}>
          Simule e planeje seu futuro financeiro com inteligência artificial e
          dados reais.
        </Text>
      </View>

      {/* Main Card */}
      <View style={styles.mainCard}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Sparkles size={28} {...{ color: colors.primary.DEFAULT }} />
        </View>
        <Text style={styles.cardTitle}>Simulador Inteligente</Text>

        {/* Valor Inicial */}
        <Text style={styles.inputLabel}>💰 VALOR INICIAL</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputPrefix}>R$</Text>
          <TextInput
            style={styles.valueInput}
            value={initialValue}
            onChangeText={setInitialValue}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.neutral[300]}
          />
        </View>

        {/* Aporte Mensal */}
        <Text style={styles.inputLabel}>⊕ APORTE MENSAL (OPCIONAL)</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputPrefix}>R$</Text>
          <TextInput
            style={styles.valueInput}
            value={monthlyValue}
            onChangeText={setMonthlyValue}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.neutral[300]}
          />
        </View>

        {/* Prazo */}
        <Text style={styles.inputLabel}>⏱ PRAZO (MESES)</Text>
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.periodPill,
                period === p.key && styles.periodPillActive,
              ]}
              onPress={() => {
                setPeriod(p.key);
                setMonths(
                  p.key === "1_ano" ? 12 : p.key === "5_anos" ? 60 : 120,
                );
              }}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p.key && styles.periodTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Slider mock */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View
              style={[styles.sliderFill, { width: `${(months / 120) * 100}%` }]}
            />
            <View
              style={[styles.sliderThumb, { left: `${(months / 120) * 100}%` }]}
            />
          </View>
          <Text style={styles.sliderLabel}>{months} MESES</Text>
        </View>

        {/* Profile */}
        <Text style={styles.inputLabel}>👤 PERFIL DO INVESTIDOR</Text>
        {PROFILES.map((p) => {
          const isActive = profile === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.profileOption,
                isActive && styles.profileOptionActive,
              ]}
              onPress={() => setProfile(p.key)}
            >
              <View style={styles.profileInfo}>
                <Text
                  style={[
                    styles.profileLabel,
                    isActive && styles.profileLabelActive,
                  ]}
                >
                  {p.label}
                </Text>
                <Text
                  style={[
                    styles.profileDesc,
                    isActive && styles.profileDescActive,
                  ]}
                >
                  {p.desc}
                </Text>
              </View>
              <View
                style={[styles.radioOuter, isActive && styles.radioOuterActive]}
              >
                {isActive && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Tipo de Ativo */}
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>
          💹 TIPO DE ATIVO
        </Text>
        <TouchableOpacity style={styles.assetSelector}>
          <Text style={styles.assetText}>Carteira Recomendada (Perfil)</Text>
          <ChevronDown size={18} {...{ color: colors.neutral[400] }} />
        </TouchableOpacity>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>SIMULAR INVESTIMENTO</Text>
          <ArrowRight size={18} {...{ color: "#FFF" }} />
        </TouchableOpacity>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomIcon}>
          <Wallet size={32} {...{ color: colors.primary.light }} />
        </View>
        <Text style={styles.bottomTitle}>Pronto para simular?</Text>
        <Text style={styles.bottomDesc}>
          Preencha os dados ao lado e descubra como seu dinheiro pode trabalhar
          para você.
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: colors.primary.DEFAULT,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[400],
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary.DEFAULT + "10",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.primary.DEFAULT,
    textAlign: "center",
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: colors.neutral[400],
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  inputPrefix: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.neutral[400],
    marginRight: 8,
  },
  valueInput: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: colors.primary.DEFAULT,
  },
  periodRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginBottom: 16,
  },
  periodPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  periodPillActive: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
  },
  periodText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.neutral[500],
  },
  periodTextActive: {
    color: "#FFFFFF",
  },
  sliderContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  sliderTrack: {
    width: "100%",
    height: 6,
    backgroundColor: colors.neutral[100],
    borderRadius: 3,
    position: "relative",
    marginBottom: 8,
  },
  sliderFill: {
    height: 6,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary.DEFAULT,
    position: "absolute",
    top: -6,
    marginLeft: -9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.neutral[500],
    letterSpacing: 0.5,
  },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral[50],
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  profileOptionActive: {
    backgroundColor: colors.primary.DEFAULT + "10",
    borderColor: colors.primary.DEFAULT,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.neutral[500],
    letterSpacing: 0.5,
  },
  profileLabelActive: {
    color: colors.primary.DEFAULT,
  },
  profileDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.neutral[400],
    marginTop: 2,
  },
  profileDescActive: {
    color: colors.primary.light,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: colors.primary.DEFAULT,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.DEFAULT,
  },
  assetSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  assetText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.primary.DEFAULT,
  },
  ctaButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  ctaText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#FFF",
    letterSpacing: 0.5,
  },
  bottomSection: {
    alignItems: "center",
    marginTop: 40,
    paddingVertical: 32,
  },
  bottomIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary.DEFAULT + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  bottomTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.primary.DEFAULT,
    marginBottom: 8,
  },
  bottomDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[400],
    textAlign: "center",
    lineHeight: 18,
  },
});
