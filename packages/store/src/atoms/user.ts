import {atom, selector} from 'recoil';

// put it in .env
export const BACKEND_URL = 'http://localhost:3000';

export interface User {
    id: string;
    name: string;
    token: string;
    isGuest?: boolean;
}

export const userAtom = atom<User | null>({
    key: 'user',
    default: selector({
        key: 'user/default',
        get: async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    return null;
                }
                const userData = await response.json();
                return userData;
            } catch (error) {
                console.error('Error fetching user data:', error);
                return null;
            }
        }
    })
});
