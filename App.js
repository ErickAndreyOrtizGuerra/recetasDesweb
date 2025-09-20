import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from './screens/MenuScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6C63FF',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ title: 'Recetas Deliciosas' }}
        />
        <Stack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen} 
          options={{ title: 'Receta Sorpresa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
