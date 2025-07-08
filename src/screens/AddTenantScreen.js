import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { addTenant } from '../services/tenantService';

const AddTenantScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = async () => {
    try {
      await addTenant({ name, contact, roomId });
      Alert.alert("Tenant added successfully");
      setName('');
      setContact('');
      setRoomId('');
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Contact</Text>
      <TextInput value={contact} onChangeText={setContact} keyboardType="phone-pad" />
      <Text>Room ID</Text>
      <TextInput value={roomId} onChangeText={setRoomId} keyboardType="numeric" />
      <Button title="Add Tenant" onPress={handleSubmit} />
    </View>
  );
};

export default AddTenantScreen;
