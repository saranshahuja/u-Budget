import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useNavigation, NavigationProp, StackActions } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

// Define your route names
type RootStackParamList = {
  Homescreen: undefined;
  Settings: undefined;
  // Add other routes here
};

const BottomNavigationBar = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()


  return (
    <View style={tw`flex-row justify-around bg-[#121212] items-center h-12% absolute bottom-0 w-full`}>
      <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Home'))}
        style={tw`flex-col items-center`}
      >
        <Ionicons name='home' size={24} color='white' />
        <Text style={tw`text-white text-xs`}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('Settings'))}
        style={tw`flex-col items-center`}
      >
        <Ionicons name='settings' size={24} color='white' />
        <Text style={tw`text-white text-xs`}>Settings</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BottomNavigationBar

