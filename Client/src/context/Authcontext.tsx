import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext=createContext<AuthContextType|null>(null)

export function Authprovider({children}:{children:ReactNode}){

    const [token,settoken]=useState<string|null>(localStorage.getItem("token"))

    const[user,setuser]=useState<User|null>(() =>{
        const storeduser=localStorage.getItem("user")
        return storeduser? JSON.parse(storeduser):null
        
    })

    function login(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    settoken(token);
    setuser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    settoken(null);
    setuser(null);
  }
  return(
<AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )

}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}