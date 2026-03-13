import AppCard from "@/components/app-card";
import * as storage from "@/lib/storage";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const Settings = () => {
  const [notifications, setNontification] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notification setting from storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedNotifications = await storage.get<boolean>(
        storage.STORAGE_KEYS.NOTIFICATIONS,
      );

      if (savedNotifications !== null) {
        setNontification(savedNotifications);
      }

      const savedTheme = await storage.get<boolean>(storage.STORAGE_KEYS.THEME);

      if (savedTheme !== null) {
        setDarkMode(savedTheme);
      }

      setIsLoading(false);
    };
    // call the saync function to load notification
    loadSettings();
  }, []);

  // save notification prefrence when toggled
  const handleToggle = async (value: boolean) => {
    setNontification(value);
    await storage.set(storage.STORAGE_KEYS.NOTIFICATIONS, value);
  };

  const handleDarkModeToggle = async (value: boolean) => {
    setDarkMode(value);
    await storage.set(storage.STORAGE_KEYS.THEME, value);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Setting</Text>
      <AppCard
        title="Notifications"
        subtitle="Enable app notifications"
        right={<Switch value={notifications} onValueChange={handleToggle} />}
      />

      <AppCard
        title="Dark Mode"
        subtitle="Use dark theme"
        right={<Switch value={darkMode} onValueChange={handleDarkModeToggle} />}
      />

      <Text>Stored: {darkMode ? "true" : "false"}</Text>
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
