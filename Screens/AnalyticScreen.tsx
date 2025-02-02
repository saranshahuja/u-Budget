import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import BottomNavigationBar from '../Components/BottomNavigationBar'
import tw from 'twrnc'




const AnalyticScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text style={tw`text-black text-3xl font-bold px-2`}>
        Analytics
      </Text>
      <BottomNavigationBar />
    </SafeAreaView>
  )
}

export default AnalyticScreen

const styles = StyleSheet.create({})