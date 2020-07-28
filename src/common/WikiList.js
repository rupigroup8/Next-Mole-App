import React,{ Component  } from "react";
import { View,Linking} from "react-native";
import { ListItem } from 'react-native-elements'

//let list = [];

export default class WikiList extends Component{
    state = {
        paths:[],
        anotherPath:false
    }
    componentDidUpdate(){
        const pathLength = this.props.pathList.length;
        console.log('update: ')
        if (this.state.paths.length!==0 && this.props.getPathAgain && !this.state.anotherPath) {
            this.setState({
                paths:[]
            })
        }
        this.props.pathList.map((article,i)=>{

            let API = 'https://en.wikipedia.org/w/api.php?action=query&titles='+article+'&prop=pageimages&format=json&pithumbsize=100';
            console.log(API);
            fetch(API)
                .then(response => response.json())
                .then(data => {
                console.log(data);
                //getting the page id for extracting information about the article 
                var pageid = Object.keys(data.query.pages)[0];
                
                //getting the full url to redirect user onPress
                fullWikiUri = 'https://en.wikipedia.org/wiki/';
                let wiki = data.query.pages[pageid].title;
                fullWikiUri = fullWikiUri + wiki;
                
                //updating the list to be rendered
                let wikiArticleForList = {
                    name:data.query.pages[pageid].title,
                    avatar_url:data.query.pages[pageid].thumbnail.source,
                    wikiUrl:fullWikiUri
                }
                //this condition avoids infinte loop
                if (this.state.paths.length!==pathLength) {
                    //list.push(wikiArticleForList);
                    this.setState({
                        paths:[...this.state.paths,wikiArticleForList],
                        anotherPath:true
                    })
                }
            })
        })
        console.log(this.state.paths)
    }
    render(){
        return(
            <View>
            {
                this.state.paths.map((l, i) => (
                <ListItem
                    onPress={()=> Linking.openURL(l.wikiUrl)}
                    key={i}
                    leftAvatar={{ 
                        source: { uri: l.avatar_url } 
                    }}
                    title={l.name}
                    subtitle={l.subtitle}
                    rightIcon={{
                        type:'ios-git-compare',
                        color:'grey'
                    }}
                />
                ))
            }
            </View>
        )
    }
}