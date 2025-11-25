import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp path="/sign-up" />
    </div>
  );
};

export default SignUpPage;
