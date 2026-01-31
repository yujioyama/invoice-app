"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/apiAuth";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string }>({});

  useEffect(() => {
    async function fetchUser() {
      const data = await getMe();
      if (data?.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  const handleHeaderClick = () => {
    if (user.id) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <header className="cursor-pointer flex justify-center">
      <button onClick={handleHeaderClick} className="py-4 text-2xl font-bold">
        Invoice App
      </button>
    </header>
  );
}
