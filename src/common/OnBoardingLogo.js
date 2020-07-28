import React from 'react';
import {Box} from 'react-native-design-utility';
import {Image} from 'react-native';

import {images} from '../constant/images';

const OnBoardingLogo = () =>(
    <Box center>
                <Image 
                style={{width: 300, height: 300}}
                source={images.logo} />
            </Box>
)

export default OnBoardingLogo;