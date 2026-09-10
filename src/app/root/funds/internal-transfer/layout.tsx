import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Internal Transfer 💸 | Internal Transfer",
    description: "You can transfer your funds between MT5 accounts here",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
