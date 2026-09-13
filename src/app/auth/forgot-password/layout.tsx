import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Reset Password | MILES CAPITAL",
    description: "Reset your Miles Capital password",
  };


const layout = ({children}:any) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout
