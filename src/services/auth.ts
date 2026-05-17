import { User } from "@/types";
import { AUTH_CONSTANTS, ERROR_MESSAGES } from "@/constants";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, getUserProfile } from "./firestore";

/**
 * Sign in with Google.
 * Handles profile creation if not exists.
 *
 * NOTE: For Native (Android/iOS), you must use @react-native-google-signin/google-signin
 * and then pass the idToken to signInWithCredential(auth, GoogleAuthProvider.credential(idToken)).
 *
 * TODO: Replace mock implementation with real Google Sign-In
 * This is currently a placeholder for development/testing only.
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    // FIXME: This is a mock implementation for development only.
    // In production, implement real Google Sign-In using @react-native-google-signin/google-signin
    console.warn(
      "[Auth] Google Login is currently mocked. Replace with real implementation for production.",
    );

    // For now, we simulate a successful login
    // In production, this should use the real Google Sign-In flow
    const simulatedUser = {
      uid: "gustavo-mock-id",
      displayName: "gustavo souza",
      email: "gustavogss.jp@gmail.com",
      photoURL:
        "https://ui-avatars.com/api/?name=Gustavo+Souza&background=1B3A4B&color=fff&size=200&bold=true&format=png",
    };

    let profile = await getUserProfile(simulatedUser.uid);

    if (!profile) {
      profile = {
        id: simulatedUser.uid,
        name: simulatedUser.displayName,
        email: simulatedUser.email,
        avatar: simulatedUser.photoURL,
        plan: AUTH_CONSTANTS.DEFAULT_PLAN,
        credits: AUTH_CONSTANTS.INITIAL_CREDITS,
        monthlyCreditLimit: AUTH_CONSTANTS.INITIAL_MONTHLY_LIMIT,
        createdAt: new Date().toISOString(),
        subscriptionStatus: AUTH_CONSTANTS.DEFAULT_SUBSCRIPTION_STATUS,
        isTrial: true,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(
          Date.now() + AUTH_CONSTANTS.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000,
        ).toISOString(),
        cancelAtPeriodEnd: false,
        mesesConsecutivos: 0,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        updatedAt: new Date().toISOString(),
      };
      await createUserProfile(profile);
    }

    // Fix for previously created mock users that were given 100 credits by mistake
    if (profile && profile.plan === "free" && profile.credits === 100) {
      profile.credits = AUTH_CONSTANTS.INITIAL_CREDITS;
      profile.monthlyCreditLimit = AUTH_CONSTANTS.INITIAL_MONTHLY_LIMIT;
      await createUserProfile(profile);
    }

    // Ensure avatar is always up-to-date from Google
    if (!profile.avatar && simulatedUser.photoURL) {
      profile.avatar = simulatedUser.photoURL;
      await createUserProfile(profile);
    }

    return profile;
  } catch (error) {
    console.error("[Auth] Google login failed:", error);
    throw new Error(ERROR_MESSAGES.AUTH_FAILED);
  }
}

/**
 * Register a new user with email/password.
 * Creates Firebase Auth account + Firestore user profile.
 *
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password (must be at least 8 characters)
 * @returns Created user profile
 * @throws Error if registration fails
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  try {
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, { displayName: name });

    const user: User = {
      id: credential.user.uid,
      name,
      email,
      plan: AUTH_CONSTANTS.DEFAULT_PLAN,
      credits: AUTH_CONSTANTS.INITIAL_CREDITS,
      monthlyCreditLimit: AUTH_CONSTANTS.INITIAL_MONTHLY_LIMIT,
      createdAt: new Date().toISOString(),
      subscriptionStatus: AUTH_CONSTANTS.DEFAULT_SUBSCRIPTION_STATUS,
      isTrial: true,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(
        Date.now() + AUTH_CONSTANTS.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString(),
      cancelAtPeriodEnd: false,
      mesesConsecutivos: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      updatedAt: new Date().toISOString(),
    };

    await createUserProfile(user);
    return user;
  } catch (error) {
    console.error("[Auth] Registration failed:", error);
    throw error;
  }
}

/**
 * Sign in an existing user with email/password.
 * Returns the Firestore user profile.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns User profile from Firestore
 * @throws Error if login fails or profile not found
 */
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);

    if (!profile) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Fix for previously created mock users that were given 100 credits by mistake
    if (profile.plan === "free" && profile.credits === 100) {
      profile.credits = AUTH_CONSTANTS.INITIAL_CREDITS;
      profile.monthlyCreditLimit = AUTH_CONSTANTS.INITIAL_MONTHLY_LIMIT;
      await createUserProfile(profile);
    }

    return profile;
  } catch (error) {
    console.error("[Auth] Login failed:", error);
    throw error;
  }
}

/**
 * Sign out the current user.
 *
 * @throws Error if sign out fails
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("[Auth] Logout failed:", error);
    throw error;
  }
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 *
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthChange(
  callback: (firebaseUser: FirebaseUser | null) => void,
) {
  return onAuthStateChanged(auth, callback);
}
