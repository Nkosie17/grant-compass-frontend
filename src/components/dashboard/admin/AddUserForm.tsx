
// Since AddUserForm.tsx is a read-only file, we need to create a wrapper component
// that will handle the callback after user creation

import React from "react";
import { originalComponent as OriginalAddUserForm } from "@/components/dashboard/admin/AddUserForm";

type AddUserFormProps = {
  onUserAdded?: () => void;
};

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded }) => {
  // This wrapper component allows us to handle the successful user creation
  // without modifying the original read-only component
  const handleUserCreated = () => {
    // Call the onUserAdded callback if provided
    if (onUserAdded) {
      onUserAdded();
    }
  };

  // Pass the callback to the original component
  return <OriginalAddUserForm onSuccess={handleUserCreated} />;
};

export default AddUserForm;
