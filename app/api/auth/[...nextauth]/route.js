import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        // Connect to the database if not already connected
        await connectToDB();

        // Find the user by email
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        // If the user exists, attach the user's ID to the session
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (error) {
        console.log("Error in session callback:", error);
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        // Connect to the database
        await connectToDB();

        // Check if the user already exists in the database
        const userExists = await User.findOne({ email: profile.email });

        // If the user does not exist, create a new one
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            image: profile.picture, // Use `profile.picture` for Google profile image
          });
        }

        return true; // Sign-in is successful
      } catch (error) {
        console.log("Error in signIn callback:", error);
        return false; // Sign-in failed
      }
    },
  },
});

export { handler as GET, handler as POST };
