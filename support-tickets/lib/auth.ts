import { SignJWT,jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logEvent } from '@/utils/sentry';

// convert to Uint8Array for jose
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const cookieName = "auth-token";


// This will encrypt and sign a JWT token with the given payload */
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

/* This will verify and decode a JWT token
    Input: token string
    Output: payload object of type T (email, userId, etc.)
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
    throw new Error(`Error verifying auth token : ${error}`);
  }
}
