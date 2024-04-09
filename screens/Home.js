import { StyleSheet, View, Image, Platform, ScrollView, TouchableOpacity, ImageBackground,Modal, TouchableWithoutFeedback} from 'react-native';
import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Menu from './Menu';
import TopFlatList from './TopFlatList'
import Video from 'react-native-video';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2358475138249813/5341581079';

export default function Home() {
  const [items, setItems] = useState([]);
  // const navigation = useNavigation(); // Get the navigation object
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [downloadList, setDownloadList] = useState('');
  const [photoType, setPhotoType] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [isPaused, setIsPaused] = useState(true);
  const [isFree, setIsFree] = useState(false);
  const videoRef = useRef();
  let timeoutID = useRef();

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

  useEffect(() => {
    getAllItems().then(items => setItems(items));
  }, []);

  const testCallBack = (index) => {
    if (index == 0)
      getItemsByTag('Painting').then(items => setItems(items));
    else if (index == 1)
      getItemsByTag('City').then(items => setItems(items));
    else if (index == 2)
      getAllStatic().then(items => setItems(items));
  }

  const handleImagePress = (imageUri, downloadList, photoType, freeDownload) => {
    // navigation.navigate('Preview', { imageUri, link });
    setModalImg(imageUri);
    setShowModal(true);
    setDownloadList(downloadList);
    setPhotoType(photoType);
    setIsFree(freeDownload);
    if(photoType === 'live') {
      setVideoLink(downloadList[1].link);
    }
  };

  const onLoad = (data) => {
    // console.log({ data });
    clearTimeout(timeoutID.current);
    if (videoRef.current) {
      timeoutID.current = setTimeout(() => {
        setIsPaused(false);
        // console.log('seek()')
        // Call the seek() method with the desired position
        videoRef.current.seek(0);
      }, 500);
    }
  };

  useEffect(() => {
    if(showModal === false) {
      // console.log('showModal false, clear timeout');
      clearTimeout(timeoutID.current);
      setIsPaused(true);
    }
  }, [showModal]);

  return (
    <>
      {/* <ScrollView contentContainerStyle={styles.scrollViewContent} bounces='false'> */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {Platform.OS === 'ios' && (<View style={styles.topBouncingBackground}/>)}
      <View><TopFlatList myFunc={testCallBack}/></View>
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
                  item.photoType,
                  item.freeDownload
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
                {!item.freeDownload && (
                  <Image
                    source={require('./images/diamond.png')}
                    style={styles.diamond}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </React.Fragment>
        ))}


        <Modal
          // animationType={'fade'}
          animationType={'slide'}
          transparent={true} // if set it false, sometimes will freeze.
          visible={showModal}
          onOverlayClick={() => { console.log('close...'); }}
          >

        { photoType === 'static' ?
        <ImageBackground source={{ uri: modalImg }} style={styles.imageBackground}>
          <View style={styles.menuContainer}>
            <Menu downloadList={downloadList} photoType={photoType} isFree={isFree}/>
          </View>
          <TouchableOpacity onPress={() => {setShowModal(false);}} style={styles.touch_back}>
            <Image
              source={require('./images/back_img.png')}
              style={styles.image_back}
              resizeMode="contain"
            />
          </TouchableOpacity>
            {/* {!isFree && (
              <Image
                source={require('./images/diamond.png')}
                style={styles.modalDiamond}
                resizeMode="contain"
              />
            )} */}
        </ImageBackground>
        :
        <>
        <Video source={{uri: videoLink}}
        // ref={(ref) => {
        //   this.player = ref
        // }}
        ref={videoRef}    // Store reference
        onLoad={onLoad}
        paused={isPaused} // Disable autoplay at begin
        rate={0.38}
        resizeMode={"cover"}
        style={styles.backgroundVideo}/>
          <View style={styles.menuContainer}>
            <Menu downloadList={downloadList} photoType={photoType} isFree={isFree}/>
          </View>
          <TouchableOpacity onPress={() => {setShowModal(false);}} style={styles.touch_back}>
            <Image
              source={require('./images/back_img.png')}
              style={styles.image_back}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>}
      </Modal>
      {Platform.OS === 'ios' && (<View style={styles.bottomBouncingBackground}/>)}
      </ScrollView>
    </>
  )
}

const spacerHeight = 1000;
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
    bottom: '7%',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  image_back: {
    width: 35,
    height: 35,
  },
  touch_back: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    opacity: 0.35,
    paddingRight: 50,
    paddingBottom: 50,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  BannerAdStyle: {
    // margin: 3,
  },
  backgroundVideo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Red with 50% opacity
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  topBouncingBackground: {
    backgroundColor: 'black',
    height: spacerHeight,
    position: 'absolute',
    top: -spacerHeight,
    left: 0,
    right: 0,
  },
  bottomBouncingBackground: {
    backgroundColor: 'black',
    height: spacerHeight,
    position: 'absolute',
    bottom: -spacerHeight,
    left: 0,
    right: 0,
  },
  diamond: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    opacity: 0.8,
    // borderWidth: 1,
    // borderColor: 'red',
    width: 30,
    height: 30,
  },
  modalDiamond: {
    position: 'absolute',
    left: 35,
    bottom: 50,
    opacity: 0.8,
    width: 50,
    height: 50,
  }
});
