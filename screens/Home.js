import {
  View,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,Modal,
  TouchableWithoutFeedback
} from 'react-native';
import React, { useEffect, useState, useRef} from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Menu from './Menu';
import TopFlatList from './TopFlatList'
import ModalContent from '../component/ModalContent'
import Video from 'react-native-video';
import { getAllItems, getAllStatic, getItemsByTag} from '../service/dataService'

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2358475138249813/5341581079';

export default function Home() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [downloadList, setDownloadList] = useState('');
  const [photoType, setPhotoType] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [isPaused, setIsPaused] = useState(true);
  const [isFree, setIsFree] = useState(false);
  const videoRef = useRef();
  let timeoutID = useRef();

  useEffect(() => {
    getAllItems().then(items => setItems(items));
  }, []);

  const testCallBack = (index) => {
    if (index == 0) {
      // getAllStatic().then(items => setItems(items));
      getAllStatic()
      .then(items => {
        // Sort items by itemId in descending order
        items.sort((a, b) => b.itemId.localeCompare(a.itemId))
        // Get only the first 12 items
        const newItems = items.slice(0, 12)
        setItems(newItems)
      })
      .catch(error => console.error('Error fetching items:', error))
    } else if (index == 1) {
      getItemsByTag('Anime').then(items => setItems(items));
    } else if (index == 2) {
      getItemsByTag('Painting').then(items => setItems(items));
    } else if (index == 3) {
      getItemsByTag('City').then(items => setItems(items));
    }
  }

  const handleImagePress = (imageUri, downloadList, photoType, freeDownload) => {
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
    clearTimeout(timeoutID.current);
    if (videoRef.current) {
      timeoutID.current = setTimeout(() => {
        setIsPaused(false);
        // Call the seek() method with the desired position
        videoRef.current.seek(0);
      }, 250);
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
          <ModalContent
            downloadList={downloadList}
            photoType={photoType}
            isFree={isFree}
            modalImg={modalImg}
            setShowModal={setShowModal}
          />
        </ImageBackground>
        :
        <View style={styles.videoBackground}>
          <Video source={{uri: videoLink}}
          // ref={(ref) => {
          //   this.player = ref
          // }}
          ref={videoRef}    // Store reference
          onLoad={onLoad}
          paused={isPaused} // Disable autoplay at begin
          rate={0.38}
          resizeMode={"cover"}
          style={styles.previewVideo}/>
          {/* <View style={styles.menuContainer}>
            <Image source={require('./images/smartphone.png')} style={styles.image_back} resizeMode="contain"/>
            <Menu downloadList={downloadList} photoType={photoType} isFree={isFree}/>
            <View style={styles.buttonLike}/>
          </View>
          <TouchableOpacity onPress={() => {setShowModal(false);}} style={styles.touch_back}>
            <Image
              source={require('./images/back_img.png')}
              style={styles.image_back}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
          <ModalContent
            downloadList={downloadList}
            photoType={photoType}
            isFree={isFree}
            modalImg={modalImg}
            setShowModal={setShowModal}
          />
        </View>}
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
    aspectRatio: 9 / 19, // Adjusted to 9:16 ratio
    // borderRadius: 10, // Rounded corners for images
  },
  modal: {
    flex: 1,
    alignContent:'center',
    backgroundColor: '#00ff00',
    padding: 100
  },
  BannerAdStyle: {
    // margin: 3,
  },
  imageBackground: {
    // backgroundColor:'#000',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Red with 50% opacity
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewVideo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Red with 50% opacity
    position: 'absolute',
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
    width: 30,
    height: 30,
  },
});
