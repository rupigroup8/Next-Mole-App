
import React from "react";
import {Alert,Image,Text,View,ScrollView} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import firebase from 'firebase';
import {Button,Icon,List, ListItem as ListBase, Left, Body, Right} from 'native-base';
import { Avatar,ListItem} from 'react-native-elements'
import WikiLoader from '../common/WikiLoader';
import Dialog, {DialogTitle, DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

import {images} from '../constant/images';

let gamesToShow = [];
const STATE = {
    REMOVE:0,
    OPEN:1,
    JOIN:2,
    START:3,
    NEXTCreator:4,
    NEXTJoiner:5,
    WINCreator:6,
    WINJoiner:7,
}

const categories = [
    { name: 'NBA',image:images.nbaLogo}, 
    { name: 'GENERAL KNOWLEDGE',image:images.generalKnowledgeLogo},
    { name: 'MUSIC',image:images.musicLogo},
    { name: 'POLITICS',image:images.politicsLogo},
    { name: 'CELEBRITY',image:images.celebrityLogo},
    { name: 'FILMS',image:images.filmLogo},
  ];

export default class GamesWon extends React.Component{
    state ={
        isReady:false,
        isGames:false,
        games:[],
        path:[],
        pathVisible:false
    }
  static navigationOptions = ({ navigation }) =>{
    return{
        headerTitle: (
            <Image style={{ width: 90, height: 50,flex:1 }} resizeMode='contain' source={images.logo}/>
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
    componentDidMount(){
        this.setState({
            games:[],
            isReady:false,
            isDeleted:false,
            pathVisible:false
        },()=>{
        gamesToShow=[];
        categories.forEach(category => {
            const ref =  firebase.database().ref("/theMole"+category.name);
            const openGames = ref.orderByChild("state").equalTo(STATE.WINCreator);
            openGames.on("child_added",(snapshot,key)=>{
            const data = snapshot.val();
            console.log(data);
            //igonre other people games, show only ours. 
            if (data.creator.uid==firebase.auth().currentUser.uid) {
                //push to an array
                game = {
                    key:snapshot.key,
                    data,
                    image:category.image,
                    categoryName:category.name,
                }
                gamesToShow.push(game);
                this.setState({
                    isGames:true,
                    games:[...this.state.games,game],
                })
                }
            })
        });
        categories.forEach(category => {
            const ref =  firebase.database().ref("/theMole"+category.name);
            const openGames = ref.orderByChild("state").equalTo(STATE.WINJoiner);
            openGames.on("child_added",(snapshot,key)=>{
            const data = snapshot.val();
            console.log(data)
            //igonre other people games, show only ours. 
            if (data.joiner.uid==firebase.auth().currentUser.uid) {
                console.log(data);
                //push to an array
                game = {
                    key:snapshot.key,
                    data,
                    image:category.image,
                    categoryName:category.name,
                }
                gamesToShow.push(game);
                this.setState({
                    isGames:true,
                    games:[...this.state.games,game],
                })
                }
            })
        });
      })
      setInterval(()=>{
        if (!this.state.isReady) {
          this.setState({
            isReady:true
          })
        }
      },5000)
    }
    showPath = (game)=>{
       this.setState({
           path:game.data.pathWon,
           pathVisible:true
       })       
    }   
    cancelInfo = ()=>{
        this.setState({
            pathVisible:false
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
            <Dialog 
                    width={0.9}
                    height={400}
                    visible={this.state.pathVisible}
                    dialogTitle={<DialogTitle title="Path to victory" />}
                    >
                    <DialogContent>
                        <ScrollView>

                        {this.state.path.map((item,index)=>{
                        return(
                            <List key={index} style={{marginBottom: 10}}>
                                    <ListBase avatar>
                                    
                                    {/* <Left>
                                        <Thumbnail source={i} />
                                    </Left> */}
                                    <Body>
                                        <Text style={{fontSize:17}}>{item}</Text>
                                        <Text note></Text>
                                    </Body>
                                    <Right>
                                        <Text note></Text>
                                    </Right>
                                    </ListBase>
                            </List>
                            )
                                })
                            }
                            <DialogButton
                            text="OK"
                            onPress={() => {this.cancelInfo()}}
                            />         
                        </ScrollView>     
                    </DialogContent>
            </Dialog>
            <Text style={{fontSize:20,fontWeight:'bold',textAlign:'center'}}>Games Won</Text>
            <ScrollView>
                <View>
                    {this.state.games.map((l, i) => (
                    <ListItem
                        onPress={()=>{this.showPath(l)}}  
                        key={i}
                        leftAvatar={<Avatar
                            source={l.image}
                            size="large"
                            rounded
                        />}
                        subtitle="Show winning path"
                        titleStyle={{color:'#3A5173',fontWeight:'bold'}}
                        title={"Category: " +l.categoryName}
                        subtitleStyle={{color:'#627365'}}
                        rightIcon={
                            <Icon 
                            name='ios-analytics'
                            style={{fontSize: 25, color: 'purple'}}
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
                <Text>{firebase.auth().currentUser.displayName} you didn't won yet...don't stop trying!🤗</Text>
            </Box>
        )
    }
}