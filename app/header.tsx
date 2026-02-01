"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/apiAuth";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/apiAuth";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string }>({});

  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const data = await getMe();

      if (data?.user) {
        setUser(data.user);
      } else {
        console.log("No user data received");
      }
    }
    fetchUser();
  }, [pathname]);

  if (pathname === "/auth/login") return;

  const handleHeaderClick = () => {
    if (user.id) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      setUser({});
      router.push("/auth/login");
    } catch (err: unknown) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="cursor-pointer flex items-center justify-between px-8">
      <button onClick={handleHeaderClick} className="py-4 text-2xl font-bold">
        Invoice App
      </button>
      <div className="flex-1" />
      <button
        onClick={handleLogoutClick}
        className="px-6 h-10 text-white bg-blue-500 rounded hover:bg-blue-600 font-now tracking-wide cursor-pointer"
      >
        Logout
      </button>
    </header>
  );
}
