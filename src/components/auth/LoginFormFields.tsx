
import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  loginError: string | null;
  locationMessage?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  loginError,
  locationMessage,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      {locationMessage && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertDescription>{locationMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@africau.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-sm text-au-purple hover:underline">
            Forgot Password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-au-purple hover:bg-au-purple-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
          </>
        ) : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginFormFields;
