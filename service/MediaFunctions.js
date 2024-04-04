import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { NativeModules, Alert } from 'react-native';

const { CustomMethods } = NativeModules;

export const saveLivePhoto = async (image, video) => {
  let varMyImage = '';
  let varMyVideo = '';

  const saveVideo = async (video) => {
    let cameraPermissions = await MediaLibrary.getPermissionsAsync();
    if (cameraPermissions.status !== 'granted') {
      cameraPermissions = await MediaLibrary.requestPermissionsAsync();
    }

    if (cameraPermissions.status === 'granted') {
      FileSystem.downloadAsync(
        video,
        FileSystem.documentDirectory + 'temp.MOV'
      )
        .then(({ uri }) => {
          console.log('video uri=' + uri);
          varMyVideo = uri;
          saveNativeModule(varMyImage, varMyVideo);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert('Requires camera roll permission');
    }
  };

  const saveNativeModule = (varMyImage, varMyVideo) => {
    console.log('call testNativeModule()');
    CustomMethods.MyMethod('this is test');
    console.log('varMyImage=' + varMyImage);
    console.log('varMyVideo=' + varMyVideo);

    CustomMethods.combineImage(varMyImage, varMyVideo)
      .then(response => {
        console.log('Success:', response);
        Alert.alert('', 'Live photo saved! Success:' + response);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error:' + error);
      });
  };

  let cameraPermissions = await MediaLibrary.getPermissionsAsync();
  if (cameraPermissions.status !== 'granted') {
    cameraPermissions = await MediaLibrary.requestPermissionsAsync();
  }

  if (cameraPermissions.status === 'granted') {
    FileSystem.downloadAsync(
      image,
      FileSystem.documentDirectory + 'temp.HEIC'
    )
      .then(({ uri }) => {
        console.log('img uri=' + uri);
        varMyImage = uri;
        saveVideo(video);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    alert('Requires camera roll permission');
  }
};

export const saveStaticPhoto = async (image) => {
  let cameraPermissions = await MediaLibrary.getPermissionsAsync();
  if (cameraPermissions.status !== 'granted') {
    cameraPermissions = await MediaLibrary.requestPermissionsAsync();
  }

  if (cameraPermissions.status === 'granted') {
    FileSystem.downloadAsync(
      image,
      FileSystem.documentDirectory + 'temp.HEIC'
    )
      .then(({ uri }) => {
        console.log('img uri='+uri);
        MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('','Download Succeeded!');
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    alert('Requires camera roll permission');
  }
};