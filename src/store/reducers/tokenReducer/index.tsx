import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface tokenStore{
  token?: string
}


const initialState: tokenStore = {
    token: undefined,
};


export const tokenSlice = createSlice(
    {
    name: 'tokenReducer',
    initialState,
    reducers: {
        setTokenAcion: (state, action: PayloadAction<string>) => {
          state.token = action.payload
        },
    },
  }
)   


export const { setTokenAcion } = tokenSlice.actions

export default tokenSlice.reducer