import React, {Component} from 'react';
import { View, AsyncStorage, Platform, StyleSheet, PixelRatio, Image,
    TouchableOpacity } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner, Picker, Icon, Header, Left, Body, Title, Card, CardItem } from 'native-base';
import ImagePicker from 'react-native-image-picker';

import Config from './../../config/index';

export default class UploadDocumentsScreen extends Component {
    static navigationOptions = {
      title: 'Welcome',
      header: null
    };

    constructor(props) {
        super(props);
        this.state = { 
            fileName : '',
            description : '',
            ImageSource: null,
            ImageBase64: ''
        };

        let _self = this;
        _self.user = null;
        AsyncStorage.getItem('user', (err, result) => {
            _self.user = JSON.parse(result);
            console.log('user in upload docs', _self.user);
            if(!_self.user){
                _self.props.navigation.navigate('Home'); 
            }
        });

    }

    
    onSubmit(){

        console.log(this.state);

        let _self = this;
        _self.setState({ajaxInProgress : true});
        let obj = { 
            Name : this.state.fileName,
            Description : this.state.description,
            File : this.state.ImageBase64
        };
        console.log(obj);

        const url = Config.API_URL + "medical-record";
        // The data we are going to send in our request
        let data = obj;
        // The parameters we are gonna pass to the fetch function
        let fetchData = { 
            method: 'POST', 
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + _self.user.token
              },
        }
        fetch(url, fetchData)
        .then((res) => res.json())
        .then(function(res) {
            console.log('Upload Doc ', res);
            _self.setState({ajaxInProgress : false});
            if(!res.status){
                _self.setState({ajaxInProgress : false});
                alert(res.message);
            } else {
                //await AsyncStorage.setItem('user', JSON.stringify(res));
                _self.props.navigation.navigate('Profile'); 
            }
        })
        .catch(function(err) {
            console.log(err);
            alert('Error In Upload Doc');
        });
        

    }

    selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };

            let base64 = 'data:image/jpeg;base64,' + response.data;
    
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    
            this.setState({
              ImageSource: source,
              ImageBase64: base64
            });
          }
        });
      }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() =>
                                navigate('Profile', { name: 'Profile' })
                            }>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Upload Documents</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
    
                    { this.state.ajaxInProgress ? 
                    <Spinner color='blue' />
                    :
                    <Form >

                        <Card>
                            <CardItem cardBody>
                                { this.state.ImageSource === null ? 
                                    <Image source={this.state.ImageSource} style={{height: 0, width: 0, flex: 1}}/>
                                :
                                    <Image source={this.state.ImageSource} style={{height: 200, width: null, flex: 1}}/>
                                } 
                            </CardItem>
                        </Card>

                        <View style={{ width: '100%', padding: 10}}>
                            <Button full primary onPress={this.selectPhotoTapped.bind(this)} ><Text> Select Photo </Text></Button>
                        </View>

                        <Item stackedLabel>
                            <Label>File Name</Label>
                            <Input onChangeText={(text) => this.setState({fileName: text})} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Description</Label>
                            <Input onChangeText={(text) => this.setState({description : text})} />
                        </Item>
    
                        <View style={{ width: '100%', padding: 10}}>
                            <Button full primary onPress={this.onSubmit.bind(this)} ><Text> Upload </Text></Button>
                        </View>
                  
                    </Form>
                    }
  
                </Content>
            </Container>
        );
    }
  }
