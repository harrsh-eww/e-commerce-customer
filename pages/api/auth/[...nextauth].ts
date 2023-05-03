import env from '@/utils/env';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            authorize: async (credentials) => {
                return {
                    id: '1',
                    email: 'dev@harrsh.com',
                    name: 'Harrsh Patel',
                    image: '',
                };
            },
        }),
    ],
    secret: env.auth.secret,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/',
        error: '/',
    },
    debug: true,
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            if (trigger === 'update' && session) {
                return {
                    ...token,
                    ...session.user,
                };
            }

            return {
                ...token,
                ...user,
            };
        },

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    // _id: token._id,
                    // url: token.url,
                    // contactNumber: token.contactNumber,
                    // customerID: token.customerID,
                    // name: token.name,
                    // email: token.email,
                },
            };
        },
    },
};

export default NextAuth(authOptions);