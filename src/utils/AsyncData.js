import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncData = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getAsyncData = async key => {
  let response = await AsyncStorage.getItem(key);
  let newRes = await JSON.parse(response);
  return newRes;
};

export const clearAsyncData = async key => {
  await AsyncStorage.removeItem(key);
};
