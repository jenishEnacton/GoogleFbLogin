import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Home from '../googleSignIn/Home';
import SignIn from '../googleSignIn/SignIn';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
