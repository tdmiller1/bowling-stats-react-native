import React from 'react';
import { Text, View, Image, TouchableOpacity, CameraRoll, Button } from 'react-native';
import { Camera, Permissions, takeSnapshotAsync, MediaLibrary, ImagePicker, FileSystem, ImageManipulator } from 'expo';
// import ImagePicker from 'react-native-image-picker'


const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("photo", {
    name: photo.fileName,
    type: photo.type,
    uri:photo.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  // data.append("attributes", {
  //   name: "photo.fileName",
  //   parent: {
  //     id:"0"
  //   }
  // });

  console.log(data)
  return data;
};

export default class CameraScreen extends React.Component {

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        photo:null
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

    handleUploadPhotoBox = () => {
        console.log("upload")
        console.log(this.state.photo)
        fetch("https://upload.box.com/api/2.0/files/content", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'large_client_body_buffers':'300k',
            'Authorization':'Bearer DuZ1QP5FUqHP0X8ELiZEFVwychhiAhNR'
          },
          body: createFormData(this.state.photo, {attributes: {name:"tigers.png",parent:{id:"0"}}})
        })
          .then(response => console.log(response))
      }      

      handleUploadPhoto = () => {
        console.log("upload")
        console.log(this.state.photo)
        fetch("http://10.225.29.165:3000/api/upload", {
          method: "POST",
          body: createFormData(this.state.photo, { userId: "123" })
        })
          .then(response => response.json())
          .then(response => {
            console.log("upload succes", response);
            alert("Upload success!");
            this.setState({ photo: null });
          })
          .catch(error => {
            console.log("upload error", error);
            alert("Upload failed!");
          });
      };

    handleChoosePhoto = async() => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });
      this.setState({ photo: result });
      var testName = ""
      FileSystem.getInfoAsync(this.state.photo.uri)
      .then((result) => {
        console.log(result)
        testName = result.uri.split("file:///var/mobile/Containers/Data/Application/2A4186D2-E7AC-4D00-827F-06C77EDF9D1A/Library/Caches/ExponentExperienceData/%2540tdmiller%252Ftest/ImagePicker/")
        console.log(testName[1])
        var photo = this.state.photo
        photo["fileName"] = testName[1]
        this.setState({photo : photo})
      })
      
    }


    render() {
        const { hasCameraPermission, photo } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 35 }} onPress={this.handleChoosePhoto}>Pick Photo</Text>
                {photo && (
                <React.Fragment>
                  <Image source={{ uri: photo.uri }} style ={{width:300, height:300 }} />
                </React.Fragment>)}
                
                <Text style={{ fontSize: 30 }} onPress={this.handleUploadPhoto}>Stupid</Text>
                
                <Text style={{ fontSize: 20 }} onPress={this.exitCamera}>Exit</Text>
            </View>
            );
        }
    }
  }