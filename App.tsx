import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserRegistartion from './src/components/UserRegistartion';
import Login from './src/components/Login';
import RespondAudioScreen from './src/components/RespondAudioScreen';
import HomeScreen from './src/components/HomeScreen';
import RecordAudioScreen from './src/components/RecordingAudioScreen';
import LandingScreen from './src/components/LandingScreen';
//import AudioRecorder from './src/components/AudioRecorder';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: 'Audio Sharing App',
            headerTitleStyle: {
              fontWeight: 'bold', // Add bold font weight
              fontSize: 20, // Increase font size
              color: 'white',
            },
            headerStyle: {
              backgroundColor: 'purple',
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Registration" component={UserRegistartion} />
        <Stack.Screen
          name="LandingScreen"
          component={LandingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecordAudio"
          component={RecordAudioScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RespondAudio"
          component={RespondAudioScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
