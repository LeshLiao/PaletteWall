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

export default function Menu({downloadList, photoType}){
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
          <TouchableOpacity onPress={onPress} style={styles.touch}>
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
    width: 45,
    height: 45,
    opacity: 0.8,
  },
  touch: {
    marginBottom: 20,
  },
});