import { useAppTheme } from "@/hooks/useAppTheme";
import { colors } from "@/theme/colors";
import {
  ChevronRight,
  CreditCard,
  Flame,
  Grid3X3,
  Share2,
  Shield,
  Sparkles,
  UserPlus,
  Users,
  Video,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RewardMission {
  id: string;
  title: string;
  description: string;
  credits: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  hasChevron?: boolean;
}

const MISSIONS: RewardMission[] = [
  {
    id: "1",
    title: "Uso Contínuo",
    description: "Realize tarefas de funcionamento sucessivas no app",
    credits: "ATÉ +10 CRÉDITOS",
    icon: Flame,
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
    hasChevron: true,
  },
  {
    id: "2",
    title: "Assinatura Automática",
    description: "Cadastre seu cartão e ative a assinatura automática",
    credits: "+20 CRÉDITOS",
    icon: CreditCard,
    iconColor: "#6366F1",
    iconBg: "#EEF2FF",
  },
  {
    id: "3",
    title: "Indique um Amigo",
    description: "Convide amigos e ganhe quando eles assinarem",
    credits: "+30 CRÉDITOS POR AMIGO",
    icon: Users,
    iconColor: "#0EA5E9",
    iconBg: "#F0F9FF",
  },
  {
    id: "4",
    title: "Divulgação Básica",
    description: "Divulgue o aplicativo com seu link de convidado",
    credits: "+10 CRÉDITOS",
    icon: Share2,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
  },
  {
    id: "5",
    title: "Divulgação no YouTube",
    description: "Divulgue o app em canais com mais de 5k seguidores",
    credits: "+60 CRÉDITOS",
    icon: Video,
    iconColor: "#EF4444",
    iconBg: "#FEF2F2",
  },
];

export default function RewardsScreen() {
  const userCredits = 0;
  const maxCredits = 100;
  const isPremium = true;
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
          Recompensas
        </Text>
        <Text style={[styles.headerSubtitle, { color: t.textSecondary }]}>
          Complete missões e desbloqueie o Plano{"\n"}Premium gratuitamente.
        </Text>
      </View>

      {/* Mission Cards */}
      {MISSIONS.map((mission) => (
        <View key={mission.id} style={styles.missionCard}>
          <View
            style={[styles.missionIcon, { backgroundColor: mission.iconBg }]}
          >
            <mission.icon size={24} color={mission.iconColor} />
          </View>
          <View style={styles.missionInfo}>
            <Text style={styles.missionTitle}>{mission.title}</Text>
            <Text style={styles.missionDesc}>{mission.description}</Text>
            <Text style={[styles.missionCredits, { color: mission.iconColor }]}>
              {mission.credits}
            </Text>
          </View>
          {mission.hasChevron && (
            <ChevronRight size={18} {...{ color: colors.neutral[300] }} />
          )}
        </View>
      ))}

      {/* Credits Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceSectionTitle}>
          SALDO DE CRÉDITOS FINEXYIA
        </Text>

        <View style={styles.balanceRow}>
          <View style={styles.balanceIcons}>
            <View style={styles.balanceIconBox}>
              <Grid3X3 size={18} {...{ color: colors.primary.DEFAULT }} />
            </View>
            <View
              style={[
                styles.balanceIconBox,
                { backgroundColor: colors.primary.DEFAULT },
              ]}
            >
              <Shield size={18} {...{ color: "#FFF" }} />
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.planLabel}>PLANO PREMIUM ATIVO</Text>
          <Text style={styles.progressText}>
            {userCredits} / {maxCredits} (0%)
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width:
                    `${Math.round((userCredits / maxCredits) * 100)}%` as `${number}%`,
                },
              ]}
            />
          </View>
        </View>

        {isPremium && (
          <Text style={styles.premiumNote}>Você já é um usuário Premium!</Text>
        )}

        {/* Premium Active Badge */}
        <TouchableOpacity style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>PREMIUM ATIVADO</Text>
          <Sparkles size={14} {...{ color: "#FFF" }} />
        </TouchableOpacity>

        {/* Invite Friends */}
        <TouchableOpacity style={styles.inviteButton}>
          <UserPlus size={18} {...{ color: colors.primary.DEFAULT }} />
          <Text style={styles.inviteText}>CONVIDAR AMIGOS</Text>
        </TouchableOpacity>
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
    marginBottom: 28,
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
    marginTop: 6,
    lineHeight: 18,
  },
  missionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  missionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary.DEFAULT,
    marginBottom: 3,
  },
  missionDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.neutral[400],
    lineHeight: 16,
    marginBottom: 4,
  },
  missionCredits: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  balanceSection: {
    backgroundColor: colors.neutral[50],
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  balanceSectionTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: colors.neutral[400],
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  balanceRow: {
    marginBottom: 20,
  },
  balanceIcons: {
    flexDirection: "row",
    gap: 10,
  },
  balanceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },
  progressSection: {
    width: "100%",
    marginBottom: 16,
  },
  planLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: colors.primary.DEFAULT,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  progressText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.neutral[400],
    textAlign: "right",
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 4,
  },
  premiumNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[500],
    marginBottom: 16,
  },
  premiumBadge: {
    backgroundColor: colors.success.dark,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
  },
  premiumBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#FFF",
    letterSpacing: 0.5,
  },
  inviteButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    borderWidth: 1.5,
    borderColor: colors.primary.DEFAULT,
  },
  inviteText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary.DEFAULT,
    letterSpacing: 0.5,
  },
});
