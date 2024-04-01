import { StyleSheet, View, Image, Platform, ScrollView, Text , Button, Linking, TouchableOpacity, NativeModules, ImageBackground,Modal, TouchableWithoutFeedback,Dimensions} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Menu from './Menu';
import TopFlatList from './TopFlatList'

export default function Home() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation(); // Get the navigation object
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  let varMyImage = '';
  let varMyVideo = '';

  axios.defaults.baseURL = 'https://online-store-service.onrender.com';

  const getAllItems = async () => {
    const { data } = await axios.get('/api/items');
    return data;
  };

  const getItemsByTag = async tag => {
    const { data } = await axios.get('/api/items/tag/' + tag)
    return data
  }

  const {CustomMethods} = NativeModules;

  useEffect(() => {
    getAllItems().then(items => setItems(items));
  }, []);

  const testCallBack = (index) => {
    if (index == 0)
      getItemsByTag('Landscape').then(items => setItems(items));
    else if (index == 1)
      getItemsByTag('City').then(items => setItems(items));
    else if (index == 2)
      getItemsByTag('Anime').then(items => setItems(items));

    console.log('testCallBack()='+index);
  }

  const downloadLivePhoto = async () => {
    const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/palettex-37930.appspot.com/o/digital_file%2FE5712677-FC33-494F-93BB-A525A183C659.HEIC?alt=media&token=2f53a02b-1520-4d40-a9ac-99b5c20b9e0b'; // URL or path to the still image
    const videoUrl = 'https://firebasestorage.googleapis.com/v0/b/palettex-37930.appspot.com/o/digital_file%2FE5712677-FC33-494F-93BB-A525A183C659.MOV?alt=media&token=c9a6bd75-59ac-48e5-900f-4e03dab70270'; // URL or path to the video file

    const imageUri = await saveToCameraRoll(imageUrl,videoUrl);
    // const videoUri = await saveVideo(videoUrl);
  };

  const testNativeModule = () => {
    console.log('call testNativeModule()');
    CustomMethods.MyMethod('this is test');
    console.log('varMyImage='+varMyImage);
    console.log('varMyVideo='+varMyVideo);
    CustomMethods.combineImage(varMyImage, varMyVideo);
    alert('Live photo saved!');
  }

  const saveToCameraRoll = async (image, video) => {
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
          varMyImage = uri;
          // MediaLibrary.saveToLibraryAsync(uri);
          // alert('Photo Saved to photos');
          saveVideo(video);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert('Requires camera roll permission');
    }
  };

  const saveVideo = async (video) => {
    let cameraPermissions = await MediaLibrary.getPermissionsAsync();
    if (cameraPermissions.status !== 'granted') {
      cameraPermissions = await MediaLibrary.requestPermissionsAsync();
    }

    if (cameraPermissions.status === 'granted') {
      FileSystem.downloadAsync(
        video,
        FileSystem.documentDirectory + 'E5712677-FC33-494F-93BB-A525A183C659.MOV'
      )
        .then(({ uri }) => {
          console.log('video uri='+uri);
          varMyVideo = uri;
          // MediaLibrary.saveToLibraryAsync(uri);
          testNativeModule();
          // alert('Video Saved to photos');
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert('Requires camera roll permission');
    }
  };

  const handleImagePress = (imageUri, link) => {
    // navigation.navigate('Preview', { imageUri, link });
    setModalImg(imageUri);
    setShowModal(true);
    setDownloadLink(link);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollViewContent} bounces='false'>

      {/* <BannerAd unitId={"ca-app-pub-2358475138249813/5341581079"}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}/> */}

      <View><TopFlatList myFunc={testCallBack}/></View>

      {/* <View>
        <Button
          title="Download Live Photo"
          onPress={downloadLivePhoto}
          color="#333"
        />
      </View> */}

      {items.map((item, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => handleImagePress(
            item.thumbnail.includes('https')
              ? item.thumbnail
              : `https://www.palettex.ca/images/items/${item.itemId}/${item.thumbnail}`,
            item.downloadList[0].link
          )}>
          <View style={styles.itemContainer}>
            <Image
              source={{
                uri: item.thumbnail.includes('https')
                  ? item.thumbnail
                  : `https://www.palettex.ca/images/items/${item.itemId}/${item.thumbnail}`,
              }}
              style={styles.thumbnail}
              resizeMode="cover" // Adjust resizeMode as needed
            />
          </View>
        </TouchableWithoutFeedback>
      ))}

        <Modal
          animationType={'fade'}
          // animationType={'none'}
          transparent={false}
          visible={showModal}
          onRequestClose={() => {
              console.log('close....')
        }}>

        <ImageBackground source={{ uri: modalImg }} style={styles.imageBackground}>
          <View style={styles.menuContainer}>
            <Menu link={downloadLink}/>
          </View>
          <TouchableOpacity onPress={() => {setShowModal(false);}} style={styles.touch_back}>
            <Image
              source={require('./images/back_img.png')}
              style={styles.image_back}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ImageBackground>
      </Modal>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollViewContent: {
    backgroundColor: '#000',
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    justifyContent: "center",
    paddingVertical: 10,
  },
  itemContainer: {
    width: '49%', // Adjust the width as per your layout
    marginVertical: '0.66%',
    paddingHorizontal: '0.66%',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 9 / 18, // Adjusted to 9:16 ratio
    borderRadius: 10, // Rounded corners for images
  },
  modal: {
    flex: 1,
    alignContent:'center',
    backgroundColor: '#00ff00',
    padding: 100
  },
  imageBackground: {
    backgroundColor:'#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  image_back: {
    width: 35,
    height: 35,
  },
  touch_back: {
    position: 'absolute',
    top: 60,
    left: 20,
    opacity: 0.35,
  }
});
