import React,{ Component } from "react";
import {Image,Text,StyleSheet,ImageBackground,Platform} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon} from 'native-base';
import {images} from '../constant/images';


//game states
const STATE = {
    OPEN:1,
    JOIN:2,
    START:3,
    NEXTCreator:4,
    NEXTJoiner:5,
    WINCreator:6,
    WINJoiner:7
}


export default class GameTime extends React.Component{

    static navigationOptions = ({ navigation }) =>{
        return{
          headerTitle: (
            <Image style={{ width: 90, height: 50,flex:1}} resizeMode="contain" source={images.logo}/>
            ),
          headerBackground: (
            <NetworkHeader/>
          ),
          headerTitleStyle: { color: '#4D5F66',fontSize:23 },
          headerRight:(<Text></Text>),
          headerLeft: 
            ( <Button
                onPress={()=>navigation.navigate('Profile')}
                style={{backgroundColor:"transparent",elevation:0}}>
                <Icon style={{color:"#403773",fontSize:32}}  name="ios-arrow-round-back" />
            </Button>
            ),
          }
        }

        ChooseACategory = ()=>{
            this.props.navigation.navigate('Categories');
        }
        JoinAGame = ()=>{
            this.props.navigation.navigate('JoinGame');
        }
        MyGames = ()=>{
            this.props.navigation.navigate('MyOpenGames');
        }
        GamesWon = ()=>{
            this.props.navigation.navigate('GamesWon');
        }
        LeaderBoard = ()=>{
            this.props.navigation.navigate('Leaderboard');
        }
    render(){
        return(
            <ImageBackground resizeMode='contain' style={{flex:1}} source={{uri:'https://ak1.picdn.net/shutterstock/videos/8085121/thumb/1.jpg'}}>
                <Box f={1} center bg='transparent'>
                    <Button onPress={this.ChooseACategory} style={styles.buttonStyle} block rounded bordered info>
                        <Text style={styles.textStyle}>Create a new game</Text>
                    </Button>
                    <Button onPress={this.JoinAGame} style={styles.buttonStyle} block rounded bordered primary>
                        <Text style={styles.textStyle}>Join a game</Text>
                    </Button>
                    <Button onPress={this.MyGames} style={styles.buttonStyle} block rounded bordered warning>
                        <Text style={styles.textStyle}>My opened games</Text>
                    </Button>
                    <Button onPress={this.GamesWon} style={styles.buttonStyle} block rounded bordered success>
                        <Text style={styles.textStyle}>Games WON</Text>
                    </Button>
                    <Button onPress={this.LeaderBoard} style={styles.buttonStyle} block rounded bordered danger>
                        <Text style={styles.textStyle}>Leaderboard🏆</Text>
                    </Button>
                </Box>
            </ImageBackground>
        )
    }
}

//STYLE
let styles;
if (Platform.OS ==='ios') {
    styles = StyleSheet.create({
        buttonStyle:{
            'margin':10,
        },
        textStyle:{
            'fontSize':25,
            'color':'#000',
            'fontWeight':'200'
        },
    })
}
else{
    styles = StyleSheet.create({
        buttonStyle:{
            'margin':10,
        },
        textStyle:{
            'fontSize':23,
            'color':'#000',
            'fontWeight':'normal'
        },
    })
}
