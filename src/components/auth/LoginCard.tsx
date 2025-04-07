
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginFormFields from "./LoginFormFields";
import LoginFooter from "./LoginFooter";
import { useLoginForm } from "@/hooks/useLoginForm";

const LoginCard: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    loginError,
    locationMessage,
    handleSubmit
  } = useLoginForm();

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginFormFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSubmitting={isSubmitting}
          loginError={loginError}
          locationMessage={locationMessage}
          onSubmit={handleSubmit}
        />
      </CardContent>
      <LoginFooter />
    </Card>
  );
};

export default LoginCard;
