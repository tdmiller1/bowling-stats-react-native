import React from 'react';
import { Text, View, Image, TouchableOpacity, CameraRoll } from 'react-native';
import { Camera, Permissions, takeSnapshotAsync, MediaLibrary } from 'expo';

export default class CameraScreen extends React.Component {

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        cameraRollUri: false
      };

    static navigationOptions = {
      title: 'Take Picture of Game Screen',
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ 
            hasCameraPermission: status === 'granted',
            hasCameraRollPermission:  cameraRollStatus === 'granted'
        });
      }

    exitCamera= async () =>{
    this.props.navigation.navigate('App');
    }

    snap = async () => {
        if (this.camera) {
          let photo = await this.camera.takePictureAsync()
          .then(this.camera.pausePreview());
        //   let result = await takeSnapshotAsync(this.camera,{format: 'png'})
          
        //   
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
          console.log(photo)
          console.log(asset)
        this.setState({cameraRollUri: photo })

        let file = new File(photo.uri)
        fetch('https://upload.box.com/api/2.0/files/content', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization':'Bearer QYQldyztR59IGG4BqYPe9JtQLRRXOY0P'
          },
          body: JSON.stringify({
            attributes: {
              name:"test.png",
              parent: {id:"0"}
            },
            file: file
          }),
        }).then((response) => {console.log(response)})

        // let saveResult = await CameraRoll.saveToCameraRoll(asset.uri, 'photo');
        //   console.log(result)
        //   this.setState({cameraRollUri: saveResult })
          
        //   await this.camera.saveToCameraRoll(photo)
        // console.log(photo)
        // if (this.state.hasCameraPermission === null) {
        // }else if(this.state.hasCameraPermission === false){

        // }else{
        // CameraRoll.saveToCameraRoll(photo);
        // }
        // }
        }
      };


    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 35 }} onPress={this.snap}>Snap</Text>
                {this.state.cameraRollUri && 
                <Image source={{ uri: this.state.cameraRollUri.uri }}
                style={{width:500, height:500}} />
                }
                {!this.state.cameraRollUri &&
                    <Camera ref={view=> {this.camera = view;}} style={{ flex: 1 }} type={this.state.type}>
                    <View
                        style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                        style={{
                            flex: 0.1,
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            this.setState({
                            type: this.state.type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back,
                            });
                        }}>
                        <Text
                            style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                            {' '}Flip{' '}
                        </Text>
                        </TouchableOpacity>
                    </View>
                    </Camera>
                 }
                <Text style={{ fontSize: 20 }} onPress={this.exitCamera}>Exit</Text>
            </View>
            );
        }
    }
  }