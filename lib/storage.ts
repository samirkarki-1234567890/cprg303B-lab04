import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
  THEME: "theme",
} as const;

// Get a value from storage

export const get = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  return JSON.parse(value) as T;
};

// Set a value in storage

export const set = async (key: string, value: unknown): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

// Remove a value from storage

export const remove = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
