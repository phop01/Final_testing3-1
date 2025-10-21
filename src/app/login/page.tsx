"use client";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login: ${form.email}`); // ตอนนี้ยังไม่เชื่อม API
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 border p-6 rounded-md shadow-md"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </main>
  );
}
