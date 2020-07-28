import React, { Component } from "react";
import BouncingPreloader from './Bouncing';
import {images} from '../constant/images';

export default class WikiLoader extends Component{
render(){
  return(
        <BouncingPreloader
        icons={[
            images.logo,
        ]}
        leftRotation="-780deg"
        rightRotation="60deg"
        leftDistance={-180}
        rightDistance={-250}
        speed={2000} />
    )
      }
}