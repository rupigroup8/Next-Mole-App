import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';


const scopes = ['profile','email'];

//add new user to DB from here


// app.json - 
//    gal reut      
//"android": "833547522567-ouanclkn46868t0dak561p5oop9d63l4.apps.googleusercontent.com",
//    sapir
//"android": "625987979169-470e5jli10dbo7nq3q9cecskrksd8gsk.apps.googleusercontent.com"

const loginAsync = async ()=>{
    try {
        const result = await Google.logInAsync({
          //  sapir
            //androidClientId:'625987979169-470e5jli10dbo7nq3q9cecskrksd8gsk.apps.googleusercontent.com',
            iosClientId: '625987979169-ich3hq56mbspf3k8lp6ttd4it6g246e6.apps.googleusercontent.com',
          // gal reut
            androidClientId: '833547522567-ouanclkn46868t0dak561p5oop9d63l4.apps.googleusercontent.com',
            scopes,
            behavior:'web'
        })
        if (result.type ==="success") {
            onSignIn(result);
            return Promise.resolve(result.accessToken);
        }
        return Promise.reject('Not able to log into google acount');
    } catch (error) {
        return Promise.reject(error);
    }
}

const onSignIn = (googleUser) => {
  console.log('success')
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) =>{
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase.auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then((result)=>{
          console.log("user signed in");
          if (result.additionalUserInfo.isNewUser) {
            //write to our db. 
            //POST method.
            fetch('https://proj.ruppin.ac.il/bgroup65/prod/api/Player', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  Locale:result.additionalUserInfo.profile.locale,
                  NickName:result.additionalUserInfo.profile.name,
                  Email: result.user.email,
                  ProfilePic: result.additionalUserInfo.profile.picture,
                  Uid: firebase.auth().currentUser.uid
                }),
            })
            .catch((error) => {
              console.error(error);
            });
          }else{
            let LastLogin = 'http://proj/bgroup65/prod/Player?uid='+firebase.auth().currentUser.uid;
            fetch(LastLogin).catch((error)=>{console.log(error)})
          }
        })
        .catch((error) =>{
          console.log(error);
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }

  const  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }


export const GoogleApi = {loginAsync,onSignIn};