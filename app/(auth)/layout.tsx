import { ReactNode } from "react";


const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">{children}</div>
    </div>
  )

}

    export default AuthLayout;
