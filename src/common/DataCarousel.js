import Carousel from 'react-native-snap-carousel';
import React,{ Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    slide:{
      
      alignItems:'center',
      borderStyle:'solid',
      borderColor:'grey',
      height:200,
      width:200,
      backgroundColor:'green',
    },
    itemTitle:{
      alignItems:'center',
      fontSize:20,
      color:'white',
    },
  })

export class MyCarousel extends Component {
    state ={
        //the entries will be passed from data
        entries:[
            title='Wins',
            title='Cash Mole',
            title='Bombs',
        ]
    }
    _renderItem ({item, index}) {
        //alert(item);
        return (
            <View style={styles.slide}>
                <Text style={styles.itemTitle}>{ item.title }</Text>
            </View>
        );
    }

    render () {
        return (
            <Carousel
              layout={'stack'}
              ref={(c) => { this._carousel = c; }}
              data={this.state.entries}
              renderItem={this._renderItem}
              sliderWidth={200}
              itemWidth={150}
            />
        );
    }
}