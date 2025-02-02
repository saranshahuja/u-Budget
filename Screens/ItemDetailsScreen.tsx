import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActionSheetIOS,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import tw from "twrnc";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebaseConfiguration";
import { auth } from "../firebaseConfiguration";
import { collection, addDoc } from "firebase/firestore";
import Slider from "@react-native-community/slider";

const ItemDetailsScreen = ({
  route,
  navigation,
}: {
  route?: { params?: { item?: any } };
  navigation: any;
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const frequencyActionSheetRef = useRef<ActionSheetRef>(null);
  const item = route?.params?.item;
  const [amount, setAmount] = useState("0");
  const [comment, setComment] = useState("");
  const [type, setType] = useState({ title: "expense", emoji: "💰" });
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("not recurring");
  const [selectedCategory, setSelectedCategory] = useState({
    title: "",
    emoji: "📝",
  });
  const [isSplit, setIsSplit] = useState(false);
  const splitActionSheetRef = useRef<ActionSheetRef>(null);
  const [splitUsers, setSplitUsers] = useState([
    { id: 1, percentage: 100, amount: 0 },
  ]);

  const SPLIT_CHECKPOINTS = [
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 33.33, label: '33%' },
    { value: 50, label: '50%' },
    { value: 66.67, label: '67%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' }
  ];

  const snapToNearestCheckpoint = (value: number): number => {
    const closest = SPLIT_CHECKPOINTS.reduce((prev, curr) => {
      return Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev;
    });

    if (Math.abs(closest.value - value) < 2) {
      return closest.value;
    }
    return value;
  };

  const handleNumberPress = (num: string) => {
    if (num === ".") {
      // Only add decimal if one doesn't exist already
      if (!amount.includes(".")) {
        setAmount(amount + ".");
      }
      return;
    }

    if (amount.includes(".")) {
      // If we already have a decimal, check we don't exceed 2 decimal placesr
      const decimalPlaces = amount.split(".")[1];
      if (decimalPlaces && decimalPlaces.length >= 2) {
        return;
      }
    }

    if (amount === "0") {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    setAmount(amount.slice(0, -1) || "0");
  };

  const showActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const handleTypeSelect = (categoryTitle: string, categoryEmoji: string) => {
    setSelectedCategory({ title: categoryTitle, emoji: categoryEmoji });
    actionSheetRef.current?.hide();
  };

  const frequencies = [
    { title: "Daily", value: "daily" },
    { title: "Weekly", value: "weekly" },
    { title: "Monthly", value: "monthly" },
    { title: "Yearly", value: "yearly" },
  ];

  const handleFrequencySelect = (selectedFrequency: string) => {
    setFrequency(selectedFrequency);
    setIsRecurring(true);
    frequencyActionSheetRef.current?.hide();
  };

  const expenseCategories = [
    { title: "Housing", emoji: "🏠" },
    { title: "Wifi", emoji: "📶" },
    { title: "Dining", emoji: "🍽️" },
    { title: "Beauty", emoji: "💄" },
    { title: "Debts", emoji: "💳" },
    { title: "Fitness", emoji: "💪" },
    { title: "Hobbies", emoji: "🎨" },
    { title: "Pets", emoji: "🐾" },
    { title: "Health", emoji: "🏥" },
    { title: "Learning", emoji: "📚" },
    { title: "Kids", emoji: "👶" },
    { title: "Gifts", emoji: "🎁" },
  ];

  const expenseBottomCategories = [
    { title: "Repairs", emoji: "🔧" },
    { title: "Savings", emoji: "💰" },
    { title: "Travelling", emoji: "✈️" },
    { title: "Shopping", emoji: "🛍️" },
    { title: "Movies", emoji: "🎬" },
  ];

  const incomeCategories = [
    { title: "Salary", emoji: "💵" },
    { title: "Business", emoji: "💼" },
    { title: "Freelance", emoji: "💻" },
    { title: "Investments", emoji: "📈" },
    { title: "Rental", emoji: "🏘️" },
    { title: "Gifts", emoji: "🎁" },
    { title: "Savings", emoji: "🏦" },
    { title: "Dividends", emoji: "💹" },
    { title: "Refunds", emoji: "🔄" },
  ];

  const incomeBottomCategories = [
    { title: "Side Gig", emoji: "🎸" },
    { title: "Bonus", emoji: "🎉" },
    { title: "Commission", emoji: "📊" },
    { title: "Tips", emoji: "🤝" },
  ];

  const handleSplitPress = () => {
    splitActionSheetRef.current?.show();
    // Initialize the first user's amount
    setSplitUsers([{ id: 1, percentage: 100, amount: parseFloat(amount) }]);
  };

  const handleSliderChange = (percentage: number, userId: number) => {
    const snappedValue = snapToNearestCheckpoint(percentage);
    const totalAmount = parseFloat(amount);
    const otherUsers = splitUsers.filter(user => user.id !== userId);
    const otherTotal = otherUsers.reduce((sum, user) => sum + user.percentage, 0);
    
    // Calculate remaining percentage available
    const maxAllowedPercentage = 100 - otherTotal;
    let finalPercentage = snappedValue;

    // If sliding up and total would exceed 100%, reduce other users proportionally
    if (otherTotal + finalPercentage > 100) {
      const excess = (otherTotal + finalPercentage) - 100;
      const reductionRatio = excess / otherTotal;
      
      const updatedUsers = splitUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            percentage: finalPercentage,
            amount: (totalAmount * finalPercentage) / 100
          };
        } else {
          const reducedPercentage = user.percentage * (1 - reductionRatio);
          return {
            ...user,
            percentage: reducedPercentage,
            amount: (totalAmount * reducedPercentage) / 100
          };
        }
      });
      
      setSplitUsers(updatedUsers);
    } else {
      // Normal case when sliding down or when total is under 100%
      const remainingPercentage = 100 - (otherTotal + finalPercentage);
      
      const updatedUsers = splitUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            percentage: finalPercentage,
            amount: (totalAmount * finalPercentage) / 100
          };
        } else if (otherTotal > 0) {
          // Distribute remaining percentage proportionally
          const adjustedPercentage = user.percentage + 
            (remainingPercentage * (user.percentage / otherTotal));
          return {
            ...user,
            percentage: adjustedPercentage,
            amount: (totalAmount * adjustedPercentage) / 100
          };
        }
        return user;
      });
      
      setSplitUsers(updatedUsers);
    }
  };

  const handleAddUser = () => {
    const totalAmount = parseFloat(amount);
    const newUserCount = splitUsers.length + 1;
    const equalPercentage = 100 / newUserCount;
    
    // Redistribute percentages equally among all users including the new one
    const updatedUsers = splitUsers.map(user => ({
      ...user,
      percentage: equalPercentage,
      amount: (totalAmount * equalPercentage) / 100
    }));

    setSplitUsers([
      ...updatedUsers,
      {
        id: newUserCount,
        percentage: equalPercentage,
        amount: (totalAmount * equalPercentage) / 100
      }
    ]);
  };

  const saveItem = () => {
    if (!auth.currentUser) {
      console.error("No user is signed in");
      return;
    }

    // Validate required fields
    if (amount === "0") {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    if (!selectedCategory.title) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Error", "Please add a comment");
      return;
    }

    const userItemsRef = collection(db, "items");

    addDoc(userItemsRef, {
      amount: parseFloat(amount),
      comment: comment.trim(),
      category: selectedCategory,
      type: type.title,
      frequency: frequency,
      isRecurring: isRecurring,
      isSplit: isSplit,
      splitDetails: isSplit ? splitUsers : null,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
    })
      .then(() => {
        console.log("Item saved successfully");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error saving item: ", error);
        Alert.alert("Error", "Failed to save item. Please try again.");
      });
  };

  return (
    <View style={tw`flex-1 bg-white items-center justify-around pb-10 pt-5`}>
      <View style={tw`flex-row justify-center w-full items-center px-4 pb-2`}>
        <TouchableOpacity
          style={tw`flex-row absolute left-0 justify-start w-full items-center px-4 pb-2`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text style={tw`text-gray-600`}>Back</Text>
        </TouchableOpacity>
        <View style={tw`flex-row justify-center items-center`}>
          <Text
            style={[
              tw`text-center text-2xl text-gray-600`,
              { fontFamily: "Sora-light" },
            ]}
          >
            Add{" "}
          </Text>
          <Text
            style={[
              tw`text-center text-2xl text-black`,
              { fontFamily: "Sora-light" },
            ]}
          >
            {type.title === "expense" ? "Expense" : "Income"}
          </Text>
        </View>
      </View>
      {/* Amount Display */}
      <Text
        style={[
          tw`text-center text-4xl font-bold my-8`,
          { fontFamily: "Sora-Regular" },
        ]}
      >
        $
        {Number(amount).toLocaleString("en-US", {
          minimumFractionDigits: amount.includes(".") ? 2 : 0,
          maximumFractionDigits: 2,
        })}
      </Text>

      {/* Comment Input */}
      <TextInput
        style={[
          tw`bg-gray-100 p-4 rounded-full border border-gray-200 shadow-md mb-8 w-95% self-center`,
          { fontFamily: "Sora-Regular" },
        ]}
        placeholder="Add in a message"
        value={comment}
        onChangeText={setComment}
      />

      {/* Item Title Display with Action Sheet */}
      <View style={tw`flex-row mb-8 w-95% justify-between items-center`}>
        <TouchableOpacity
          style={tw`flex-row items-center gap-x-2 bg-gray-100 px-4 py-2 rounded-full`}
          onPress={showActionSheet}
        >
          <Text>{selectedCategory.emoji}</Text>
          <Text
            style={[
              tw`text-center text-black`,
              { fontFamily: "Sora-light" },
            ]}
          >
            {selectedCategory.title || "Select Category"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center gap-x-2`}
          onPress={() => {
            if (!isRecurring) {
              frequencyActionSheetRef.current?.show();
            } else {
              setIsRecurring(false);
              setFrequency("Not recurring");
            }
          }}
        >
          <Text
            style={[tw`text-center text-black`, { fontFamily: "Sora-Regular" }]}
          >
            {isRecurring ? `${frequency} recurring` : "Not recurring"}
          </Text>
          {isRecurring ? (
            <Ionicons name="radio-button-on-outline" size={20} color="black" />
          ) : (
            <Ionicons name="radio-button-off-outline" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {/* Numeric Keypad */}
      <View style={tw`px-4`}>
        <View style={tw`flex-row flex-wrap`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num, index) => (
            <TouchableOpacity
              key={num}
              style={[
                tw`items-center justify-center`,
                { width: "33.33%", height: 80 },
              ]}
              onPress={() => handleNumberPress(num.toString())}
            >
              <Text style={[tw`text-3xl`, { fontFamily: "Sora-Regular" }]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              tw`items-center justify-center`,
              { width: "33.33%", height: 80 },
            ]}
            onPress={handleDelete}
            onLongPress={() => setAmount("0")}
            delayLongPress={500}
          >
            <Ionicons name="backspace-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Split Button */}
      <View style={tw`flex-row mb-8 w-95% justify-between items-center`}>
        <TouchableOpacity
          style={tw`flex-row items-center gap-x-2`}
          onPress={() => {
            if (!isSplit) {
              handleSplitPress();
            } else {
              setIsSplit(false);
              setSplitUsers([{ id: 1, percentage: 100, amount: 0 }]);
            }
          }}
        >
          <Text style={[tw`text-center text-black`, { fontFamily: "Sora-Regular" }]}>
            {isSplit ? "Split enabled" : "Split with others"}
          </Text>
          {isSplit ? (
            <Ionicons name="radio-button-on-outline" size={20} color="black" />
          ) : (
            <Ionicons name="radio-button-off-outline" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-full w-95% py-3 px-6 mt-4 mx-4`}
        onPress={saveItem}
      >
        <Text style={tw`text-white text-center text-lg`}>Save</Text>
      </TouchableOpacity>

      <View style={tw`mb-4`}>
        {isSplit && (
          <View style={tw`bg-gray-50 rounded-lg p-3 mb-2`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={[tw`text-gray-600`, { fontFamily: "Sora-Regular" }]}>
                Split between {splitUsers.length} people
              </Text>
              <TouchableOpacity onPress={handleSplitPress}>
                <Text style={[tw`text-blue-500`, { fontFamily: "Sora-Regular" }]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            {splitUsers.map((user, index) => (
              <Text 
                key={user.id} 
                style={[
                  tw`text-gray-500 text-sm`, 
                  { fontFamily: "Sora-Regular" }
                ]}
              >
                Person {user.id}: ${user.amount.toFixed(2)} ({user.percentage.toFixed(1)}%)
              </Text>
            ))}
          </View>
        )}
      </View>

      <ActionSheet ref={actionSheetRef}>
        <View style={tw`p-4`}>
          {/* Expense/Income Selector */}
          <View style={tw`flex-row bg-gray-100 rounded-full p-1 mb-8`}>
            <TouchableOpacity
              style={tw`flex-1 py-2 rounded-full ${
                type.title === "expense" ? "bg-white" : ""
              }`}
              onPress={() => setType({ title: "expense", emoji: "💰" })}
            >
              <Text
                style={tw`text-center ${
                  type.title === "expense" ? "font-bold" : ""
                }`}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-2 rounded-full ${
                type.title === "income" ? "bg-white" : ""
              }`}
              onPress={() => setType({ title: "income", emoji: "💵" })}
            >
              <Text
                style={tw`text-center ${
                  type.title === "income" ? "font-bold" : ""
                }`}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories Grid */}
          <View style={tw`flex-row flex-wrap justify-between`}>
            {(type.title === "expense"
              ? expenseCategories
              : incomeCategories
            ).map((category) => (
              <TouchableOpacity
                key={category.title}
                style={tw`w-[30%] bg-gray-100 rounded-lg p-4 mb-4`}
                onPress={() => handleTypeSelect(category.title, category.emoji)}
              >
                <Text style={tw`text-center mb-1`}>{category.emoji}</Text>
                <Text style={tw`text-center text-sm`}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Row Categories */}
          <View style={tw`flex-row justify-between mt-2`}>
            {(type.title === "expense"
              ? expenseBottomCategories
              : incomeBottomCategories
            ).map((category) => (
              <TouchableOpacity
                key={category.title}
                style={tw`px-3 py-2 bg-gray-100 rounded-full`}
                onPress={() => handleTypeSelect(category.title, category.emoji)}
              >
                <Text style={tw`text-sm text-center`}>
                  {category.emoji} {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ActionSheet>

      <ActionSheet ref={frequencyActionSheetRef}>
        <View style={tw`p-4`}>
          <Text
            style={[
              tw`text-lg mb-4 text-center`,
              { fontFamily: "Sora-Regular" },
            ]}
          >
            Select Frequency of this{" "}
            {type.title === "expense" ? "expense" : "income"}
          </Text>
          {frequencies.map((freq) => (
            <TouchableOpacity
              key={freq.value}
              style={tw`py-3 px-4 border-b border-gray-200`}
              onPress={() => handleFrequencySelect(freq.value)}
            >
              <Text style={[tw`text-center`, { fontFamily: "Sora-Regular" }]}>
                {freq.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionSheet>

      <ActionSheet ref={splitActionSheetRef}>
        <View style={tw`p-4`}>
          <Text style={[tw`text-xl mb-4 text-center font-bold`, { fontFamily: "Sora-Regular" }]}>
            Split Amount: ${parseFloat(amount).toFixed(2)}
          </Text>
          
          {splitUsers.map((user, index) => (
            <View key={user.id} style={tw`mb-6`}>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={[tw`text-lg`, { fontFamily: "Sora-Regular" }]}>
                  Person {user.id}
                </Text>
                <Text style={[tw`text-lg font-bold`, { fontFamily: "Sora-Regular" }]}>
                  ${user.amount.toFixed(2)} ({user.percentage.toFixed(1)}%)
                </Text>
              </View>
              
              <Slider
                value={user.percentage}
                onValueChange={(value) => handleSliderChange(value, user.id)}
                minimumValue={0}
                maximumValue={100}
                step={0.5}
                thumbTintColor="#3b82f6"
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
                tapToSeek={true}
              />
              
              {/* Checkpoint markers */}
              <View style={tw`flex-row justify-between mt-1`}>
                {SPLIT_CHECKPOINTS.map((checkpoint) => (
                  <TouchableOpacity
                    key={checkpoint.value}
                    onPress={() => handleSliderChange(checkpoint.value, user.id)}
                    style={tw`items-center`}
                  >
                    <View style={tw`w-0.5 h-2 bg-gray-400 mb-1`} />
                    <Text style={[
                      tw`text-xs text-gray-500`,
                      { fontFamily: "Sora-Regular" }
                    ]}>
                      {checkpoint.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          
          {splitUsers.length < 5 && (
            <TouchableOpacity
              style={tw`bg-gray-200 rounded-full py-3 px-4 mt-4`}
              onPress={handleAddUser}
            >
              <Text style={[tw`text-center text-lg`, { fontFamily: "Sora-Regular" }]}>
                Add Person
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-full py-3 px-4 mt-4`}
            onPress={() => {
              setIsSplit(true);
              splitActionSheetRef.current?.hide();
            }}
          >
            <Text style={[tw`text-white text-center text-lg`, { fontFamily: "Sora-Regular" }]}>
              Confirm Split
            </Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({});
