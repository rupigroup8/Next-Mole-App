import React,{Component} from "react";
import {Alert,Text,View} from "react-native";
import ConffetiForWinner from "../common/ConffetiForWinner";
import firebase from 'firebase';

export default class Winner extends React.Component{
    state= {
        showConffeti:false,
        userUID:firebase.auth().currentUser.uid
    }
    componentDidMount(){
        this.setCashMoleForWinner();
        this.setState({
            showConffeti:true
        },()=>{
            window.setTimeout(()=>{
                Alert.alert('Nice!','Great win, You got +25 CashMole😉');
                this.props.navigation.navigate('Profile');
            },4000)
        })
    }
    setCashMoleForWinner = ()=>{
        //increase wins and cashMole for the winner
        const cash = 25;
        const win = 1;
        const endpoint = 'https://proj.ruppin.ac.il/bgroup65/prod/api/playerWinOrLose?win='+win+'&cashMole='+cash+'&uid='+firebase.auth().currentUser.uid;
        console.log(endpoint);  
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
        if (this.state.showConffeti) {
            return(
                <ConffetiForWinner/>
            )
        }
        return(
            <View flex={1}>
                <Text>Good job! You Won 25 CASH MOLE!</Text>
            </View>
        )
    }
}