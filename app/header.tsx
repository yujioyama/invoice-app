"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getMe } from "@/lib/apiAuth";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/apiAuth";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string }>({});

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
      } else {
        console.log("No user data received");
      }
    }
    fetchUser();
  }, [pathname, noAuthPages]);

  if (noAuthPages.includes(pathname)) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-end px-4 sm:px-8">
          <button
            onClick={toggleLanguage}
            className="btn btn-ghost"
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button onClick={handleHeaderClick} className="brand">
            {t("app.name")}
          </button>
          {/* Dashboardに戻るボタン */}
          <button
            onClick={() => router.push("/dashboard")}
            className="btn btn-secondary"
          >
            {t("nav.backToDashboard")}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="btn btn-ghost"
            title={t("language.switchTitle")}
          >
            {t("language.toggle")}
          </button>
          {user.name && (
            <div className="relative group">
              <button
                className="flex items-center gap-2 text-slate-700 font-medium hover:underline focus:outline-none"
                title={t("nav.profileEdit")}
                tabIndex={0}
              >
                <span>{t("nav.hello", { name: user.name })}</span>
              </button>
              <div className="absolute right-0 top-full w-40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:opacity-100 hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-10">
                <button
                  className="w-full gap-1 flex text-left px-4 py-2 hover:bg-slate-100 text-sm bg-white border rounded shadow-lg"
                  onClick={() => router.push("/profile/edit")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 17.25V14.75C3 14.3358 3.33579 14 3.75 14H16.25C16.6642 14 17 14.3358 17 14.75V17.25C17 17.6642 16.6642 18 16.25 18H3.75C3.33579 18 3 17.6642 3 17.25Z"
                      stroke="#555"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M14.5 3.5L16.5 5.5M7 13L14.5 5.5M7 13L5 13L5 11L12.5 3.5L14.5 5.5L7 13Z"
                      stroke="#555"
                      strokeWidth="1.2"
                    />
                  </svg>
                  {t("nav.profileEdit")}
                </button>
              </div>
            </div>
          )}
          <button onClick={handleLogoutClick} className="btn btn-primary">
            {t("nav.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
