import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner, Picker, Icon, Header, Left, Body, Title } from 'native-base';

import Config from './../../config/index';

export default class SignUpScreen extends Component {
    static navigationOptions = {
      title: 'Welcome',
      header: null
    };

    constructor(props) {
        super(props);
        this.state = { 
            firstName : '',
            lastName : '',
            role : 'admin',
            email : '',
            password : '',
            organization : '',
            orgs : null,
            ajaxInProgress : true
        };

        this.onOrganizationSelect = this.onOrganizationSelect.bind(this);
        this.fetchOrganizations = this.fetchOrganizations.bind(this);

        console.debug('this.props', props);

        this.fetchOrganizations();
        
    }

    fetchOrganizations(){
        var _self = this;
        _self.setState({ajaxInProgress : true});
        fetch(Config.API_URL + 'blockChain/organizationsList')
            .then((res) => res.json())
            .then(function(res) {
                console.log("organizations", res);
                _self.setState({orgs : res.success});
                _self.setState({ajaxInProgress : false});
            })
            .catch(function() {
                alert('Error In Fetching Organizations');
            });
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

    onOrganizationSelect(value) {
        console.log(value);
        for( let i = 0; i < this.state.orgs.length; i++){
            if(this.state.orgs[i].orgId == value){
                console.log(this.state.orgs[i]);
                this.setState({
                    organization: this.state.orgs[i]
                });
                break;
            }
        }
        console.log('onOrganizationSelect', this.state.organization);
    }


    onSubmit(){
        let _self = this;
        _self.setState({ajaxInProgress : true});
        let obj = { 
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            role : this.state.role,
            email : this.state.email,
            password : this.state.password,
            organization : this.state.organization
        };
        console.log(obj);

        const url = Config.API_URL + "users";
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
        .then(function(res) {
            console.log('Sign up ', res);
            _self.setState({ajaxInProgress : false});
            if(!res.user){
                _self.setState({ajaxInProgress : false});
                alert(res.message);
            } else {
                //await AsyncStorage.setItem('user', JSON.stringify(res));
                _self.props.navigation.navigate('Home'); 
            }
        })
        .catch(function(err) {
            console.log(err);
            alert('Error In Sign Up');
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
                        <Title>Sign Up</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
    
                    { this.state.ajaxInProgress ? 
                    <Spinner color='blue' />
                    :
                    <Form >
                        <Item stackedLabel>
                            <Label>First Name</Label>
                            <Input onChangeText={(text) => this.setState({firstName: text})} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Last Name</Label>
                            <Input onChangeText={(text) => this.setState({lastName : text})} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Email</Label>
                            <Input onChangeText={(text) => this.validate(text)} />
                        </Item>
                        <Item stackedLabel >
                            <Label>Password</Label>
                            <Input secureTextEntry={true} onChangeText={(text) => this.setState({password : text})} />
                        </Item>
                        <Item style={{ padding: 5}} picker last>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ width: undefined }}
                                placeholder="Select Organization"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                selectedValue={this.state.organization.orgId}
                                onValueChange={this.onOrganizationSelect}
                            >
                                <Picker.Item label={'Select Organization'} value={null} key={null} />
                                { this.state.orgs && this.state.orgs.map(org => {
                                    return <Picker.Item label={org.name} value={org.orgId} key={org.orgId} />
                                })}

                            </Picker>
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