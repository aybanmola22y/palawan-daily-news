"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { deleteAuthorAction } from "./actions";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        const success = await deleteAuthorAction(userId);
        if (success) {
          router.refresh();
        } else {
          alert("Failed to delete user. They might have associated articles.");
        }
      } catch (error) {
        alert("An error occurred while deleting the user.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-1 text-gray-400 hover:text-red-600 transition-colors ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
      title="Delete User"
    >
      <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} />
    </button>
  );
}
