import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "CRM - Reset Password | Auth",
    description: "CRM - Login, Enter your details below to login to your account",
  };


const layout = ({children}:any) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout
