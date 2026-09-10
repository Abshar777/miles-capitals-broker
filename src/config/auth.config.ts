import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        token: { label: "Token", type: "token" },
        verified: { label: "Verified", type: "boolean" },
        otpAccess: { label: "OTP Access", type: "boolean" },
        forgetOtpAccess: { label: "Forget OTP Access", type: "boolean" },
        conformPasswordToken: { label: "Conform Password Access", type: "boolean" },
        country: { label: "Country", type: "string" },
        city: { label: "City", type: "string" },
        name: { label: "Name", type: "string" },
        id: { label: "ID", type: "string" },
      },
      async authorize(credentials,) {


        if (!credentials?.email) {
          console.log("Email is required.");
          return null;
        }

        // Mock user for now, replace with actual DB call
        const user = {
          id: credentials.id as string || "123",
          name: credentials.name as string || "",
          email: credentials.email as string,
          token: credentials.token as string,
          verified: credentials.verified as unknown as boolean,
          otpAccess: credentials.otpAccess as unknown as boolean,
          forgetOtpAccess: credentials.forgetOtpAccess as unknown as boolean,
          conformPasswordToken: credentials.conformPasswordToken as unknown as string,
          country: credentials.country as string,
          city: credentials.city as string,

        };



        return user;
      }
    }),
  ],

  pages: {
    signIn: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - how often session is updated
  },
  cookies: {
    // Add custom cookie configuration
    sessionToken: {
      name: `client-mt5-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `client-mt5-callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        // secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `client-mt5-csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, account, profile, session }) {

      console.log(session,trigger,"session")
      if (trigger === "update") {
        token.name = session?.name || token?.name;
        token.id = session?.id || token?.id;
        token.email = session?.email || token?.email;
        token.token = session?.token || token?.token;
        token.image = session?.image || token?.image;
        token.verified = session?.verified || token?.verified;
        token.otpAccess = session?.otpAccess || token?.otpAccess;
        token.forgetOtpAccess = session?.forgetOtpAccess || token?.forgetOtpAccess;
        token.conformPasswordToken = session?.conformPasswordToken || token?.conformPasswordToken;
        token.country = session?.country || token?.country;
        token.city = session?.city || token?.city;
      }
      // When user signs in, store user data in token
      if (user) {
        token.id = user?.id;
        token.name = user?.name;
        token.email = user?.email;
        token.token = user.token;
        token.image = user?.image || "";
        token.verified = user?.verified;
        token.otpAccess = user?.otpAccess;
        token.forgetOtpAccess = user?.forgetOtpAccess || false;
        token.conformPasswordToken = user?.conformPasswordToken;
        token.country = user?.country;
        token.city = user?.city;
      }


      return token;
    },

    async session({ session, token }) {


      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.token = token.token as string;
        session.user.image = token.image as string;
        session.user.verified = token.verified as boolean;
        session.user.otpAccess = token.otpAccess as boolean;
        session.user.forgetOtpAccess = token.forgetOtpAccess as boolean || false;
        session.user.conformPasswordToken = token.conformPasswordToken as string;

        session.user.country = token.country as string;
        session.user.city = token.city as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || baseUrl;



      // Handle signout
      if (url.includes('/api/auth/signout')) {
        return `${frontendUrl}/auth/login`;
      }

      // Handle signin success
      if (url.includes('/api/auth/signin') || url === '/auth/login') {
        return frontendUrl;
      }

      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${frontendUrl}${url}`;
      }

      // Allow same-origin URLs
      if (url.startsWith(frontendUrl)) {
        return url;
      }

      // Default fallback
      return frontendUrl;
    },
  },

  // Add these additional options for stability
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,

  // JWT options for better token handling
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Events for debugging
  events: {
    async signIn({ user, account, profile }) {

    },
    async signOut({ session, token }) {

    },
    async session({ session, token }) {

    },
   
    updateUser(data) {
    console.log(data,"updateUser")
   },
  },
};

// Type declarations
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      token?: string;
      image?: string;
      verified?: boolean;
      otpAccess?: boolean;
      forgetOtpAccess?: boolean;
      conformPasswordToken?: string;
      country?: string;
      city?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    token?: string;
    image?: string;
    verified?: boolean;
    otpAccess?: boolean;
    forgetOtpAccess?: boolean;
    conformPasswordToken?: string;
    country?: string;
    city?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    token?: string;
    image?: string;
    verified?: boolean;
    otpAccess?: boolean;
    forgetOtpAccess?: boolean;
    conformPasswordToken?: string;
    country?: string;
    city?: string;
  }
}