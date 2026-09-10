import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Withdraw 💸 | Withdraw",
    description: "You can withdraw your funds here",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
