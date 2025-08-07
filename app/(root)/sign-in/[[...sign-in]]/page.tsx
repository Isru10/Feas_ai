import { SignIn } from "@clerk/nextjs";

// This page will render Clerk's beautiful, pre-built sign-in form.
export default function Page() {
  return (
    <div className="flex justify-center items-center py-24">
      <SignIn />
    </div>
  );
}