import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { getTenants } from '../services/tenantService';

const TenantListScreen = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getTenants();
        setTenants(data);
      } catch (err) {
        console.error('Error fetching tenants:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, borderBottomWidth: 1, paddingBottom: 5 }}>
            <Text>Name: {item.name}</Text>
            <Text>Contact: {item.contact}</Text>
            <Text>Room ID: {item.roomId}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TenantListScreen;
