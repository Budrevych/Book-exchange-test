import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/fairbaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { useAuthStore } from "../stores/useAuthStore";
import { BookForm } from "../components/BookForm/BookForm";

export function MyBooks() {
  const user = useAuthStore((state) => state.user);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "books"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBooks(items);
        setLoading(false);
      },
      (err) => {
        console.error("Snapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const handleDelete = async (book) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteDoc(doc(db, "books", book.id));

      if (book.storagePath) {
        const sRef = storageRef(storage, book.storagePath);
        await deleteObject(sRef);
      }
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  };

  return (
    <>
      <BookForm />
      <h1>MyBooks</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <img src={book.photoUrl} alt={book.name} />
              <h2>{book.name}</h2>
              <p>Author: {book.author}</p>
              <p>Added: {book.createdAt.toDate().toLocaleDateString()}</p>
              <button onClick={() => handleDelete(book)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
