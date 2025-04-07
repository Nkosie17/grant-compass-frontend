
import React from "react";
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";

const LoginFooter: React.FC = () => {
  return (
    <CardFooter className="flex justify-center">
      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="text-au-purple hover:underline">
          Sign up
        </Link>
      </p>
    </CardFooter>
  );
};

export default LoginFooter;
