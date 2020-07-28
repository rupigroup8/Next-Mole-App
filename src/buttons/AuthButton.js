import React from 'react';
import { SocialIcon } from 'react-native-elements'
import {Box } from 'react-native-design-utility';

export const FbButton = (props) => {
    return(
    <SocialIcon
        onPress={props.onPress}
        style={{borderRadius:2}}
        title='Sign In With Facebook'
        button
        type='facebook'
    />
    );
}

export const GoogleButton = (props) =>{
    return(
    <SocialIcon
        onPress={props.onPress}
        style={{backgroundColor:"red",borderRadius:3}}
        title='Sign In With Google'
        button
        type='google'
    />
    );
}