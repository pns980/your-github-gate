import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function isRecoveryUrl(href: string) {
  const url = new URL(href);
  const hashParams = new URLSearchParams(url.hash.startsWith("#") ? url.hash.slice(1) : url.hash);
  const type = url.searchParams.get("type") ?? hashParams.get("type");

  return (
    type === "recovery" ||
    url.searchParams.has("code") ||
    url.searchParams.has("token") ||
    hashParams.has("access_token") ||
    hashParams.has("refresh_token")
  );
}

function buildRecoveryRedirect(href: string) {
  const url = new URL(href);
  const search = new URLSearchParams(url.searchParams);
  if (!search.get("type")) search.set("type", "recovery");

  return {
    pathname: "/auth",
    search: `?${search.toString()}`,
    hash: url.hash,
  };
}

export default function AuthRecoveryRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  // Catch recovery tokens in the URL (some providers land on the wrong route).
  useEffect(() => {
    if (!isRecoveryUrl(window.location.href)) return;
    if (location.pathname === "/auth") return;

    navigate(buildRecoveryRedirect(window.location.href), { replace: true });
  }, [location.pathname, navigate]);

  // Catch PASSWORD_RECOVERY even if the SDK cleaned the URL before our effects ran.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate({ pathname: "/auth", search: "?type=recovery" }, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
}
