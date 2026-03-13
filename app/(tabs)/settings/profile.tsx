import {
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  View,
} from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { theme } from "@/styles/theme";
import * as storage from "@/lib/storage";

// Define a Zod schema for the profile data

const profileSchema = z.object({
  firstName: z
    .string("first name must be a string")
    .trim()
    .min(3, "first name must be at least 3 characters"),
  lastName: z
    .string("last name must be a string")
    .trim()
    .min(3, "last name must be at least 3 characters"),
  email: z.email("invalid email address"),
  studentId: z
    .string("student ID must be a string")
    .trim()
    .min(7, "student ID must be at least 7 characters"),
  phone: z
    .string()
    .refine((val) => val.replace(/\D/g, ""), "phone number must be 10 digits"),
});

type ProfileForm = z.infer<typeof profileSchema>;

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true); // track loading state while we load saved profile data
  const [isEditing, setIsEditing] = useState(true); // track whether we are in edit mode or view mode
  const [hasSavedData, setHasSavedData] = useState(false); // track wether we have any saved data to determine wiether to show Cancel Button
  const {
    control,
    handleSubmit,
    reset, // adds reset function to reset form values when canceling edits
    watch, // tracks form values for enabling/disabling save button
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  const watchedValues = watch(); // track field values to disable/enable the save button

  const isFormFilled = Object.values(watchedValues).every((v) => v.length > 0);
  // Checks if all fields have some values (basic check to prevent saving empty forms)
  // it will produce an array of all field values, and then it will check if each vlaues has length >0
  // ["Jane", "smith", "", "A12345678", "(403) 555-0123"] => false

  // Load saved profile data on Mount
  useEffect(() => {
    const loadProfile = async () => {
      // Get profile data out of local storage if it exists and store in a variable named save
      const saved = await storage.get<ProfileForm>(
        storage.STORAGE_KEYS.PROFILE,
      );
      if (saved !== null) {
        reset(saved); // prefill form with saved data
        setHasSavedData(true);
      } else {
        setIsEditing(true);
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const onSubmit = async (data: ProfileForm) => {
    // save the validated profile data to local storage
    await storage.set(storage.STORAGE_KEYS.PROFILE, data);
    setHasSavedData(true);
    setIsEditing(false);
  };

  const handleCancel = async () => {
    const saved = await storage.get<ProfileForm>(storage.STORAGE_KEYS.PROFILE);
    if (saved !== null) {
      reset(saved);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isEditing) {
    const values = watch();
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.h1}>MY PROFILE</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text>{values.firstName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Last Name</Text>
            <Text>{values.lastName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Email</Text>
            <Text>{values.email}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Student ID</Text>
            <Text>{values.studentId}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Phone Number</Text>
            <Text>{values.phone}</Text>
          </View>
        </View>
        <Pressable style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Edit Profile</Text>

      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="e.g Jane"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.firstName && (
        <Text style={styles.error}>{errors.firstName.message}</Text>
      )}

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="e.g Smith"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.lastName && (
        <Text style={styles.error}>{errors.lastName.message}</Text>
      )}

      {/* Email*/}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="example@example.com"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Phone */}
      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="e.g (403) 555-123"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      {/* Student ID */}
      <Text style={styles.label}>Student ID</Text>
      <Controller
        control={control}
        name="studentId"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.studentId && styles.inputError]}
            placeholder="e.g Jane"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="characters"
            maxLength={9}
          />
        )}
      />
      {errors.studentId && (
        <Text style={styles.error}>{errors.studentId.message}</Text>
      )}

      {hasSavedData ? (
        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.saveButton, !isFormFilled && styles.buttonDisabled]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Save Profile</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.button, !isFormFilled && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isFormFilled}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </Pressable>
      )}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.screen,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  // View Mode Styles
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  profileRow: {
    padding: 16,
  },
  profileLabel: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  cancelButton: {
    flex: 1,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  // week 9: cancel button text is a muted color to indicate it's a secondary action
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  // week 9: save button takes up remaining space, same primary style as before, but disabled when form is not completely filled out
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
