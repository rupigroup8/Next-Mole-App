import React,{ Component } from "react";
import {Image, StyleSheet,View ,TouchableOpacity,Linking,ScrollView,ImageBackground} from "react-native";
import {Button,Icon, Text} from 'native-base';
import  NetworkHeader from '../common/NetworkHeader';
import Autocomplete from 'react-native-autocomplete-input';
import { ListItem,Avatar } from 'react-native-elements'
import { images } from "../../src/constant/images";
import {Box} from 'react-native-design-utility';
import WikiLoader from '../common/WikiLoader';


let newStateArray = [];

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        borderRadius:50,
        marginBottom:50,
        zIndex:4
      },
      autocompleteContainer: {
        marginLeft: 10,
        marginRight: 10,
      },
      itemText: {
        fontSize: 22,
        margin: 1,
        color:'#3C4037'
      },

      infoText: {
        textAlign: 'center'
      },
      list:{
        borderColor:"grey",
        borderWidth:0.6,
        borderStyle:'solid',
        backgroundColor:'#E2B5FF',
        position:'relative'
      },
      openingText: {
        textAlign: 'center'
      },
        textInputStyle:{
            height:40,
            borderColor:'grey',
            borderWidth:1,
            margin:'5%',
            padding:10,
            borderRadius:10
        },
        title:{
            textAlign:'center',

        }
})

export default class Paths extends React.Component{

    static navigationOptions = ({ navigation }) =>{
        return{
            headerTitle: (
                <Image style={{ width: 220, height: 39 }} source={images.SIXDOW}/>
            ),
          headerBackground: (
            <NetworkHeader/>
          ),
          headerTitleStyle: { color: '#4D5F66',fontSize:23 },
          headerLeft: 
           ( <Button
              onPress={()=>navigation.navigate('Profile')}
              style={{backgroundColor:"transparent",elevation:0}}>
              <Icon  style={{color:"#403773",fontSize:35}}  name="ios-arrow-round-back" />
            </Button>
           ),
          }
        }
    state={
        path:[],
        paths:[],
        articles: [],
        secondArticles:[],
        query: '',
        secondQuery:'',
        isReady:true,
        isButtonReady:true,
    }
    FirstOpenSearchWiki = (text)=>{
        const serachTerm = text;
        const API = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+serachTerm+'&limit=10&namespace=0&format=json';
        if (serachTerm.length>0) {
            console.log(serachTerm);
            console.log(API);
            fetch(API)
            .then(response => response.json())
            .then(data => {
                console.log(data[1]);
                this.setState({ 
                articles:data[1],
                query: text,
                isButtonReady:this.state.secondQuery.length>0 ? false : true
                })
          })
        }
        
    }

    SecondOpenSearchWiki = (text)=>{
        const serachTerm = text;
        const API = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+serachTerm+'&limit=10&namespace=0&format=json';

        if (serachTerm.length>0) {
        //console.log(serachTerm);
        //console.log(API);
        fetch(API)
          .then(response => response.json())
          .then(data => {
            console.log(data[1]);
            this.setState({ 
                secondArticles:data[1],
                secondQuery: text,
                isButtonReady:this.state.query.length>0 ? false : true
             })
          })
        }
    }
    SearchPath = ()=>{   
        this.setState({
            isReady:false
        },()=>{ 
        //let source = this.state.query.replace(' ','%20').toString();
        //let target = this.state.secondQuery.replace(' ','%20').toString();
        let end = '?source='+this.state.query+'&target='+this.state.secondQuery+'';
        let pathsUri = 'http://proj.ruppin.ac.il/bgroup65/prod/api/SIXDOW'+end;
        fetch(pathsUri)
          .then((response) => response.json())
          .then(async (data) => {
            this.setState({
                paths:data,
                path:[],
            },()=>
            {
                    newStateArray = [];
                    let originalArrayForSort=[];
                    //console.log(this.state.paths)
                    for (let i = 0; i < this.state.paths.length; i++) {
                            if(i%2==0){
                                originalArrayForSort.push(this.state.paths[i]);
                                this.GetData(this.state.paths[i],i);
                            }
                    }
  
                })
            })
        })
    }
    GetData = (article,index)=>{
        //console.log(article)
        let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+article+'&prop=pageimages&format=json&pithumbsize=100';
        //console.log(API);
        fetch(API)
        
            .then(response => response.json())
            .then(data => {
                        //getting the page id for extracting information about the article 
                        var pageid = Object.keys(data.query.pages)[0];
                       
                        //console.log(data.query.pages[pageid].title);

                        if (data.query.pages[pageid].missing === "") {
                            alert("no good");
                            return;
                        }
                        //getting the full url to redirect user onPress
                        fullWikiUri = 'https://en.wikipedia.org/wiki/';
                        let wiki = data.query.pages[pageid].title;
                        fullWikiUri = fullWikiUri + wiki;
                        let pic = 'https://www.freeiconspng.com/uploads/no-image-icon-4.png';
                        if (typeof data.query.pages[pageid].thumbnail !== "undefined") {
                            pic = data.query.pages[pageid].thumbnail.source;
                        }
                        
                        //updating the list to be rendered
                        
                        let wikiArticleForList = {
                            name:data.query.pages[pageid].title,
                            avatar_url:pic,
                            wikiUrl:fullWikiUri,
                            index:index
                        }

                        newStateArray.push(wikiArticleForList);
                            
                    })
                .then(()=>{
                        console.log(newStateArray);
                        newStateArray.sort((num1, num2) => num1.index < num2.index ? -1 : 1);
                        console.log(newStateArray);
                        this.setState({
                            //path:newStateArray,
                            isReady:true
                        })
                })
    }
    render(){
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        if (!this.state.isReady) {
            return(
              <Box f={1} center bg="white">
                <WikiLoader/>
              </Box>
            )
          }
        return(
            <View flex={1} style={{marginTop:'4%',backgroundColor:'transparent'}}>
                <Text style={{textAlign:'center',marginTop:'5%',fontSize:24}}>Find the shortest path{"\n\n"}From</Text>

                <View style={styles.container}>
                    <Autocomplete
                    listStyle={styles.list}
                    autoCapitalize="words"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={this.state.articles.length === 1 && comp(query, this.state.articles[0]) ? [] : this.state.articles}
                    defaultValue={this.state.query}
                    onChangeText={text => this.FirstOpenSearchWiki(text)}
                    renderItem={(wikiTitle) => (
                        <TouchableOpacity onPress={() => this.setState({ query: wikiTitle,articles:[]})}>
                            <Text style={styles.itemText}>
                                {wikiTitle}
                            </Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                <Text style={{textAlign:'center',fontSize:24,marginTop:'3%'}}>To</Text>
                <View style={styles.container}>
                    <Autocomplete
                    listStyle={styles.list}
                    autoCapitalize="words"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    data={this.state.secondArticles.length === 1 && comp(query, this.state.secondArticles[0]) ? [] : this.state.secondArticles}
                    defaultValue={this.state.secondQuery}
                    onChangeText={text => this.SecondOpenSearchWiki(text)}
                    renderItem={(wikiTitle) => (
                        <TouchableOpacity onPress={() => this.setState({ secondQuery: wikiTitle,secondArticles:[] })}>
                            <Text style={styles.itemText}>
                                {wikiTitle}
                            </Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                <View flex={1} style={{margin:"5%"}}>
                    <Button disabled={this.state.isButtonReady} style={{backgroundColor:"#81BFAF"}} onPress={this.SearchPath} block >
                        <Text style={{fontSize:25,fontWeight:'bold'}}>Let's Go!</Text>
                    </Button>
                    <ScrollView>
                        <View>
                        {
                            newStateArray.map((l, i) => (
                            <ListItem
                                onPress={()=> Linking.openURL(l.wikiUrl)}
                                key={i}
                                leftAvatar={<Avatar
                                    source={ {uri: l.avatar_url} }
                                    size="large"
                                />}
                                title={l.name}
                                subtitle={l.subtitle}
                                rightIcon={
                                    <Icon 
                                    name='ios-infinite'
                                    style={{fontSize: 25, color: '#AE81FE'}}
                                    />
                                }
                            />
                            ))
                        }
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
