import React from 'react'
import { Metadata } from 'next';
import Authloading from './loading';


export const metadata: Metadata = {
    title: "CRM - Register | Auth",
    description: "CRM - Register, Enter your details below to create an account",
  };


const layout = ({children}:any) => {
  return (
    <>
      {children}
      
    </>
  )
}

export default layout
