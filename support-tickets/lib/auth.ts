import { SignJWT,jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logEvent } from '@/utils/sentry';

// convert to Uint8Array for jose
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const cookieName = "auth-token";


<<<<<<< HEAD
//* This will encrypt and sign a JWT token with the given payload */
=======
//* This function verifies the JWT token from cookies and returns the payload if valid */
>>>>>>> 3c0cba65caeeeeb0ea2e5e3f6da698cbd3e0927f
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

