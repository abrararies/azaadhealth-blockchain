
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';

import HomeScreen from './../containers/home/index';
import ProfileScreen from './../containers/profile/index';
import SignInScreen from './../containers/signin/index';
import SignUpScreen from './../containers/signup/index';
import UploadDocumentsScreen from './../containers/uploaddocuments/index';
import ClaimScreen from './../containers/claim/index';

export default Routes = {
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
  SignIn: { screen: SignInScreen },
  SignUp: { screen: SignUpScreen },
  UploadDocuments: { screen: UploadDocumentsScreen },
  Claim: { screen: ClaimScreen },
};