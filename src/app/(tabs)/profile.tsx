import { PremiumCelebration } from "@/components/PremiumCelebration";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserStore } from "@/store/useUserStore";
import { colors } from "@/theme/colors";
import {
  Check,
  LogOut,
  Plus,
  RefreshCcw,
  Sparkles,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  theme: any;
}

function LogoutModal({
  visible,
  onCancel,
  onConfirm,
  theme: t,
}: LogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: t.bg }]}>
          <View style={styles.modalIconContainer}>
            <LogOut size={32} color={colors.error.DEFAULT} />
          </View>
          <Text style={[styles.modalTitle, { color: t.textPrimary }]}>
            Sair da Conta?
          </Text>
          <Text style={[styles.modalDescription, { color: t.textMuted }]}>
            Ao sair, você precisará entrar novamente para acessar seus dados e
            gerenciar suas finanças de forma inteligente.
          </Text>

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonCancel,
                { borderColor: colors.neutral[200] },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.modalButtonText, { color: t.textMuted }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonConfirm,
                { backgroundColor: colors.error.DEFAULT },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonTextConfirm}>Sair Agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const FREE_FEATURES = [
  { label: "Transações básicas", included: true },
  { label: "Sem metas", included: false },
  { label: "Sem orçamento", included: false },
  { label: "Sem QRCode", included: false },
  { label: "Sem Pix", included: false },
  { label: "Sem recompensas", included: false },
  { label: "Sem Insights de IA", included: false },
];

const PREMIUM_FEATURES = [
  { label: "Todos os Recursos", included: true },
  { label: "Suporte prioritário", included: true },
  { label: "Metas e Orçamento", included: true },
  { label: "Pix e QRCode", included: true },
  { label: "Programa de recompensas", included: true },
  { label: "Gráficos de Progressão", included: true },
  { label: "Insights de IA", included: true },
];

export default function ProfileScreen() {
  const [autoRenew, setAutoRenew] = useState(true);
  const [systemNotif, setSystemNotif] = useState(true);
  const [budgetAlert, setBudgetAlert] = useState(true);
  const [billReminder, setBillReminder] = useState(true);
  const [celebrate, setCelebrate] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const { user, logout, upgradeToPremium } = useUserStore();
  const isPremium = user?.plan === "premium";
  const t = useAppTheme();

  async function handleUpgrade() {
    try {
      await upgradeToPremium();
      setCelebrate(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o upgrade.");
    }
  }

  function handleLogout() {
    setIsLogoutModalVisible(true);
  }

  async function confirmLogout() {
    setIsLogoutModalVisible(false);
    await logout();
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <LogoutModal
        visible={isLogoutModalVisible}
        onCancel={() => setIsLogoutModalVisible(false)}
        onConfirm={confirmLogout}
        theme={t}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: t.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {isPremium && (
              <View style={styles.premiumAvatarBadge}>
                <Sparkles size={12} {...{ color: "#FFF" }} />
              </View>
            )}
          </View>
          <Text style={[styles.userName, { color: t.textPrimary }]}>
            {user.name}
          </Text>
          <Text style={[styles.userEmail, { color: t.textMuted }]}>
            ✉ {user.email}
          </Text>
          <View
            style={[
              styles.creditsBadge,
              {
                backgroundColor: isPremium
                  ? colors.secondary.DEFAULT + "15"
                  : colors.primary.DEFAULT + "10",
              },
            ]}
          >
            <Text
              style={[
                styles.creditsText,
                {
                  color: isPremium
                    ? colors.secondary.DEFAULT
                    : colors.primary.DEFAULT,
                },
              ]}
            >
              {isPremium
                ? `👑 ${user.credits} Créditos Premium`
                : `💰 ${user.credits} Créditos Disponíveis`}
            </Text>
          </View>
        </View>

        {/* Plans Section */}
        <Text style={[styles.plansTitle, { color: t.textMuted }]}>
          {isPremium ? "PLANO PREMIUM" : "Escolha seu Plano"}
        </Text>

        {/* Free Plan */}
        <View
          style={[
            styles.planCardFree,
            { backgroundColor: "#eeeeee", borderColor: colors.neutral[200] },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.planName, { color: t.textPrimary }]}>
              Free
            </Text>
            {!isPremium && (
              <View style={styles.currentFreeBadge}>
                <Text style={styles.currentFreeText}>Atual</Text>
              </View>
            )}
          </View>
          <Text style={[styles.planPrice, { color: t.textMuted }]}>
            Gratuito • 5 créditos
          </Text>
          {FREE_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              {f.included ? (
                <Check size={14} {...{ color: colors.success.dark }} />
              ) : (
                <X size={14} {...{ color: t.textMuted }} />
              )}
              <Text
                style={[
                  styles.featureText,
                  { color: t.textPrimary },
                  !f.included && { color: t.textMuted },
                ]}
              >
                {f.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Premium Plan */}
        <View
          style={[
            styles.planCardPremium,
            {
              backgroundColor: colors.secondary.DEFAULT,
              borderColor: colors.secondary.dark,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>MAIS VANTAJOSO</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Sparkles size={20} {...{ color: "#FFF" }} />
            <Text style={[styles.planNamePremium, { color: "#FFF" }]}>
              Premium
            </Text>
          </View>
          <Text style={[styles.planPricePremium, { color: "#FFFFFFCC" }]}>
            R$ 54,90/mês • 100 créditos
          </Text>

          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Check size={14} {...{ color: "#FFF" }} />
              <Text style={[styles.featureTextPremium, { color: "#FFFFFFEE" }]}>
                {f.label}
              </Text>
            </View>
          ))}

          {isPremium ? (
            <View style={styles.currentPlanButton}>
              <Text style={styles.currentPlanText}>👑 Plano Atual</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={handleUpgrade}
            >
              <Sparkles size={16} {...{ color: "#FFFFFF" }} />
              <Text style={styles.upgradeButtonText}>ASSINAR PREMIUM</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Methods */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>
          💳 FORMAS DE PAGAMENTO
        </Text>
        <TouchableOpacity style={styles.paymentRow}>
          <View>
            <Text style={[styles.paymentTitle, { color: t.textPrimary }]}>
              Forma de pagamento
            </Text>
            <Text style={[styles.paymentSubtitle, { color: t.textMuted }]}>
              Nenhum cartão cadastrado
            </Text>
          </View>
          <View
            style={[
              styles.addCircle,
              { backgroundColor: colors.primary.DEFAULT + "10" },
            ]}
          >
            <Plus size={18} {...{ color: colors.primary.DEFAULT }} />
          </View>
        </TouchableOpacity>

        {/* Auto Renew */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <RefreshCcw size={18} {...{ color: colors.primary.DEFAULT }} />
            <View>
              <Text style={[styles.settingTitle, { color: t.textPrimary }]}>
                Renovação Automática
              </Text>
              <Text style={[styles.settingSubtitle, { color: t.textMuted }]}>
                Ativa
              </Text>
            </View>
          </View>
          <Switch
            value={autoRenew}
            onValueChange={setAutoRenew}
            trackColor={{
              false: t.isDark ? colors.neutral[600] : colors.neutral[200],
              true: colors.primary.DEFAULT,
            }}
            thumbColor="#FFF"
          />
        </View>

        {autoRenew && (
          <View
            style={[
              styles.autoRenewNotice,
              {
                backgroundColor: t.isDark ? "#0D2818" : "#F0FFF4",
                borderColor: t.isDark ? "#166534" : "#BBF7D0",
              },
            ]}
          >
            <Text style={styles.autoRenewText}>
              Confirmação: A renovação automática está ativa. Seu plano será
              renovado automaticamente ao final do período.
            </Text>
          </View>
        )}

        {/* Subscription History */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>
          📋 HISTÓRICO DE ASSINATURAS
        </Text>
        <View
          style={[
            styles.historyTable,
            { backgroundColor: t.card, borderColor: t.border },
          ]}
        >
          <View
            style={[styles.historyHeaderRow, { backgroundColor: t.surface }]}
          >
            <Text style={[styles.historyHeaderCell, { color: t.textMuted }]}>
              DATA
            </Text>
            <Text style={[styles.historyHeaderCell, { color: t.textMuted }]}>
              CARTÃO
            </Text>
            <Text style={[styles.historyHeaderCell, { color: t.textMuted }]}>
              EXPIRAÇÃO
            </Text>
            <Text style={[styles.historyHeaderCell, { color: t.textMuted }]}>
              STATUS
            </Text>
          </View>
          <View style={styles.historyRow}>
            <Text style={[styles.historyCell, { color: t.textPrimary }]}>
              25/03/2026
            </Text>
            <Text style={[styles.historyCell, { color: t.textPrimary }]}>
              *** 123
            </Text>
            <Text style={[styles.historyCell, { color: t.textPrimary }]}>
              25/04/2026
            </Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Ativo</Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>
          🔔 NOTIFICAÇÕES
        </Text>

        <View style={styles.notifRow}>
          <View style={styles.notifInfo}>
            <Text style={[styles.notifTitle, { color: t.textPrimary }]}>
              Notificações do Sistema
            </Text>
            <Text style={[styles.notifDesc, { color: t.textMuted }]}>
              Receber alertas gerais da plataforma
            </Text>
          </View>
          <Switch
            value={systemNotif}
            onValueChange={setSystemNotif}
            trackColor={{
              false: t.isDark ? colors.neutral[600] : colors.neutral[200],
              true: colors.primary.DEFAULT,
            }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.notifRow}>
          <View style={styles.notifInfo}>
            <Text style={[styles.notifTitle, { color: t.textPrimary }]}>
              Alerta de Orçamento (85%)
            </Text>
            <Text style={[styles.notifDesc, { color: t.textMuted }]}>
              Avisar quando atingir 85% do limite mensal
            </Text>
          </View>
          <Switch
            value={budgetAlert}
            onValueChange={setBudgetAlert}
            trackColor={{
              false: t.isDark ? colors.neutral[600] : colors.neutral[200],
              true: colors.primary.DEFAULT,
            }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.notifRow}>
          <View style={styles.notifInfo}>
            <Text style={[styles.notifTitle, { color: t.textPrimary }]}>
              Lembrete de Contas
            </Text>
            <Text style={[styles.notifDesc, { color: t.textMuted }]}>
              Alertas para contas a pagar próximas do vencimento
            </Text>
          </View>
          <Switch
            value={billReminder}
            onValueChange={setBillReminder}
            trackColor={{
              false: t.isDark ? colors.neutral[600] : colors.neutral[200],
              true: colors.primary.DEFAULT,
            }}
            thumbColor="#FFF"
          />
        </View>

        {/* Logout & Clear Data */}
        <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
          <LogOut size={18} {...{ color: colors.error.dark }} />
          <Text style={styles.dangerButtonText}>Sair / Limpar Dados</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <PremiumCelebration
        trigger={celebrate}
        onDone={() => setCelebrate(false)}
      />
    </>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarContainer: {
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: colors.primary.DEFAULT,
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: colors.primary.DEFAULT,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[400],
    marginBottom: 12,
  },
  creditsBadge: {
    backgroundColor: colors.primary.DEFAULT + "10",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  creditsText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.primary.DEFAULT,
  },
  plansTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.neutral[400],
    textAlign: "center",
    marginBottom: 16,
  },
  planCardFree: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  planName: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.primary.DEFAULT,
    marginBottom: 2,
  },
  planPrice: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.neutral[400],
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.primary.DEFAULT,
  },
  featureDisabled: {
    color: colors.neutral[300],
  },
  planCardPremium: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.secondary.DEFAULT,
  },
  premiumBadge: {
    position: "absolute",
    top: 12,
    right: -20,
    backgroundColor: colors.secondary.dark,
    paddingHorizontal: 28,
    paddingVertical: 4,
    transform: [{ rotate: "20deg" }],
  },
  premiumBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    color: "#FFF",
    letterSpacing: 1,
  },
  planNamePremium: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#FFF",
    marginBottom: 2,
  },
  planPricePremium: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#FFFFFFCC",
    marginBottom: 14,
  },
  featureTextPremium: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#FFFFFFEE",
  },
  currentPlanButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  currentPlanText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary.DEFAULT,
  },
  sectionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: colors.neutral[400],
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 8,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary.DEFAULT,
  },
  paymentSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.neutral[400],
  },
  addCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.DEFAULT + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary.DEFAULT,
  },
  settingSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.neutral[400],
  },
  autoRenewNotice: {
    backgroundColor: "#F0FFF4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  autoRenewText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.success.dark,
    lineHeight: 17,
  },
  historyTable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    overflow: "hidden",
    marginBottom: 28,
  },
  historyHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.neutral[50],
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  historyHeaderCell: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    color: colors.neutral[400],
    letterSpacing: 0.5,
  },
  historyRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  historyCell: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.primary.DEFAULT,
  },
  statusPill: {
    backgroundColor: colors.success.dark + "15",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: colors.success.dark,
  },
  notifRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  notifInfo: {
    flex: 1,
    marginRight: 12,
  },
  notifTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary.DEFAULT,
  },
  notifDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.neutral[400],
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error.DEFAULT,
  },
  dangerButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.error.dark,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ff4a34", // Vermelho Premium para máximo destaque
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 16,
    shadowColor: "#ff4a34",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  upgradeButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  premiumAvatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: colors.secondary.DEFAULT,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  currentFreeBadge: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentFreeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: colors.neutral[500],
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.error.DEFAULT + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  modalDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonCancel: {
    borderWidth: 1,
  },
  modalButtonConfirm: {
    // Background color set programmatically in render
  },
  modalButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  modalButtonTextConfirm: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
