import { useDispatch, useSelector } from "react-redux"
import { useAppSelector } from "../../hooks";
import { setUserAcion } from ".";
import { UserType } from "../../../shared/types/userType";



export const useUserReducer = ()=>{
    const {user} = useAppSelector((state)=>state.userReducer);
    const dispatch = useDispatch();
    const setUser = (currentUser: UserType) =>{
        dispatch(setUserAcion(currentUser))
    };
    return {
        user,
        setUser,
    }
};