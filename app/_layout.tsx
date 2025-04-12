import { Stack } from "expo-router";
import "./globals.css";
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <>
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="movies/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="series/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
    <Toast/>
    </>
  );
}
