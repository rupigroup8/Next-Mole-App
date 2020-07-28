import * as Facebook from 'expo-facebook';
import firebase from 'firebase';

const permissions = ['public_profile','email'];

//add new user to DB from here

const loginAsync = async () =>{
    try {
      // sapir
        await Facebook.initializeAsync('752014891800107');
        //  gal reut
        //await Facebook.initializeAsync('559289171399567');
        const {
          type,
          token,
          expires,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({permissions});
        // const {type,token } = await Facebook.logInWithReadPermissionsAsync('752014891800107',{permissions});
        if (type ==="success") {
            console.log('suc', token.authResponse)
            checkLoginState(token);
            return Promise.resolve(token);
        }
        else{
          console.log('errorrrr', token.authResponse)
        }
        return Promise.reject('no success');
    } catch (error) {
        return Promise.reject(error);
    }
}

const checkLoginState = (event) => {
  console.log('inside check facebook login state')
    if (event) {
       console.log('37' ,event); 
      // User is signed-in Facebook.
      var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) =>{
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(event, firebaseUser)) {
          // Build Firebase credential with the Facebook auth token.
          var credential = firebase.auth.FacebookAuthProvider.credential(
            event
        );
          // Sign in with the credential from the Facebook user.
          firebase.auth().signInAndRetrieveDataWithCredential(credential)
          .then((type)=>{
              console.log("user signed in" + type.user.uid)
              if (type.additionalUserInfo.isNewUser) {
                console.log(type.additionalUserInfo);
                fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/Player', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  Locale:"",
                  NickName:type.additionalUserInfo.profile.name,
                  Email: type.additionalUserInfo.profile.email,
                  ProfilePic: type.additionalUserInfo.profile.picture.data.url,
                  Uid:firebase.auth().currentUser.uid
                }),
                })
                .catch((error) => {
                  console.error(error);
                });
              }else{
                let LastLogin = 'https://proj/bgroup65/prod/Player?uid='+firebase.auth().currentUser.uid;
                fetch(LastLogin, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                })
                .catch((error)=>{
                  console.log(error);
                });
              }
          })
          .catch((error) =>{
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
        } else {
          // User is already signed-in Firebase with the correct user.
          console.log('User already signed-in Firebase.');

        }
      });
    } else {
      // User is signed-out of Facebook.
      firebase.auth().signOut();
    }
  }

  const isUserEqual = (facebookAuthResponse, firebaseUser) =>{
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
            providerData[i].uid === facebookAuthResponse.userID) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

export const FacebookApi = {
    loginAsync
}