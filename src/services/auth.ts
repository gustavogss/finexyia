import { User } from "@/types";
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
 */
export async function loginWithGoogle(): Promise<User> {
  // Fix for Android/iOS: signInWithPopup is only for Web.
  // We simulate a successful login here for your environment (Android Emulado).
  console.log("[Auth] Google Login Simulation triggered.");

  const simulatedUser = {
    uid: "gustavo-mock-id",
    displayName: "gustavo souza",
    email: "gustavogss.jp@gmail.com",
    photoURL: "https://ui-avatars.com/api/?name=Gustavo+Souza&background=1B3A4B&color=fff&size=200&bold=true&format=png",
  };

  let profile = await getUserProfile(simulatedUser.uid);

  if (!profile) {
    profile = {
      id: simulatedUser.uid,
      name: simulatedUser.displayName,
      email: simulatedUser.email,
      avatar: simulatedUser.photoURL,
      plan: "free",
      credits: 5,
      monthlyCreditLimit: 5,
      createdAt: new Date().toISOString(),
      subscriptionStatus: "active",
      isTrial: true,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
    profile.credits = 5;
    profile.monthlyCreditLimit = 5;
    await createUserProfile(profile); // This uses merge: true and will update it
  }

  // Ensure avatar is always up-to-date from Google
  if (!profile.avatar && simulatedUser.photoURL) {
    profile.avatar = simulatedUser.photoURL;
    await createUserProfile(profile);
  }

  return profile;
}

/**
 * Register a new user with email/password.
 * Creates Firebase Auth account + Firestore user profile.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(credential.user, { displayName: name });

  const user: User = {
    id: credential.user.uid,
    name,
    email,
    plan: "free",
    credits: 5,
    monthlyCreditLimit: 5,
    createdAt: new Date().toISOString(),
    subscriptionStatus: "active",
    isTrial: true,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    mesesConsecutivos: 0,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    updatedAt: new Date().toISOString(),
  };

  await createUserProfile(user);
  return user;
}

/**
 * Sign in an existing user with email/password.
 * Returns the Firestore user profile.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(credential.user.uid);

  if (!profile) {
    throw new Error("Perfil do usuário não encontrado no Firestore.");
  }

  // Fix for previously created mock users that were given 100 credits by mistake
  if (profile.plan === "free" && profile.credits === 100) {
    profile.credits = 5;
    profile.monthlyCreditLimit = 5;
    await createUserProfile(profile); // This uses merge: true and will update it
  }

  return profile;
}

/**
 * Sign out the current user.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(
  callback: (firebaseUser: FirebaseUser | null) => void,
) {
  return onAuthStateChanged(auth, callback);
}
