import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/fairbaseConfig";

export function BooksList() {
  const [booksList, setBooksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const booksCollection = collection(db, "books");
    const booksQuery = query(booksCollection, orderBy("name"));

    const unsubscribe = onSnapshot(
      booksQuery,
      (snapshot) => {
        const fetchedBooks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooksList(fetchedBooks);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const goToBookDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const filteredBooks = booksList
    .filter(
      (book) =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by name or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2"
          />
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-sky-400 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto"
          >
            Sort {sortAsc ? "↓" : "↑"}
          </button>
        </div>

        {loading ? (
          <p className="text-center mt-6 text-gray-500">Loading books...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-center mt-6 text-gray-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-sm flex flex-col"
              >
                <img
                  src={book.photoUrl || "/placeholder.png"}
                  alt={book.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold mb-1">{book.name}</h2>
                  <p className="text-gray-600 mb-4">{book.author}</p>
                  <button
                    onClick={() => goToBookDetails(book.id)}
                    className="mt-auto bg-sky-400 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
