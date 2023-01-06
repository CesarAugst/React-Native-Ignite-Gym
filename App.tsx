import { View, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from './src/theme';
import { Loading } from '@components/Loading';

import { AuthContext } from '@contexts/AuthContext';

import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContext.Provider value={{
        id: '1',
        name: 'Cesar',
        email: 'cesar@email.com',
        avatar: 'cesar.png'
      }}>
        {fontsLoaded ? <Routes/> : <Loading/>}
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}
