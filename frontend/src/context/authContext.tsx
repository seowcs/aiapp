import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";

interface Props {
    children?: ReactNode
}

export const AuthContext = createContext<any>({});

export const AuthContextProvider = ({children}: Props) => {
    const [currentUser, setCurrentUser] = useState<string|null>(sessionStorage.getItem('user')||null)
    const [token, setToken] = useState<string|null>(sessionStorage.getItem('user')||null)

    const login = async(input:any) => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin':'http://localhost:3000'
        }
    }
    const resp = await axios.post("http://localhost:5000/login", input,config);
      const access_token = resp.data.access_token
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("user", input.username)
      setCurrentUser(input.username)
      setToken(access_token)
    }

    const logout = () => {
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('access_token')
        setCurrentUser(null)
        setToken(null)
    }

    useEffect(() => {
      setCurrentUser(sessionStorage.getItem('user'))
      setToken(sessionStorage.getItem('access_token'))
    }, [])
    
    return(
        <AuthContext.Provider value={{currentUser, token, login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}