import React from 'react';
import {Box} from 'react-native-design-utility';
import {Image,StyleSheet} from 'react-native';
import {images} from '../constant/images';

const NetworkHeader = (props) =>(
    <Box center>
        <Image 
        style={{width:"100%",height:100,backgroundColor:'transparent'}}
        source={images.network} />
    </Box>
)

export default NetworkHeader;