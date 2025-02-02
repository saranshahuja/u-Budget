import { StyleSheet, Text, SafeAreaView, View, Image, FlatList, PanResponder, GestureResponderEvent, PanResponderGestureState, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import tw from "twrnc";
import BottomNavigationBar from '../Components/BottomNavigationBar'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfiguration';
import { db } from '../firebaseConfiguration';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your route names
type RootStackParamList = {
  BudgetGraph: undefined; // Add other routes here if needed
};

const Homescreen = ({navigation}: {navigation: any}) => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({
    spent: 0,
    earned: 0,
    overall: 0
  });
  const [selectedTotal, setSelectedTotal] = useState('spent');
  const user = auth.currentUser;
  console.log(user);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, where('userId', '==', user.uid));

    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
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
            split: data.isSplit,
            type: data.type
          });

          if (data.type === 'expense') {
            spent += parseFloat(data.amount);
          } else {
            earned += parseFloat(data.amount);
          }
        });

        setItems(itemsData);
        setTotals({
          spent,
          earned,
          overall: earned - spent
        });
        setIsLoading(false);
      }, (error) => {
        console.error("Firebase snapshot error:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase setup error:", error);
      setIsLoading(false);
    }
  }, [auth.currentUser]);

  const getTotalDisplayText = () => {
    switch(selectedTotal) {
      case 'spent':
        return 'Spent this month';
      case 'earned':
        return 'Earned this month';
      case 'overall':
        return 'Overall balance';
      default:
        return '';
    }
  };

  const getTotalAmount = () => {
    return totals[selectedTotal as keyof typeof totals].toFixed(2);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={tw`flex-row justify-between items-center px-3 py-4 rounded-lg mb-2 border-b border-gray-200`}
      onPress={() => navigation.navigate('ItemDetailsScreen', { item })}
    >
      <View>
        <Text style={tw`text-black text-lg font-medium`}>{item.title}</Text>
        <Text style={tw`text-gray-500 text-xs`}>{item.description}</Text>
      </View>
      <View style={tw`flex-row items-center gap-x-1`}>
        {item.split && (
          <MaterialIcons name="call-split" size={24} color="green" />
        )}
        <Text style={tw`text-black text-lg`}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

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

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={[tw`mt-4 text-gray-600`, { fontFamily: 'Sora-Regular' }]}>
          Loading your dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} {...panResponder.panHandlers}>
      <View style={tw`px-4 pt-4 pb-8`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Ionicons name="menu-outline" size={24} color="black" />
          <Ionicons name="time-outline" size={24} color="black" />
        </View>
        
        <TouchableOpacity 
          style={tw`mt-3 mb-2`}
          onPress={() => {
            const options = ['spent', 'earned', 'overall'];
            const currentIndex = options.indexOf(selectedTotal);
            const nextIndex = (currentIndex + 1) % options.length;
            setSelectedTotal(options[nextIndex]);
          }}
        >
          <Text style={[
            tw`text-gray-600 text-center mb-2`,
            { fontFamily: 'Sora-Regular' }
          ]}>{getTotalDisplayText()}</Text>
          <Text style={[
            tw`text-3xl font-bold text-center`,
            { color: selectedTotal === 'overall' ? 
              (totals.overall >= 0 ? '#2ecc71' : '#e74c3c') : 
              (selectedTotal === 'earned' ? '#2ecc71' : '#e74c3c') 
            }, {fontFamily: 'Sora-SemiBold'}
          ]}>
            {selectedTotal === 'overall' && totals.overall > 0 ? '+' : ''}${getTotalAmount()}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`h-3/5 mx-2 px-2 border border-gray-200 shadow-lg rounded-2xl bg-white`}>
        {isLoading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={tw`mt-2 text-gray-600`}>Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity style={tw`bg-blue-500 my-10 mx-2 px-2 py-2 w-14 h-14  self-center rounded-full items-center justify-center`} onPress={() => navigation.navigate('ItemDetailsScreen')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <View style={tw`flex-row justify-center gap-x-1 mb-4`}>
        {[...Array(7)].map((_, i) => (
          <View 
            key={i} 
            style={tw`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-gray-800' : 'bg-gray-300'}`} 
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({});
