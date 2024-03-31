import {Button,StyleSheet,TouchableOpacity,Image,View,ActivityIndicator} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const rewarded = RewardedAd.createForAdRequest(
  'ca-app-pub-2358475138249813/8159531709', {
  keywords: ['fashion', 'clothing'],
});

export default function Menu({link}){
  const { showActionSheetWithOptions } = useActionSheet();
  const [loaded, setLoaded] = useState(false);
  const [press, setPress] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED, () => {
      console.log('effect setLoaded(true);');
      setLoaded(true);
      console.log('effect rewarded.show();');
      rewarded.show();
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        console.log('link='+link);
        saveToCameraRoll(link);
        setButtonVisible(false);
      },
    );

    // Unsubscribe from events on unmount
    return () => {
      console.log('unmount===')
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const onPress = () => {
    console.log('onPress=======')
    const options = ['Watch Ads', 'Go Premium', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case destructiveButtonIndex:
          console.log('Watch Ads');
          setPress(true);
          rewarded.load();
          // rewarded.show();
          break;
        case 1:
          console.log('Go Premium');
          break;
        case cancelButtonIndex:
          console.log('Cancel');
      }});
  }

  const saveToCameraRoll = async (image) => {
    let cameraPermissions = await MediaLibrary.getPermissionsAsync();
    if (cameraPermissions.status !== 'granted') {
      cameraPermissions = await MediaLibrary.requestPermissionsAsync();
    }

    if (cameraPermissions.status === 'granted') {
      FileSystem.downloadAsync(
        image,
        FileSystem.documentDirectory + 'E5712677-FC33-494F-93BB-A525A183C659.HEIC'
      )
        .then(({ uri }) => {
          console.log('img uri='+uri);
          MediaLibrary.saveToLibraryAsync(uri);
          alert('Download Succeeded!')
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert('Requires camera roll permission');
    }
  };

  // No advert ready to show yet
  // if (!loaded) {
  //   return null;
  // }

  return (
    buttonVisible ? (
      <View style={styles.container}>
        {press ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity onPress={onPress}>
            <Image
              source={require('./images/cloud_download.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    ) : null
  );
};

const styles = StyleSheet.create({
  container: {
    // Add styles as needed
  },
  image: {
    width: 50,
    height: 50,
  },
});