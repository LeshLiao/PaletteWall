import React from 'react';
import Home from './screens/Home'
import Detail from './screens/Detail'
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <ActionSheetProvider>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: 'black' },
              headerTintColor: 'white',
              headerShown: false // hide page title name
            }}>
            <Stack.Screen name="PaletteX" component={Home} />
            <Stack.Screen name="Preview" component={Detail} />
          </Stack.Navigator>
        </ActionSheetProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black', // Set the background color to black
  }
});
