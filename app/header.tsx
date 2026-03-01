"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { getMe } from "@/lib/apiAuth";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/apiAuth";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string }>({});
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  const toggleLanguage = async () => {
    const nextLang = i18n.language === "ja" ? "en" : "ja";
    await i18n.changeLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  useEffect(() => {
    if (noAuthPages.includes(pathname)) return;

    async function fetchUser() {
      const data = await getMe();
      if (data?.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, [pathname, noAuthPages]);

  // プロフィールドロップダウンを外クリックで閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (noAuthPages.includes(pathname)) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-end px-4 sm:px-8">
          <button
            onClick={toggleLanguage}
            className="btn btn-ghost text-xs tracking-widest"
            title={t("language.switchTitle")}
          >
            {t("language.toggle")}
          </button>
        </div>
      </header>
    );
  }

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
      toast.success(t("nav.logout"));
    } catch (err: unknown) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button onClick={handleHeaderClick} className="brand">
            {t("app.name")}
          </button>
          {pathname !== "/dashboard" && (
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-secondary h-8 px-3 text-xs"
            >
              {t("nav.backToDashboard")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="btn btn-ghost h-8 px-3 text-xs tracking-widest"
            title={t("language.switchTitle")}
          >
            {t("language.toggle")}
          </button>

          {user.name && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name}</span>
                <svg
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/60">
                  <button
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    onClick={() => {
                      router.push("/profile/edit");
                      setProfileOpen(false);
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M14.5 3.5L16.5 5.5M7 13L14.5 5.5M7 13L5 13L5 11L12.5 3.5L14.5 5.5L7 13Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("nav.profileEdit")}
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
