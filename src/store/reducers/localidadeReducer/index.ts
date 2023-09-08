import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";

interface localidadeStore{
    localidade: LocalidadeType[];
};

const initialState: localidadeStore = {
    localidade: [],
};

export const localidadeSlice = createSlice(
    {
        name:  'localidadeReducer',
        initialState,
        reducers: {
            setLocalidadeAction: (state, action: PayloadAction<LocalidadeType[]>)=>{
                state.localidade  = action.payload
            },
        },
    }

)

export const {setLocalidadeAction} = localidadeSlice.actions;
export default localidadeSlice.reducer;