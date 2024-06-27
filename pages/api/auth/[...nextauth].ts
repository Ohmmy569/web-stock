import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/app/firebase/firebase";

export const authOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials): Promise<any> {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, (credentials as any).username || '', (credentials as any).password || '');
     
          
          if (userCredential.user) {
            return userCredential.user;
          }
          return null;
        } catch (error : any) {
        
          throw new Error(JSON.stringify({ code: error.code, message: error.message }));
        }
      }
    })
  ],
};

export default NextAuth(authOptions);
