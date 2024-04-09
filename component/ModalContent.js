import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Menu from '../screens/Menu';

export default function ModalContent({ downloadList, photoType, isFree, modalImg, setShowModal }) {
  return (
    <ImageBackground source={{ uri: modalImg }} style={styles.imageBackground}>
      <TouchableOpacity onPress={() => setShowModal(false)} style={styles.back_container}>
        <Image
          source={require('../screens/images/back_img.png')}
          style={styles.image_back}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.menuContainer}>
        <Menu downloadList={downloadList} photoType={photoType} isFree={isFree} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    backgroundColor: '#000',
    flex: 1,
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  image_back: {
    width: 35,
    height: 35,
  },

  back_container: {
    flex: 8,
    // position: 'absolute',
    top: '10%',
    // height: '70%',  // 80% on the top is touch_back area.
    // left: '5%',
    width: '90%',
    opacity: 0.35,
    paddingRight: 50,
    paddingBottom: 50,
    borderWidth: 1,
    borderColor: 'red',
  },
  menuContainer: {
    // position: 'absolute',
    bottom: '7%',
    // top: 0,
    // left: 0,
    // right: 0,
    // height: 100,
    width: '80%',
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    borderWidth: 1,
    borderColor: 'blue',

  },
});
