import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function AuthHeader() {
  return (
    <header style={{ display: "flex", justifyContent: "flex-end" }}>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
