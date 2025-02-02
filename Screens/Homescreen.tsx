import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  FlatList,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import tw from "twrnc";
import BottomNavigationBar from "../Components/BottomNavigationBar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth } from "../firebaseConfiguration";
import { db } from "../firebaseConfiguration";
import { StackNavigationProp } from "@react-navigation/stack";

// Define your route names
type RootStackParamList = {
  BudgetGraph: undefined; // Add other routes here if needed
};

const Homescreen = ({ navigation }: { navigation: any }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({
    spent: 0,
    earned: 0,
    overall: 0,
  });
  const [selectedTotal, setSelectedTotal] = useState("spent");
  const user = auth.currentUser;
  console.log(user);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("userId", "==", user.uid));

    try {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log("Received snapshot with", snapshot.size, "items");
          const itemsData: any[] = [];
          let spent = 0;
          let earned = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            itemsData.push({
              id: doc.id,
              title: data.category.title,
              amount: `$${parseFloat(data.amount).toFixed(2)}`,
              description: data.comment,
              isSplit: data.isSplit,
              splitDetails: data.splitDetails,
              type: data.type,
            });

            if (data.type === "expense") {
              const amount = data.isSplit 
                ? parseFloat(data.amount) * (data.splitDetails?.[0]?.percentage || 50) / 100
                : parseFloat(data.amount);
              spent += amount;
            } else {
              earned += parseFloat(data.amount);
            }
          });

          setItems(itemsData);
          setTotals({
            spent,
            earned,
            overall: earned - spent,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Firebase snapshot error:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase setup error:", error);
      setIsLoading(false);
    }
  }, [auth.currentUser]);

  const getTotalDisplayText = () => {
    switch (selectedTotal) {
      case "spent":
        return "Spent this month";
      case "earned":
        return "Earned this month";
      case "overall":
        return "Overall balance";
      default:
        return "";
    }
  };

  const getTotalAmount = () => {
    return totals[selectedTotal as keyof typeof totals].toFixed(2);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={tw`flex-row justify-between items-center px-3 py-4 rounded-lg mb-2 border-b border-gray-200`}
      onPress={() => navigation.navigate("ItemDetailsScreen", { item })}
    >
      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center gap-x-2`}>
          <Text style={tw`text-black text-lg font-medium`}>{item.title}</Text>
          {item.isSplit && (
            <View style={tw`bg-blue-100 px-2 py-0.5 rounded-full`}>
              <Text style={tw`text-blue-600 text-xs`}>
                Split {item.splitDetails?.length || 2}
              </Text>
            </View>
          )}
        </View>
        <Text style={tw`text-gray-500 text-xs`}>{item.description}</Text>
        {item.isSplit && (
          <Text style={tw`text-gray-400 text-xs mt-1`}>
            Your share: ${(parseFloat(item.amount) * 
              (item.splitDetails?.[0]?.percentage || 50) / 100).toFixed(2)}
          </Text>
        )}
      </View>
      <View style={tw`flex-row items-center gap-x-1`}>
        {item.split && (
          <MaterialIcons name="call-split" size={20} color="#3b82f6" />
        )}
        <Text 
          style={[
            tw`text-black text-lg`,
            item.type === "expense" ? tw`text-red-500` : tw`text-green-500`
          ]}
        >
          {item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        // Detect a horizontal swipe
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureState.dx < -50) {
          // Swipe left detected
          navigation.navigate("BudgetGraph");
        }
      },
    })
  ).current;

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={[tw`mt-4 text-gray-600`, { fontFamily: "Sora-Regular" }]}>
          Loading your dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} {...panResponder.panHandlers}>
      <View style={tw`px-4 pt-4 pb-8`}>
        <View style={tw`flex-row justify-between items-center`}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="time-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`mt-6 mb-4`}
          onPress={() => {
            const options = ["spent", "earned", "overall"];
            const currentIndex = options.indexOf(selectedTotal);
            const nextIndex = (currentIndex + 1) % options.length;
            setSelectedTotal(options[nextIndex]);
          }}
        >
          <View style={tw`flex-row items-center justify-center mb-3`}>
            <Text
              style={[
                tw`text-gray-600 text-center mr-2`,
                { fontFamily: "Sora-Regular" },
              ]}
            >
              {getTotalDisplayText()}
            </Text>

            <Ionicons
              name={"chevron-expand"}
              size={24}
              color="black"
            />
          </View>

          <Text
            style={[
              tw`text-4xl font-bold text-center`,
              {
                color:
                  selectedTotal === "overall"
                    ? totals.overall >= 0
                      ? "#2ecc71"
                      : "#e74c3c"
                    : selectedTotal === "earned"
                    ? "#2ecc71"
                    : "#e74c3c",
              },
              { fontFamily: "Sora-SemiBold" },
            ]}
          >
            {selectedTotal === "overall" && totals.overall > 0 ? "+" : ""}$
            {getTotalAmount()}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={tw`h-3/5 mx-4 px-3 border border-gray-200 shadow-lg rounded-2xl bg-white`}
      >
        {isLoading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={tw`mt-4 text-gray-600`}>Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`py-2`}
          />
        )}
      </View>

      <TouchableOpacity
        style={tw`bg-blue-500 my-12 mx-2 px-2 py-2 w-16 h-16 self-center rounded-full items-center justify-center`}
        onPress={() => navigation.navigate("ItemDetailsScreen")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <View style={tw`flex-row justify-center gap-x-2 mb-6`}>
        {[...Array(7)].map((_, i) => (
          <View
            key={i}
            style={tw`h-2 w-2 rounded-full ${
              i === 0 ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({});
