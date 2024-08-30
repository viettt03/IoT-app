import { View, Text, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import Table2 from './Screens/Table2';
import ProfileScreens from './Screens/ProfileScreens';
import Table from './Screens/Table';
import DateTimePickerExample from './Screens/DateTimePickerExample ';
import Example from './Screens/DateTimePickerExample ';


type Props = {}

const Tab = createBottomTabNavigator();

const Tabs = (props: Props) => {
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
                name="Table1"
                component={Table}
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
                name="Table2"
                component={Table2}
                options={({ route }) => ({

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