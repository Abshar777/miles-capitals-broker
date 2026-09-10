import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "IB Room 🤝 ",
    description: "IB Room for your referrals and earnings",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
