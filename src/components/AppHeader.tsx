import { useNotificationStore } from "@/store/useNotificationStore";
import { useThemeStore } from "@/store/useThemeStore";
import { colors } from "@/theme/colors";
import { Bell, Moon, Sun, Trash2, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Helpers ────────────────────────────────────────────────────────────────

const HEADER_BG = colors.primary.DEFAULT; // sempre igual, independe do tema

function formatTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

const TYPE_COLORS: Record<string, string> = {
  info: "#3B82F6",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
};

// ─── Notification Sidebar ────────────────────────────────────────────────────

interface NotificationSidebarProps {
  visible: boolean;
  onClose: () => void;
}

function NotificationSidebar({ visible, onClose }: NotificationSidebarProps) {
  const slideAnim = useRef(new Animated.Value(320)).current;
  const { notifications, unreadCount, markAllAsRead, clearAll } =
    useNotificationStore();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (visible) {
      markAllAsRead();
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 320,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            paddingTop: insets.top + 16,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.drawerTitle}>Notificações</Text>
            {notifications.length > 0 && (
              <Text style={styles.drawerSubtitle}>
                {notifications.length} notificação
                {notifications.length !== 1 ? "ões" : ""}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} {...{ color: colors.neutral[500] }} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.drawerDivider} />

        {/* List */}
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={40} {...{ color: colors.neutral[300] }} />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyDesc}>
              Você está em dia! Nada novo por enquanto.
            </Text>
          </View>
        ) : (
          <>
            {notifications.map((notif) => (
              <View key={notif.id} style={styles.notifCard}>
                <View
                  style={[
                    styles.notifDot,
                    { backgroundColor: TYPE_COLORS[notif.type] },
                  ]}
                />
                <View style={styles.notifContent}>
                  <View style={styles.notifRow}>
                    <Text style={styles.notifTitle} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <Text style={styles.notifTime}>
                      {formatTime(notif.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.notifMessage} numberOfLines={2}>
                    {notif.message}
                  </Text>
                </View>
              </View>
            ))}

            {/* Clear All Button */}
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Trash2 size={16} {...{ color: colors.error.dark }} />
              <Text style={styles.clearButtonText}>
                Limpar histórico de notificações
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

// ─── Main Header ────────────────────────────────────────────────────────────

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const isDark = colorScheme === "dark";
  const paddingTop = insets.top + 10;

  return (
    <>
      <StatusBar
        backgroundColor={HEADER_BG}
        barStyle="light-content"
        translucent
      />
      <View style={[styles.header, { paddingTop }]}>
        {/* Esquerda — Toggle de Tema */}
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={toggleTheme}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={
            isDark ? "Mudar para tema claro" : "Mudar para tema escuro"
          }
        >
          {isDark ? (
            <Sun size={20} {...{ color: "#FFFFFF" }} />
          ) : (
            <Moon size={20} {...{ color: "#FFFFFF" }} />
          )}
        </TouchableOpacity>

        {/* Centro — Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={[styles.headerLogoIcon, { tintColor: "#FFFFFF" }]}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>
            Finexy<Text style={styles.logoAccent}>IA</Text>
          </Text>
        </View>

        {/* Direita — Sino */}
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setSidebarVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Notificações"
        >
          <Bell size={20} {...{ color: "#FFFFFF" }} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <NotificationSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Header ──
  header: {
    backgroundColor: HEADER_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    zIndex: 100,
    // Sombra sutil para destacar a header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    position: "relative",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogoIcon: {
    width: 30,
    height: 30,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  logoAccent: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#F97316",
    letterSpacing: -0.5,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: colors.secondary.DEFAULT,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: HEADER_BG,
  },
  badgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: "#FFFFFF",
  },

  // ── Sidebar ──
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 320,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  drawerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.primary.DEFAULT,
  },
  drawerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.neutral[400],
    marginTop: 2,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.neutral[50],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginBottom: 16,
  },

  // ── Notification Cards ──
  notifCard: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    gap: 12,
    alignItems: "flex-start",
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
    gap: 8,
  },
  notifTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.primary.DEFAULT,
    flex: 1,
  },
  notifTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: colors.neutral[400],
    flexShrink: 0,
  },
  notifMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[500],
    lineHeight: 18,
  },

  // ── Empty State ──
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.primary.DEFAULT,
  },
  emptyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: colors.neutral[400],
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },

  // ── Clear Button ──
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.error.DEFAULT,
  },
  clearButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.error.dark,
  },
});
