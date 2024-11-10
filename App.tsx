import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import Homescreen from './Screens/Homescreen';
import DetailsScreen from './Screens/DetailsScreen';
import SettingsScreen from "./Screens/SettingsScreen";
import BudgetGraph from './Screens/BudgetGraph';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Homescreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
        <Stack.Screen name="BudgetGraph" component={BudgetGraph} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}