import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {firebase} from '@react-native-firebase/database';

export default function HomeScreen({navigation}) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const entriesRef = firebase.database().ref('entries');
    entriesRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const entriesList = Object.values(data);
        setEntries(entriesList);
      }
    });
    return () => entriesRef.off('value');
  }, []);

  return (
    <View>
      <Text>Audio Entries:</Text>
      {entries.map((entry, index) => (
        <View key={index}>
          <Text>{entry}</Text>
          <Button
            title="Respond"
            onPress={() => navigation.navigate('RespondAudio', {entry})}
          />
        </View>
      ))}
      <Button
        title="Record Audio"
        onPress={() => navigation.navigate('RecordAudio')}
      />
    </View>
  );
}
