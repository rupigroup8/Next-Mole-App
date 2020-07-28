import React,{ Component } from 'react';
import {Box} from 'react-native-design-utility'
import {Animated} from 'react-native';

import OnBoardingLogo from '../common/OnBoardingLogo';
import {FbButton,GoogleButton} from '../buttons/AuthButton';
import { FacebookApi } from '../api/Facebook';
import { GoogleApi } from '../api/Google';


class LoginScreen extends Component{
    state={
        opacity: new Animated.Value(0),
        position: new Animated.Value(0)
    }
    static navigationOptions = {
        header: null,
    }
    componentDidMount(){
        Animated.parallel([this.positionAnim(),this.opacityAnim()]).start();
    }
    opacityAnim = ()=>{
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration:300,
            delay:100
        }).start()
    };
    positionAnim = () =>{
        Animated.timing(this.state.position,{
            toValue:1,
            duration:400,
            useNativeDriver:true
        }).start()
    };

    onGooglePress =async ()=>{
        //alert("google press");
        try {
            const token = await GoogleApi.loginAsync();
            //alert('token: ' + token);

        } catch (error) {
            console.log('error',error);
        }
    };
    onFacebookPress = async ()=>{
        //alert("facebook press");
        try {
            const token = await FacebookApi.loginAsync();
            //alert('token: ' + token);

        } catch (error) {
            console.log('error',error);
        }
    };
    render(){
        const {opacity} = this.state;
        const logoTransition = this.state.position.interpolate({
            inputRange:[0,1],
            outputRange:[150,0]
        })

        return(
            <Box f={1} center bg="white">
                <Animated.View style={{flex:1,transform:[{
                    translateY:logoTransition
                }]}}>
                    <Box f={1} center>
                        <OnBoardingLogo />
                    </Box>
                </Animated.View>
                <Animated.View style={{flex:0.9,width:"80%",shadow:1,opacity}} >
                    <FbButton onPress={this.onFacebookPress}/>
                    <GoogleButton onPress={this.onGooglePress}/>
                </Animated.View>
            </Box>
        )
    }
}

export default LoginScreen;