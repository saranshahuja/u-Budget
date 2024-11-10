import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '../Components/BottomNavigationBar'
const SettingsScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <Text style={tw`text-white text-3xl font-bold px-2`}>
        Settings
      </Text>
      <BottomNavigationBar />
    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({})