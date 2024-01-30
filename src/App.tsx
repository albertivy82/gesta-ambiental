import React from 'react';
import 'react-native-get-random-values';
import { Provider } from 'react-redux';
import Navigation from './Navigation';
import store from "./store";




const App = () => {

return (
    <Provider store ={store}>
      <Navigation/>
    </Provider>
  );
};

export default App;