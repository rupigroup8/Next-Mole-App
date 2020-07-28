import React from 'react';
import { I18nManager,ActivityIndicator} from 'react-native';
import {UtilityThemeProvider, Box} from 'react-native-design-utility';

import Navigation from './src/screens/index';



import {images} from './src/constant/images';
import {cacheImages} from './src/utils/cachImage';
import firebase from 'firebase';
import {FirebaseConfig} from './src/constant/ApiKeys';
//initializing firebase for auth + game managment
firebase.initializeApp(FirebaseConfig);

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

console.disableYellowBox = true;

export default class App extends React.Component {

  state ={
    isReady:false,
    notification: {},
  }
  async componentDidMount(){
    this.cacheAssets();
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
  }
  
  cacheAssets = async () =>{
    const imagesAssets = cacheImages(Object.values(images));
    await Promise.all([...imagesAssets]);
    this.setState({isReady:true});

  }

  render() {
    
    if (!this.state.isReady) {
      return(
        <Box f={1} center bg="white">
          <ActivityIndicator size="large"/>
        </Box>
      )
    }
    return (
      <UtilityThemeProvider>
        <Navigation  />
      </UtilityThemeProvider>
    );
  }
}

