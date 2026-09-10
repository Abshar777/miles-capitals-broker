import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Wallets 💳",
    description: "You can see your wallet here",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
