import React from 'react';
import { View, Image, StyleSheet, Dimensions,ImageBackground, Text,StatusBar } from 'react-native';
import Menu from './Menu';

const { width, height } = Dimensions.get('window');

export default function Detail({ route }) {
  const { imageUri, link } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.menuContainer}>
        <Menu link={link}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Optional: Set background color to black for full screen effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: width,
    height: height,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end', // Adjust as needed
    alignItems: 'center', // Adjust as needed
    marginBottom: 35, // Adjust as needed to leave space from the bottom
  }
});
