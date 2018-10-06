import React, {Component} from 'react';
import { View, AsyncStorage } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner, Picker, Icon, Header, Left, Body, Title } from 'native-base';

import Config from './../../config/index';

export default class ClaimScreen extends Component {
    static navigationOptions = {
      title: 'Welcome',
      header: null
    };

    constructor(props) {
        super(props);
        this.state = { 
            UserID : '',
            Title : '',
            Description : '',
            Status : 'Open',
            InsuranceCompany : 'First world insurance',
            Employer : '',
            file : '',
            medicalRecords : null,
            ajaxInProgress : true
        };

        this.fetchMedicalRecords = this.fetchMedicalRecords.bind(this);
        this.onDocumentSelect = this.onDocumentSelect.bind(this);

        let _self = this;
        _self.user = null;
        AsyncStorage.getItem('user', (err, result) => {
            _self.user = JSON.parse(result);
            console.log('user in upload docs', _self.user);
            _self.fetchMedicalRecords();
            if(!_self.user){
                _self.props.navigation.navigate('Home'); 
            }
        });
        
    }

    fetchMedicalRecords(){
        var _self = this;
        _self.setState({ajaxInProgress : true});
        let fetchData = { 
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + _self.user.token
              },
        }
        fetch(Config.API_URL + 'medical-record', fetchData)
            .then((res) => res.json())
            .then(function(res) {
                console.log("medical-record", res);
                _self.setState({medicalRecords : res.data});
                _self.setState({ajaxInProgress : false});
            })
            .catch(function() {
                alert('Error In Fetching MedicalRecords');
            });
    }

    
    onDocumentSelect(value) {
        console.log(value);
        for( let i = 0; i < this.state.medicalRecords.length; i++){
            if(this.state.medicalRecords[i]._id == value){
                console.log(this.state.medicalRecords[i]);
                this.setState({
                    file: this.state.medicalRecords[i]
                });
                break;
            }
        }
        console.log('onDocumentSelect', this.state.file);
    }


    onSubmit(){
        let _self = this;
        _self.setState({ajaxInProgress : true});

        let obj = { 
            Title : this.state.Title,
            Description : this.state.Description,
            Status : this.state.Status,
            InsuranceCompany : this.state.InsuranceCompany,
            Employer : this.state.Employer,
            Files : [{
                URL : _self.state.file.URL,
                ObjectID : _self.state.file._id,
            }]
        };
        console.log(obj);

        const url = Config.API_URL + "claims";
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
            console.log('Claim ', res);
            _self.setState({ajaxInProgress : false});
            if(!res.id){
                alert(res.message);
            } else {
                //await AsyncStorage.setItem('user', JSON.stringify(res));
                _self.props.navigation.navigate('Profile'); 
            }
        })
        .catch(function(err) {
            console.log(err);
            alert('Error In Claim');
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
                        <Title>Submit Claim</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
    
                    { this.state.ajaxInProgress ? 
                    <Spinner color='blue' />
                    :
                    <Form >
                        <Item stackedLabel>
                            <Label>Title</Label>
                            <Input onChangeText={(text) => this.setState({Title: text})} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Description</Label>
                            <Input onChangeText={(text) => this.setState({Description : text})} />
                        </Item>                        
                        <Item stackedLabel>
                            <Label>Employer</Label>
                            <Input onChangeText={(text) => this.setState({Employer : text})} />
                        </Item>
                        <Item style={{ padding: 5}} picker last>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ width: undefined }}
                                placeholder="Select Document"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                selectedValue={this.state.file && this.state.file._id}
                                onValueChange={this.onDocumentSelect}
                            >
                                <Picker.Item label={'Select Document'} value={null} key={null} />
                                { this.state.medicalRecords && this.state.medicalRecords.map(rec => {
                                    return <Picker.Item label={rec.Name || rec.Description} value={rec._id} key={rec._id} />
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