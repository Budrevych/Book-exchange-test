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
    <div style={{ padding: 16 }}>
      <h1>My Books</h1>
      <BookForm />
      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books yet</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 12,
          }}
        >
          {books.map((b) => (
            <div
              key={b.id}
              style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}
            >
              <img
                src={b.photoUrl || "/placeholder.png"}
                alt={b.name}
                style={{ width: "100%", height: 140, objectFit: "cover" }}
              />
              <h3>{b.name}</h3>
              <p>{b.author}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleDelete(b)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
