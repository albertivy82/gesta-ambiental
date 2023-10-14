import React from 'react';
import store from "./store"
import {Provider} from 'react-redux'
import Navigation from './Navigation';
import { getLocalidades } from './realm/services/localidadeServices';
import { useLocalidades } from './modules/home/hook/useLocalidades';
import { useEffect, useState } from 'react';
import { useLocalidadeRducer } from './store/reducers/localidadeReducer/useLocalidadeReducer';



const App = () => {

return (
    <Provider store ={store}>
      <Navigation/>
    </Provider>
  );
};

export default App;