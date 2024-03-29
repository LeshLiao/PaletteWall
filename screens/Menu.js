import {Button,StyleSheet,TouchableOpacity,Image} from 'react-native';
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

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        console.log('link='+link);
        saveToCameraRoll(link);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const onPress = () => {
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
          rewarded.show();
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


  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={require('./images/cloud_download.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});