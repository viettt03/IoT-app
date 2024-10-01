import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import ControlHistory from './Screens/ControlHistory';
import ProfileScreens from './Screens/ProfileScreens';
import SensorHistory from './Screens/SensorHistory';


const Tab = createBottomTabNavigator();

const Tabs = (props) => {
    const [refresh, setRefresh] = useState(false);
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: { height: 55 }
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <Image source={{ uri: focused ? "https://cdn-icons-png.flaticon.com/512/3917/3917032.png" : "https://cdn-icons-png.flaticon.com/512/3917/3917014.png" }}
                                style={{ width: 27, height: 27, tintColor: focused ? '#000' : '#444' }}
                            />
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                name="SensorHistory1"
                component={SensorHistory}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <Image source={{
                                uri: focused ?
                                    "https://cdn-icons-png.flaticon.com/512/3917/3917754.png"
                                    : "https://cdn-icons-png.flaticon.com/512/3917/3917132.png"
                            }}
                                style={{ width: 27, height: 27, tintColor: focused ? '#000' : '#444' }}
                            />
                        </View>
                    ),
                })}
            />
            <Tab.Screen
                name="ControlHistory"
                component={ControlHistory}
                options={({ navigation, route }) => ({

                    tabBarIcon: ({ focused }) => (
                        <View>

                            <Image source={{
                                uri: focused ? "https://cdn-icons-png.flaticon.com/512/13727/13727331.png" :
                                    "https://cdn-icons-png.flaticon.com/512/13727/13727342.png"
                            }}
                                style={{ width: 27, height: 27, tintColor: focused ? '#000' : '#444' }}
                            />
                        </View>
                    ),
                    tabPress: (e) => {
                        e.preventDefault(); // Ngăn chặn hành động mặc định
                        setRefresh(prev => !prev); // Đảo ngược giá trị refresh để kích hoạt useEffect
                        navigation.navigate(route.name); // Điều hướng lại đến tab hiện tại
                    },
                })}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreens}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <View>

                            <Image source={{ uri: focused ? "https://cdn-icons-png.flaticon.com/512/3917/3917705.png" : "https://cdn-icons-png.flaticon.com/512/3917/3917546.png" }}
                                style={{ width: 27, height: 27, tintColor: focused ? '#000' : '#444' }}
                            />
                        </View>
                    ),
                })}
            />

        </Tab.Navigator>
    )
}

export default Tabs