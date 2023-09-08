import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserBody } from '../../../shared/types/userBody';

interface userStore{
  user?: UserBody;
}


const initialState: userStore = {
    user:undefined,
};


export const userSlice = createSlice(
    {
    name: 'userReducer',
    initialState,
    reducers: {
        setUserAcion: (state, action: PayloadAction<UserBody>) => {
          state.user = action.payload
        },
    },
  }
)   


export const { setUserAcion } = userSlice.actions

export default userSlice.reducer