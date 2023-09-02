import {configureStore} from '@reduxjs/toolkit'
import tokenReducer from './reducers/tokenReducer'
import localidadeReducer from './reducers/localidadeReducer'

export const store = configureStore({
    reducer:{
        tokenReducer,
       // userReducer,
       localidadeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
