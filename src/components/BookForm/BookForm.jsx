import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/fairbaseConfig";
import { useAuthStore } from "../../stores/useAuthStore";

export function BookForm() {
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const DEFAULT_IMAGE = "/public/placeholder.jpg"; // файл у public/

  function isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please log in first.");
      return;
    }
    if (!name.trim() || !author.trim()) {
      setError("Please fill name and author.");
      return;
    }

    setLoading(true);
    try {
      let photoUrl = DEFAULT_IMAGE;

      if (photoUrlInput && isValidUrl(photoUrlInput.trim())) {
        photoUrl = photoUrlInput.trim();
      }

      await addDoc(collection(db, "books"), {
        ownerId: user.uid,
        name: name.trim(),
        author: author.trim(),
        photoUrl,
        storagePath: null,
        createdAt: serverTimestamp(),
      });

      setName("");
      setAuthor("");
      setPhotoUrlInput("");
      alert("Book added!");
    } catch (err) {
      console.error("Error adding book:", err);
      setError(err.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto p-6 my-10 bg-white shadow-md rounded-xl">
      <h3 className="text-xl font-bold mb-4 text-center">Add a Book</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Book name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Photo URL (optional)"
          value={photoUrlInput}
          onChange={(e) => setPhotoUrlInput(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          Leave empty or invalid → default image will be used
        </p>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-sky-500 text-white font-semibold hover:bg-sky-600 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </section>
  );
}
