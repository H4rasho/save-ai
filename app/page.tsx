import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  return (
    <div>
      <SignedOut>
        <Link href="/sign-in">Sign In</Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}
