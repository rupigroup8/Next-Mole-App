import React, { Component } from 'react';
import { Container, Header, View, Button,Icon, Fab } from 'native-base';


export default class FABSettings extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  goToIntro = ()=>{
    this.props.GoToScreen('Intro');
  }
  goToSettings = ()=>{
    this.props.GoToScreen('Settings');
  }
  render() {
    return (  
      //<Container>
        <View style={{ flex: 1 }}>
          <Fab 
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#AC98D3',fontSize:25 }}
            position="bottomLeft"
            onPress={this.goToIntro}>
            <Icon name="ios-help-buoy" />
          </Fab>
        </View>
      //</Container>
    );
  }
}
