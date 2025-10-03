// app/api/auth/[...nextauth]/route.js
import * as NextAuthModule from "next-auth";
import * as CredMod from "next-auth/providers/credentials";

/* ---------- normalize helper ---------- */
function resolve(mod) {
  if (!mod) return null;
  if (typeof mod === "function") return mod;
  if (mod && typeof mod.default === "function") return mod.default;
  if (mod && mod.default && typeof mod.default.default === "function") return mod.default.default;
  return null;
}

/* ---------- normalize imports ---------- */
const NextAuthFn = resolve(NextAuthModule);
const Credentials = resolve(CredMod);

if (!NextAuthFn) {
  console.error("❌ Could not resolve NextAuth function. Got:", NextAuthModule);
  throw new Error("NextAuth import failed.");
}

if (!Credentials) {
  console.error("❌ Could not resolve Credentials provider. Got:", CredMod);
  throw new Error("Credentials provider import failed.");
}

console.log("✅ Resolved NextAuth ->", typeof NextAuthFn);
console.log("✅ Resolved Credentials ->", typeof Credentials);

/* ---------- NextAuth options ---------- */
export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            console.error("Backend login failed:", res.status, await res.text());
            return null;
          }

          const data = await res.json();
          return {
            id: data.user?._id ?? data.user?.id,
            name: data.user?.name,
            email: data.user?.email,
            token: data.token,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user ?? session.user;
      return session;
    },
  },
  pages: { signIn: "/login" },
};

/* ---------- export handlers for App Router ---------- */
const handler = NextAuthFn(authOptions);
export { handler as GET, handler as POST };
