import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CLoader} from '../common/CLoader';
import {clearAsyncData} from '../utils/AsyncData';

export default function Home({navigation}) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogout() {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      await clearAsyncData('TokenLogin');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Google Sign-Out Error: ', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity
        style={[styles.googlebtn, {marginVertical: 0}]}
        onPress={handleGoogleLogout}>
        <Text style={styles.button}>Log Out</Text>
      </TouchableOpacity>
      {loading && <CLoader />}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
  button: {
    padding: 5,
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  googlebtn: {
    borderRadius: 10,
    padding: 10,
    width: '70%',
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 10,
    flexDirection: 'row',
    gap: 10,
  },
});
