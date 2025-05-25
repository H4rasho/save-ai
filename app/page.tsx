import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
	return (
		<div>
			<SignedOut>
				<SignInButton mode="modal" />
				<SignUpButton mode="modal" />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
}
