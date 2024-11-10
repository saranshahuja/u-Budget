import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import tw from 'twrnc';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['0', '5', '10', '15', '20', '25', '30'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 120],
      strokeWidth: 2,
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
};

const BudgetGraph = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>

      <View style={tw`p-2.5`}>
        <Text style={tw`text-lg text-white`}>Hi, Name</Text>
      </View>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={tw`my-2 rounded-lg self-center`}
      />
      <View style={tw`bg-blue-500 m-2.5 p-3.75 rounded-lg`}>
        <Text style={tw`text-lg text-white font-bold`}>Saving Goal</Text>
        <Text style={tw`text-base text-white`}>3D Printer</Text>
        <Text style={tw`text-base text-white`}>$3200</Text>
      </View>
      <View style={tw`bg-blue-500 m-2.5 p-3.75 rounded-lg`}>
        <Text style={tw`text-lg text-white font-bold`}>Savings</Text>
        <Text style={tw`text-base text-white`}>Emergency</Text>
        <Text style={tw`text-base text-white`}>$5000</Text>
      </View>
      <View style={tw`bg-blue-500 m-2.5 p-3.75 rounded-lg`}>
        <Text style={tw`text-lg text-white font-bold`}>Statistics</Text>
        <Text style={tw`text-base text-white`}>Average Daily Savings</Text>
        <Text style={tw`text-base text-white`}>$10</Text>
      </View>
    </SafeAreaView>
  );
};

export default BudgetGraph;
