import React from 'react';
import { View,Text } from "react-native";
import { Notifications } from 'expo';

export default class PushNotPage extends React.Component {

    state = {
        token: '',
        txtToken: '',
        notification: {},
    }

    componentDidMount() {
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notification) => {
        this.setState({ notification: notification });
    };

    getMyToken = () => {
        this.setState({ txtToken: this.state.token });
    };

    btnSendPushFromClient = () => {
        let per = {
            to: this.state.token,
            title: 'title from client',
            body: "body from client side",
            badge : 3,
            data : {name:"nir", grade:100 }
        };

        // POST adds a random id to the object sent
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(per),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                    returned from server\n
                    json.data= ${JSON.stringify( json.data)}`);

                } else {
                    alert('err json');
                }
            });
    }

    btnSendPushFromServer = () => {
        let pnd = {
            to: this.state.token,
            title: 'title from Ruppin Server',
            body: "body from server side",
            badge : 4,
            data : {name:"sivan", grade:99 }
        };

        // POST adds a random id to the object sent
        fetch('http://proj.ruppin.ac.il/igroup96/test1/sendpushnotification', {
            method: 'POST',
            body: JSON.stringify(pnd),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json != null) {
                    console.log(`
                    returned from Ruppin server\n
                    json= ${JSON.stringify( json)}`);

                } else {
                    alert('err json');
                }
            });
    }
}
