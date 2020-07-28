import {createAppContainer,createStackNavigator,createSwitchNavigator,createBottomTabNavigator} from 'react-navigation';
import React,{Component} from 'react';
import NetworkHeader from '../common/NetworkHeader'
import Categories from './CategoriesScreen';
//Auth screen (only if the player isn't signed in)
const AuthNavigator = createStackNavigator(
    {
        Login:{
            getScreen: ()=>require('./LoginScreen').default,
        }
    },
    {
        navigationOptions:{
           header:null,
        },
    },
)

//user profile 
const ProfileNavigator = createStackNavigator(
    {
        Profile: {
            getScreen: ()=>require('./ProfileScreen').default,
        },
    },
)

const BombNavigator = createStackNavigator(
    {
        BombShop: {
            getScreen: ()=>require('./BombShop').default,
        },
    },
)

const LeaderboardNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=>require('./Leaderboard').default,
        },
    },
)

const PathsNavigator = createStackNavigator(
    {
        BombShop: {
            getScreen: ()=>require('./PathsScreen').default,
        },
    },
)

const AvatarNavigator = createStackNavigator(
    {
        Avatar: {
            getScreen: ()=> require('./AvatarScreen').default,
        }
    }
)
//walkthrough game introduction . . .
const IntroNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./Intro').default,
        }
    }
)

//Article screen
const ArticleNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./article').default,
        }
    }
)

//Categories screen
const CategoriesNavigator = createStackNavigator(
    {
        Intro: {
            getScreen:Categories,
        }
    }
)
//Choose a Game screen
const ChooseAGameNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./ChooseAGame').default,
        }
    }
)
//Join a  game screen
const JoinAGameNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./JoinAGame').default,
        }
    }
)
//Game Board Screen
const TheMoleGameNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./TheMoleGame').default,
        }
    }
)
//my opened games screen 
const MyOpenGamesNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./MyOpenGames').default,
        }
    }
)
//loser screen 
const LoserNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./loserScreen').default,
        }
    }
)
//winner screen 
const WinnerNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./winnerScreen').default,
        }
    }
)
//games won screen 
const GamesWonNavigator = createStackNavigator(
    {
        Intro: {
            getScreen: ()=> require('./GamesWon').default,
        }
    }
)
//settings screen . . .
const SettingsNavigator = createStackNavigator(
    {
        Settings: {
            getScreen: ()=> require('./SettingsScreen').default,
        }
    },
    {
    navigationOptions: {
        headerBackground: (
          <NetworkHeader/>
        ),
        headerTitleStyle: { color: '#000' },
      }
    },
)


//using switch navigator for better performence
const AppNavigator = createSwitchNavigator(
    {
        Splash:{
            getScreen:()=>require('./Splash').default,
        },
        Auth: AuthNavigator,
        Avatar: AvatarNavigator,
        Profile:ProfileNavigator,
        Intro:IntroNavigator,
        Settings:SettingsNavigator,
        Article:ArticleNavigator,
        //Categories:CategoriesNavigator,
        Categories:{
            getScreen:()=>require('./CategoriesScreen').default,
        },
        BombShop:BombNavigator,
        Paths:PathsNavigator,
        ChooseAGame:ChooseAGameNavigator,
        GameBoard:TheMoleGameNavigator,
        JoinGame: {
            getScreen: ()=> require('./JoinAGame').default,
        },
        MyOpenGames:MyOpenGamesNavigator,
        Winner:WinnerNavigator,
        Loser:LoserNavigator,
        GamesWon:GamesWonNavigator,
        Leaderboard:LeaderboardNavigator
    },{
        initialRouteName:'Splash',
    }
)

//warp with app container
const AppContainer = createAppContainer(AppNavigator);
class Navigation extends Component{
    render(){
        return <AppContainer />;
    }
}

export default Navigation;