import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export default function AppLoader() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.Image
        source={require("../assets/images/icon.png")}
        style={[
          {
            width: 120,
            height: 120,
          },
          animatedStyle,
        ]}
        resizeMode="contain"
      />

      <Animated.View style={[{ alignItems: "center", marginTop: 20 }, animatedStyle]}>
        <Text style={{ fontSize: 28, fontFamily: "Inter_700Bold" }}>
          <Text style={{ color: "#232323" }}>Finexy</Text>
          <Text style={{ color: "#F97316" }}>IA</Text>
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 6,
            fontSize: 14,
            fontFamily: "Inter_400Regular",
          }}
        >
          v1.0
        </Text>
      </Animated.View>
    </View>
  );
}
