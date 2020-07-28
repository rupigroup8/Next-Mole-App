import { SideMenu, List, ListItem } from 'react-native-elements'
import React from "react";
import { View } from "react-native";
import {images} from '../constant/images';
import GameBoard from '../screens/TheMoleGame';
const list = [
    {
        avatar_url:images.avatar1,
        name:'avatar 1'
    },
    {
        avatar_url: images.avatar2,
        name:'avatar 2'
    },
    {
        avatar_url:images.avatar3,
        name:'avatar 3'
    },
    {
        avatar_url:images.avatar4,
        name:'avatar 4'
    }
]

export default class SidePath extends React.Component{ 
    constructor () {
        super()
        this.state = {
            isOpen: true
        }
        this.toggleSideMenu = this.toggleSideMenu.bind(this)
    }

    toggleSideMenu () {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render () {
    const MenuComponent = (
        <View style={{flex: 1, backgroundColor: '#ededed', paddingTop: 50}}>
        <List containerStyle={{marginBottom: 20}}>
        {
            list.map((l, i) => (
            <ListItem
                roundAvatar
                onPress={() => console.log('Pressed')}
                avatar={l.avatar_url}
                key={i}
                title={l.name}
                // subtitle={l.subtitle}
            />
            ))
        }
        </List>
        </View>
        )

        return (
            <SideMenu
                isOpen={this.state.isOpen}
                menu={MenuComponent}>
                <GameBoard toggleSideMenu={this.toggleSideMenu.bind(this)} />
            </SideMenu>
        )
    }
}