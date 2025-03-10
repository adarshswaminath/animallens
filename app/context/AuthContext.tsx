"use client"
import React,{createContext,useContext,useEffect,useState} from "react"
import {User} from "firebase/auth"
import {auth} from "../firebase/config"

type AuthContextType = {
    user: User | null;
}


const AuthContext = createContext<AuthContextType>({user : null});
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user,setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    },[])

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)