import React, { createContext, useCallback, useState } from 'react';
export const ToastContext = createContext();
export const ToastProvider = ({ children }) => { const [toasts,setToasts]=useState([]); const notify=useCallback((message,type='success')=>{const id=Date.now();setToasts(t=>[...t,{id,message,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);},[]); return <ToastContext.Provider value={{notify}}>{children}<div className="toast-stack">{toasts.map(t=><div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}</div></ToastContext.Provider>; };
