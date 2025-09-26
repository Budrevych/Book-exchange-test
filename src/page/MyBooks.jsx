// src/pages/MyBooks.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/fairbaseConfig";
import { useAuthStore } from "../stores/useAuthStore";
import { BookForm } from "../components/BookForm/BookForm";

export function MyBooks() {
  const user = useAuthStore((s) => s.user);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "books"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "books", id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Please log in to see your books.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BookForm />

      <h2 className="text-2xl font-bold mt-8 mb-4">My Books</h2>

      {books.length === 0 ? (
        <p className="text-gray-500">You haven’t added any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={book.photoUrl || "/placeholder.png"}
                alt={book.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{book.name}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="mt-4 px-3 py-2 text-sm rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
