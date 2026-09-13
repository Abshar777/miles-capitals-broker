import React from 'react'
import { Metadata } from 'next';
import Authloading from './loading';


export const metadata: Metadata = {
    title: "Sign Up | MILES CAPITAL",
    description: "Create your Miles Capital account",
  };


const layout = ({children}:any) => {
  return (
    <>
      {children}
      
    </>
  )
}

export default layout
