/**
 * PremiumCelebration — chuva de confetes ao ativar o plano Premium
 *
 * Uso:
 *   const [celebrate, setCelebrate] = useState(false);
 *   <PremiumCelebration trigger={celebrate} onDone={() => setCelebrate(false)} />
 */

import { colors } from "@/theme/colors";
import React, { useEffect, useRef } from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const { width, height } = Dimensions.get("window");

// Paleta de confetes alinhada ao brand
const CONFETTI_COLORS = [
  colors.secondary.DEFAULT, // laranja
  colors.primary.DEFAULT,   // verde escuro
  colors.primary.light,     // verde médio
  "#FFFFFF",
  "#FFD700",                // dourado
  colors.secondary.light,   // laranja claro
  "#F0FDF4",
  "#FF4E91",                // rosa festivo
];

interface PremiumCelebrationProps {
  /** Quando true dispara os confetes */
  trigger: boolean;
  /** Chamado ao término da animação */
  onDone?: () => void;
}

export function PremiumCelebration({ trigger, onDone }: PremiumCelebrationProps) {
  const cannon1 = useRef<ConfettiCannon>(null);
  const cannon2 = useRef<ConfettiCannon>(null);
  const cannon3 = useRef<ConfettiCannon>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (trigger) {
      // Disparo imediato
      cannon1.current?.start();

      // Segundo canhão com delay
      setTimeout(() => cannon2.current?.start(), 300);

      // Terceiro canhão com delay mayor
      setTimeout(() => cannon3.current?.start(), 600);

      // Auto-dismiss após 4s
      timerRef.current = setTimeout(() => {
        onDone?.();
      }, 4000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger]);

  if (!trigger) return null;

  return (
    <Modal
      visible={trigger}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Overlay escurecido semi-transparente */}
      <View style={styles.overlay} pointerEvents="none">
        {/* Mensagem de celebração */}
        <View style={styles.badge}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Bem-vindo ao Premium!</Text>
          <Text style={styles.subtitle}>
            Você desbloqueou todos os recursos da Finexyia
          </Text>
        </View>
      </View>

      {/* Canhão esquerdo */}
      <ConfettiCannon
        ref={cannon1}
        count={80}
        origin={{ x: 0, y: height * 0.2 }}
        colors={CONFETTI_COLORS}
        explosionSpeed={350}
        fallSpeed={3000}
        fadeOut
        autoStart={false}
        autoStartDelay={0}
      />

      {/* Canhão central */}
      <ConfettiCannon
        ref={cannon2}
        count={100}
        origin={{ x: width / 2, y: -20 }}
        colors={CONFETTI_COLORS}
        explosionSpeed={400}
        fallSpeed={3200}
        fadeOut
        autoStart={false}
        autoStartDelay={0}
      />

      {/* Canhão direito */}
      <ConfettiCannon
        ref={cannon3}
        count={80}
        origin={{ x: width, y: height * 0.2 }}
        colors={CONFETTI_COLORS}
        explosionSpeed={350}
        fallSpeed={3000}
        fadeOut
        autoStart={false}
        autoStartDelay={0}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
    marginHorizontal: 32,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: colors.primary.DEFAULT,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 20,
  },
});
