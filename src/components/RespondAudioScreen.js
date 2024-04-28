import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {AudioRecorderPlayer} from 'react-native-audio-recorder-player';
import {firebase} from '@react-native-firebase/storage';

export default function RespondAudioScreen({route}) {
  const {entry} = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const startRecording = async () => {
    const path = 'audio_' + Date.now() + '.wav';
    await audioRecorderPlayer.startRecorder(path);
    setAudioPath(path);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const path = await audioRecorderPlayer.stopRecorder();
    setAudioPath(path);
    setIsRecording(false);
    const response = await fetch(audioPath);
    const blob = await response.blob();
    const storageRef = firebase
      .storage()
      .ref()
      .child('audio/' + Date.now() + '.wav');
    await storageRef.put(blob);
    const downloadURL = await storageRef.getDownloadURL();
    // Handle response by saving it or sending it to the corresponding entry
  };

  return (
    <View>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
}
