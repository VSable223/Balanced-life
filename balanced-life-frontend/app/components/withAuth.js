"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return <Component {...props} />;
  };
}
