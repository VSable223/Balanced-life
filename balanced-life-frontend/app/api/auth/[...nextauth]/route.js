import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Send login request to Express backend
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await res.json();
          return { id: data.user._id, name: data.user.name, email: data.user.email, token: data.token };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, 'user' will be defined.
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          token: user.token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the user details from the token in the session.
      session.user = token.user || session.user;
      return session;
    },
  },  
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
