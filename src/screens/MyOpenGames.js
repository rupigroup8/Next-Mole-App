
import React from "react";
import {Image,Text,View,ScrollView} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon} from 'native-base';
import firebase from 'firebase';
import { ListItem,Avatar } from 'react-native-elements'
import WikiLoader from '../common/WikiLoader';

import {images} from '../constant/images';

let gamesToShow = [];
const STATE = {
    OPEN:1,
    JOIN:2,
    DONE:3,
    NEXTCreator:4,
    NEXTJoiner:5,
  }

const categories = [
    { name: 'NBA',image:images.nbaLogo}, 
    { name: 'GENERAL KNOWLEDGE',image:images.generalKnowledgeLogo},
    { name: 'MUSIC',image:images.musicLogo},
    { name: 'POLITICS',image:images.politicsLogo},
    { name: 'CELEBRITY',image:images.celebrityLogo},
    { name: 'FILMS',image:images.filmLogo},
  ];

export default class GameBoard extends React.Component{
    state ={
        isReady:false,
        isGames:false,
        games:[]
    }
  static navigationOptions = ({ navigation }) =>{
    return{
      headerTitle: (
        <Image style={{ width: 90, height: 50,flex:1 }} resizeMode="contain" source={images.logo}/>
      ),
      headerBackground: (
        <NetworkHeader/>
      ),
      headerTitleStyle: { color: '#4D5F66',fontSize:23 },
      headerRight:<Text></Text>,
      headerLeft: 
        ( <Button
            onPress={()=>navigation.navigate('ChooseAGame')}
            style={{backgroundColor:"transparent",elevation:0}}>
            <Icon style={{color:"#403773",fontSize:32}}  name="ios-arrow-round-back" />
        </Button>
        ),
    }
}
getGames = ()=>{
  gamesToShow=[];
        categories.forEach(category => {
            console.log(category);
            const ref =  firebase.database().ref("/theMole"+category.name);
            const openGames = ref.orderByChild("state").equalTo(STATE.OPEN);
            console.log(openGames);
            openGames.on("child_added",(snapshot,key)=>{
            const data = snapshot.val();
            //igonre other people games, show only ours. 
            if (data.creator.uid==firebase.auth().currentUser.uid) {
                //push to an array
                game = {
                    key:snapshot.key,
                    data,
                    image:category.image,
                    categoryName:category.name
                }
                gamesToShow.push(game);
                this.setState({
                    isGames:true,
                    games:gamesToShow,
                    isReady:true
                })
                }
            })
        });
}
componentDidMount(){
        this.setState({
            games:[],
            isReady:false,
            isDeleted:false
        },()=>{
          this.getGames();
      })
      setInterval(()=>{
        if (!this.state.isReady) {
          this.setState({
            isReady:true
          })
        }
      },3000)
    }   
    cancelGame = (key,categoryNameToJoin)=>{
         //use firebase right here to join existing game in a category to choose from
         const ref =  firebase.database().ref("/theMole"+categoryNameToJoin);
         const user = firebase.auth().currentUser;
         const gameRef = ref.child(key);
         
         //remove a game from firebase 
         gameRef.remove()
         .then(()=>{
             //this.props.navigation.navigate('ChooseAGame')
             this.getGames();

         })
         .catch((error)=>{
             console.log(error)
         })
    }
  render(){
    if (!this.state.isReady) {
        return(
          <Box f={1} center bg="white">
            <WikiLoader/>
          </Box>
        )
    }
    else if(this.state.games.length!==0){
        return(
          <View flex={1} style={{margin:"5%"}}>
          <Text style={{fontSize:20,fontWeight:'bold',textAlign:'center'}}>Opened Games</Text>
          <ScrollView>
              <View>
                  {this.state.games.map((l, i) => (
                  <ListItem
                      onPress={()=>{this.cancelGame(l.key,l.categoryName)}}  
                      key={i}
                      leftAvatar={<Avatar
                          source={l.image}
                          size="large"
                          rounded
                      />}
                      title={l.data.creator.displayName}
                      titleStyle={{color:'#3A5173',fontWeight:'bold'}}
                      subtitle={"Category: " +l.categoryName}
                      subtitleStyle={{color:'#627365'}}
                      rightIcon={
                          <Icon 
                          name='ios-close'
                          style={{fontSize: 25, color: 'red'}}
                          />
                      }
                  />
                  ))
                  }
              </View>
          </ScrollView>
      </View>
        )
        }
            return(
      <Box f={1} center>
        <Text style={{fontSize:20}}>{firebase.auth().currentUser.displayName}, You don't have any opened games🤔</Text>
      </Box>
    )
  }
}