'use client';

import { SignIn } from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
        <SignIn />
    </main>
  )
}

export default SignInPage