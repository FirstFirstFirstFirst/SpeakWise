import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to continue your English learning journey
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              card: "shadow-lg border",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          signUpUrl="/sign-up" 
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
