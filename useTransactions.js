import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'paytrack-v1';
export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { AsyncStorage.getItem(KEY).then(data => { if(data) setTransactions(JSON.parse(data)); setLoading(false); }); }, []);
  const persist = (txs) => AsyncStorage.setItem(KEY, JSON.stringify(txs));
  const addTransaction    = useCallback((tx) => { setTransactions(prev => { const next=[tx,...prev]; persist(next); return next; }); }, []);
  const deleteTransaction = useCallback((id) => { setTransactions(prev => { const next=prev.filter(t=>t.id!==id); persist(next); return next; }); }, []);
  const updateCategory    = useCallback((id,cat) => { setTransactions(prev => { const next=prev.map(t=>t.id===id?{...t,category:cat}:t); persist(next); return next; }); }, []);
  return { transactions, loading, addTransaction, deleteTransaction, updateCategory };
}
