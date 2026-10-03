import {useRecoilValue} from 'recoil';
import {userAtom} from "../atoms/user"; 

export const useUser = () => {
    const user = useRecoilValue(userAtom);
    return user;
}
