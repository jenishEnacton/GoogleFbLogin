import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import images from '../assets/images/index';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CLoader} from '../common/CLoader';
import {getAsyncData, setAsyncData} from '../utils/AsyncData';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    '367737373212-vns3cc5s8lrc706ueot37j57hr1qtqka.apps.googleusercontent.com',
  androidClientId:
    '367737373212-h1r85eaq7rg64tkrk90a0ulb2reebg40.apps.googleusercontent.com',
  iosClientId:
    '367737373212-gk0q8lekvc4h9u3usf0q8mn60iuu48g4.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

export default function SignIn({navigation}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const tokenData = await getAsyncData('TokenLogin');
      if (tokenData) {
        navigation.navigate('Home');
      }
    } catch (e) {
      console.error('Failed to fetch the token', e);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await GoogleLogin();
      const {idToken, user} = response;
      await setAsyncData('TokenLogin', idToken);
      setUser(user);
      navigation.navigate('Home');
    } catch (apiError) {
      setLoading(false);
      setError(
        apiError?.response?.data?.error?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name, first_name, last_name',
      },
    };

    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
          setError(error.toString());
        } else {
          setUserInfo(result);
          console.log('result:', result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const handleLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        console.log('Login cancelled');
        setError('Login cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          const accessToken = data.accessToken.toString();
          getInfoFromToken(accessToken);
        }
      }
    } catch (error) {
      console.log('Login fail with error: ' + error);
      setError(error.toString());
    }
  };

  const handleLogout = () => {
    LoginManager.logOut();
    setUserInfo(null);
    setError(null);
    console.log('Logged out.');
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Sign In Google</Text>
      <View style={styles.innerview}>
        <TouchableOpacity style={styles.googlebtn} onPress={handleGoogleLogin}>
          <Image source={images.google} style={styles.googleicon} />
          <Text style={styles.button}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googlebtn} onPress={handleLogin}>
          <Image source={images.facebook} style={styles.facebookicon} />
          <Text style={styles.button}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googlebtn} onPress={handleLogout}>
          <Image source={images.facebook} style={styles.facebookicon} />
          <Text style={styles.button}>Log Out</Text>
        </TouchableOpacity>
        {userInfo && (
          <Text style={styles.userInfo}>Logged in as {userInfo.name}</Text>
        )}
        {error ? <Text style={styles.errortext}>{error}</Text> : null}
        {user ? (
          <View style={styles.datacontainer}>
            <Image source={{uri: user?.photo}} style={styles.userphoto} />
            <Text style={styles.button}>{user?.id}</Text>
            <Text style={styles.button}>{user?.givenName}</Text>
            <Text style={styles.button}>{user?.email}</Text>
          </View>
        ) : null}
      </View>
      {loading && <CLoader />}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 10,
  },
  innerview: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
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
  googleicon: {
    width: 30,
    height: 30,
  },
  errortext: {fontSize: 15, textAlign: 'center', color: 'red'},
  datacontainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userphoto: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  facebookicon: {
    width: 50,
    height: 50,
  },
  userInfo: {
    fontSize: 16,
    marginVertical: 16,
    color: '#000',
  },
});
