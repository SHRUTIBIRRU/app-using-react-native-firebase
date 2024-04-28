import React, {useState} from 'react';
import {View, Button, PermissionsAndroid, Platform, Text} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {firebase} from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export default function RecordAudioScreen({navigation}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const audioRecorderPlayer = new AudioRecorderPlayer();

  async function requestAudioPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Recording audio permission granted');
        } else {
          console.log('Recording audio permission denied');
        }
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
    }
  }

  // Call the function to request permission when the component mounts or when recording is about to start

  const startRecording = async () => {
    try {
      requestAudioPermission();
      const directory = RNFS.DocumentDirectoryPath; // Get the writable directory path
      const path = `${directory}/audio_${Date.now()}.wav`;
      //const path = '/audio_' + Date.now() + '.wav';
      console.log('startpath', path);
      const uri = await audioRecorderPlayer.startRecorder(path); // Call startRecorder method
      setAudioPath(uri);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error); // Log any errors
    }
  };

  const uploadAudioToFirebase = async path => {
    try {
      const reference = firebase
        .storage()
        .ref()
        .child('audio/' + Date.now() + '.wav'); // Create a reference to the desired location in Firebase Storage
      const fileExists = await RNFS.stat(path); // Check if the file exists at the specified path
      if (fileExists) {
        // Wait for the file to be fully written before attempting to upload
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time if needed
        await reference.putFile(path); // Upload the file to Firebase Storage
        const downloadURL = await reference.getDownloadURL(); // Get the download URL of the uploaded file
        console.log('Audio file uploaded to Firebase:', downloadURL);
      } else {
        console.error(
          'Failed to upload audio to Firebase: The local file specified does not exist on the device',
        );
      }
    } catch (error) {
      console.error('Failed to upload audio to Firebase:', error); // Log any errors
    }
  };

  const stopRecording = async () => {
    const path = await audioRecorderPlayer.stopRecorder();
    setAudioPath(path);
    setIsRecording(false);
    await uploadAudioToFirebase(path);
    //await saveAudio();
    // const response = await fetch(audioPath);
    // console.log('response', response);
    // const blob = await response.blob();
    // console.log('blob', blob);

    // const storageRef = firebase
    //   .storage()
    //   .ref(path.substring(path.lastIndexOf('/')))
    //   .child('audio/' + Date.now() + '.wav');
    // await storageRef.put(audioPath);
    // console.log('path, response, blob, storageRef', storageRef);
    // const downloadURL = await storageRef.getDownloadURL();
    // firebase.database().ref('entries').push(downloadURL);
  };

  const saveAudio = async () => {
    // Get the audio file URI

    // const path = RNFS.DocumentDirectoryPath + '/audio_' + Date.now() + '.wav';
    const path = 'audio_' + Date.now() + '.wav';
    console.log('path', path);
    const audioFileUri = await audioRecorderPlayer.startRecorder();
    console.log('audioFileUri', audioFileUri);
    // Upload the audio file to Firebase Storage
    const storageRef = firebase.storage().ref();
    const audioFileRef = storageRef.child(
      'audio/' + audioFileUri.split('/').pop(),
    );
    await audioFileRef.putFile(audioFileUri);

    // Get the audio file download URL
    const audioFileDownloadUrl = await audioFileRef.getDownloadURL();

    // Save the audio file download URL to Firebase Database
    const databaseRef = firebase.database().ref();
    const audioFileDatabaseRef = databaseRef.child(
      'audio/' + audioFileUri.split('/').pop(),
    );
    await audioFileDatabaseRef.set(audioFileDownloadUrl);

    // Alert the user that the audio file has been saved
    alert('Audio file has been saved!');
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 10,
          marginTop: 10,
        }}>
        <Button
          title={'Start Recording'}
          onPress={startRecording}
          disabled={isRecording}
        />
        <Button
          title={'Stop Recording'}
          onPress={stopRecording}
          disabled={!isRecording}
        />
        <Text style={{color: 'black'}}>{isRecording ? 'Recording' : ''}</Text>
        {audioPath ? <Text>Audio URI: {audioPath}</Text> : null}
        {/* Display the audio URI if available */}
      </View>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
