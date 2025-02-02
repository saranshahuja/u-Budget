import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";


const FirstScreen = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center px-6`}>
      <View style={tw`flex-1 justify-center items-center`}>
        <Text
          style={[tw`text-4xl font-bold`, { fontFamily: "Sora-ExtraBold" }]}
        >
          <Text style={[tw`text-[#0080FF]`, { fontFamily: "Sora-ExtraBold" }]}>
            u
          </Text>
          Budget
        </Text>
        <Text style={[tw`text-gray-500 text-xs`, { fontFamily: "Sora-Regular" }]}>
          Your Last Budgeting App
        </Text>
      </View>
      <View style={tw`flex-1 absolute bottom-10 justify-end w-full`}>
        <TouchableOpacity
          style={tw`flex-row justify-center w-full bg-blue-500 p-3 rounded-full mt-2 border border-gray-200 shadow-lg`}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text
            style={[
              tw`text-white text-center font-bold text-lg`,
              { fontFamily: "Sora-SemiBold" },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({});
