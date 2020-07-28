import React, { Component } from 'react';
import { Container, Header, View, Button, Icon, Fab } from 'native-base';
export default class FABStartGame extends Component {
  constructor(props) {
  super(props)
    this.state = {
      active: false
    };
  }
  render() {
    return (  
      <Container backgroundColor="white">
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#8BBAE3'}}
            position="bottomRight"
            onPress={() => this.props.GoToScreen('ChooseAGame')}>
            <Icon name="logo-game-controller-b" />
          </Fab>
        </View>
      </Container>
    );
  }
}
