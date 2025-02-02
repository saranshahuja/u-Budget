import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CardStyleInterpolators } from "@react-navigation/stack";
import * as Font from "expo-font";
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Homescreen from "./Screens/Homescreen";
import DetailsScreen from "./Screens/DetailsScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import BudgetGraph from "./Screens/BudgetGraph";
import LoginScreen from "./Screens/LoginScreen";
import FirstScreen from "./Screens/FirstScreen";
import SignupScreen from "./Screens/SignupScreen";
import ItemDetailsScreen from "./Screens/ItemDetailsScreen";



const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Sora-Regular": require("./assets/fonts/Sora-Regular.ttf"),
        "Sora-Medium": require("./assets/fonts/Sora-Medium.ttf"),
        "Sora-Bold": require("./assets/fonts/Sora-Bold.ttf"),
        "Sora-ExtraBold": require("./assets/fonts/Sora-ExtraBold.ttf"),
        "Sora-ExtraLight": require("./assets/fonts/Sora-ExtraLight.ttf"),
        "Sora-Light": require("./assets/fonts/Sora-Light.ttf"),
        "Sora-SemiBold": require("./assets/fonts/Sora-SemiBold.ttf"),
        "Sora-Thin": require("./assets/fonts/Sora-Thin.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="FirstScreen"
            component={FirstScreen}
            options={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={Homescreen}
            options={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }}
          />
          <Stack.Screen
            name="DetailsScreen"
            component={DetailsScreen}
            options={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }}
          />
          <Stack.Screen
            name="BudgetGraphScreen"
            component={BudgetGraph}
            options={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
            }}
          />
          <Stack.Screen
            name="ItemDetailsScreen"
            component={ItemDetailsScreen}
            options={{ headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
