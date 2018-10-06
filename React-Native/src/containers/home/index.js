import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';
import { Container, Header, Content, Button, Text } from 'native-base';

export default class HomeScreen extends Component {
    static navigationOptions = {
      title: 'Welcome',
      header: null
    };

    constructor(props){
        super(props);

        let _self = this;
        let user = null;
        AsyncStorage.getItem('user', (err, result) => {
            user = JSON.parse(result);
            console.log('user', user);
            if(user){
                _self.props.navigation.navigate('Profile'); 
            }
        });

    }

    render() {
      const { navigate } = this.props.navigation;
      return (
        <Container>
            <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
                <View style={{ flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center', alignItems :  'center'}} >
                
                    <View style={{ padding : 10 }} >
                        <Button
                            primary
                            style={{}}
                            onPress={() =>
                                navigate('SignIn', { name: 'Sign In' })
                            }
                        ><Text> Sign In </Text></Button>
                    </View>
                    <View style={{ padding : 10 }} >
                        <Button
                            primary
                            style={{}}
                            onPress={() =>
                                navigate('SignUp', { name: 'Sign Up' })
                            }
                        ><Text> Sign Up </Text></Button>
                    </View>
                
                </View>
            </Content>
        </Container>
      );
    }
  }