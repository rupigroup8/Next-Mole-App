import * as React from 'react';
import { Image,Text } from 'react-native';
import { Banner } from 'react-native-paper';

import {images} from '../constant/images';


export default class BannerMole extends React.Component {
  state = {
    visible: true,
  };

  render() {
    return (
      <Banner
        visible={this.state.visible}
        actions={[
          {
            label: 'OK',
            onPress: () => this.setState({ visible: false }),
          },
        ]}
        image={({ size}) =>
          <Image
            source={images.logo}
            style={{
              width: 70,
              height: 70,
            }}
          />
        }
      >
        <Text style={{fontSize:20,marginTop:"10%"}}>{this.props.title}</Text>
      </Banner>
    );
  }
}