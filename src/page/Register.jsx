import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      nav("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create your account
        </h1>
        <div className="border border-gray-400 p-4 rounded-md">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2 mx-3 my-6 w-100"
          >
            <input
              className="mb-2 border border-gray-400 p-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              required
            />
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
              Register
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
