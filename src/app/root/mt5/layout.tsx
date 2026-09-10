import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "MT5 Account ⛓️‍💥",
    description: "connect your mt5 account here",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
