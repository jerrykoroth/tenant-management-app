import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

const LoadingOverlay = ({ 
  visible = false, 
  message = 'Loading...', 
  transparent = true,
  size = 'large',
  color = '#2196F3' 
}) => {
  return (
    <Modal
      transparent={transparent}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size={size} color={color} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
});

export default LoadingOverlay;