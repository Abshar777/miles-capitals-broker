import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Reset Password | MILES CAPITAL",
    description: "Set a new password for your Miles Capital account",
  };


const layout = ({children}:any) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout
