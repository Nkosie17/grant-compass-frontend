
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SSOButtonProps {
  isSubmitting: boolean;
}

const SSOButton: React.FC<SSOButtonProps> = ({ isSubmitting }) => {
  return (
    <Button 
      variant="outline" 
      className="w-full mt-4"
      onClick={() => toast.info("SSO integration coming soon")}
      disabled={isSubmitting}
    >
      AU Single Sign-On
    </Button>
  );
};

export default SSOButton;
