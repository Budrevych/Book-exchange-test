import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth } from "./firebase/fairbaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "./stores/useAuthStore";

import { Home } from "./page/Home";
import { Login } from "./page/Login";
import { Register } from "./page/Register";
import { BooksList } from "./page/BooksList";
import { MyBooks } from "./page/MyBooks";
import { Admin } from "./page/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      useAuthStore.getState().setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || null,
      });
    } else {
      useAuthStore.getState().clearUser();
    }
  });
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BooksList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/books"
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
