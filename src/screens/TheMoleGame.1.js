import React from "react";
import {Alert,StyleSheet,Image,Text,View,ImageBackground,TouchableOpacity,ScrollView,Platform,TouchableHighlight} from "react-native";
import {Box} from 'react-native-design-utility'
import NetworkHeader from '../common/NetworkHeader';
import {Button,Icon,List, ListItem, Left, Body,Container, Content, Footer, FooterTab } from 'native-base';
import firebase from 'firebase';
import {images} from '../constant/images';
import WikiLoader from '../common/WikiLoader';
import { storageGet } from "../constant/Storage";
import { FlatGrid } from 'react-native-super-grid';
import CountdownTimer from "../common/countdown";
import Dialog, {DialogTitle, DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

let InfoTitle='Google';
let InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects='
const body = { method: 'GET', dataType: 'json'};
let myRequest = new Request(InfoApi, body); 

let marTop = 38;
let footerHeight = 60;
if (Platform.OS==='ios') {
  marTop = 24;
  footerHeight = 80;
}


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
let list = [];
let listJoiner = [];
let listCreator = [];

let currentGamekey = '';
let categoryPlayed='';

export default class GameBoard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isStarted:false,
      modalTargetVisible:false,
      yourPathCount:0,
      oponentPathCount:0,
      isCreatorTurn:true,
      timeStop:false,
      wait:true,
      modalVisible: false,
      dialogContent:'',
      dialogTitle:'',
      pathVisible:false,
      historyPaths:list,
      timerStart:false,
      creatorPath:[],
      creatorTarget:{},
      creatorNext:'',
      creatorCurrentNode:'',
      creatorVerteciesToChooseFrom:[],
      joinerPath:[],
      joinerTarget:{},
      joinerNext:'',
      joinerCurrentNode:'',
      joinerVerteciesToChooseFrom:[],
      user:firebase.auth().currentUser.uid,
      joinerUid:'',
      creatorUid:'',
      category:'',
      newList:false
    }
    this.getArticleInfo =this.getArticleInfo.bind(this);
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
            <Icon style={{color:"#4D5F66",fontSize:32}}  name="ios-arrow-round-back" />
          </Button>
        ),
    }
  }
  componentDidMount(){
    this.GetItemsFromStorage();
  }
  openPathHistory = ()=>{
    this.setState({
      modalVisible:false,
      pathVisible:true,
      timerStart:false
    })
  }
  GetItemsFromStorage = async ()=>{
    let key = await storageGet('key');
    let category =  await storageGet('category');
    this.setState({category:category},()=>{
      this.watchGame(key,category);
    })
  }
  winner = (game)=>{
    const ref =  firebase.database().ref("/theMole"+categoryPlayed);
    const gameRef = ref.child(currentGamekey);
            
    this.setState({
      modalTargetVisible:false,
      modalVisible:false
    },()=>{
      //if game winner is the creator
      if (game.state == STATE.WINCreator) {
        if (this.state.user==this.state.creatorUid) {
          this.props.navigation.navigate('Winner');
          let path = [];
          path.push(game.JoinerPath.target);
          this.state.historyPaths.map((p)=>{
            path.push(p.title);
          })
          path.push(this.state.creatorTarget.title);
          gameRef.update(({
            'pathWon': path,
          }));
        }
        if (this.state.user==this.state.joinerUid) {
          this.props.navigation.navigate('Loser');
        }
      }
      //if game winner is the joiner
      if (game.state == STATE.WINJoiner) {
        if (this.state.user==this.state.joinerUid) {
          
          this.props.navigation.navigate('Winner');
          let path = [];
          path.push(game.CreatorPath.target);
          this.state.historyPaths.map((p)=>{
            path.push(p.title);
          })
          path.push(this.state.joinerTarget.title);
          gameRef.update(({
            'pathWon': path,
          }));
        }
        if (this.state.user==this.state.creatorUid) {
          this.props.navigation.navigate('Loser');
        }
      }
    })
  }
  nextJoinerTurn =  (gamer)=>{
    if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:false,
        timerStart:true,
        oponentPathCount:gamer.currentCreatorPathCount
      })
    }
    if (firebase.auth().currentUser.uid == gamer.creator.uid) {
      this.setState({
        isCreatorTurn:false,
        wait:true,
        timerStart:true,
      })
    }
  }
  nextCreatorTurn = (gamer)=>{
      if (firebase.auth().currentUser.uid == gamer.creator.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:false,
          timerStart:true,
          oponentPathCount:gamer.currentJoinerPathCount
        })
      }
      if (firebase.auth().currentUser.uid == gamer.joiner.uid) {
        this.setState({
          isCreatorTurn:true,
          wait:true,
          timerStart:true,
        })
      }
  }
  watchGame = (key,categoryNameToJoin)=>{

    currentGamekey = key;
    categoryPlayed = categoryNameToJoin;

    const ref =  firebase.database().ref("/theMole"+categoryNameToJoin);
    const gameRef = ref.child(key);  
    
    gameRef.on('value',(snapshot)=>{
      const game = snapshot.val();
      switch (game.state) {
        case STATE.JOIN: this.checkGameStart(game);
          break;
        case STATE.START: this.startGame(game);
          break;
        case STATE.WINCreator: this.winner(game);
          break;
        case STATE.WINJoiner: this.winner(game);
          break;
        case STATE.NEXTJoiner: this.nextJoinerTurn(game);
          break;
        case STATE.NEXTCreator: this.nextCreatorTurn(game);
          break;
        case STATE.REMOVE: this.gameRemoved(game);
          break;
        default:
          break;
      }
    })
  }
  checkGameStart = ()=>{
    this.setState({isStarted:false},()=>{
      window.setTimeout(()=>{
          const ref =  firebase.database().ref("/theMole"+categoryPlayed);
          const gameRef = ref.child(currentGamekey); 
          gameRef.on('value',(snapshot)=>{
            const game = snapshot.val();
            if (game.state === STATE.JOIN) {
              const ref2 =  firebase.database().ref("/theMole"+categoryPlayed);
              const gameRef2 = ref2.child(currentGamekey);
              gameRef2.update(({
                'state': STATE.REMOVE
              }));
            }
          })
      },15000)
    })
  }
  gameRemoved = ()=>{
    Alert.alert(
      'Current game',
      'Oponnent left the game..😶',
      [
        {text: 'OK', onPress: () => {this.props.navigation.navigate('Profile')}},
      ],
    );   
  }
  startGame = (game)=>{
    this.setState({
        //timerStart:true,
        joinerUid:game.joiner.uid,
        creatorUid:game.creator.uid,
        joinerPath:game.JoinerPath.path,
        joinerNext:game.JoinerPath.next,
        joinerCurrentNode:game.JoinerPath.target,
        creatorPath:game.CreatorPath.path,
        creatorNext:game.CreatorPath.next,
        creatorCurrentNode:game.CreatorPath.target,
        oponentPathCount: this.state.user == game.joiner.uid ? game.CreatorPath.length : game.JoinerPath.length,
        yourPathCount: this.state.user == game.joiner.uid ? game.JoinerPath.length : game.CreatorPath.length,

      },()=>{
          this.setState({
            joinerVerteciesToChooseFrom:[this.state.joinerNext,...game.JoinerPath.verteciesToChooseFrom],
            creatorVerteciesToChooseFrom:[this.state.creatorNext,...game.CreatorPath.verteciesToChooseFrom],
        },()=>{
          this.fetchDataFromWiki(game);
          window.setTimeout(()=>{
            console.log(this.state.creatorTarget);
            console.log(this.state.joinerTarget);
            this.setState({
              isStarted:true
            })
            const ref =  firebase.database().ref("/theMole"+categoryPlayed);
            const gameRef = ref.child(currentGamekey);
            gameRef.update(({
              'currentJoinerPathCount': game.JoinerPath.length,
              'currentCreatorPathCount': game.CreatorPath.length,
              'state': STATE.NEXTCreator
            }));
        },5000)
      })
    })
  }
  fetchListForcCreatorFromWiki = ()=>{
    //get pics for each article
    listCreator = [];
    //fetch creator vertecies to choose from
    this.state.creatorVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listCreator.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listCreator.push(article);
        }
      })
      .then(()=>{
        this.setState({newList:true})
      })
    })
  }
  fetchListForJoinerFromWiki = ()=>{
    //get pics for each article
    listJoiner = [];
    //fetch creator vertecies to choose from
    this.state.joinerVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listJoiner.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listJoiner.push(article);
        }
      })
      .then(()=>{
        this.setState({newList:true})
      })
    })
  }
  fetchDataFromWiki = (game)=>{
    //get pics for each article
    listJoiner = [];
    listCreator = [];
    //fetch joiner vertecies to choose from
    this.state.joinerVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listJoiner.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listJoiner.push(article);
        }
      })
    })
    //fetch creator vertecies to choose from
    this.state.creatorVerteciesToChooseFrom.map((item,key)=>{
      let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+item+'&prop=pageimages&format=json&pithumbsize=400';
      fetch(API)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:item,
            image:data.query.pages[pgid].thumbnail.source
          }
          listCreator.push(article);
        }
        else {
          let article = {
            title:item,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          listCreator.push(article);
        }
      })
    })
    //fetch creator target 
    let API1 = 'https://en.wikipedia.org/w/api.php?action=query&titles='+game.CreatorPath.target+'&prop=pageimages&format=json&pithumbsize=600';
      fetch(API1)
        .then(response => response.json())
        .then(data => {
        var pgid = Object.keys(data.query.pages)[0];
        if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
          let article = {
            title:game.CreatorPath.target,
            image:data.query.pages[pgid].thumbnail.source
          }
          this.setState({
            creatorTarget:article
          })
        }
        else {
          let article = {
            title:game.CreatorPath.target,
            image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
          }
          this.setState({
            creatorTarget:article
          },()=>{
            alert(this.state.creatorTarget.image)
          })  
        }
    })
    //fetch joiner target 
    let API2 = 'https://en.wikipedia.org/w/api.php?action=query&titles='+game.JoinerPath.target+'&prop=pageimages&format=json&pithumbsize=600';
    fetch(API2)
      .then(response => response.json())
      .then(data => {
      var pgid = Object.keys(data.query.pages)[0];
      if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
        let article = {
          title:game.JoinerPath.target,
          image:data.query.pages[pgid].thumbnail.source
        }
        this.setState({
          joinerTarget:article
        })
      }
      else {
        let article = {
          title:game.JoinerPath.target,
          image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6g5X-oXWXB0OlpfvqY0XmoZik1FiTSwB5YBIN7m4xOunbUXKC'
        }
        this.setState({
          joinerTarget:article
        })
      }
    })
  }
  changeTurn = ()=>{
    //check if we have a winner first
    //if we don't than update game state
    this.setState({timerStart:true},()=>{
      if (this.state.isCreatorTurn) {
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTJoiner}));
        
      }
      else{
          const ref =  firebase.database().ref("/theMole"+categoryPlayed);
          const gameRef = ref.child(currentGamekey);
          gameRef.update(({'state': STATE.NEXTCreator}));
      }
    });
  }
  TimerExpired = ()=>{
    if (this.state.isCreatorTurn) {
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTJoiner}));
    }
    else{
        const ref =  firebase.database().ref("/theMole"+categoryPlayed);
        const gameRef = ref.child(currentGamekey);
        gameRef.update(({'state': STATE.NEXTCreator}));
    }
  }
  getArticleInfo(title){
    //get article info from wikipedia.
      InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+title+'&redirects=';
      myRequest = new Request(InfoApi, body); 
      fetch(myRequest)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          var pageid = Object.keys(data.query.pages)[0];
          Alert.alert(
            title,
            data.query.pages[pageid].extract,
            [
              {
                text: 'Cancel',
                //onPress: () => {this._handleNotificationForeGround(false,data.key,data.category)},
                style: 'cancel',
              },
              {
                text: "Let's go!", 
                onPress: () => {this.nextMove(title)},
                style:'default'
              },
            ],
            {cancelable: true},
          );  
          // this.setState({   
          //   // timerStart:false,       
          //   // dialogContent:data.query.pages[pageid].extract,
          //   // dialogTitle:title,
          // },()=>{
          //   this.setState({
          //     // timerStart:false,
          //     // modalVisible:true,
          //     // pathVisible:false,
          //   })
          // })
      })     
  }
  getDataOnTarget = (title)=>{
    alert(title);
    
        InfoTitle = title;
        InfoApi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&exintro&titles='+InfoTitle+'&redirects=';
        alert(InfoApi);
        myRequest = new Request(InfoApi, body); 
        fetch(myRequest)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          var pageid = Object.keys(data.query.pages)[0];
          
          Alert.alert(
            InfoTitle,
            data.query.pages[pageid].extract,
            [
              {
                text: "OK", 
                style:'default'
              },
            ],
          );  
        
        })  
  }
  cancelInfo = ()=>{
    this.setState({
      timerStart:false,
      modalVisible: false,
      modalTargetVisible:false,
      pathVisible:false,
    });
  }
  nextMove = (title)=>{
    const ref =  firebase.database().ref("/theMole"+categoryPlayed);
    const gameRef = ref.child(currentGamekey);
    
    this.setState({
      timerStart:false,
      modalVisible: false,
      modalTargetVisible:false,
      pathVisible:false,
    },()=>{
      //check who's turn is it..
      if (this.state.user==this.state.creatorUid && !this.state.wait) {
        //1. check if chosen node equal to target
        if (this.state.creatorTarget.title==title) {
          //we have a winner.
          gameRef.update(({'state': STATE.WINCreator}));
          //show confetty
          //show staff to oponent
        }
        else{
          let uri = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetPath/?source='+title+'&target='+this.state.creatorTarget.title+'&categoryNAME='+this.state.category;
          console.log(uri);
          fetch(uri)
          .then(response => response.json())
          .then((data)=>{
            if (data[0][0]=='not found') {
              alert('no path from ' + title + ' to ' + this.state.creatorTarget.title + ' try another article..')
            }
            else{
              article={
                title:title,
                image:images.logo
              }
              list.push(article);
              gameRef.update(({'currentCreatorPathCount': data[0].length}));
              let firstVertex = data[0][1];
              let TwoMore = data[1];
              this.setState({
                creatorVerteciesToChooseFrom:[firstVertex,...TwoMore],
                yourPathCount:data[0].length,
                creatorCurrentNode:title
              },()=>{
                this.fetchListForcCreatorFromWiki();
                this.changeTurn();
              })
            }
          })
        }
      }

      //JOINER METHODS
      if (this.state.user==this.state.joinerUid && !this.state.wait) {
        //1. check if chosen node equal to target
        if (this.state.joinerTarget.title==title) {
          //we have a winner.
          gameRef.update(({'state': STATE.WINJoiner}));
        }
        else{
          let uri = 'https://proj.ruppin.ac.il/bgroup65/prod/api/network/?source='+title+'&target='+this.state.joinerTarget.title+'&categoryNAME='+this.state.category;
          console.log(uri);
          fetch(uri)
          .then(response => response.json())
          .then((data)=>{
            if (data[0][0]=='not found') {
              alert('no path from ' + title + ' to ' + this.state.joinerTarget.title + ' try another article..')
            }
            else{
              article={
                title:title,
                image:images.logo
              }
              list.push(article);
              console.log(data);
              gameRef.update(({'currentJoinerPathCount': data[0].length}));
              let firstVertex = data[0][1];
              let TwoMore = data[1];

              this.setState({
                joinerVerteciesToChooseFrom:[firstVertex,...TwoMore],
                yourPathCount:data[0].length,
                joinerCurrentNode:title
              },()=>{
                this.fetchListForJoinerFromWiki();
                this.changeTurn();
              })
            }
          })
        }
      }
    })

    //IF NOT:
    //2. update current node
    //3. get path from current node to target
    //4. get more random vertecies to show as options
    //5. change turn's

  }
  getNewCards = ()=>{
    let endpoint = '';
    if (this.state.user == this.state.creatorUid) {
      endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetRandomVerteciesFromVertex3/?source='+this.state.creatorCurrentNode+'&categoryName='+categoryPlayed;
    }
    if (this.state.user == this.state.joinerUid) {
      endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/networkGetRandomVerteciesFromVertex3/?source='+this.state.joinerCurrentNode+'&categoryName='+categoryPlayed;
    }
    fetch(endpoint)
      .then(response => response.json())
      .then((data)=>{
        if (this.state.user == this.state.creatorUid) {
          this.setState({
            creatorVerteciesToChooseFrom:data
          },()=>{
            this.fetchListForcCreatorFromWiki();
          })        
        }
        if (this.state.user == this.state.joinerUid) {
          this.setState({
            joinerVerteciesToChooseFrom:data
          },()=>{
            this.fetchListForJoinerFromWiki();
          })
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  render(){
    if (!this.state.isStarted) {
      return(
        <Box f={1} center bg="white">
          <WikiLoader/>
        </Box>
      )
    }
    return(
      <View style={{flex:1}}>
      {/* Using alert instead */}
        <Dialog 
            footer={<DialogButton
              text="OK"
              onPress={() => {this.cancelInfo()}}
            />  }
            width={0.9}
            height={0.8}
            visible={this.state.pathVisible}
            dialogTitle={<DialogTitle title="Paths History" />}
            >
            <DialogContent>
            <ScrollView>

              {this.state.historyPaths.map((item,index)=>{
              return(
              <List key={index}>
                    <ListItem avatar>
                      <Left>
                        <Text note>{index+1}.</Text>
                      </Left>
                      <Body>
                        <Text>{item.title}</Text>
                        <Text note></Text>
                      </Body>
                    </ListItem>
              </List>
              )
                })
              }       
              </ScrollView>    
            </DialogContent>
      </Dialog>
        
        <Dialog 
            width={0.9}
            height={0.8}
            visible={this.state.modalTargetVisible}
            dialogTitle={<DialogTitle title={this.state.dialogTitle} />}
            footer={
              <DialogFooter>
                <DialogButton
                  text="OK"
                  onPress={() => {this.cancelInfo()}}
                />
              </DialogFooter>
            }
            
            >
            <DialogContent>
              <ScrollView>
                <Text>
                  {this.state.dialogContent}
                </Text>
              </ScrollView>
            </DialogContent>
        </Dialog>
        
        <Dialog 
            width={0.9}
            height={0.8}
            visible={this.state.modalVisible}
            dialogTitle={<DialogTitle title={this.state.dialogTitle} />}
            footer={
              <DialogFooter style={{zIndex:4}}>
                <DialogButton
                  text="CANCEL"
                  onPress={() => {this.cancelInfo()}}
                />
                <DialogButton
                    text="OK"
                    onPress={() => {this.nextMove(this.state.dialogTitle)}}
                  />
              </DialogFooter>
            }
          >
            <DialogContent>
              <ScrollView>
                <Text>
                  {this.state.dialogContent}
                </Text>
              </ScrollView>
            </DialogContent>
            
      </Dialog>
       
      
        <View style={{flex:0.2,flexDirection:'row',marginTop:10}}>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>You</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'green'}}>{this.state.yourPathCount}</Text>
          </View>
          <View style={{flex:0.2,marginTop:'7%'}}>
            <CountdownTimer startAgain={this.state.timerStart} Expired={this.TimerExpired}/>
          </View>
          <View style={{flex:0.4,marginTop:'7%'}}>
            <Text style={{textAlign:'center',fontSize:21}}>Opponent</Text>
            <Text style={{textAlign:'center',fontSize:24,color:'red'}}>{this.state.oponentPathCount}</Text>
          </View>
        </View> 


        <View flex={0.4} style={{alignContent:'space-between',flexDirection:'row',marginTop:20}}>
          <View flex={0.2}></View>
          <View flex={0.6} style={{justifyContent:'center'}}>
            <View flex={0.3}>
              <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center'}}>Target</Text>
            </View>
            <View flex={0.2} style={{fontWeight:'bold',textAlign:'center',marginTop:4}}>
              {this.state.user==this.state.creatorUid ?<Text style={{textAlign:'center',fontSize:13}}>{this.state.creatorTarget.title}</Text>:<Text style={{textAlign:'center',fontSize:15}}>{this.state.joinerTarget.title}</Text>}
            </View>
            <View flex={0.5} style={{flexDirection:'row',marginTop:18}}>
              <View flex={0.3}></View>
              <View flex={0.4}>
                  {this.state.user==this.state.creatorUid ? 
                  (
                    //<TouchableHighlight onPress={()=>this.getArticleInfo(this.state.creatorTarget.title)}>
                      <ImageBackground source={{uri: this.state.creatorTarget.image}} style={{ flex: 1}} resizeMode='stretch'>
                        <View>
                        </View>
                      </ImageBackground>  
                    //</TouchableHighlight>
                  )
                  :
                  (
                    //<TouchableHighlight onPress={()=>this.getArticleInfo(this.state.joinerTarget.title)}>
                      <ImageBackground source={{uri: this.state.joinerTarget.image}} style={{ flex: 1}} resizeMode='stretch'>
                          <View>
                          </View>
                      </ImageBackground>
                    //</TouchableHighlight>
                  )
                }
              </View>
              <View flex={0.3}>
              </View>
            </View>
          </View>
        </View>
       
       
        <View style={{flex:0.4,marginTop:marTop}}>
          {
            this.state.wait 
          ? 
            <Text></Text>
          :
            (<View flex={1} style={{marginTop:10}}>
              <FlatGrid
                itemDimension={100}
                items={this.state.user==this.state.creatorUid ? listCreator : listJoiner }
                style={styles.gridView}
                //staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={()=>this.getArticleInfo(item.title)}>
                    <ImageBackground source={{uri:item.image}} style={{ flex: 1}} resizeMode='stretch'>
                      <View style={[styles.itemContainer]}>
                        
                      </View>
                    </ImageBackground>
                    <Text style={{textAlign:'center',fontSize:16}}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>)
          }
        </View>
        
        
        <Container style={{backgroundColor:'transparent'}} >
            <Content />
            <Footer  >
            <ImageBackground source={images.network} style={{width: '100%', height:footerHeight,color:'transparent'}}>
              <FooterTab>
                  <Button vertical onPress={this.openPathHistory}>
                    <Icon style={styles.iconStyle} name="ios-flag" />
                  </Button>
                  <Button vertical onPress={this.getNewCards}>
                    <Icon style={styles.iconStyle} name="ios-sync" />
                  </Button>
              </FooterTab>
              </ImageBackground>
            </Footer>
          </Container>
       
    </View>
    )
  }
}


//STYLE
const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'space-between',
    padding: 10,
    height: 60,
  },
  itemName: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  iconStyle:{
    color:'black',
    fontSize:33
  },
  textStyle:{
    fontSize:15,
    fontWeight:'bold',
    color:'black'
  }
});
