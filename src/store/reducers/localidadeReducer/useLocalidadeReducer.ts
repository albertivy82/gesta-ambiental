import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks"
import { setLocalidadeAction } from ".";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";

export const useLocalidadeRducer = ()=>{

    const {localidade} = useAppSelector((state)=>state.localidadeReducer);

    const dispatch = useDispatch();
    const setLocalidade = (currentlocalidade: LocalidadeType[]) =>{
        dispatch(setLocalidadeAction(currentlocalidade))
    };
    
    
    return {
        localidade,
        setLocalidade,
    }
}