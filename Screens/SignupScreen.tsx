import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'

const SignupScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center px-6`}>
      <View>
        <Text>SignupScreen</Text>
      </View>
    </SafeAreaView>
  )
}

export default SignupScreen

const styles = StyleSheet.create({})