// Создаем провайдер контекста, который будет предоставлять состояние аутентификации
import React, {createContext, useState} from "react";
// Создаем контекст
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};