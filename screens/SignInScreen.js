import React from 'react';
import {
  Button,
  View,
  AsyncStorage
} from 'react-native';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({ domain: 'tuckermillerdev.auth0.com', clientId: 'us90SZb8Ycff5cupcpGxFH9fXI5FyBR3' });

export default class SignInScreen extends React.Component {
    
    state = {
        isLoadingComplete: false,
        accessToken: null,
        name:null
    };

    handleLogin = () => {
    auth0
        .webAuth
        .authorize({scope: 'openid profile email', audience: ''})
        .then((credentials) => {
        auth0
            .auth
            .userInfo({token: credentials.accessToken})
            .then((user) => {
            this.setState({
                accessToken: credentials.accessToken,
                avatar: user.picture,
                name: user.nickname
            });
            this._signInAsync();
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error));
    }
    
    static navigationOptions = {
      title: 'Please sign in',
    };
  
    render() {
      return (
        <View>
          <Button title="Sign in!" onPress={this.handleLogin} />
        </View>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', this.state.accessToken);
      this.props.navigation.navigate('App');
    };
  }