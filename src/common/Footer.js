import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base';
import {ImageBackground} from 'react-native';
import {images} from '../constant/images';
import { StyleSheet} from 'react-native';

export default class FooterNavigator extends Component {
  GoBack = ()=>{
    this.props.BackOrSave('Back');
  }
  GoSave = ()=>{
    //save prefferences to DB
    //go back to profile if saves uploded successfuly
    alert('Changes been saved!');
    this.props.BackOrSave('Save');
  }
  render() {
    return (
      <Container >
        <Content />
        <Footer >
        <ImageBackground source={images.network} style={{width: '100%', height:80}}>
          <FooterTab>
              <Button vertical onPress={this.GoBack}>
                <Icon style={styles.iconStyle} name="ios-arrow-back" />
                <Text style={styles.textStyle}>Back</Text>
              </Button>
              <Button vertical onPress={this.GoSave}>
                <Icon style={styles.iconStyle} name="ios-save" />
                <Text style={styles.textStyle}>Save</Text>
              </Button>
          </FooterTab>
          </ImageBackground>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  iconStyle:{
    color:'black',
    fontSize:35
  },
  textStyle:{
    fontSize:15,
    fontWeight:'bold',
    color:'black'
  }
})