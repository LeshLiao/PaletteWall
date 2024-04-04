import { StyleSheet, View, Image, Platform, ScrollView, Text , Button, Linking, TouchableOpacity, NativeModules, ImageBackground,Modal, TouchableWithoutFeedback,Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Menu from './Menu';
import TopFlatList from './TopFlatList'
import { saveLivePhoto } from '../service/MediaFunctions';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2358475138249813/5341581079';

export default function Home() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation(); // Get the navigation object
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [downloadList, setDownloadList] = useState('');
  const [photoType, setPhotoType] = useState('');

  axios.defaults.baseURL = 'https://online-store-service.onrender.com';

  const getAllItems = async () => {
    const { data } = await axios.get('/api/items');
    return data;
  };

  const getItemsByTag = async tag => {
    const { data } = await axios.get('/api/items/tag/' + tag)
    return data
  }

  const getAllStatic = async () => {
    const { data } = await axios.get('/api/items/photoType/live')
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
      getAllStatic().then(items => setItems(items));

    console.log('testCallBack()='+index);
  }

  const downloadLivePhoto = async () => {
    let imageUrl = 'https://firebasestorage.googleapis.com/v0/b/palettex-37930.appspot.com/o/images%2Fitems%2F200001%2F5983a8ec-e2ed-45b8-af01-3223c91221e7IMB_jF4Z8r.HEIC?alt=media&token=8702ddfa-53bb-4f77-b68f-577b83d51014';

    let videoUrl = 'https://firebasestorage.googleapis.com/v0/b/palettex-37930.appspot.com/o/images%2Fitems%2F200001%2F27b8d278-a26f-4878-b5c2-88b52d039e14IMB_jF4Z8r.MOV?alt=media&token=8e3ccb03-47f2-4ba4-a9c2-2c10ff72b0ee';

    await saveLivePhoto(imageUrl,videoUrl);
  };

  const handleImagePress = (imageUri, downloadList, photoType) => {
    // navigation.navigate('Preview', { imageUri, link });
    setModalImg(imageUri);
    setShowModal(true);
    setDownloadList(downloadList);
    setPhotoType(photoType);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollViewContent} bounces='false'>
      <View><TopFlatList myFunc={testCallBack}/></View>

      {/* <View>
        <Button
          title="Download Live Photo"
          onPress={downloadLivePhoto}
          color="#999"
        />
      </View> */}

      {items.map((item, index) => (
          <React.Fragment key={index}>
            {index % 10 === 0 && index !== 0 && (
              <View style={styles.BannerAdStyle}>
                <BannerAd
                  unitId={adUnitId}
                  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                />
              </View>
            )}
            <TouchableWithoutFeedback
              onPress={() =>
                handleImagePress(
                  item.thumbnail.includes("https")
                    ? item.thumbnail
                    : `https://www.palettex.ca/images/items/${item.itemId}/${item.thumbnail}`,
                  item.downloadList,
                  item.photoType
                )
              }
            >
              <View style={styles.itemContainer}>
                <Image
                  source={{
                    uri: item.thumbnail.includes("https")
                      ? item.thumbnail
                      : `https://www.palettex.ca/images/items/${item.itemId}/${item.thumbnail}`,
                  }}
                  style={styles.thumbnail}
                  resizeMode="cover" // Adjust resizeMode as needed
                />
              </View>
            </TouchableWithoutFeedback>
          </React.Fragment>
        ))}

        <Modal
          animationType={'fade'}
          // animationType={'slide'}
          transparent={true} // if set false, sometimes will freeze.
          visible={showModal}
          onRequestClose={() => {
              console.log('close....')
        }}>

        <ImageBackground source={{ uri: modalImg }} style={styles.imageBackground}>
          <View style={styles.menuContainer}>
            <Menu downloadList={downloadList} photoType={photoType}/>
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
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  itemContainer: {
    width: '50%', // Adjust the width as per your layout
    // marginVertical: '0.66%',
    // paddingHorizontal: '0.66%',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 9 / 18, // Adjusted to 9:16 ratio
    // borderRadius: 10, // Rounded corners for images
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
    top: 80,
    left: 20,
    opacity: 0.35,
    // borderWidth: 1,
    // borderColor: 'red',
    paddingRight: 50,
    paddingBottom: 50,
  },
  BannerAdStyle: {
    // margin: 3,
  }
});
