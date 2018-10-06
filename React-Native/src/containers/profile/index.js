import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';
import { Container, Header, Content, Button, Text } from 'native-base';

export default class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  constructor(props){
    super(props);

    let _self = this;
    let user = null;
    AsyncStorage.getItem('user', (err, result) => {
        user = JSON.parse(result);
        console.log('user', user);
        if(!user){
            _self.props.navigation.navigate('Home'); 
        }
    });

}

signOut(){
    let _self = this;
    AsyncStorage.removeItem('user', (err, result) => {
        _self.props.navigation.navigate('Home');
    });
}

  render() {
    const { navigate } = this.props.navigation;
    return (
        <Container>
        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
            <View style={{ flex: 1,
                flexDirection: 'column',
                justifyContent: 'center', alignItems :  'center'}} >
            
                <View style={{ padding : 10 }} >
                    <Button
                        primary
                        style={{}}
                        onPress={() =>
                            navigate('UploadDocuments', { name: 'Upload Documents' })
                        }
                    ><Text> Upload Documents </Text></Button>
                </View>
                <View style={{ padding : 10 }} >
                    <Button
                        primary
                        style={{}}
                        onPress={() =>
                            navigate('Claim', { name: 'Claim' })
                        }
                    ><Text> Claim </Text></Button>
                </View>
                <View style={{ padding : 10 }} >
                    <Button
                        primary
                        style={{}}
                        onPress={this.signOut.bind(this)}
                    ><Text> Sign Out </Text></Button>
                </View>
            
            </View>
        </Content>
    </Container>
    );
  }
}
