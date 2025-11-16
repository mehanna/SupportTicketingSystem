import { SignJWT,jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logEvent } from '@/utils/sentry';

// convert to Uint8Array for jose
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const cookieName = "auth-token";

/**
 * This will encrypt and sign a JWT token with the given payload 
 * @param payload - The payload to include in the JWT token
 * @returns The signed JWT token as a string
 * */
export async function signAuthToken(payload: any) {
  try {
    /* 
    Sign the JWT token
     - set protected header with algorithm
     - set issued at time
     - set expiration time to 7 days
     - sign with secret
    */
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // Token valid for 24 hours
        .sign(secret);
    return token;

  } catch (error) {
    logEvent("Token Signing Error", 
        'auth',
        {payload},
        'error',
        error
    );
    throw new Error(`Error signing auth token : ${error}`);
  }
}

/**
 * This will verify and decode a JWT token
 * @param token - The JWT token to verify and decode
 * @returns The decoded payload of any type T
 */

export async function verifyAuthToken<T>(token: string): Promise<T> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch (error) {
    logEvent("Token Verification Error", 
        'auth',
        {tokenSnippet: token.slice(0,10) + '...'},
        'error',
        error
    );
    throw new Error(`Error verifying token decryption : ${error}`);
  }
}


/**
 * This function sets the authentication cookie in the user's browser.
 * @param token 
 */
export async function setAuthCookie(token: string) {
    try {
        const cookieStore = await cookies();
        cookieStore.set({
            name: cookieName,
            value: token,
            httpOnly: true,
            sameSite: 'lax',// means the cookie is sent with same-site requests and with cross-site top-level navigation
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        });
    } catch (error) {
        logEvent("Set Auth Cookie Error", 
            'auth',
            {tokenSnippet: token.slice(0,10) + '...'},
            'error',
            error
        );
        throw new Error(`Error setting auth cookie : ${error}`);
    }

}