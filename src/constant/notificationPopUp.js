import React from 'react';
import { View } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';

import {images} from '../constant/images';


export default class NotificationPopupToShow extends React.Component{
  componentDidMount(){
    this.ShowPopUp();
  }

  ShowPopUp = ()=>{
    this.popup.show({
      onPress: function() {console.log('Pressed')},
      appIconSource:images.logo,
      appTitle: this.props.title,
      timeText: 'Now',
      title: this.props.category && ((this.props.category==="FILMS"?"Movies":this.props.category) + " new game created!"),
      body:this.props.body && (this.props.body + '😀'),
    });
  }

  render() {
    return (
      <View style={{zIndex:140}}>
        <NotificationPopup ref={ref => this.popup = ref} />
      </View>
    );
  }
}