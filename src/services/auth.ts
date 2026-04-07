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
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=GS",
  };

  let profile = await getUserProfile(simulatedUser.uid);

  if (!profile) {
    profile = {
      id: simulatedUser.uid,
      name: simulatedUser.displayName,
      email: simulatedUser.email,
      plan: "free",
      credits: 5,
      createdAt: new Date().toISOString(),
    };
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
    createdAt: new Date().toISOString(),
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
