import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "CRM - Forgot Password | Auth",
    description: "CRM - Forgot Password, Enter your details below to reset your password",
  };


const layout = ({children}:any) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout
