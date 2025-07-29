import { FinanceProvider } from "@/hooks/useFinanceStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transaction/create" options={{ title: "Add Transaction", presentation: "modal" }} />
      <Stack.Screen name="transaction/edit" options={{ title: "Edit Transaction" }} />
      <Stack.Screen name="debtloan/create" options={{ title: "Add Debt/Loan", presentation: "modal" }} />
      <Stack.Screen name="debtloan/edit" options={{ title: "Edit Debt/Loan" }} />
      <Stack.Screen name="person/create" options={{ title: "Add Person", presentation: "modal" }} />
      <Stack.Screen name="category/create" options={{ title: "Add Category", presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FinanceProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </FinanceProvider>
    </QueryClientProvider>
  );
}