/**
 * QRCodeScanner — Leitor de QR Code para Notas Fiscais (NFC-e)
 *
 * Usa expo-camera para ler QR codes de notas fiscais brasileiras.
 * Extrai valor total e descrição da URL da NFC-e.
 */

import { colors } from "@/theme/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanLine, X, Zap } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── NFC-e Parser ───────────────────────────────────────────────────────────

export interface NFCeData {
  valor: number;
  descricao: string;
  raw: string;
}

/**
 * Tenta extrair dados de uma URL de NFC-e brasileira.
 *
 * Formatos comuns:
 *  - URL da SEFAZ com parâmetro `p=` contendo chave de acesso + valor
 *  - Texto puro com "vNF=" ou "vTP=" indicando valor total
 *  - QR code simples com valor numérico
 */
function parseNFCeQRCode(data: string): NFCeData | null {
  if (!data || data.trim().length === 0) return null;

  const raw = data.trim();

  // Padrão 1: URL da SEFAZ com parâmetro de valor
  // Exemplo: ...&vNF=123.45&... ou ...vTP=123.45...
  const valorMatch = raw.match(/[?&|](?:vNF|vTP|vICMS)=(\d+\.?\d*)/i);
  if (valorMatch) {
    const valor = parseFloat(valorMatch[1]);
    if (!isNaN(valor) && valor > 0) {
      return {
        valor,
        descricao: "Nota Fiscal (QR Code)",
        raw,
      };
    }
  }

  // Padrão 2: QR Code com pipe separando campos (formato SAT/NFC-e)
  // Chave|Data|Valor|CNPJ|...
  const pipes = raw.split("|");
  if (pipes.length >= 3) {
    for (const part of pipes) {
      const num = parseFloat(part.replace(",", "."));
      if (!isNaN(num) && num > 0 && num < 1000000) {
        return {
          valor: num,
          descricao: "Nota Fiscal (QR Code)",
          raw,
        };
      }
    }
  }

  // Padrão 3: URL padrão NFC-e com chave de 44 dígitos
  const chaveMatch = raw.match(/(\d{44})/);
  if (chaveMatch) {
    return {
      valor: 0, // será preenchido manualmente
      descricao: `NFC-e ${chaveMatch[1].slice(0, 8)}...`,
      raw,
    };
  }

  // Padrão 4: Qualquer URL reconhecível como nota fiscal
  if (
    raw.toLowerCase().includes("nfce") ||
    raw.toLowerCase().includes("nfe") ||
    raw.toLowerCase().includes("sefaz") ||
    raw.toLowerCase().includes("fazenda")
  ) {
    return {
      valor: 0,
      descricao: "Nota Fiscal Eletrônica",
      raw,
    };
  }

  // Padrão 5: Texto simples — tenta extrair qualquer número como valor
  const simpleNum = raw.match(/(\d+[.,]\d{2})/);
  if (simpleNum) {
    const valor = parseFloat(simpleNum[1].replace(",", "."));
    if (!isNaN(valor) && valor > 0) {
      return { valor, descricao: "Despesa (QR Code)", raw };
    }
  }

  // Fallback: retorna dados brutos
  return {
    valor: 0,
    descricao: "QR Code lido",
    raw,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

interface QRCodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (data: NFCeData) => void;
}

export function QRCodeScanner({ visible, onClose, onScan }: QRCodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned || processing) return;
      setScanned(true);
      setProcessing(true);

      const parsed = parseNFCeQRCode(data);
      if (parsed) {
        // Pequeno delay para feedback visual
        setTimeout(() => {
          onScan(parsed);
          setProcessing(false);
          setScanned(false);
          onClose();
        }, 600);
      } else {
        setProcessing(false);
        setScanned(false);
      }
    },
    [scanned, processing, onScan, onClose]
  );

  const handleClose = () => {
    setScanned(false);
    setProcessing(false);
    onClose();
  };

  if (!visible) return null;

  // Permissão não determinada ainda
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <View style={st.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text style={st.loadingText}>Carregando câmera...</Text>
        </View>
      </Modal>
    );
  }

  // Permissão negada
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <View style={st.permissionContainer}>
          <View style={st.permissionCard}>
            <View style={st.permissionIconWrap}>
              <ScanLine size={48} {...{ color: colors.primary.DEFAULT }} />
            </View>
            <Text style={st.permissionTitle}>Acesso à Câmera</Text>
            <Text style={st.permissionDesc}>
              Para ler notas fiscais via QR Code, precisamos de acesso à câmera
              do seu dispositivo.
            </Text>
            <TouchableOpacity style={st.permissionBtn} onPress={requestPermission}>
              <Text style={st.permissionBtnText}>Permitir Acesso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.cancelBtn} onPress={handleClose}>
              <Text style={st.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Câmera ativa
  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={st.container}>
        <CameraView
          style={st.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39", "datamatrix"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Overlay Escuro */}
        <View style={st.overlay}>
          {/* Header */}
          <View style={st.header}>
            <TouchableOpacity style={st.closeBtn} onPress={handleClose}>
              <X size={22} {...{ color: "#FFF" }} />
            </TouchableOpacity>
            <Text style={st.headerTitle}>Ler Nota Fiscal</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Scan Area */}
          <View style={st.scanArea}>
            <View style={st.scanFrame}>
              {/* Cantos do quadrado */}
              <View style={[st.corner, st.topLeft]} />
              <View style={[st.corner, st.topRight]} />
              <View style={[st.corner, st.bottomLeft]} />
              <View style={[st.corner, st.bottomRight]} />

              {/* Indicador de scanning */}
              {processing && (
                <View style={st.processingOverlay}>
                  <ActivityIndicator size="large" color={colors.secondary.DEFAULT} />
                  <Text style={st.processingText}>Processando...</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={st.footer}>
            <View style={st.tipRow}>
              <Zap size={16} {...{ color: colors.secondary.DEFAULT }} />
              <Text style={st.tipText}>
                Aponte a câmera para o QR Code da nota fiscal
              </Text>
            </View>
            <Text style={st.tipSubtext}>
              Funciona com NFC-e, SAT e cupons fiscais eletrônicos
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const FRAME_SIZE = 260;

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#FFF",
  },

  // Scan area
  scanArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: "relative",
  },

  // Corners
  corner: {
    position: "absolute",
    width: 36,
    height: 36,
    borderColor: colors.secondary.DEFAULT,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },

  // Processing
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  processingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFF",
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    gap: 8,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFF",
  },
  tipSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },

  // Permission screen
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#FFF",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permissionCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  permissionIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary.DEFAULT + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  permissionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.primary.DEFAULT,
    marginBottom: 8,
  },
  permissionDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  permissionBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#FFF",
  },
  cancelBtn: {
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.neutral[400],
  },
});
