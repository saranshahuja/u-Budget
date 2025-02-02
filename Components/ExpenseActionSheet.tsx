import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

interface ExpenseActionSheetProps {
  actionSheetRef: React.RefObject<ActionSheetRef>;
  currentView: "numpad" | "budgetType";
  enteredAmount: string;
  selectedBudgetType: string;
  position1: Animated.Value;
  position2: Animated.Value;
  position3: Animated.Value;
  opacity1: Animated.Value;
  opacity2: Animated.Value;
  opacity3: Animated.Value;
  scaleAnim: Animated.Value;
  setCurrentView: (view: "numpad" | "budgetType") => void;
  handleNumpadPress: (num: string) => void;
  handleSave: () => void;
  setSelectedBudgetType: (type: string) => void;
  transactionType: 'expense' | 'income';
  setTransactionType: (type: 'expense' | 'income') => void;
}

export const budgetTypes = {
  expense: [
    { type: 'Netflix', icon: 'play-circle', iconType: 'material', color: '#E50914', canBeExpense: true },
    { type: 'Spotify', icon: 'spotify', iconType: 'font-awesome', color: '#1DB954', canBeExpense: true },
    { type: 'Amazon Prime', icon: 'amazon', iconType: 'font-awesome', color: '#FF9900', canBeExpense: true },
    { type: 'Apple', icon: 'apple', iconType: 'font-awesome', color: '#A2AAAD', canBeExpense: true },
    { type: 'Disney+', icon: 'play-circle', iconType: 'material', color: '#113CCF', canBeExpense: true },
    { type: 'Xbox', icon: 'microsoft-xbox', iconType: 'material-community', color: '#107C10', canBeExpense: true },
    { type: 'Google', icon: 'google', iconType: 'font-awesome', color: '#4285F4', canBeExpense: true },
    { type: 'Adobe', icon: 'adobe', iconType: 'font-awesome-brands', color: '#FF0000', canBeExpense: true },
    { type: 'Coffee', icon: 'coffee', iconType: 'font-awesome', color: '#6F4E37', canBeExpense: true },
    { type: 'Food', icon: 'restaurant', iconType: 'material', color: '#FF6347', canBeExpense: true },
    { type: 'Transport', icon: 'directions-car', iconType: 'material', color: '#FF4500', canBeExpense: true },
    { type: 'Shopping', icon: 'shopping-bag', iconType: 'material', color: '#FF69B4', canBeExpense: true },
    { type: 'Entertainment', icon: 'gamepad', iconType: 'font-awesome', color: '#8A2BE2', canBeExpense: true },
    { type: 'Health', icon: 'medical-services', iconType: 'material', color: '#FF1493', canBeExpense: true },
    { type: 'Bills', icon: 'receipt', iconType: 'material', color: '#FFD700', canBeExpense: true },
    { type: 'Education', icon: 'school', iconType: 'material', color: '#32CD32', canBeExpense: true },
    { type: 'Groceries', icon: 'shopping-cart', iconType: 'material', color: '#FF8C00', canBeExpense: true },
    { type: 'Housing', icon: 'home', iconType: 'material', color: '#4682B4', canBeExpense: true },
    { type: 'Utilities', icon: 'lightbulb', iconType: 'material', color: '#FFD700', canBeExpense: true },
    { type: 'Insurance', icon: 'shield', iconType: 'material', color: '#8B0000', canBeExpense: true },
    { type: 'Other', icon: 'more-horiz', iconType: 'material', color: '#808080', canBeExpense: true }
  ],
  income: [
    { type: 'Salary', icon: 'attach-money', iconType: 'material', color: '#32CD32', canBeExpense: false },
    { type: 'Freelance', icon: 'laptop', iconType: 'material', color: '#4682B4', canBeExpense: false },
    { type: 'Investment', icon: 'trending-up', iconType: 'material', color: '#FFD700', canBeExpense: false },
    { type: 'Gift', icon: 'card-giftcard', iconType: 'material', color: '#FF69B4', canBeExpense: false },
    { type: 'Bonus', icon: 'star', iconType: 'material', color: '#FF4500', canBeExpense: false },
    { type: 'Refund', icon: 'undo', iconType: 'material', color: '#FF6347', canBeExpense: false },
    { type: 'Rental', icon: 'house', iconType: 'material', color: '#8A2BE2', canBeExpense: false },
    { type: 'Side Hustle', icon: 'work', iconType: 'material', color: '#FF8C00', canBeExpense: false },
    { type: 'Other', icon: 'more-horiz', iconType: 'material', color: '#808080', canBeExpense: false }
  ]
};

export const getIconForType = (type: string) => {
  const expenseType = budgetTypes.expense.find(t => t.type === type);
  const incomeType = budgetTypes.income.find(t => t.type === type);
  return expenseType || incomeType || { icon: 'more-horiz', iconType: 'material' };
};

const ExpenseActionSheet = ({
  actionSheetRef,
  currentView,
  enteredAmount,
  selectedBudgetType,
  position1,
  position2,
  position3,
  opacity1,
  opacity2,
  opacity3,
  scaleAnim,
  setCurrentView,
  handleNumpadPress,
  handleSave,
  setSelectedBudgetType,
  transactionType,
  setTransactionType,
}: ExpenseActionSheetProps) => {
  return (
    <ActionSheet
      ref={actionSheetRef}
      gestureEnabled={true}
      overlayColor="rgba(0,0,0,1)"
      containerStyle={tw`bg-white rounded-t-2xl p-5 `}
    >
      {currentView === "numpad" ? (
        <>
          <Text style={tw`text-lg self-center font-bold mb-6 mt-2`}>
            Add New {transactionType === 'expense' ? 'Expense' : 'Income'}
          </Text>
{/* 
          <View style={tw`flex-row justify-start items-center py-1 rounded-full px-3 w-40% ${transactionType === 'expense' ? 'bg-red-500 ' : 'bg-green-500'}`}>

              <Text style={tw`text-2xl mr-2`}>
                {transactionType === 'expense' ? '💸' : '💰'}
              </Text>
              <Text style={tw`text-base font-light ${transactionType === 'expense' ? 'text-white' : 'text-black'}`}>
                {transactionType === 'expense' ? 'Expense' : 'Income'}
              </Text>
      
          </View> */}


          <View style={tw`h-20 justify-center items-center`}>
            {[
              { position: position1, opacity: opacity1 },
              { position: position2, opacity: opacity2 },
              { position: position3, opacity: opacity3 },
            ].map((anim, i) => (
              <Animated.Text
                key={i}
                style={[
                  tw`text-2xl text-gray-400 absolute`,
                  {
                    transform: [
                      { translateY: anim.position },
                      {
                        scale: anim.opacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                    opacity: anim.opacity,
                  },
                ]}
              >
                ${enteredAmount}
              </Animated.Text>
            ))}
            <Animated.Text
              style={[
                tw`text-4xl self-center font-bold mb-8`,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              ${Number(enteredAmount).toFixed(2)}
            </Animated.Text>
          </View>

          <View style={tw`flex-row justify-between items-center py-4`}>
            <TouchableOpacity
              onPress={() => setCurrentView("budgetType")}
              style={[
                tw`bg-[#D9D9D9] p-3 rounded-full flex-row justify-center items-center min-w-[120px]`,
                selectedBudgetType ? tw`bg-blue-50` : null
              ]}
            >
              {selectedBudgetType ? (
                <>
                  <Ionicons
                    name={getIconForType(selectedBudgetType).icon as any}
                    type={getIconForType(selectedBudgetType).iconType}
                    size={24}
                    style={tw`mr-2`}
                  />
                  <Text style={tw`text-base font-medium text-blue-500`}>
                    {selectedBudgetType}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={tw`text-2xl mr-2`}>📝</Text>
                  <Text style={tw`text-base font-light`}>Category</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-[#0080FF] px-6 py-3 rounded-full`}
              onPress={handleSave}
            >
              <Text style={tw`text-white text-base font-medium`}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row flex-wrap justify-between px-4`}>
            {[
              "1",
              "2", 
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              ".",
              "0",
              "backspace",
            ].map((num) => {
              const buttonAnim = useRef(new Animated.Value(1)).current;

              const animatePress = () => {
                Animated.sequence([
                  Animated.timing(buttonAnim, {
                    toValue: 0.8,
                    duration: 50,
                    useNativeDriver: true
                  }),
                  Animated.timing(buttonAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                  })
                ]).start();
                handleNumpadPress(num);
              };

              return (
                <Animated.View
                  key={num}
                  style={[
                    tw`w-[30%] h-20 justify-center items-center mb-4`,
                    {
                      transform: [{scale: buttonAnim}]
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={tw`w-full h-full justify-center items-center`}
                    onPress={animatePress}
                  >
                    {num === "backspace" ? (
                      <Ionicons name="backspace" size={24} color="black" />
                    ) : (
                      <Text style={tw`text-2xl`}>{num}</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <View style={tw`flex-row items-center mb-4`}>
            <TouchableOpacity
              onPress={() => setCurrentView("numpad")}
              style={tw`p-2`}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold ml-4`}>Select Category</Text>
          </View>

          <View style={tw`flex-row justify-around mb-4 bg-gray-100 rounded-full p-1`}>
            <TouchableOpacity 
              style={tw`flex-1 p-2 ${transactionType === 'expense' ? 'bg-white rounded-full shadow' : ''}`}
              onPress={() => setTransactionType('expense')}
            >
              <Text style={tw`text-center ${transactionType === 'expense' ? 'text-blue-500' : 'text-gray-500'}`}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 p-2 ${transactionType === 'income' ? 'bg-white rounded-full shadow' : ''}`}
              onPress={() => setTransactionType('income')}
            >
              <Text style={tw`text-center ${transactionType === 'income' ? 'text-blue-500' : 'text-gray-500'}`}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={tw`h-4/5`}>
            <Text style={tw`text-lg font-bold mb-4`}>
              Select {transactionType === 'expense' ? 'Expense' : 'Income'} Category
            </Text>
            <View style={tw`flex-row flex-wrap justify-between px-2`}>
              {budgetTypes[transactionType]
                .filter(({ canBeExpense }) => transactionType === 'expense' ? canBeExpense : true)
                .map(({ type, icon, iconType, color }) => {
                  const isSelected = selectedBudgetType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => {
                        console.log('Selecting category:', type);
                        setSelectedBudgetType(type);
                        setCurrentView("numpad");
                      }}
                      style={[
                        tw`w-[31%] aspect-square mb-3 p-2 rounded-2xl justify-center items-center border border-gray-50`,
                        isSelected ? tw`bg-blue-100 border-2 border-blue-500` : tw``
                      ]}
                    >
                      <Ionicons
                        name={icon as any}
                        type={iconType}
                        size={24}
                        color={isSelected ? '#007AFF' : color}
                      />
                      <Text 
                        style={[
                          tw`text-sm text-center mt-2 px-1`,
                          isSelected ? tw`text-blue-500 font-medium` : tw`text-gray-700`
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ScrollView>
        </>
      )}
    </ActionSheet>
  );
};

export default ExpenseActionSheet;
