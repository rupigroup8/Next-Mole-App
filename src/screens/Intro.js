import React from 'react';
import { StyleSheet } from 'react-native';
import AppIntroSlider from '../../node_modules/react-native-app-intro-slider/AppIntroSlider';
import App from '../../App';
import {images} from '../constant/images';

 
const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    resizeMode:'contain'
  },
  text:{
    fontSize: 21,
  },
  title:{
    fontSize: 50,
  }
});

const slides = [
  {
    key: 'Help4',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'Start a new game in one of the six categories Offered',
    image: images.screenshot3,
    imageStyle: styles.image,
    textStyle: styles.text,
    backgroundColor: '#22bcb5',
  },
  {
    key: 'Help1',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'Your Goal is to get from one Wikipedia article - your Source,\n To another article - your target.',
    image: images.screenshot1,
    imageStyle: styles.image,
    textStyle: styles.text,
    backgroundColor: '#59b2ab',
  },
  {
    key: 'Help2',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'In order to win the game,\nTry to get to the base article of your opponent in the\nshortest path and as fast as you can!',
    image: images.screenshot2,
    imageStyle: styles.image,
    textStyle: styles.text,
    backgroundColor: '#febe29',
  },
  {
    key: 'Help3',
    title: 'The Mole',
    titleStyle:styles.title,
    text: 'Don\'t know what article to choose from?\nNo problem! hit the "Change cards" button and get 3 new articles on your next turn.',
    image: images.screenshot4,
    imageStyle: styles.image,
    textStyle: styles.text,
    backgroundColor: '#22bcb5',
  },

];

class Intro extends React.Component {
  static navigationOptions = {
    header:null,
  }
  state = {
    showRealApp: false
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
  }
  render() {
    if (this.state.showRealApp) {
      return this.props.navigation.navigate('Profile');
    } else {
      return <AppIntroSlider slides={slides} onDone={this._onDone}/>;
    }
  }
}

export default Intro;