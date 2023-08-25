import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserType {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: 'bearer' | string;
    expires_in: number;
    [key: string]: string | number;
}

interface UserStore {
    user?: UserType;
}
  
  
const initialState: UserStore = {
    user: undefined,
};


export const userSlice = createSlice({
  name: 'useReducer',
  initialState,
  reducers: {
    setUserAcion: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload
    },
  },
})


export const { setUserAcion } = userSlice.actions

export default userSlice.reducer