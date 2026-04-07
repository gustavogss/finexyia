import { useAppTheme } from "@/hooks/useAppTheme";
import { useTransactionStore } from "@/store/useTransactionStore";
import { colors } from "@/theme/colors";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Car,
  ChevronRight,
  Eye,
  EyeOff,
  Gift,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
  Wallet,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QUICK_ACTIONS = [
  {
    id: "despesa",
    label: "Despesa",
    icon: ArrowDownRight,
    color: colors.error.dark,
    bg: "#FEF2F2",
  },
  {
    id: "receita",
    label: "Receita",
    icon: ArrowUpRight,
    color: colors.success.dark,
    bg: "#F0FDF4",
  },
  {
    id: "carteira",
    label: "Carteira",
    icon: Wallet,
    color: colors.primary.DEFAULT,
    bg: "#F0FDFA",
  },
  {
    id: "metas",
    label: "Metas",
    icon: Target,
    color: colors.secondary.DEFAULT,
    bg: "#FFF7ED",
  },
];

const CATEGORIES: Record<string, { label: string; icon: any; color: string }> = {
  moradia: { label: "MORADIA", icon: Car, color: "#6366F1" },
  transporte: { label: "TRANSPORTE", icon: Car, color: "#F59E0B" },
  alimentacao: { label: "ALIMENTAÇÃO", icon: Utensils, color: "#EF4444" },
  compras: { label: "COMPRAS", icon: Car, color: "#EC4899" },
  lazer: { label: "LAZER", icon: Car, color: "#8B5CF6" },
  saude: { label: "SAÚDE", icon: Car, color: "#10B981" },
  educacao: { label: "EDUCAÇÃO", icon: Car, color: "#3B82F6" },
  salario: { label: "SALÁRIO", icon: Banknote, color: "#22C55E" },
  freelance: { label: "FREELANCE", icon: Banknote, color: "#14B8A6" },
  investimento: { label: "INVESTIMENTO", icon: Banknote, color: "#0EA5E9" },
};

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DashboardScreen() {
  const [showBalance, setShowBalance] = useState(true);
  const t = useAppTheme();
  const store = useTransactionStore();

  const totalIncome = useMemo(() => store.totalIncome(), [store.transactions]);
  const totalExpenses = useMemo(() => store.totalExpenses(), [store.transactions]);
  const balance = totalIncome - totalExpenses;
  const recentTx = useMemo(() => store.transactions.slice(0, 5), [store.transactions]);

  const totalBudgetLimit = useMemo(() => store.budgets.reduce((s, b) => s + b.limit, 0), [store.budgets]);
  const totalBudgetSpent = useMemo(() => store.budgets.reduce((s, b) => s + b.spent, 0), [store.budgets]);
  const budgetPct = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Saudação */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={[styles.greeting, { color: t.textPrimary }]}>
            Olá, Gustavo 👋
          </Text>
          <Text style={[styles.greetingSub, { color: t.textSecondary }]}>
            Sua saúde financeira de hoje
          </Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            {showBalance ? (
              <Eye size={18} {...{ color: "#FFFFFF99" }} />
            ) : (
              <EyeOff size={18} {...{ color: "#FFFFFF99" }} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceValue}>
          {showBalance ? `R$ ${fmt(balance)}` : "••••••"}
        </Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <View style={styles.statIcon}>
              <ArrowUpRight size={12} {...{ color: colors.success.dark }} />
            </View>
            <View>
              <Text style={styles.statLabel}>Receitas</Text>
              <Text style={styles.statValue}>
                {showBalance ? `R$ ${fmt(totalIncome)}` : "••••"}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.balanceStat}>
            <View style={styles.statIcon}>
              <ArrowDownRight size={12} {...{ color: colors.error.dark }} />
            </View>
            <View>
              <Text style={styles.statLabel}>Despesas</Text>
              <Text style={styles.statValue}>
                {showBalance ? `R$ ${fmt(totalExpenses)}` : "••••"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* AI Insight */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <View style={styles.insightIconContainer}>
            <Sparkles size={16} {...{ color: colors.secondary.DEFAULT }} />
          </View>
          <Text style={styles.insightTitle}>Insight da IA</Text>
        </View>
        <Text style={styles.insightText}>
          Atenção: Suas despesas com lazer aumentaram 15% este mês. Que tal
          reajustar sua meta?
        </Text>
        <TouchableOpacity style={styles.insightCTA}>
          <Text style={styles.insightCTAText}>Ver análise completa</Text>
          <ChevronRight size={14} {...{ color: colors.secondary.DEFAULT }} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { backgroundColor: action.bg }]}
          >
            <View
              style={[
                styles.actionIconCircle,
                { backgroundColor: action.color + "20" },
              ]}
            >
              <action.icon size={20} {...{ color: action.color }} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Credit Score Card */}
      <View style={styles.creditCard}>
        <View style={styles.creditHeader}>
          <ShieldCheck size={20} {...{ color: colors.primary.DEFAULT }} />
          <Text style={styles.creditTitle}>Score de Crédito</Text>
        </View>
        <View style={styles.creditBody}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>720</Text>
            <Text style={styles.scoreLabel}>BOM</Text>
          </View>
          <View style={styles.creditInfo}>
            <Text style={styles.creditInfoText}>
              Seu score está acima da média. Continue mantendo seus pagamentos
              em dia!
            </Text>
            <View style={styles.scoreBars}>
              <View
                style={[
                  styles.scoreBar,
                  { backgroundColor: "#EF4444", flex: 1 },
                ]}
              />
              <View
                style={[
                  styles.scoreBar,
                  { backgroundColor: "#F59E0B", flex: 1 },
                ]}
              />
              <View
                style={[
                  styles.scoreBar,
                  { backgroundColor: "#22C55E", flex: 2 },
                ]}
              />
              <View
                style={[
                  styles.scoreBar,
                  { backgroundColor: "#10B981", flex: 1 },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Budget Summary */}
      <View style={styles.budgetSummary}>
        <View style={styles.budgetSummaryHeader}>
          <PiggyBank size={18} {...{ color: colors.primary.DEFAULT }} />
          <Text style={styles.budgetSummaryTitle}>Orçamento do Mês</Text>
          <Text style={styles.budgetPercent}>{budgetPct}%</Text>
        </View>
        <View style={styles.budgetBarContainer}>
          <View style={[styles.budgetBarFill, { width: `${Math.min(budgetPct, 100)}%` }]} />
        </View>
        <View style={styles.budgetAmounts}>
          <Text style={styles.budgetSpent}>R$ {fmt(totalBudgetSpent)} gastos</Text>
          <Text style={styles.budgetLimit}>de R$ {fmt(totalBudgetLimit)}</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Últimas Transações</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllLink}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {recentTx.map((tx) => {
        const cat = CATEGORIES[tx.categoryId] ?? { label: tx.categoryId.toUpperCase(), icon: Banknote, color: "#6B7280" };
        const isIncome = tx.type === "income";
        return (
          <View key={tx.id} style={styles.txCard}>
            <View style={[styles.txIcon, { backgroundColor: cat.color + "15" }]}>
              <cat.icon size={18} {...{ color: cat.color }} />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txName}>{tx.name}</Text>
              <Text style={styles.txCategory}>{cat.label}</Text>
            </View>
            <Text
              style={[
                styles.txAmount,
                {
                  color: isIncome ? colors.success.dark : colors.error.dark,
                },
              ]}
            >
              {isIncome ? "+" : "-"} R$ {fmt(tx.amount)}
            </Text>
          </View>
        );
      })}

      {/* Rewards Teaser */}
      <TouchableOpacity style={styles.rewardTeaser}>
        <View style={styles.rewardTeaserLeft}>
          <Gift size={22} {...{ color: colors.secondary.DEFAULT }} />
          <View>
            <Text style={styles.rewardTeaserTitle}>
              Programa de Recompensas
            </Text>
            <Text style={styles.rewardTeaserDesc}>
              Ganhe créditos completando missões
            </Text>
          </View>
        </View>
        <ChevronRight size={18} {...{ color: colors.neutral[400] }} />
      </TouchableOpacity>

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
  greetingRow: {
    marginBottom: 20,
  },
  greeting: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  greetingSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#FFFFFF99",
  },
  balanceValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#FFFFFF15",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "#FFFFFF80",
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#FFFFFF20",
    marginHorizontal: 12,
  },

  // AI Insight
  insightCard: {
    backgroundColor: colors.secondary.DEFAULT + "08",
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.secondary.DEFAULT + "20",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  insightIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.secondary.DEFAULT + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.secondary.dark,
  },
  insightText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[600],
    lineHeight: 18,
    marginBottom: 10,
  },
  insightCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  insightCTAText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.secondary.DEFAULT,
  },

  // Quick Actions
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.primary.DEFAULT,
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: "47%",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.primary.DEFAULT,
  },

  // Credit Score
  creditCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  creditHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  creditTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary.DEFAULT,
  },
  creditBody: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.success.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: colors.primary.DEFAULT,
  },
  scoreLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
    color: colors.success.dark,
    letterSpacing: 1,
  },
  creditInfo: {
    flex: 1,
  },
  creditInfoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.neutral[500],
    lineHeight: 16,
    marginBottom: 10,
  },
  scoreBars: {
    flexDirection: "row",
    gap: 3,
    height: 6,
  },
  scoreBar: {
    height: 6,
    borderRadius: 3,
  },

  // Budget Summary
  budgetSummary: {
    backgroundColor: colors.neutral[50],
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  budgetSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  budgetSummaryTitle: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary.DEFAULT,
  },
  budgetPercent: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.warning.dark,
  },
  budgetBarContainer: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    marginBottom: 8,
  },
  budgetBarFill: {
    height: 8,
    backgroundColor: colors.success.dark,
    borderRadius: 4,
  },
  budgetAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetSpent: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.neutral[400],
  },
  budgetLimit: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: colors.neutral[500],
  },

  // Recent Transactions
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  seeAllLink: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.secondary.DEFAULT,
  },
  txCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    gap: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary.DEFAULT,
  },
  txCategory: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: colors.neutral[400],
    letterSpacing: 0.5,
  },
  txAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },

  // Reward Teaser
  rewardTeaser: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.secondary.DEFAULT + "08",
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.secondary.DEFAULT + "20",
  },
  rewardTeaserLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  rewardTeaserTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary.DEFAULT,
  },
  rewardTeaserDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.neutral[400],
    marginTop: 2,
  },
});
