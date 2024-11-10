import { StyleSheet, Text, SafeAreaView, View, Image, FlatList, PanResponder, GestureResponderEvent, PanResponderGestureState } from "react-native";
import React, { useRef } from "react";
import tw from "twrnc";
import BottomNavigationBar from '../Components/BottomNavigationBar'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your route names
type RootStackParamList = {
  BudgetGraph: undefined; // Add other routes here if needed
};

const data = [
  { id: '1', title: 'Groceries', amount: '$200', description: 'Weekly grocery shopping' },
  { id: '2', title: 'Rent', amount: '$500', description: 'Monthly apartment rent' },
  { id: '3', title: 'Utilities', amount: '$100', description: 'Electricity and water bills' },
  { id: '4', title: 'Entertainment', amount: '$200', description: 'Movies, games, and outings' },
  { id: '5', title: 'Transportation', amount: '$150', description: 'Gas and public transport' },
  { id: '6', title: 'Insurance', amount: '$120', description: 'Health and car insurance' },
  { id: '7', title: 'Healthcare', amount: '$80', description: 'Doctor visits and medications' },
  { id: '8', title: 'Dining Out', amount: '$90', description: 'Restaurants and cafes' },
  { id: '9', title: 'Education', amount: '$300', description: 'Tuition and books' },
  { id: '10', title: 'Savings', amount: '$400', description: 'Monthly savings goal' },
];

const renderItem = ({ item }: { item: any }) => (
  <View style={tw`flex-row justify-between items-center px-2 py-1 mb-2 border-b border-gray-800`}>
    <View>
      <Text style={tw`text-white text-base font-semibold`}>{item.title}</Text>
      <Text style={tw`text-gray-400 text-sm`}>{item.description}</Text>
    </View>
    <Text style={tw`text-white text-base font-semibold`}>{item.amount}</Text>
  </View>
);

const Homescreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Detect a horizontal swipe
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dx < -50) {
          // Swipe left detected
          navigation.navigate('BudgetGraph');
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} {...panResponder.panHandlers}>
      <View style={tw`px-2 pr-3 flex flex-row justify-between items-center`}>
        <Text style={tw`text-white text-3xl font-bold px-2`}>
          <Text style={tw`text-blue-500`}>u</Text>Budget
        </Text>
        <Ionicons name="notifications" size={20} color="white" />
      </View>
      <View style={tw`px-2 flex-row items-center justify-between`}>
        <Text style={tw`text-white text-sm`}>
          Your budget tracker app
        </Text>
        <Text style={tw`text-white text-xl font-bold px-2`}>
          Hi, saransh
        </Text>
      </View>
      <Image
        source={require("../assets/uBudget-pig.png")}
        resizeMode="contain"
        style={tw`w-40% h-35% self-center`}
      />
      <View style={tw`flex-col w-full  items-center px-2 pb-5`}>
        <Text style={tw`text-white text-lg font-bold px-2`}>
          Total Budget
        </Text>
        <Text style={tw`text-white text-lg font-bold px-2`}>
          $1000
        </Text>
      </View>
      <Text style={tw`text-white text-2xl font-bold px-2`}>
        Expenses
      </Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <BottomNavigationBar />
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({});
