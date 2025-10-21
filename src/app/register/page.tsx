"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // handle common errors (validation / duplicate)
        setError(data?.error || "Failed to register");
        return;
      }

      setSuccess("Registered successfully");
      // redirect to login after short delay
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      console.error("Register error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 border p-6 rounded-md shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-700 bg-green-100 p-2 rounded">
            {success}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2"
          required
          value={form.name}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2"
          required
          value={form.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2"
          required
          value={form.password}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}
