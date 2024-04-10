import React, { useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Menu from '../screens/Menu';

export default function ModalContent({ downloadList, photoType, isFree, modalImg, setShowModal }) {
  const [showLock, setShowLock] = useState(false);

  const showLockScreen = (lock) => {
    setShowLock(lock);
  }

  const closeScreen = () => {
    if (showLock == false) {
      setShowModal(false);
    }
    setShowLock(false);
  }

  return (
    <>
      { showLock ?
        <TouchableOpacity onPress={() => {showLockScreen(false);}}>
          <Image source={require('../screens/images/lock_text_2.png')} style={styles.lockScreen} resizeMode="contain"/>
        </TouchableOpacity>
      :
        <>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => {showLockScreen(true);}}>
            <Image source={require('../screens/images/smartphone.png')} style={styles.image_back} resizeMode="contain"/>
          </TouchableOpacity>
          <Menu downloadList={downloadList} photoType={photoType} isFree={isFree}/>
          <View style={styles.buttonLike}/>
        </View>
        <TouchableOpacity onPress={() => {closeScreen();}} style={styles.touch_back}>
        <Image
          source={require('../screens/images/back_img.png')}
          style={styles.image_back}
          resizeMode="contain"
          />
        </TouchableOpacity>
        </>
      }
    </>
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
  buttonLike: {
    width: 35,
    height: 35,
  },
  touch_back: {
    position: 'absolute',
    top: '10%',
    height: '70%',  // 80% on the top is touch_back area.
    left: '5%',
    width: '90%',
    opacity: 0.35,
    paddingRight: 50,
    paddingBottom: 50,
    // borderWidth: 1,
    // borderColor: 'blue',
  },
  menuContainer: {
    position: 'absolute',
    bottom: '6%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 20,
    // backgroundColor: '#555',
    opacity: 0.7,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  lockScreen: {
    flex:1,
    opacity:0.8,
  }
});
