import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Test = () => {
    return (
        <View className="flex-1 bg-white p-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <Image
                    source={{ uri: 'https://your-profile-image-url' }} // Replace with actual image URL
                    className="w-12 h-12 rounded-full"
                />
                <View className="ml-4">
                    <Text className="text-xl font-semibold">Hi, Samantha!</Text>
                    <Text className="text-gray-500">Welcome home</Text>
                </View>
            </View>

            {/* Weather Info */}
            <View className="bg-blue-100 rounded-xl p-5 mb-6">
                <Text className="text-gray-500">Sadai, 15 May 2020</Text>
                <View className="flex-row items-center justify-between mt-3">
                    <View className="flex-row items-center">
                        <Text className="text-blue-500 text-2xl mb-2">💡</Text>
                        <Text className="text-blue-700 text-4xl font-bold ml-3">25°C</Text>
                    </View>
                    <View>
                        <Text className="text-blue-700 text-lg">49% Indoor Humidity</Text>
                        <Text className="text-blue-700 text-lg">41% Outdoor Humidity</Text>
                    </View>
                </View>
            </View>

            {/* Running Appliances */}
            <View className="flex-1 justify-center items-center bg-white">
                <View className="flex-row justify-around w-full px-6">
                    {/* Smart Light Card */}
                    <TouchableOpacity className="w-40 h-48 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <Icon name="lightbulb-o" size={32} color="#60A5FA" />
                            <View className="w-3 h-3 bg-green-500 rounded-full" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-900">Smart Light</Text>
                        <Text className="text-sm text-gray-400 mt-1">Consumes 10 kWh</Text>
                        <View className="flex-1 justify-end items-center mt-4">
                            <MaterialIcon name="power-settings-new" size={24} color="#EF4444" />
                        </View>
                    </TouchableOpacity>

                    {/* Smart TV Card */}
                    <TouchableOpacity className="w-40 h-48 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <MaterialIcon name="tv" size={32} color="#34D399" />
                            <View className="w-3 h-3 bg-green-500 rounded-full" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-900">Smart TV</Text>
                        <Text className="text-sm text-gray-400 mt-1">Consumes 20 kWh</Text>
                        <View className="flex-1 justify-end items-center mt-4">
                            <MaterialIcon name="power-settings-new" size={24} color="#EF4444" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Test;
