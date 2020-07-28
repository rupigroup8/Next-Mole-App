import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import firebase from 'firebase';
import {Alert,Vibration,Platform} from 'react-native';
import { storageSet } from "../constant/Storage";
import OnBoardingLogo from '../common/OnBoardingLogo'
import { Notifications } from "expo";
import Constants from 'expo-constants';

const STATE = {
  REMOVE:0,
  OPEN:1,
  JOIN:2,
  START:3,
  NEXTCreator:4,
  NEXTJoiner:5,
  WINCreator:6,
  WINJoiner:7
}

class SplashScreen extends Component{
    state={
      expoPushToken: '',
      notification:{},
    }
    async componentDidMount(){
        this.checkAuth();
        //await this.registerForPushNotificationsAsync2();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }
    registerForPushNotificationsAsync2 = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = await Notifications.getExpoPushTokenAsync();
        this.setState({ expoPushToken: token },()=>{
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
        });
      } else {
        alert('Must use physical device for Push Notifications');
      }
  
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }
    };
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
      let token = await Notifications.getExpoPushTokenAsync();
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
    _handleNotificationForeGround = (game,key,category)=>{
      const ref =  firebase.database().ref("/theMole"+category);
      const gameRef = ref.child(key);
      if (game) {
        fetch('http://proj.ruppin.ac.il/igroup8/prod/api/NetworkStartAGame?categoryNAME='+category)
          .then(response => response.json())
          .then((data)=>{
            joinerPath = {
              path: data[1],
              verteciesToChooseFrom:data[3],
              target:data[0][0],
              next:data[1][1],
              length:data[1].length,
              pathHistory:[]
            }
            creatorPath = {
              path: data[0],
              verteciesToChooseFrom:data[2],
              target:data[1][0],
              next:data[0][1],
              length:data[0].length,
              pathHistory:[]
            }
            gameRef.update(({'JoinerPath': joinerPath}));
            gameRef.update(({'CreatorPath': creatorPath}));
          })
          .then(()=>{
            gameRef.update(({'state': STATE.START}));
            this.props.navigation.navigate('GameBoard');
          })
          .catch((err)=>{
            console.log(err)
          })
      }
      else{
        gameRef.update(({'state': STATE.REMOVE}));
      }
    }
    _handleNotification = ({origin,data}) => {
        Vibration.vibrate();
        storageSet('key', data.key);
        storageSet('category', data.category);
        if (origin === 'received') {
          // Works on both iOS and Android
          Alert.alert(
            (data.category==="FILMS"?"Movies":data.category) + ' New Game!',
            'Come play with '+data.joiner+' in ' + (data.category==="FILMS"?"Movies":data.category)+ ' game',
            [
              {
                text: 'Cancel game',
                onPress: () => {this._handleNotificationForeGround(false,data.key,data.category)},
                style: 'cancel',
              },
              {
                text: "Let's go!", 
                onPress: () => {this._handleNotificationForeGround(true,data.key,data.category)},
                style:'default'
              },
            ],
            {cancelable: true},
          );          
        }
        else{
        //update game state and starting paths
        const ref =  firebase.database().ref("/theMole"+data.category);
        const gameRef = ref.child(data.key);      
        fetch('http://proj.ruppin.ac.il/igroup8/prod/api/NetworkStartAGame?categoryNAME='+data.category)
          .then(response => response.json())
          .then((data)=>{
            joinerPath = {
              path: data[1],
              verteciesToChooseFrom:data[3],
              target:data[0][0],
              next:data[1][1],
              length:data[1].length,
              pathHistory:[]
            }
            creatorPath = {
              path: data[0],
              verteciesToChooseFrom:data[2],
              target:data[1][0],
              next:data[0][1],
              length:data[0].length,
              pathHistory:[]
            }
            gameRef.update(({'JoinerPath': joinerPath}));
            gameRef.update(({'CreatorPath': creatorPath}));
          })
          .then(()=>{
              gameRef.update(({'state': STATE.START}));
              this.props.navigation.navigate('GameBoard');
          })
          .catch((err)=>{
            console.log(err)
          })
        }
    }
    checkAuth = ()=>{
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                let LastLogin = 'http://proj.ruppin.ac.il/bgroup65/prod/api/PlayerLastLogin';
                fetch(LastLogin, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                     Uid:firebase.auth().currentUser.uid
                    }),
                  })
                  .catch((error)=>{
                    alert(error);
                  });                
                  this.props.navigation.navigate('Profile',
                  params={
                    lastScreen: 'Splash'
                  });
            }
            else{
                this.props.navigation.navigate('Auth')
            }
        })    
    }

    render(){
        return(
            <Box f={1} center bg="white">
                <OnBoardingLogo />
            </Box>
        )
    }
}

export default SplashScreen;