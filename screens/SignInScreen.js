import React from 'react';
import {
  Button,
  View,
  AsyncStorage
} from 'react-native';
import { AuthSession } from 'expo';
import Auth0 from 'react-native-auth0';
import jwtDecoder from 'jwt-decode';

const auth0ClientId = 'us90SZb8Ycff5cupcpGxFH9fXI5FyBR3';
const auth0Domain = 'https://tuckermillerdev.auth0.com';

// const auth0 = new Auth0({ domain: 'tuckermillerdev.auth0.com', clientId: 'us90SZb8Ycff5cupcpGxFH9fXI5FyBR3' });

function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export default class SignInScreen extends React.Component {
    
    state = {
        isLoadingComplete: false,
        accessToken: null,
        name:null,
        result:null,
        email:null
    };

    handleParams = (responseObj) => {
      if (responseObj.error) {
        Alert.alert('Error', responseObj.error_description
          || 'something went wrong while logging in');
        return;
      }
      const encodedToken = responseObj.id_token;
      const decodedToken = jwtDecoder(encodedToken);
      const username = decodedToken.name;
      this.setState({ username });
    }
    

    _loginWithAuth0 = async () => {
      let redirectUrl = AuthSession.getRedirectUrl();
      let authUrl = `${auth0Domain}/authorize` + toQueryString({
          client_id: auth0ClientId,
          response_type: 'token',
          scope: 'openid name email',
          redirect_uri: redirectUrl,
      });

      const result = await AuthSession.startAsync({
        authUrl: authUrl
      });

      if(result.type === 'success'){
        let token = result.params.access_token;
        fetch(`${auth0Domain}/userinfo?access_token=${token}`)
        .then((response) => response.json())
        .then((result) => {
          this.setState({
            email: result.email,
            accessToken: token
          });
          this._signInAsync();
        });
      }
    }
    
    static navigationOptions = {
      title: 'Please sign in',
    };
  
    render() {
      return (
        <View>
          <Button title="Sign in!" onPress={this._loginWithAuth0} />
        </View>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', this.state.accessToken);
      this.props.navigation.navigate('App');
    };
  }