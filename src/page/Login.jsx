import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      nav("/books");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Log in to your account
        </h1>
        <div className="border border-gray-400 p-4 rounded-md">
          <h3 className="text-xl">
            Don’t have an account?{" "}
            <Link to="/register" className="text-sky-400">
              Register here
            </Link>
          </h3>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2 mx-3 my-6 w-100"
          >
            <input
              className="mb-2 border border-gray-400 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />
            <input
              className="mb-2 border border-gray-400 p-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            <button
              className="mb-2 border border-gray-400 p-2 rounded-md w-30 bg-sky-400 hover:bg-sky-600"
              type="submit"
            >
              Login
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
