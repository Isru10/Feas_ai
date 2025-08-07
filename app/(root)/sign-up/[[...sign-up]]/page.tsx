import { SignUp } from "@clerk/nextjs";

// This page will render Clerk's pre-built sign-up form.
export default function Page() {
  return (
    <div className="flex justify-center items-center py-24">
      <SignUp />
    </div>
  );
}