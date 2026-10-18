import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/user';

/**
 * Returns a setter for the userAtom.
 * Use this to programmatically set the user (e.g., after a guest login API call).
 */
export const useSetUser = () => {
    const [, setUser] = useRecoilState(userAtom);
    return setUser;
};
