// import React from "react";
import React, { useState } from 'react';
import { Dimensions, View,Image, StyleSheet ,FlatList } from 'react-native';

export default function TopFlashList() {
  const width = Dimensions.get('window').width * 0.85;

  const [images] = useState([
    require('./images/1.jpg'),
    require('./images/2.jpg'),
    require('./images/3.jpg')
  ]);

  return (
    <FlatList
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    data={images}
    renderItem={ ({ item, index }) => (
      <View style={{
        width: width,
        height: 100,
        margin: 5
      }}>
        <Image source={item} /* Use item to set the image source */
          key={index} /* Important to set a key for list items,
                         but it's wrong to use indexes as keys, see below */
          style={{
            // width: width,
            width: '100%',
            height: 100,
            borderRadius: 10,
            // borderWidth:2,
            // borderColor:'#d35647',
            objectFit: 'fill',
            // objectFit: 'cover',
            // resizeMode: 'cover',
          }}
        />
      </View>
    )}
  />
  );
}

const styles = StyleSheet.create({
  CarouselItem: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  img: {
    width: '100%',
    height:'100%'
  }
})
