'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Machine, UserInvestment } from '@/lib/types';
import { machines } from '@/lib/data';

interface InvestmentsContextType {
  userInvestments: UserInvestment[];
  addUserInvestment: (machine: Machine) => void;
  isLoading: boolean;
}

const InvestmentsContext = createContext<InvestmentsContextType | undefined>(undefined);

const getInitialState = (): UserInvestment[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const item = window.localStorage.getItem('userInvestments');
    if (item) {
        const storedInvestments = JSON.parse(item) as any[];
        return storedInvestments.map(inv => {
            const machine = machines.find(m => m.id === inv.machine.id);
            if (!machine) return null; // In case a machine was removed from the main list
            return {
                ...inv,
                purchaseDate: new Date(inv.purchaseDate),
                machine: machine
            }
        }).filter(Boolean) as UserInvestment[]; // Filter out nulls
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
  return [];
};


export const InvestmentsProvider = ({ children }: { children: ReactNode }) => {
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserInvestments(getInitialState());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
        try {
            window.localStorage.setItem('userInvestments', JSON.stringify(userInvestments));
        } catch (error) {
            console.error('Error writing to localStorage', error);
        }
    }
  }, [userInvestments, isLoading]);


  const addUserInvestment = (machine: Machine) => {
    const newInvestment: UserInvestment = {
      id: `inv_${Date.now()}`,
      machine: machine,
      purchaseDate: new Date(),
    };
    setUserInvestments(prevInvestments => [...prevInvestments, newInvestment]);
  };

  return (
    <InvestmentsContext.Provider value={{ userInvestments, addUserInvestment, isLoading }}>
      {children}
    </InvestmentsContext.Provider>
  );
};

export const useInvestments = () => {
  const context = useContext(InvestmentsContext);
  if (context === undefined) {
    throw new Error('useInvestments must be used within an InvestmentsProvider');
  }
  return context;
};
