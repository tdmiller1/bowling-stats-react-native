import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon, AuthSession } from 'expo';
import AppNavigator from './navigation/AppNavigator';
// import Auth0 from 'react-native-auth0';

// const auth0 = new Auth0({ domain: 'tuckermillerdev.auth0.com', clientId: 'Otg8g3tLLbeDgj8KsXhyyuzQgYR006Bq' });

const auth0ClientId = 'us90SZb8Ycff5cupcpGxFH9fXI5FyBR3';
const auth0Domain = 'tuckermillerdev.auth0.com';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    accessToken: null,
    name:null
  };

  handleLogout = () => {
    this.setState({
      accessToken: null,
      avatar: null,
      name: null
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator screenProps={{
            accessToken: this.state.accessToken,
            name: this.state.name,
            handleLogin: this._loginWithAuth0,
            handleLogout: this._loginWithAuth0
          }}/>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
