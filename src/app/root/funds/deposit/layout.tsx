import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Deposit 💸 | Deposit",
    description: "You can deposit your funds here",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
