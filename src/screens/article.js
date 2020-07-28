import * as React from 'react';
import {Linking,ScrollView,ActivityIndicator} from 'react-native';
import {  Button, Card, Title, Paragraph } from 'react-native-paper';
import { Icon } from "native-base";
import NetworkHeader from '../common/NetworkHeader';
//import {images} from '../constant/images';
import {Box} from 'react-native-design-utility';
import WikiLoader from '../common/WikiLoader';

const wikipediaApi = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&prop=extracts&exintro=&explaintext=&grnnamespace=0';
const body = { method: 'GET', dataType: 'json'};
const myRequest = new Request(wikipediaApi, body); 
let fullWikiUri = "";


class RandArticle extends React.Component{
  state = {
    imageUrl:'https://i.pinimg.com/originals/59/9a/2b/599a2b3ebc21325ff8f26bd6bf94ed61.jpg',
    randomArticle:"",
    article:false,
    randomArticleImage:"",
    randomArticleURI:"",
    isReady:false
  }
  componentDidMount(){
    fetch(myRequest)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            var pageid = Object.keys(data.query.pages)[0];
            fullWikiUri = 'https://en.wikipedia.org/wiki/';
            let wiki = data.query.pages[pageid].title;
            fullWikiUri = fullWikiUri + wiki;
            this.setState({ 
              randomArticle: data.query.pages[pageid],
              article: true
             },()=>{
              let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+this.state.randomArticle.title+'&prop=pageimages&format=json&pithumbsize=400';
              fetch(API)
              .then(response => response.json())
              .then(data => {
                var pgid = Object.keys(data.query.pages)[0];
                if (typeof data.query.pages[pgid].thumbnail !== "undefined") {
                  this.setState({imageUrl:data.query.pages[pgid].thumbnail.source,isReady:true})
                }
                else {
                  this.setState({
                    isReady:true,
                    imageUrl:'https://i.pinimg.com/originals/59/9a/2b/599a2b3ebc21325ff8f26bd6bf94ed61.jpg',
                  })
                }
              })
             })
          })
          
  }
  static navigationOptions =({ navigation })=> {
    return{
        headerTitle:"Random Wiki!",
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#000',fontSize:23 },
        headerLeft: 
              ( <Button
                  onPress={()=>navigation.navigate('Profile')}
                  style={{backgroundColor:"transparent"}}>
                  <Icon style={{color:"#403773",fontSize:35}}  name="ios-arrow-round-back" />
                </Button>
              ),
      }
    }
  goBackToProfile = ()=>{
    this.props.navigation.navigate('Profile');
  }
  goBackToWikipedia = ()=>{
    Linking.openURL(fullWikiUri);
  }
  getRandomAgain = ()=>{
    this.setState({isReady:false},()=>{
      this.componentDidMount();
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
    return(
    <ScrollView>
      <Card elevation={16}>
          <Card.Cover style={{width:400,height:300,backgroundColor:'transparent'}} resizeMode='repeat' source={{uri:this.state.imageUrl}}/>      
          <Card.Content>
          <Title>{this.state.randomArticle.title}</Title>
          <Paragraph>{this.state.randomArticle.extract}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={this.goBackToProfile}>Ok</Button>
          <Button onPress={this.goBackToWikipedia}>Get the full article!</Button>
          <Button style={{color:'#79BC6D'}} onPress={this.getRandomAgain}>NEXT ONE!</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
    )
  }
}


export default RandArticle;