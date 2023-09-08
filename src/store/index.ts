import {configureStore} from '@reduxjs/toolkit'
import tokenReducer from './reducers/tokenReducer'
import localidadeReducer from './reducers/localidadeReducer'
import userReducer from './reducers/userReducer';


export const store = configureStore({
    reducer:{
        tokenReducer,
        userReducer,
       localidadeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
