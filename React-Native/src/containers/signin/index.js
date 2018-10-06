import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner, Picker, Icon, Header, Left, Body, Title } from 'native-base';

export default class SignInScreen extends Component {
    static navigationOptions = {
        title: 'Welcome',
        header: null
      };
  
      constructor(props) {
          super(props);
          this.state = { 
              email : '',
              password : '',
              ajaxInProgress : false
          };
      }
  
      validate = (text) => {
          console.log(text);
          let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
          if(reg.test(text) === false)
          {
          console.log("Email is Not Correct");
          this.setState({email:''})
          return false;
            }
          else {
            this.setState({email:text})
            console.log("Email is Correct");
          }
      }

      onSubmit(){
          let _self = this;
          _self.setState({ajaxInProgress : true});
          let obj = { 
              email : this.state.email,
              password : this.state.password
          };
          console.log(obj);
  
          const url = Config.API_URL + "auth";
          // The data we are going to send in our request
          let data = obj;
          // The parameters we are gonna pass to the fetch function
          let fetchData = { 
              method: 'POST', 
              body: JSON.stringify(data),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
          }
          fetch(url, fetchData)
          .then((res) => res.json())
          .then(async (res) => {
              console.log('Sign In ', res);
              _self.setState({ajaxInProgress : false});
              if(!res.user){
                  alert(res.message);
              } else {
                  await AsyncStorage.setItem('user', JSON.stringify(res));
                  //AsyncStorage.setItem('MyUser', JSON.stringify(res), () => {
                      //AsyncStorage.getItem('MyUser1', (err, result) => {
                       // console.log(result);
                      //});
                  //});
                  _self.props.navigation.navigate('Profile'); 
              }
          })
          .catch(function(err) {
              console.log(err);
              alert('Error In Sign In');
          });
  
      }
  
      render() {
          const { navigate } = this.props.navigation;
          return (
              <Container>
                  <Header>
                      <Left>
                          <Button transparent onPress={() =>
                                  navigate('Home', { name: 'Home' })
                              }>
                          <Icon name='arrow-back' />
                          </Button>
                      </Left>
                      <Body>
                          <Title>Sign In</Title>
                      </Body>
                  </Header>
                  <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
      
                      { this.state.ajaxInProgress ? 
                      <Spinner color='blue' />
                      :
                      <Form >
                          <Item stackedLabel>
                              <Label>Email</Label>
                              <Input onChangeText={(text) => this.validate(text)} />
                          </Item>
                          <Item stackedLabel >
                              <Label>Password</Label>
                              <Input secureTextEntry={true} onChangeText={(text) => this.setState({password : text})} />
                          </Item>
                          
                          <View style={{ width: '100%', padding: 10}}>
                              <Button full primary onPress={this.onSubmit.bind(this)} ><Text> Submit </Text></Button>
                          </View>
                    
                      </Form>
                      }
    
                  </Content>
              </Container>
          );
      }
    
  
  }