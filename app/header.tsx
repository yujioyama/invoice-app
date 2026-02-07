"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getMe } from "@/lib/apiAuth";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/apiAuth";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string }>({});

  const pathname = usePathname();
  const noAuthPages = useMemo(
    () => [
      "/auth/login",
      "/auth/verifyEmail",
      "/auth/emailSent",
      "/auth/register",
    ],
    [],
  );

  useEffect(() => {
    if (noAuthPages.includes(pathname)) return;

    async function fetchUser() {
      const data = await getMe();

      if (data?.user) {
        setUser(data.user);
      } else {
        console.log("No user data received");
      }
    }
    fetchUser();
  }, [pathname, noAuthPages]);

  if (noAuthPages.includes(pathname)) return null;

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
      toast.success("Logged out successfully");
    } catch (err: unknown) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-8">
        <button onClick={handleHeaderClick} className="brand">
          Invoice App
        </button>
        <button onClick={handleLogoutClick} className="btn btn-primary">
          Logout
        </button>
      </div>
    </header>
  );
}
