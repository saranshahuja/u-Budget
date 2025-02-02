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
      isSplit: false,
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
    <View style={tw`flex-1 bg-white items-center justify-center`}>
      <View style={tw`flex-row justify-center w-full items-center px-4 pb-2`}>
        <TouchableOpacity
          style={tw`flex-row absolute left-0 justify-start w-full items-center px-4 pb-2`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          <Text style={tw`text-gray-600`}>Back</Text>
        </TouchableOpacity>
        <View style={tw`flex-row justify-center items-center`}>
          <Text
            style={[
              tw`text-center text-2xl text-gray-600`,
              { fontFamily: "Sora-SemiBold" },
            ]}
          >
            Add{" "}
          </Text>
          <Text
            style={[
              tw`text-center text-2xl text-black`,
              { fontFamily: "Sora-SemiBold" },
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
        placeholder="Comment"
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
              { fontFamily: "Sora-SemiBold" },
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
              <Text style={[tw`text-3xl`, { fontFamily: "Sora-Bold" }]}>
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

      {/* Save Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-full w-95% py-3 px-6 mt-4 mx-4`}
        onPress={saveItem}
      >
        <Text style={tw`text-white text-center text-lg`}>Save</Text>
      </TouchableOpacity>

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
              { fontFamily: "Sora-SemiBold" },
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
    </View>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({});
