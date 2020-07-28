import { FlatGrid } from 'react-native-super-grid';
import React,{Component} from 'react';
import {View,StyleSheet,Text,ImageBackground} from 'react-native';
import {Button,Icon} from 'native-base';
import NetworkHeader from '../common/NetworkHeader';
import BannerMole from "../common/BannerMole";

import {images} from '../constant/images';

export default class BombShop extends Component{
    static navigationOptions = ({ navigation }) =>{
        return{
        headerTitle:"The Bomb shop!",
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#4D5F66',fontSize:20 },
        headerLeft: 
         ( <Button
            onPress={()=>navigation.navigate('Profile')}
            style={{backgroundColor:"transparent"}}>
              <Icon style={{color:"#4D5F66",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
         ),
        }
      }
      render() {
        const items = [
          { name: '1 BOMB', code: '#1abc9c' ,image:images.bomb1}, 
          { name: '3 BOMBS', code: '#3498db',image:images.bomb3 },
          { name: '5 BOMBS', code: '#34495e' ,image:images.bomb5},
          { name: '7 BOMBS', code: '#27ae60' ,image:images.bomb7},
        ];
    
        return (
        <View flex={1}>
          <BannerMole title={'The more bombs you take, the better deal you get.'}/>
          <FlatGrid
            itemDimension={130}
            items={items}
            style={styles.gridView}
            //staticDimension={300}
            // fixed
            spacing={20}
            renderItem={({ item, index }) => (
              <ImageBackground source={item.image} style={{ flex: 1 }} resizeMode='contain'>
                <View style={[styles.itemContainer,{borderStyle:'solid',bordeeWidth:2}]}>
                </View>
              </ImageBackground>
            )}
          />
          </View>
        );
    }
}
const styles = StyleSheet.create({
    gridView: {
      marginTop: 20,
      flex: 1,
    },
    itemContainer: {
      justifyContent: 'flex-end',
      borderRadius: 5,
      padding: 10,
      height: 150,
    },
    itemName: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
  });