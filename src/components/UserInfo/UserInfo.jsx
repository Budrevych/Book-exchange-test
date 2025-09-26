import React from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export function UserInfo() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">User Info</h2>
      <p className="mb-1">Name: {user.name}</p>
      <p className="mb-1">Email: {user.email}</p>
      {user.role && <p>Role: {user.role}</p>}
    </div>
  );
}
