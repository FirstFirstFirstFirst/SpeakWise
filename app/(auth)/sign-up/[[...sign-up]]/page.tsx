import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Join SpeakWise</h1>
          <p className="text-gray-600 mt-2">Create your account and start improving your English speaking skills</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              card: "shadow-lg border",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            }
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}