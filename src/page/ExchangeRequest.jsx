import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/fairbaseConfig";
import { useAuthStore } from "../stores/useAuthStore";

export function ExchangeRequest() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [book, setBook] = useState(null);
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      const bookRef = doc(db, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      if (bookSnap.exists()) {
        const bookData = bookSnap.data();

        if (bookData.ownerId === user.uid) {
          alert("You cannot request exchange for your own book");
          navigate("/books");
          return;
        }

        setBook(bookData);
      } else {
        setBook(null);
      }
    };

    const fetchMyBooks = async () => {
      const q = query(
        collection(db, "books"),
        where("ownerId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      setMyBooks(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchBook();
    fetchMyBooks();
  }, [bookId, user, navigate]);

  if (!book) return <p className="p-4">Loading book...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{book.name}</h2>
      <p className="mb-2">Author: {book.author}</p>
      {book.photoUrl && (
        <img
          src={book.photoUrl}
          alt={book.name}
          className="mb-4 w-full h-auto object-cover rounded"
        />
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Your info:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">
          Your books available for exchange:
        </h3>
        {myBooks.length > 0 ? (
          <ul className="list-disc list-inside">
            {myBooks.map((b) => (
              <li key={b.id}>
                {b.name} — {b.author}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no books to offer</p>
        )}
      </div>

      <button
        onClick={() => alert("Exchange request prepared!")}
        className="px-4 py-2 bg-sky-400 text-white rounded hover:bg-sky-600"
      >
        Prepare Exchange Request
      </button>
    </div>
  );
}
