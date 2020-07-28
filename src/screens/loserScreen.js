import React from "react";
import { Alert } from "react-native";
import firebase from 'firebase';
import { AnimatedEmoji } from 'react-native-animated-emoji';

export default class LoserScreen extends React.Component{
    state={
        userUID:firebase.auth().currentUser.uid,
    }
    componentDidMount(){
        this.getCashMoleFromLoser();
    }
    onAnimationCompleted = ()=>{
        Alert.alert('Maybe next time...','You Lost -25 CashMole 😲');
        this.props.navigation.navigate('Profile');
    }
    getCashMoleFromLoser=()=>{
        //decrease cashMole by -25 and set +0 wins
        const cash = -25;
        const win = 0;
        const endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/playerWinOrLose?win='+win+'&cashMole='+cash+'&uid='+firebase.auth().currentUser.uid;
          fetch(endpoint,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then((data)=>{
            })
            .catch((error)=>{
              console.log(error);
            })
    }
    render(){
        return(

                <AnimatedEmoji
                    
                    index={5} // index to identity emoji component
                    style={{ bottom: 300 }} // start bottom position
                    name={'disappointed_relieved'} // emoji name
                    size={30} // font size
                    duration={5000} // ms
                    onAnimationCompleted={this.onAnimationCompleted} // completion handler
                />
        )
    }
}