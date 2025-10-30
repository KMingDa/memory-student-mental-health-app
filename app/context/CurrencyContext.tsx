import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextType = {
    currency: number;
    setCurrency: (value: number) => void;
    addCurrency: (amount: number) => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState(0);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("userCurrency");
            if (stored) setCurrency(parseInt(stored, 10));
        })();
    }, []);

    const addCurrency = async (amount: number) => {
        const newTotal = currency + amount;
        setCurrency(newTotal);
        await AsyncStorage.setItem("userCurrency", newTotal.toString());
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, addCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
    return ctx;
};
