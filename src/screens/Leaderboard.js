
//שלל הספריות שהשתמשנו בהם

import React,{Component} from 'react';
import { Image } from "react-native";
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text,Button,Icon} from 'native-base';
import WikiLoader from '../common/WikiLoader';
import {Box} from 'react-native-design-utility';
import {images} from '../constant/images';
import NetworkHeader from '../common/NetworkHeader';
import { LongPressGestureHandler } from 'react-native-gesture-handler';



//for example
const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
];

export default class Leaderboard extends React.Component{
    state={
        bestPlayers:[],
          //אנימציית ההמתנה - כל עוד isready = false הוא יקפוץ
        isReady:false
    }
        //עיצוב כללי של העמוד

    static navigationOptions = ({ navigation }) =>{
      return{
        headerTitle: (
          <Text style={{fontSize:35}}>🏆</Text>
        ),
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#4D5F66',fontSize:23 },
        headerRight:<Text style={{marginRight:10}}></Text>,
        headerLeft: 
          ( <Button
              onPress={()=>navigation.navigate('ChooseAGame')}
              style={{backgroundColor:"transparent",elevation:0}}>
              <Icon style={{color:"#403773",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
          ),
          }
      }
      //ברגע שהמסך מוכן - זאת הפונקציה הראשונה שמתבצעת
      //document ready
    componentDidMount(){
           //תבנית כתיבה קבועה מגוגל לפעולת הGET
      //קישור לדאתא שהוצאנו מהDB
      //הוצאנו רשימת משתמשים אשר נמצאים ב25 המקומות הראשונים לפי מספר הניצחונות של כל משתמש
      fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/playerwinners')
            //את רשימת האנשים נמיר לג'ייסון
      .then((response) => response.json())
      .then((responseJson) => {
           //כאשר הג'ייסון מוכן קודם כל נפסיק את פעולת ההמתנה
        //הפסקה של האנימציה שקופצת
        //ונעדכן את רשימת המשתמשים לפי השליפה מהדאתאבייס
        this.setState({
          isReady:true,
          bestPlayers:responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });
        
    }
        //ברגע שיש עידכון של הstate והוא מוכן הוא מרונדר אוטומטית
    render(){
        if (!this.state.isReady) {
            return(
              <Box f={1} center bg="white">
                <WikiLoader/>
              </Box>
            )
        }
        return(
            <Container>
              <Content>
                <List>
                {
                      //עיצוב עבור כל משתמש ברשימה שהוצאנו
                  //נעבור על כל איבר ברשימה ונבצע עליו את הפעולות הבאות
                  //יקבל את התמונה ששלפנו עבורו
                  //שם המשתמש (הכינוי)
                  //מספר הנקודות שקיבל
                    this.state.bestPlayers.map((p) => (
                      
                          <ListItem avatar>
                            <Left>
                              <Thumbnail source={{ uri: p.ProfilePic}} />
                            </Left>
                            <Body>
                          <Text style={{fontWeight:'bold',textAlign:'left'}}>{p.NickName}</Text>
                          <Text note style={{color:'#7CCB9D',fontWeight:'bold'}}>Number of wins: {p.NumOfWinnings}</Text>
                          </Body>
                      </ListItem>
                    ))
                }
              </List>
            </Content>
          </Container>
        )
    }
}