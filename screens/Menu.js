import {Button,StyleSheet,TouchableOpacity,Image,View,ActivityIndicator,Alert} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import React, { useEffect, useState } from 'react';
import { saveStaticPhoto, saveLivePhoto } from '../service/MediaFunctions';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2358475138249813/8159531709';

const rewarded = RewardedAd.createForAdRequest(
  adUnitId, {
  keywords: ['wallpaper', 'joy'],
});

export default function Menu({downloadList, photoType, isFree}){
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
        console.log('photoType=' + photoType);
        if (photoType === 'static') saveStaticPhoto(downloadList[0].link);
        if (photoType === 'live') saveLivePhoto(downloadList[0].link, downloadList[1].link);
        setButtonVisible(false);
      },
    );

    // Unsubscribe from events on unmount
    return () => {
      // console.log('unmount===')
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const onPress = () => {
    console.log('onPress()')

    let options = [];
    let goPremiumIndex = 0;
    let cancelIndex = 1;

    // No Premium Version
    options = ['Watch Ads', 'Cancel'];
    showActionSheetWithOptions({
      options,
      cancelButtonIndex: cancelIndex,
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
            console.log('Watch Ads');
            setPress(true);
            rewarded.load();
          break;
        case cancelIndex:
          console.log('Cancel');
          break;
      }
    });

    /*
    if (isFree === true) {
      options = ['Watch Ads', 'Go Premium', 'Cancel'];
      goPremiumIndex = 1;
      cancelIndex = 2;
    } else {
      options = ['Go Premium', 'Cancel'];
    }

    showActionSheetWithOptions({
      options,
      cancelButtonIndex: cancelIndex,
    }, (selectedIndex) => {
      switch (selectedIndex) {
        case 0:
          if (isFree === true) {
            console.log('Watch Ads');
            setPress(true);
            rewarded.load();
          } else {
            console.log('Go Premium');
            Alert.alert('', 'Premium features are currently unavailable.');
          }
          break;
        case goPremiumIndex:
          console.log('Go Premium');
          Alert.alert('', 'Premium features are currently unavailable.');
          break;
        case cancelIndex:
          console.log('Cancel');
          break;
        default:
          break;
      }
    });
    */
  }

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
            {isFree ?
              <Image
              source={require('./images/download2.png')}
              style={styles.download_image}
              resizeMode="contain"
            />
            :
            <Image
              source={require('./images/p2.png')}
              style={styles.p_image}
              resizeMode="contain"
            />
            }
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
  download_image: {
    width: 45,
    height: 43,
    opacity: 0.7,
  },
  p_image: {
    width: 42,
    height: 39,
    opacity: 0.9,
  },
});