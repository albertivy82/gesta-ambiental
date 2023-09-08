import { useDispatch} from "react-redux"
import { useAppSelector } from "../../hooks";
import { UserBody } from "../../../shared/types/userBody";
import { setUserAcion } from ".";



export const useUserReducer = ()=>{
    const {user} = useAppSelector((state)=>state.userReducer);
    
    const dispatch = useDispatch();
    const setUser = (currentuser: UserBody[]) =>{
        dispatch(setUserAcion(currentuser))
    };
    
    
    return {
        user,
        setUser,
    }
};