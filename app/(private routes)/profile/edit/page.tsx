"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateMe } from "@/lib/api/clientApi";
import { getErrorMessage } from "@/lib/api/getErrorMessage";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();

    try {
      setError("");
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = () => router.push("/profile");

  if (!user) return <p>Loading, please wait...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user.username}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p>{error}</p>}
        </form>
      </div>
    </main>
  );
}
