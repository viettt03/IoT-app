/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/Tabs';
import { Provider } from './src/Context/Context';
const Stack = createStackNavigator();
function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <Provider>
        <Stack.Navigator>
          <Stack.Screen name="Main" options={{ headerShown: false }} component={Tabs} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}


export default App;
