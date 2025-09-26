import React from "react";
import { Login } from "./Login";
import { UserInfo } from "../components/UserInfo/UserInfo";
import { useAuthStore } from "../stores/useAuthStore";

export function Home() {
  const user = useAuthStore((state) => state.user);

  return <>{user ? <UserInfo /> : <Login />}</>;
}
