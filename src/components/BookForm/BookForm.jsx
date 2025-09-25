import React, { useState } from "react";
import { db, storage } from "../../firebase/fairbaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthStore } from "../../stores/useAuthStore";

export function BookForm() {
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in");
      return;
    }

    let photoUrl = "";
    let storagePath = "";

    try {
      // Якщо є файл — завантажуємо його у Firebase Storage
      if (file) {
        storagePath = `books/${user.uid}/${Date.now()}_${file.name}`;
        const sRef = ref(storage, storagePath);
        await uploadBytes(sRef, file); // завантажуємо файл
        photoUrl = await getDownloadURL(sRef); // отримуємо URL
      }

      // Зберігаємо книгу в Firestore
      await addDoc(collection(db, "books"), {
        name,
        author,
        photoUrl,
        storagePath,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      setName("");
      setAuthor("");
      setFile(null);
      alert("Book added!");
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="flex flex-col gap-2 mx-3 my-6 w-100"
        type="text"
        placeholder="Book name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="flex flex-col gap-2 mx-3 my-6 w-100"
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        className="flex flex-col gap-2 mx-3 my-6 w-100"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button type="submit">Add Book</button>
    </form>
  );
}
