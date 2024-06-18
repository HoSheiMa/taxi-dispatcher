import { Stack } from "expo-router";
import { Primary, Secondary, White } from "../class/helper/Theme";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Text,
} from "react-native-paper";
export default function Layout() {
  return (
    <PaperProvider
      theme={{
        roundness: 4,
        colors: {
          ...DefaultTheme.colors,
          primary: Primary,
          primaryContainer: Primary,
          secondaryContainer: Secondary,
          surfaceVariant: "#fff",
          onPrimary: Secondary,
        },
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Primary,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
