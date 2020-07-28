import React, { Component } from 'react';
import { Container, View, Button,Icon, Fab } from 'native-base';

export default class FABPaths extends Component {

  goToPathsScreen = ()=>{
    this.props.GoToScreen('Paths');
  }
  render() {
    return (  
      //<Container>
        <View style={{ flex: 1 }}>
          <Fab
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#8BBA99' }}
            position="bottomLeft"
            onPress={this.goToPathsScreen}>
            <Icon name="ios-infinite" />
          </Fab>
        </View>
     // </Container>
    );
  }
}
