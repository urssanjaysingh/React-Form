import { Outlet } from "react-router";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [persist] = useLocalStorage('persist', false);
    
    const effectRun = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [auth?.accessToken, refresh])

    useEffect(() => {
        if (effectRun.current) {
            console.log(`isLoading: ${isLoading}`)
            console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
        }
        effectRun.current = true;
    }, [auth?.accessToken, isLoading])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>isLoading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin
