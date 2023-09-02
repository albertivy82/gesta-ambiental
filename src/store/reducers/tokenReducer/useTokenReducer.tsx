import { useDispatch, useSelector } from "react-redux"
import { useAppSelector } from "../../hooks";
import { setTokenAcion} from ".";



export const useTokenReducer = ()=>{
    const {token} = useAppSelector((state)=>state.tokenReducer);
    
    const dispatch = useDispatch();
    const setToken = (currenttoken: string) =>{
        dispatch(setTokenAcion(currenttoken))
    };
    
    
    return {
        token,
        setToken,
    }
};