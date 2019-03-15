import React from 'react';
// import BoxSDK from 'box-node-sdk';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  Button,
  AsyncStorage,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
const auth0Domain = 'https://tuckermillerdev.auth0.com';

// const sdk = new BoxSDK({  clientID: BOX_clientID,  clientSecret: BOX_clientSecret});

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = { 
      email:null,
      accessToken:null,
      games: [],
      text:'placeholder' };
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _retrieveData = async () =>{
    try{
      const token = await AsyncStorage.getItem('userToken');
      if(token!==null){
        this.setState({accessToken: token})
        fetch(`${auth0Domain}/userinfo?access_token=${token}`)
        .then((response) => response.json())
        .then((result) => {
          this._isMounted && this.setState({
            email: result.email,
            accessToken: token
          });
          this.pullGames();
        });
      }
    }catch(error){
      console.log(error)
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  componentDidMount(){
    this._isMounted = true;
    // var client = sdk.getBasicClient(BOX_accesstoken);
    this._retrieveData();
  }

  componentDidUpdate(){
    this.pullGames();
  }

  pullGames = _ => {
    var host = "https://bowling-stats-server.herokuapp.com"
    const url = `${host}/games/find?id=${this.state.email}`;
    fetch(url).then(response => {
      return response.json().then(body => {
        if(response.status === 200){
          this._isMounted && this.setState({games: body.games})
        }
      })
    })
  }


  renderGames = () => {
    if(this.state.games.length != 0){
      return this.state.games.map(function(game, i){
        return(
          <View key={i}>
            <Text>{game.score}</Text>
            <Text>{game.date}</Text>
          </View>
        )
      })
    }
  }

  otherScreen= async () =>{
    this.props.navigation.navigate('Camera');
  }

  // DEV TEST
  createBoxFolder = () => {
    const {text} = this.state
    fetch('https://api.box.com/2.0/folders', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization':'Bearer ZEbzZBYtYqIavFlfqQqUZAXwVShlOsYT'
      },
      body: JSON.stringify({
        name: text.toString(),
        parent: {id:"0"},
      }),
    }).then((response) => {console.log(response)})
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
          <View>{this.renderGames()}</View>
        <Button title="Camera" onPress={this.otherScreen} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
          <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <Button title="Create Box Folder" onPress={this.createBoxFolder} />
        <Text>{this.state.text}</Text>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
