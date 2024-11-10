import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';

const DetailsScreen = ({ route }: { route: any }) => {
  const { title, amount, description } = route.params;

  return (
    <View style={tw`flex-1 bg-black p-4`}>
      <Text style={tw`text-white text-2xl font-bold`}>{title}</Text>
      <Text style={tw`text-gray-400 text-lg`}>{description}</Text>
      <Text style={tw`text-white text-xl mt-2`}>Amount: {amount}</Text>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({});