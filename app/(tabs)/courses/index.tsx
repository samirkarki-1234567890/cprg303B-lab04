import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../../../components/app-card";
import { theme } from "@/styles/theme";
import * as api from "@/lib/api";
import React, { useState, useEffect } from "react";
import { set } from "zod";

const CoursesList = () => {
  const [courses, setCourses] = useState<api.Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadCourses(){
    try {
      setError(null)
      setIsLoading(true)
      const result = await api.getCourses()
      setCourses(result)

    } catch (error) {
      setError( error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true)
      setError(null)
      const result = await api.getCourses()
      setCourses(result)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(()=>{
    loadCourses()
  },[])
  
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Your Courses</Text>
      <FlatList
        data={COURSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(tabs)/courses/${item.id}`)}>
            <AppCard
              title={item.title}
              subtitle={item.subtitle}
              right={
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.muted}
                />
              }
            />
          </Pressable>
        )}
      />
    </View>
  );
};

export default CoursesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.screen,
    backgroundColor: theme.colors.bg,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    margin: 12,
    color: theme.colors.text,
  },
});
