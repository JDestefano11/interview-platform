import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden -mt-16">
      
      {/* Auth container with enhanced styling */}
      <div className="auth-container relative z-10 backdrop-blur-md bg-[#050A18]/40 border border-[#4D4DFF]/30 shadow-[0_0_30px_rgba(77,77,255,0.2)] rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  )
}

    export default AuthLayout;
