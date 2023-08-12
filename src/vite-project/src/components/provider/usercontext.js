import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const UserContext = createContext(undefined);
export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (_jsx(UserContext.Provider, { value: { isLoggedIn, setIsLoggedIn }, children: children }));
};
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
