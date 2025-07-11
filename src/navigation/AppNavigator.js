import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TenantListScreen from '../screens/TenantListScreen';
import AddTenantScreen from '../screens/AddTenantScreen';
import RoomManagementScreen from '../screens/RoomManagementScreen';
import PaymentTrackingScreen from '../screens/PaymentTrackingScreen';
import ReportsScreen from '../screens/ReportsScreen';
import HostelManagementScreen from '../screens/HostelManagementScreen';
import TenantDetailsScreen from '../screens/TenantDetailsScreen';
import CheckInOutScreen from '../screens/CheckInOutScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import AddPaymentScreen from '../screens/AddPaymentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Tenants') {
            iconName = 'people';
          } else if (route.name === 'Rooms') {
            iconName = 'hotel';
          } else if (route.name === 'Payments') {
            iconName = 'payment';
          } else if (route.name === 'Reports') {
            iconName = 'assessment';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tenants" component={TenantListScreen} />
      <Tab.Screen name="Rooms" component={RoomManagementScreen} />
      <Tab.Screen name="Payments" component={PaymentTrackingScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddTenant" component={AddTenantScreen} />
      <Stack.Screen name="TenantDetails" component={TenantDetailsScreen} />
      <Stack.Screen name="CheckInOut" component={CheckInOutScreen} />
      <Stack.Screen name="HostelManagement" component={HostelManagementScreen} />
      <Stack.Screen name="AddRoom" component={AddRoomScreen} />
      <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
