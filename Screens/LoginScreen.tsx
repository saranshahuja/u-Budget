import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfiguration'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfiguration'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setIsAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        
        // Check if user document exists
        const userDocRef = doc(db, 'users', userCredential.user.uid)
        const userDoc = await getDoc(userDocRef)
        
        // If document doesn't exist, create it
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: userCredential.user.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Add any other default user fields you want
          })
        }

        // Store user authentication state and user ID
        await AsyncStorage.setItem('@auth_status', 'true')
        await AsyncStorage.setItem('@user_id', userCredential.user.uid)
        
        setIsAuthenticated(true)
      } catch (error: any) {
        Alert.alert('Error', error.message)
      } finally {
        setLoading(false)
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields')
    }
  }

  return (
    <KeyboardAvoidingView 
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={tw`flex-grow justify-center px-2 mx-2`}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={tw`flex-1 h-full justify-center`}>
          <View style={tw`items-center mb-8`}>
            <Text style={[tw`text-3xl font-bold mt-4 text-gray-800`, {fontFamily: 'Sora-ExtraBold'}]}><Text style={[tw`text-[#0080FF]`, {fontFamily: 'Sora-ExtraBold'}]}>u</Text>Budget</Text>
            <Text style={[tw`text-gray-500 mt-2`, {fontFamily: 'Sora-Regular'}]}>Your Last Budgeting App</Text>
          </View>

          <View style={tw`gap-y-4 bg-white py-6 px-4 rounded-2xl border border-gray-200 shadow-sm`}>
            <View>
              <Text style={[tw`text-gray-700 mb-2`, {fontFamily: 'Sora-SemiBold'}]}>Email</Text>
              <TextInput
                style={[tw`bg-gray-200 p-4 rounded-2xl border border-gray-200 shadow-sm`, {fontFamily: 'Sora-Regular'}]}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text style={[tw`text-gray-700 mb-2`, {fontFamily: 'Sora-SemiBold'}]}>Password</Text>
              <TextInput
                style={[tw`bg-gray-200 p-4 rounded-2xl border border-gray-200 shadow-sm`, {fontFamily: 'Sora-Regular'}]}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity>
              <Text style={[tw`text-center text-gray-500 self-end`, {fontFamily: 'Sora-Regular'}]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[tw`bg-[#0080FF] p-3 rounded-full mt-4`, {fontFamily: 'Sora-SemiBold'}]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={[tw`text-white text-center font-bold text-lg`, {fontFamily: 'Sora-SemiBold'}]}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row items-center justify-center gap-x-2`}>
              <View style={tw`flex-1 h-[1px] bg-gray-200`}></View>
              <Text style={[tw`text-gray-500`, {fontFamily: 'Sora-Regular'}]}>Or</Text>
              <View style={tw`flex-1 h-[1px] bg-gray-200`}></View>
            </View>
            <View style={tw`flex-row justify-center gap-x-6`}>
              <TouchableOpacity style={tw`p-4 rounded-full bg-white border border-gray-200 shadow-sm`}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              
              <TouchableOpacity style={tw`p-4 rounded-full bg-white border border-gray-200 shadow-sm`}>
                <Ionicons name="logo-apple" size={24} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity style={tw`p-4 rounded-full bg-white border border-gray-200 shadow-sm`}>
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`flex-row justify-center mt-8`}>
            <Text style={[tw`text-gray-500`, {fontFamily: 'Sora-Regular'}]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={[tw`text-[#0080FF] font-bold`, {fontFamily: 'Sora-SemiBold'}]  }>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})