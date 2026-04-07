import { useAppTheme } from "@/hooks/useAppTheme";
import { useTransactionStore } from "@/store/useTransactionStore";
import { colors } from "@/theme/colors";
import { QRCodeScanner, type NFCeData } from "@/components/QRCodeScanner";
import {
  ArrowRight,
  Banknote,

  Car,
  Check,
  ChevronDown,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  Laptop,

  QrCode,
  ScanLine,
  ShoppingBag,
  Target,
  TrendingUp,
  Utensils,
  X,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {

  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Categories ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "moradia", label: "Moradia", icon: Home, color: "#6366F1" },
  { id: "transporte", label: "Transporte", icon: Car, color: "#F59E0B" },
  { id: "alimentacao", label: "Alimentação", icon: Utensils, color: "#EF4444" },
  { id: "compras", label: "Compras", icon: ShoppingBag, color: "#EC4899" },
  { id: "lazer", label: "Lazer", icon: Gamepad2, color: "#8B5CF6" },
  { id: "saude", label: "Saúde", icon: Heart, color: "#10B981" },
  { id: "educacao", label: "Educação", icon: GraduationCap, color: "#3B82F6" },
  { id: "salario", label: "Salário", icon: Banknote, color: "#22C55E" },
  { id: "freelance", label: "Freelance", icon: Laptop, color: "#14B8A6" },
  { id: "investimento", label: "Investimento", icon: TrendingUp, color: "#0EA5E9" },
];

const getCat = (id: string) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];

type TabType = "expense" | "income";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ─── Category Picker Modal ─────────────────────────────────────────────────

function CategoryPickerModal({
  visible,
  onClose,
  onSelect,
  selected,
  filterIncome,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  selected: string;
  filterIncome: boolean;
}) {
  const t = useAppTheme();
  const filtered = filterIncome
    ? CATEGORIES.filter((c) => ["salario", "freelance", "investimento"].includes(c.id))
    : CATEGORIES.filter((c) => !["salario", "freelance", "investimento"].includes(c.id));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={[s.modalContent, { backgroundColor: t.card }]}>
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: t.textPrimary }]}>Selecione a Categoria</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} {...{ color: t.textSecondary }} />
            </TouchableOpacity>
          </View>
          <View style={s.catGrid}>
            {filtered.map((cat) => {
              const active = selected === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    s.catItem,
                    { backgroundColor: active ? cat.color + "18" : t.surface, borderColor: active ? cat.color : t.border },
                  ]}
                  onPress={() => { onSelect(cat.id); onClose(); }}
                >
                  <View style={[s.catIconWrap, { backgroundColor: cat.color + "20" }]}>
                    <cat.icon size={20} {...{ color: cat.color }} />
                  </View>
                  <Text style={[s.catLabel, { color: t.textPrimary }]} numberOfLines={1}>{cat.label}</Text>
                  {active && (
                    <View style={[s.catCheck, { backgroundColor: cat.color }]}>
                      <Check size={10} {...{ color: "#FFF" }} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

// ─── Currency Mask ──────────────────────────────────────────────────────────

/** Formata centavos brutos em "1.234,56" */
function applyCurrencyMask(raw: string): string {
  // Mantém somente dígitos
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // Converte para centavos — ex: "12345" → 123,45
  const cents = parseInt(digits, 10);
  const formatted = (cents / 100).toFixed(2);

  // Aplica separador de milhar e troca . por ,
  const [intPart, decPart] = formatted.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withThousands},${decPart}`;
}

/** Remove máscara e retorna valor float */
function parseMaskedValue(masked: string): number {
  if (!masked) return 0;
  // "1.234,56" → "1234.56"
  const clean = masked.replace(/\./g, "").replace(",", ".");
  return parseFloat(clean) || 0;
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function TransactionsScreen() {
  const t = useAppTheme();
  const store = useTransactionStore();

  const [activeTab, setActiveTab] = useState<TabType>("expense");

  // Estado separado por aba
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseCat, setExpenseCat] = useState("");

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDesc, setIncomeDesc] = useState("");
  const [incomeCat, setIncomeCat] = useState("");

  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const isExpense = activeTab === "expense";

  // Valores derivados da aba ativa
  const amount = isExpense ? expenseAmount : incomeAmount;
  const description = isExpense ? expenseDesc : incomeDesc;
  const categoryId = isExpense ? expenseCat : incomeCat;

  const setAmount = isExpense ? setExpenseAmount : setIncomeAmount;
  const setDescription = isExpense ? setExpenseDesc : setIncomeDesc;
  const setCategoryId = isExpense ? setExpenseCat : setIncomeCat;

  const selectedCat = categoryId ? getCat(categoryId) : null;

  const handleAmountChange = useCallback((text: string) => {
    const masked = applyCurrencyMask(text);
    setAmount(masked);
  }, [isExpense]);

  const handleSave = useCallback(() => {
    const parsed = parseMaskedValue(amount);
    if (!parsed || !categoryId || !description.trim()) return;
    store.addTransaction({
      name: description.trim(),
      amount: parsed,
      type: activeTab,
      categoryId,
      date: new Date(),
      description: description.trim(),
    });
    setAmount("");
    setDescription("");
    setCategoryId("");
    setSuccessMsg(isExpense ? "Despesa registrada!" : "Receita registrada!");
    setTimeout(() => setSuccessMsg(""), 2500);
  }, [amount, categoryId, description, activeTab, isExpense]);

  const handleQRScan = useCallback((data: NFCeData) => {
    if (data.valor > 0) {
      const masked = applyCurrencyMask((data.valor * 100).toFixed(0));
      setExpenseAmount(masked);
    }
    setExpenseDesc(data.descricao);
    setExpenseCat("compras");
    setSuccessMsg("📷 Nota fiscal lida com sucesso!");
    setTimeout(() => setSuccessMsg(""), 3000);
  }, []);

  return (
    <ScrollView
      style={[s.container, { backgroundColor: t.bg }]}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={[s.headerTitle, { color: t.textPrimary }]}>Transações</Text>
        <Text style={[s.headerSub, { color: t.textSecondary }]}>Gestão de fluxo de caixa</Text>
      </View>

      {/* Tabs */}
      <View style={[s.tabContainer, { backgroundColor: t.surface }]}>
        {(["expense", "income"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && [s.tabActive, { backgroundColor: t.card }]]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, { color: activeTab === tab ? colors.primary.DEFAULT : t.textMuted }]}>
              {tab === "expense" ? "Nova Despesa" : "Nova Receita"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Success Toast */}
      {!!successMsg && (
        <View style={s.toast}>
          <Check size={16} {...{ color: "#FFF" }} />
          <Text style={s.toastText}>{successMsg}</Text>
        </View>
      )}

      {/* Amount Input */}
      <View style={s.amountSection}>
        <Text style={[s.amountLabel, { color: t.textMuted }]}>
          {isExpense ? "VALOR DA DESPESA" : "VALOR DA RECEITA"}
        </Text>
        <View style={s.amountRow}>
          <Text style={[s.amountPrefix, { color: isExpense ? colors.error.dark : colors.success.dark }]}>R$</Text>
          <TextInput
            style={[s.amountInput, { color: t.textPrimary }]}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={t.textMuted}
          />
        </View>
      </View>

      {/* Description */}
      <View style={s.fieldGroup}>
        <Text style={[s.fieldLabel, { color: t.textSecondary }]}>Descrição</Text>
        <TextInput
          style={[s.textInput, { backgroundColor: t.surface, borderColor: t.border, color: t.textPrimary }]}
          value={description}
          onChangeText={setDescription}
          placeholder={isExpense ? "Ex: Supermercado Semanal" : "Ex: Salário Mensal"}
          placeholderTextColor={t.textMuted}
        />
      </View>

      {/* Category */}
      <View style={s.fieldGroup}>
        <Text style={[s.fieldLabel, { color: t.textSecondary }]}>Categoria</Text>
        <TouchableOpacity
          style={[s.selectInput, { backgroundColor: t.surface, borderColor: t.border }]}
          onPress={() => setShowCatPicker(true)}
        >
          {selectedCat ? (
            <View style={s.selectedCatRow}>
              <View style={[s.miniCatIcon, { backgroundColor: selectedCat.color + "20" }]}>
                <selectedCat.icon size={14} {...{ color: selectedCat.color }} />
              </View>
              <Text style={[s.selectText, { color: t.textPrimary }]}>{selectedCat.label}</Text>
            </View>
          ) : (
            <Text style={[s.selectPlaceholder, { color: t.textMuted }]}>Selecione uma categoria</Text>
          )}
          <ChevronDown size={18} {...{ color: t.textMuted }} />
        </TouchableOpacity>
      </View>

      {/* Scan / Pix */}
      {isExpense ? (
        <TouchableOpacity style={[s.scanSection, { borderColor: t.border }]} onPress={() => setShowScanner(true)}>
          <ScanLine size={16} {...{ color: colors.secondary.DEFAULT }} />
          <Text style={[s.scanText, { color: colors.secondary.DEFAULT }]}>📷 Ler nota fiscal (QR Code)</Text>
        </TouchableOpacity>
      ) : (
        <View style={[s.pixSection, { backgroundColor: t.isDark ? "#0D2818" : "#F0FFF4", borderColor: t.isDark ? "#166534" : "#BBF7D0" }]}>
          <View style={s.pixHeader}>
            <QrCode size={18} {...{ color: colors.success.dark }} />
            <Text style={[s.pixTitle, { color: t.textPrimary }]}>Receber via Pix</Text>
          </View>
          <Text style={[s.pixDesc, { color: t.textSecondary }]}>Gere uma chave copia e cola para esta transação</Text>
          <TouchableOpacity style={s.pixButton}>
            <Text style={s.pixButtonText}>Gerar Chave Pix</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity
        style={[s.saveButton, { backgroundColor: isExpense ? colors.primary.DEFAULT : colors.success.dark, opacity: amount && categoryId && description ? 1 : 0.5 }]}
        onPress={handleSave}
        disabled={!amount || !categoryId || !description}
      >
        <Text style={s.saveButtonText}>{isExpense ? "Salvar Despesa" : "Salvar Receita"}</Text>
        <ArrowRight size={18} {...{ color: "#FFF" }} />
      </TouchableOpacity>

      {/* ── Budgets ───────────────────────────────────────────────────── */}
      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: t.textPrimary }]}>Meus Orçamentos</Text>
        <View style={[s.sectionBadge, { backgroundColor: colors.primary.DEFAULT + "15" }]}>
          <Text style={[s.sectionBadgeText, { color: colors.primary.DEFAULT }]}>{store.budgets.length}</Text>
        </View>
      </View>
      {store.budgets.map((budget) => {
        const cat = getCat(budget.categoryId);
        const pct = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
        const barColor = pct > 80 ? colors.error.dark : pct > 50 ? colors.warning.dark : cat.color;
        return (
          <View key={budget.id} style={[s.budgetCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <View style={[s.budgetIconWrap, { backgroundColor: cat.color + "15" }]}>
              <cat.icon size={20} {...{ color: cat.color }} />
            </View>
            <View style={s.budgetInfo}>
              <View style={s.budgetTopRow}>
                <Text style={[s.budgetName, { color: t.textPrimary }]}>{budget.name}</Text>
                <Text style={[s.budgetLimitText, { color: t.textMuted }]}>R$ {formatCurrency(budget.limit)}</Text>
              </View>
              <View style={[s.progressBg, { backgroundColor: t.surface }]}>
                <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
              </View>
              <View style={s.budgetBottomRow}>
                <Text style={[s.budgetSpentText, { color: t.textSecondary }]}>R$ {formatCurrency(budget.spent)} gastos</Text>
                <Text style={[s.budgetRemainingText, { color: barColor }]}>
                  {pct > 80 ? "⚠️ " : ""}R$ {formatCurrency(budget.limit - budget.spent)} restam
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* ── Goals ─────────────────────────────────────────────────────── */}
      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: t.textPrimary }]}>Minhas Metas</Text>
        <View style={[s.sectionBadge, { backgroundColor: colors.secondary.DEFAULT + "15" }]}>
          <Text style={[s.sectionBadgeText, { color: colors.secondary.DEFAULT }]}>{store.goals.length}</Text>
        </View>
      </View>
      {store.goals.map((goal) => {
        const cat = getCat(goal.categoryId);
        const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
        return (
          <View key={goal.id} style={[s.goalCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <View style={s.goalTopRow}>
              <View style={s.goalLeft}>
                <View style={[s.goalIconWrap, { backgroundColor: cat.color + "15" }]}>
                  <Target size={16} {...{ color: cat.color }} />
                </View>
                <View>
                  <Text style={[s.goalName, { color: t.textPrimary }]}>{goal.name}</Text>
                  {goal.deadline && <Text style={[s.goalDeadline, { color: t.textMuted }]}>Meta: {goal.deadline}</Text>}
                </View>
              </View>
              <View style={s.goalRight}>
                <Text style={[s.goalCurrent, { color: colors.primary.DEFAULT }]}>R$ {formatCurrency(goal.current)}</Text>
                <Text style={[s.goalTarget, { color: t.textMuted }]}>de R$ {formatCurrency(goal.target)}</Text>
              </View>
            </View>
            <View style={[s.progressBg, { backgroundColor: t.surface }]}>
              <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: colors.secondary.DEFAULT }]} />
            </View>
            <Text style={[s.goalPct, { color: t.textSecondary }]}>{pct.toFixed(0)}% concluído</Text>
          </View>
        );
      })}

      {/* ── Reminders ────────────────────────────────────────────────── */}
      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: t.textPrimary }]}>Lembretes de Pagamento</Text>
      </View>
      {store.reminders.map((rem) => {
        const cat = getCat(rem.categoryId);
        return (
          <TouchableOpacity
            key={rem.id}
            style={[s.reminderCard, { backgroundColor: t.card, borderColor: t.border, opacity: rem.paid ? 0.5 : 1 }]}
            onPress={() => store.toggleReminderPaid(rem.id)}
          >
            <View style={[s.reminderStripe, { backgroundColor: rem.paid ? colors.success.dark : cat.color }]} />
            <View style={s.reminderInfo}>
              <Text style={[s.reminderName, { color: t.textPrimary, textDecorationLine: rem.paid ? "line-through" : "none" }]}>{rem.name}</Text>
              <Text style={[s.reminderDateText, { color: t.textMuted }]}>📅 {rem.startDate}</Text>
            </View>
            <View style={s.reminderRight}>
              <Text style={[s.reminderAmount, { color: t.textPrimary }]}>R$ {formatCurrency(rem.amount)}</Text>
              {rem.paid && <Text style={[s.paidBadge, { color: colors.success.dark }]}>PAGO ✓</Text>}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* ── Transaction History ───────────────────────────────────────── */}
      <View style={[s.sectionHeader, { marginTop: 24 }]}>
        <Text style={[s.sectionTitle, { color: t.textPrimary }]}>Histórico</Text>
        <View style={[s.monthPill, { backgroundColor: t.surface }]}>
          <Text style={[s.monthPillText, { color: t.textSecondary }]}>ESTE MÊS</Text>
        </View>
      </View>
      {store.transactions.map((tx) => {
        const cat = getCat(tx.categoryId);
        const isIncome = tx.type === "income";
        return (
          <View key={tx.id} style={[s.txCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <View style={[s.txIconWrap, { backgroundColor: cat.color + "15" }]}>
              <cat.icon size={18} {...{ color: cat.color }} />
            </View>
            <View style={s.txInfo}>
              <Text style={[s.txName, { color: t.textPrimary }]}>{tx.name}</Text>
              <Text style={[s.txCat, { color: t.textMuted }]}>{cat.label} · {formatDateShort(tx.date)}</Text>
            </View>
            <Text style={[s.txAmount, { color: isIncome ? colors.success.dark : colors.error.dark }]}>
              {isIncome ? "+" : "-"} R$ {formatCurrency(tx.amount)}
            </Text>
          </View>
        );
      })}

      <View style={{ height: 40 }} />

      {/* Category Picker Modal */}
      <CategoryPickerModal
        visible={showCatPicker}
        onClose={() => setShowCatPicker(false)}
        onSelect={setCategoryId}
        selected={categoryId}
        filterIncome={!isExpense}
      />

      {/* QR Code Scanner */}
      <QRCodeScanner
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
      />
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  // Header
  header: { alignItems: "center", marginBottom: 20 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 24 },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },

  // Summary
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 18, padding: 16, borderWidth: 1 },
  summaryIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  summaryLabel: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.3, marginBottom: 4 },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 16 },

  // Balance
  balancePill: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1, marginBottom: 20 },
  balancePillLabel: { fontFamily: "Inter_500Medium", fontSize: 13, flex: 1 },
  balancePillValue: { fontFamily: "Inter_700Bold", fontSize: 17 },

  // Tabs
  tabContainer: { flexDirection: "row", borderRadius: 14, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 11 },
  tabActive: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },

  // Toast
  toast: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.success.dark, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  toastText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },

  // Amount
  amountSection: { alignItems: "center", marginBottom: 24 },
  amountLabel: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1, marginBottom: 8 },
  amountRow: { flexDirection: "row", alignItems: "baseline" },
  amountPrefix: { fontFamily: "Inter_700Bold", fontSize: 20, marginRight: 6 },
  amountInput: { fontFamily: "Inter_700Bold", fontSize: 36, minWidth: 100, textAlign: "center" },

  // Fields
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 13, marginBottom: 6 },
  textInput: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14, fontFamily: "Inter_400Regular", fontSize: 14 },
  selectInput: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  selectText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  selectPlaceholder: { fontFamily: "Inter_400Regular", fontSize: 14 },
  selectedCatRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  miniCatIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },

  // Scan / Pix
  scanSection: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, borderBottomWidth: 1, marginBottom: 8 },
  scanText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  pixSection: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  pixHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  pixTitle: { fontFamily: "Inter_700Bold", fontSize: 14 },
  pixDesc: { fontFamily: "Inter_400Regular", fontSize: 12, marginBottom: 12 },
  pixButton: { backgroundColor: colors.success.dark, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  pixButtonText: { fontFamily: "Inter_700Bold", fontSize: 14, color: "#FFF" },

  // Save
  saveButton: { borderRadius: 16, paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 32 },
  saveButtonText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#FFF" },

  // Section
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, marginTop: 8 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
  sectionBadge: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  sectionBadgeText: { fontFamily: "Inter_700Bold", fontSize: 12 },

  // Budgets
  budgetCard: { borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 12, borderWidth: 1, gap: 14 },
  budgetIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  budgetInfo: { flex: 1 },
  budgetTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  budgetName: { fontFamily: "Inter_700Bold", fontSize: 14 },
  budgetLimitText: { fontFamily: "Inter_400Regular", fontSize: 11 },
  budgetBottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  budgetSpentText: { fontFamily: "Inter_400Regular", fontSize: 11 },
  budgetRemainingText: { fontFamily: "Inter_500Medium", fontSize: 11 },

  // Progress
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },

  // Goals
  goalCard: { borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1 },
  goalTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  goalLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  goalIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  goalName: { fontFamily: "Inter_700Bold", fontSize: 14 },
  goalDeadline: { fontFamily: "Inter_400Regular", fontSize: 10, marginTop: 2 },
  goalRight: { alignItems: "flex-end" },
  goalCurrent: { fontFamily: "Inter_700Bold", fontSize: 15 },
  goalTarget: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
  goalPct: { fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 6 },

  // Reminders
  reminderCard: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 10, borderWidth: 1 },
  reminderStripe: { width: 4, height: 40, borderRadius: 2, marginRight: 12 },
  reminderInfo: { flex: 1 },
  reminderName: { fontFamily: "Inter_700Bold", fontSize: 14, marginBottom: 2 },
  reminderDateText: { fontFamily: "Inter_400Regular", fontSize: 11 },
  reminderRight: { alignItems: "flex-end" },
  reminderAmount: { fontFamily: "Inter_700Bold", fontSize: 15 },
  paidBadge: { fontFamily: "Inter_600SemiBold", fontSize: 10, marginTop: 4 },

  // History
  monthPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  monthPillText: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 0.5 },
  txCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, gap: 12 },
  txIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1 },
  txName: { fontFamily: "Inter_700Bold", fontSize: 14 },
  txCat: { fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
  txAmount: { fontFamily: "Inter_700Bold", fontSize: 15 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "70%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontFamily: "Inter_700Bold", fontSize: 18 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catItem: { width: "30%", borderRadius: 16, padding: 14, alignItems: "center", borderWidth: 1.5, position: "relative" },
  catIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  catLabel: { fontFamily: "Inter_500Medium", fontSize: 11, textAlign: "center" },
  catCheck: { position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
});
