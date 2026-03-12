"use client";

import { useEffect, useState } from "react";

interface UserSession {
  email: string;
  organization_id: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = (await res.json()) as UserSession | null;
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
};
