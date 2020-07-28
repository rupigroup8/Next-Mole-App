import React from "react";
import {View,Text,ScrollView} from 'react-native';
import PopupDialog, { SlideAnimation,DialogTitle } from 'react-native-popup-dialog';
import {  List, ListItem } from 'react-native-elements'



const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom',
});

class GamePopUp extends React.Component{

cancelInfo = ()=>{
    this.popupDialog.dismiss();
}

render(){
    return(
    <View>
        <PopupDialog
        width={0.9}
        height={400}
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        dialogAnimation={slideAnimation}
        dialogTitle={this.props.title}
        >
            <ScrollView>
                <Text>{this.props.articleContent}</Text>
            </ScrollView>
            <DialogButton
            text="OK"
            onPress={() => {this.cancelInfo()}}
            />
        </PopupDialog>
    </View>
    )
}

}

export default GamePopUp;