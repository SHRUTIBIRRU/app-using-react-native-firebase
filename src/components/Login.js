import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    try {
      const response = await auth().signInWithEmailAndPassword(
        email.trim(),
        password,
      );
      if (response) {
        ToastAndroid.showWithGravity(
          'Cogactulations! you are logged in successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.navigate('LandingScreen');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text>{message}</Text>
      <View style={styles.subContainer}>
        <Text>No Account?</Text>
        <TouchableOpacity
          style={{paddingLeft: 10}}
          onPress={() => navigation.navigate('Registration')}>
          <Text
            style={{
              color: 'skyblue',
            }}>
            Click Here to register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default LoginScreen;
