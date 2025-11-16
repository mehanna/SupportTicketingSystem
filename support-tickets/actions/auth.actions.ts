'use server';

import { prisma } from '@/db/prisma';
import { logEvent } from '@/utils/sentry';
import bcrypt from 'bcryptjs';
import {signAuthToken, setAuthCookie} from '@/lib/auth';
import { log } from 'console';

type responseState = {
    success: boolean;
    message: string;
}
/**
 * register a new use and set auth cookie
 *   The user inputs is not valid, return an error message
 *   If the user already exists, return an error message
 *   if registration is successful, sign an auth token and set the auth cookie
 * @param prevState 
 * @param formData 
 * @returns responseState

*/
export async function registerUser(
    prevState: responseState,
    formData: FormData
): Promise<responseState> {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        //************ 
        // validate input
        //************
        if (!name || !email || !password) {
            logEvent(
                'Validation failed: missing required fields',
                'auth',
                { name, email },
                'warning'
            );
            return { success: false, message: 'All fields are required.' };
        }
        //************ 
        // check if user already exists 
        //************ 
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            logEvent(
                'Registration failed: user already exists',
                'auth',
                { email },
                'warning'
            );
            return { success: false, message: 'User with this email already exists.' };
        }
        //************ 
        // hash password
        //************
        const hashedPassword = await bcrypt.hash(password, 10);

        //************
        // create user in database
        //************
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        logEvent(
            `User registered with ID: ${user.id}`,
            'auth',
            { userId: user.id, email: user.email },
            'info'
        );
        //************
        // sign auth token
        //************
        const token =  await signAuthToken({ userId: user.id, email: user.email });

        //************
        // set auth cookie
        //************
        await setAuthCookie(token);

        logEvent(
            `User registration successful and auth cookie set for user ID: ${user.email}`,
            'auth',
            { userId: user.id, email: user.email },
            'info'  
        );
        return { success: true, message: 'User registered successfully' };
    }
    catch (error) {
        logEvent(
            'Registration failed: unexpected error',
            'auth',
            { formData: Object.fromEntries(formData.entries()) },
            'error',
            error
        );
        return { success: false, message: 'An error occurred during registration.' };
    }

}
