import React,{ Component } from 'react';
import FooterNavigator from '../common/Footer'
import {Text} from 'react-native';
import { Container,Icon } from 'native-base';
import {Alert,StyleSheet, FlatList, View, Platform,Image} from 'react-native';
import NetworkHeader from '../common/NetworkHeader';
import {images} from '../constant/images';
import Lightbox from 'react-native-lightbox/Lightbox/';
import {Button} from 'react-native-elements';
import BannerMole from '../common/BannerMole';
import firebase from 'firebase';

const activeProps = {
  resizeMode: 'contain',
  flex: 1,
  width: null
};
const styles = StyleSheet.create({
    MainContainer :{
      justifyContent: 'center',
      flex:7,
      margin: 10,
      paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
      borderStyle:'solid',
      height:'auto'
    },
    GridViewBlockStyle: {
      justifyContent: 'center',
      flex:1,
      alignItems: 'center',
      height: 165,
      width:135,
      margin: 5,
      backgroundColor: 'transparent',
      borderStyle:'solid',
      borderWidth:1,
      borderRadius:15
    },
    GridViewInsideImageItemStyle: {
     justifyContent: 'center',
     width:159,
     height:115,
     borderRadius:10,
     //borderStyle:'solid',
     //borderWidth:1
    },
  });


class AvatarScreen extends Component{
  static navigationOptions = ({ navigation }) =>{
    return{
    headerTitle:"Our Avatars!",
    headerBackground: (
      <NetworkHeader/>
    ),
    headerTitleStyle: { color: '#000',fontSize:20,textAlign:'center' },
    headerLeft: 
     ( <Button
        onPress={()=>navigation.navigate('Profile')}
        type='clear'
        icon={
          <Icon
            name="ios-arrow-round-back"
            style={{color:"#403773",fontSize:35}}
          />
        }
    />
     ),
    }
  }
    state = {
        GridViewItems: [
          {key: images.avatar1,name:'1'},
          {key: images.avatar2,name:'2'},
          {key: images.avatar3,name:'3'},
          {key: images.avatar4,name:'4'},
          {key: images.avatar5,name:'5'},
          {key: images.avatar6,name:'6'},
          {key: images.avatar7,name:'7'},
          {key: images.avatar8,name:'8'},
          {key: images.avatar9,name:'9'},
          {key:firebase.auth().currentUser.photoURL,name:firebase.auth().currentUser.photoURL}
        ],
    }
    BackToProfileScreen = (screenName) =>{
        if (screenName==='Back') {
          this.props.navigation.navigate('Profile');
        }
        else{  
          this.props.navigation.navigate('Profile');
        }
      }

    changeToAvatar = (avatar)=>{
        let avatarUrl = 'http://proj.ruppin.ac.il/bgroup65/prod/img/'+avatar+'.png';
        if (avatar.length>1) {
          avatarUrl = avatar;
        }      

        let endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/PlayerAvatar?avatarUrl='+avatarUrl+'&uid='+firebase.auth().currentUser.uid;
        console.log(endpoint);
        fetch(endpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          })
          .then(()=>{
            Alert.alert(
              '',
              'Profile pic changed🤩',
              [
                {
                  text: "OK", 
                  style:'default'
                },
              ],
            );  
            this.props.navigation.navigate('Profile');
          })
          .catch((error)=>{
            console.log(error);
          });
    }
    render(){
        return(
            <Container>
              <BannerMole title='More avatars are coming soon:)' />
                <View  style={styles.MainContainer}>
                    <FlatList
                    data={ this.state.GridViewItems }
                    renderItem={({item}) =>
                        <View on style={styles.GridViewBlockStyle}>
                          <Lightbox activeProps={activeProps} pinchToZoom swipeToDismiss>
                            <Image style={styles.GridViewInsideImageItemStyle} source={item.name.length>1?{uri:item.key}:item.key}/>
                          </Lightbox>
                          <Button 
                            onPress={()=>this.changeToAvatar(item.name)}
                            title="take me!"
                            style={{paddingBottom:1,paddingTop:1}}
                            type='outline'
                          />
                        </View>
                    }
                    numColumns={2}
                    />
                </View> 
            </Container>
        )
    }
}


export default AvatarScreen;