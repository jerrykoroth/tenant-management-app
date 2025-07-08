import React from 'react';
import { View, Button } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <Button title="Add Tenant" onPress={() => navigation.navigate('AddTenant')} />
      <Button title="View Tenants" onPress={() => navigation.navigate('TenantList')} />
    </View>
  );
};

export default DashboardScreen;
