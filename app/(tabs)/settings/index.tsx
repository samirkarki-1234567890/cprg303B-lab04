import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "@/components/app-card";
import { theme } from "@/styles/theme";
import React, { useState, useEffect } from "react";
import * as storage from "@/lib/storage";

const Settings = () => {
  const [notifications, setNontification] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load notification setting from storage on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      // Try to load saved value from storage if it exists - save will hold a boolean value of either true or false
      const saved = await storage.get<boolean>(
        storage.STORAGE_KEYS.NOTIFICATIONS,
      );
      if (saved !== null) {
        setNontification(saved);
      }
      setIsLoading(false);
    };
    // call the saync function to load notification
    loadNotifications();
  }, []);

  // save notification prefrence when toggled
  const handleToggle = async (value: boolean) => {
    setNontification(value);
    await storage.set(storage.STORAGE_KEYS.NOTIFICATIONS, value)
  };

  if (isLoading){
    return (
      <View style = {styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />

      </View>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Setting</Text>
      <AppCard
        title="Notifications"
        subtitle="Enable app notifications"
        right={
          <Switch value={notifications} onValueChange={handleToggle} />
        }
      />

      <Pressable onPress={() => router.push("/(tabs)/settings/profile")}>
        <AppCard
          title="Account"
          subtitle="Update Profile settings"
          right={
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.primary}
            />
          }
        />
      </Pressable>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: theme.colors.text,
  },
});
