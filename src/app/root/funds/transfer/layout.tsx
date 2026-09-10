import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Transfer 💸 | Wallet to MT5",
    description: "Manage your funds, transfer them between your wallet and MT5 accounts securely and instantly.",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
