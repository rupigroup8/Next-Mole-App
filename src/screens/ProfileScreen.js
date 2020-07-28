import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import { StyleSheet,ImageBackground,ActivityIndicator,Image} from 'react-native';
import {Button,Icon, Content} from 'native-base';
import { Avatar,Text} from 'react-native-elements';
import FABStartGame from '../common/StartAGame';
import FABSettings from '../common/Settings';
import FABPaths from '../common/BombShop';
import firebase from 'firebase';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import {images} from '../constant/images';




class ProfileScreen extends Component{
    static navigationOptions = ({ navigation }) =>{
    return{
      headerTitle: (
        <Image style={{ width: 90, height: 40,flex:1 }} resizeMode="contain" source={images.logo}/>
      ),
      headerBackgroundStyle: {backgroundColor:'#000'},
      //headerTitleStyle: { color: '#4D5F66',fontSize:23,alignSelf: 'center' },
      headerRight: 
       ( <Button
          onPress={()=>navigation.navigate('Article')}
          style={{backgroundColor:"transparent",elevation:0}}>
            <Icon style={{color:"#2DA3BD",fontSize:35}}  name="md-paper" />
        </Button>
       ),
      headerLeft: 
       ( <Button
          onPress={()=>navigation.navigate('Paths')}
          style={{backgroundColor:"transparent",elevation:0}}>
          <Icon style={{color:"#2DA3BD",fontSize:35}}  name="ios-infinite" />
        </Button>
       ),
      }
    }
    state = {
      showAlert:false,
      userName:"",
      userPic:"",
      email:"",
      isReady:false,
      playerCash:'?',
      playerWins:'?'
    }
    NavigateToHelp = ()=>{
      this.props.navigation.navigate('Intro');
    }
    //get token for notifications..
    registerForPushNotificationsAsync = async ()=>{

      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      console.log(finalStatus)
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
        console.log(status)
      }
      console.log(finalStatus)

      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }
      
      // Get the token that uniquely identifies this device
      const  token = await Notifications.getExpoPushTokenAsync();

      // POST the token to your backend server from where you can retrieve it to send push notifications.      
    
      return fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/PlayerToken', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         Token: token,
         Uid:firebase.auth().currentUser.uid
        }),
      })
      .catch((error)=>{
        alert(error);
      });
    }

    componentDidMount(){
      //console.log("Profile: ", this.props.navigation.getParam())
      this.registerForPushNotificationsAsync();
      //get current user info from firebase auth
        this.setState({
          userName:firebase.auth().currentUser.displayName,
          userPic:firebase.auth().currentUser.photoURL,
          email:firebase.auth().currentUser.email,
          isReady:true
        },()=>{
          const endpoint = 'http://proj.ruppin.ac.il/bgroup65/prod/api/playergetplayer?uid='+firebase.auth().currentUser.uid;
          fetch(endpoint)
            .then(response => response.json())
            .then((data)=>{
              this.setState({
                playerCash:data.CashMole,
                playerWins:data.NumOfWinnings,
                userPic:data.ProfilePic,
                
              })
            })
            .catch((error)=>{
              console.log(error);
            })
        })
      

    }
    
    EditAvatarPic = () =>{
      this.props.navigation.navigate('Avatar');
    }
    changeScreen=(screenName)=>{ 
     this.props.navigation.navigate(screenName);
    }
    render(){
      //const { lastScreen } = this.props.navigation.state.params;


      if (!this.state.isReady) {
        return(
          <Box f={1} center bg="white">
            <ActivityIndicator color='purple' size="large"/>
          </Box>
        )
      }
        return(
          
            <Box f={1} bg="transparent">
              <ImageBackground resizeMode='contain' style={{flex:1}} source={{uri:'https://securestrux.com/content/uploads/2014/02/network_blue_opacity_lighter.png'}}>
                {/* {lastScreen==='Splash' ? <NotificationPopupToShow body="Welcome Back" title="Hey you"/>:<Text></Text>} */}
              <Box f={1} style={{marginTop:"15%"}} center>
                <Avatar size='xlarge' 
                rounded
                source={{
                  uri:
                   this.state.userPic?this.state.userPic:'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                }}
                showEditButton
                onEditPress={this.EditAvatarPic}
              />
              <Text h5 style={{fontWeight:"bold",marginTop:"5%"}}>{this.state.userName}</Text>
            </Box>
            </ImageBackground>

            
                  <Content contentContainerStyle={{ flex: 1,marginTop:'4%'}}>
                    <Grid style={{justifyContent:'space-evenly'}}>
                      <Col></Col>
                      <Col style={styles.colStyleForGrid}>
                        <Row>
                          <Col >
                            <ImageBackground resizeMode='contain' style={{ flex: 1 }} source={images.dollar_coins}>
                            <Row></Row>
                            <Text style={styles.textStyleForGrid}>{this.state.playerCash}</Text>     
                            </ImageBackground> 
                            </Col>                 
                        </Row>
                      </Col>
                      <Col style={styles.colStyleForGrid}>
                        <Row>
                          <Col>
                            <ImageBackground resizeMode='contain' style={{ flex: 1}} source={images.prize}>
                              <Row>
                              </Row>
                              <Text style={styles.textStyleForGrid}>{this.state.playerWins}</Text>
                            </ImageBackground>
                          </Col>                        
                        </Row>
                      </Col>
                      <Col></Col>
                    </Grid>
                </Content>

            <Box bg='transparent' f={1} style={{marginBottom:"3%"}}>
                <Box f={1} >
                  <FABStartGame GoToScreen={this.changeScreen}/> 
                </Box>
                <Box style={{marginLeft:"37%"}}>
                  <FABPaths GoToScreen={this.changeScreen}/>
                </Box> 
                <Box>
                  <FABSettings GoToScreen={this.changeScreen} />
                </Box>
            </Box>


          </Box>
          
        )
    }
}


export default ProfileScreen;


//STYLE
const styles = StyleSheet.create({
  baseColumns:{
    padding:10,

  },
  dataViewCash:{
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
    padding:5,
    borderRadius:10,
    backgroundColor:'#4F86EC'
  },
  dataViewBombs:{
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
    //borderWidth:1,
    padding:10,
    borderRadius:10,
    backgroundColor:'#F2BD42'
  },
  dataViewWins:{
    backgroundColor:'green',
    alignItems:'center',
    borderStyle:'solid',
    borderColor:'grey',
    backgroundColor:'#D95040',
    padding:5,
    borderRadius:10,
    marginTop:"15%"
  },
  textStyleForGrid:{
    textAlign:'center',
    color:'black',
    fontSize:20,
    fontWeight:'bold',
    //marginBottom:30
  },
  colStyleForGrid:{
    backgroundColor:'transparent',
    borderStyle:'solid',
    borderRadius:20,
    // borderWidth:1,
    margin:8,
    //backgroundColor:'#70A380'
  }
})