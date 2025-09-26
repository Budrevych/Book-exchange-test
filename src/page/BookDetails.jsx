import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/fairbaseConfig";

export function BookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const bookRef = doc(db, "books", bookId);
      const bookSnap = await getDoc(bookRef);
      if (bookSnap.exists()) {
        setBook(bookSnap.data());
      } else {
        setBook(null);
      }
    };

    fetchBook();
  }, [bookId]);

  if (!book) return <p className="p-4">Loading book...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{book.name}</h2>
      <p className="mb-4">Author: {book.author}</p>
      {book.photoUrl && (
        <img
          src={book.photoUrl}
          alt={book.name}
          className="mb-4 w-full h-auto object-cover rounded"
        />
      )}

      <button
        onClick={() => navigate(`/books/exchange/${bookId}`)}
        className="px-4 py-2 bg-sky-400 text-white rounded hover:bg-sky-600"
      >
        Request Exchange
      </button>
    </div>
  );
}
