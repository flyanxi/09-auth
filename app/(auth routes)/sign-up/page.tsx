"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import type { AuthRequest } from "@/lib/api/clientApi";
import { getErrorMessage } from "@/lib/api/getErrorMessage";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: AuthRequest = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      setError("");
      const user = await register(values);
      if (user) {
        setUser(user);
        router.push("/profile");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
