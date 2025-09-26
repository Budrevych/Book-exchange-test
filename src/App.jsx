import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth, db } from "./firebase/fairbaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "./stores/useAuthStore";

import { Header } from "./components/Header/Header";

import { Home } from "./page/Home";
import { Login } from "./page/Login";
import { Register } from "./page/Register";
import { BooksList } from "./page/BooksList";
import { MyBooks } from "./page/MyBooks";
import { BookDetails } from "./page/BookDetails";
import { ExchangeRequest } from "./page/ExchangeRequest";
import { Admin } from "./page/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.exists() ? userDocSnap.data() : {};

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userData.name || null,
            role: userData.role || "User",
          });
        } catch (err) {
          console.error("Failed to fetch user doc:", err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || null,
            role: "User",
          });
        }
      } else {
        clearUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  return (
    <BrowserRouter>
      <Header />
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
          path="/books/:bookId"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/exchange/:bookId"
          element={
            <ProtectedRoute>
              <ExchangeRequest />
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
  );
}

export default App;
