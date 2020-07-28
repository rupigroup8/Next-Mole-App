import React, { Component } from 'react';
import { Title,Button,Container, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Header } from 'native-base';
import {View,Linking} from 'react-native';
import NetworkHeader from '../common/NetworkHeader';


export default class SettingsScreen extends Component {
    static navigationOptions = ({ navigation }) =>{
      return{
      headerTitle:"Settings",
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#4D5F66',fontSize:20,alignSelf:'center' },
      headerLeft: 
      ( <Button
          onPress={()=>navigation.navigate('Profile')}
          style={{backgroundColor:"transparent",elevation:0}}>
            <Icon  style={{color:"#403773",fontSize:35}}  name="ios-arrow-round-back" />
        </Button>
      ),
      }
    }
    state = {
      soundOn:false,
      NotificationsOn:false,
    }
    BackToProfileScreen = (screenName) =>{
      if (screenName==='Back') {
        this.props.navigation.navigate('Profile');
      }
      else{
        this.props.navigation.navigate('Profile');
      }
    }
    shareToWhatsAppWithContact = (text, phoneNumber) => {
      Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
    }
  render() {
    return (
        <Container>
            {/* <View >
            <Header style={{backgroundColor:"white"}} >
                <Left >
                  <Title style={{color:"red"}}>PROFILE SETTINGS</Title>
                </Left>
                <Right />
              </Header>
            </View> */}
            {/* <Content style={{marginBottom:"-10%"}}>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#FF9501" }}>
                  <Icon active name="ios-volume-high" />
                </Button>
              </Left>
              <Body>
                <Text>Sound Mode</Text>
              </Body>
              <Right>
                <Switch onValueChange={()=>this.setState({soundOn:!this.state.soundOn})} value={this.state.soundOn} />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon active name="ios-notifications" />
                </Button>
              </Left>
              <Body>
                <Text>Send Push Notifications</Text>
              </Body>
              <Right>
                <Switch onValueChange={()=>this.setState({NotificationsOn:!this.state.NotificationsOn})} value={this.state.NotificationsOn} />
              </Right>
            </ListItem>
          </Content> */}
              <Header style={{backgroundColor:"white"}} >
                <Left >
                  <Title style={{color:"red"}}>SHARE THE APP</Title>
                </Left>
                <Right />
              </Header>
            <Content>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "white" }}>
                  <Icon style={{color:"#4167B2"}} active name="logo-facebook" />
                </Button>
              </Left>
              <Body>
                <Button transparent dark>
                  <Text>Share with Facebook!</Text>
                </Button>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "white" }}>
                  <Icon style={{color:"#00E576"}} active name="logo-whatsapp" />
                </Button>
              </Left>
              <Body>
                <Button transparent dark onPress={this.shareToWhatsAppWithContact}>
                  <Text>Share with Whatsapp!</Text>
                </Button>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
          </Content>
          <Header style={{backgroundColor:"white"}} >
                <Left >
                  <Title style={{color:"red"}}>SUPPORT</Title>
                </Left>
                <Right />
              </Header>
            <Content>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "white" }}>
                  <Icon style={{color:"#000000"}} active name="md-construct" />
                </Button>
              </Left>
              <Body>
                <Button transparent dark onPress={() => Linking.openURL('mailto:support@example.com')}>
                  <Text>Talk to us</Text>
                </Button>
              </Body>
              <Right>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
          </Content>
          <Content>
            {/* <Body>
              <Button success block>
                  <Text style={{fontSize:20}}>Save</Text>
                </Button>
            </Body> */}
          </Content>  
        </Container>
    );
  }
}