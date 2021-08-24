import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import ErrorMessage from '../components/ErrorMessage';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { firebaseConfig } from '../utils/config';
import * as firebase from 'firebase';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginError, setLoginError] = useState('');


  const onLogin = async () => {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
        navigation.replace('home');
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image
        source={require('../assets/store.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>Retail Pulse</Text>
      <View style={styles.space} />
      {loginError ? <ErrorMessage error={loginError} visible={true} /> : null}
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <View style={styles.space} />
      <FormButton
        buttonTitle="Sign In"
        onPress={onLogin}
      />
    </ScrollView>
  );
}


export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  space: {
    width: 20, // or whatever size you need
    height: 40,
  },
});
