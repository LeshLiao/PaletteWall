// import React from "react";
import React, { useState } from 'react';
import { Dimensions, View,Image, StyleSheet ,FlatList,TouchableHighlight } from 'react-native';

export default function TopFlatList({ myFunc }) {
  const width = Dimensions.get('window').width * 0.85;
  const height = width * 0.36;

  const testFunc = (index) => {
    console.log('testFunc');
    console.log(index);
    myFunc(index);
  }

  const [images] = useState([
    require('./images/0.jpg'),
    require('./images/1.jpg'),
    require('./images/2.jpg'),
    require('./images/3.jpg'),
    require('./images/4.jpg')
  ]);

  return (
    <FlatList
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    data={images}
    renderItem={ ({ item, index }) => (
        <TouchableHighlight
        key={item.key}
        onPress={() => testFunc(index)}
        style={{
            width: width,
            height: height,
            margin: 5
          }}
        >
        <Image source={item}
            key={index}
            style={{
              width: '100%',
              height: height,
              borderRadius: 10,
              // borderWidth:2,
              // borderColor:'#d35647',
              objectFit: 'fill',
            }}
          />
      </TouchableHighlight>
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
