import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ 
  children, 
  style, 
  onPress, 
  elevation = 2, 
  margin = 8, 
  padding = 16,
  backgroundColor = '#FFFFFF' 
}) => {
  const cardStyle = [
    styles.card,
    {
      elevation,
      margin,
      padding,
      backgroundColor,
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: '#000',
  },
});

export default Card;