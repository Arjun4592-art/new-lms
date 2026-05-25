// "use client";

// import { useEffect, useState, createContext, useContext } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/lib/firebase/config";
// import { getUserFromFirestore } from "@/lib/firebase/auth";
// import type { LMSUser } from "@/types";

// // ─── Context ──────────────────────────────────────────────────────────────────

// interface AuthContextValue {
//   user: LMSUser | null;
//   loading: boolean;
//   isStudent: boolean;
//   isInstructor: boolean;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextValue>({
//   user: null,
//   loading: true,
//   isStudent: false,
//   isInstructor: false,
//   isAdmin: false,
// });

// // ─── Provider ─────────────────────────────────────────────────────────────────

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<LMSUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         const lmsUser = await getUserFromFirestore(firebaseUser.uid);
//         setUser(lmsUser);
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isStudent: user?.role === "student",
//         isInstructor: user?.role === "instructor",
//         isAdmin: user?.role === "admin",
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// export function useAuth(): AuthContextValue {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// }
