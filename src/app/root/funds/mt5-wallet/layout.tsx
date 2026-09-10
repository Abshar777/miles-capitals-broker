import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "MT5 to Wallet 💸 | MT5 to Wallet",
    description: "You can transfer your funds from MT5 to wallet here",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
