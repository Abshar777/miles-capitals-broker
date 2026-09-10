import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Helpdesk 💬 ",
    description: "helpdesk for your questions and issues",
  };

const layout = ({children}:{children:React.ReactNode}) => {
  return <>{children}</>
}

export default layout
