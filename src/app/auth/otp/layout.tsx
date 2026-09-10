import React from 'react'
import { Metadata } from 'next';
import Authloading from './loading';


export const metadata: Metadata = {
  title: "CRM - OTP Verification | Auth Protected",
  description:
    "Access the CRM OTP verification page. This section is available only to unverified users who require OTP authentication for secure access.",
};


const layout = ({children}:any) => {
  return (
    <>
      {children}
      {/* <Authloading/> */}
    </>
  )
}

export default layout
