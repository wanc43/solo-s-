import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserRole, UserProfile } from "@/types";
import { handleFirestoreError, OperationType } from "@/lib/firestore-utils";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ["aaronwancha@gmail.com"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Create initial profile if it doesn't exist
            const isInitialAdmin = ADMIN_EMAILS.includes(firebaseUser.email || "");
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "Solo Member",
              photoURL: firebaseUser.photoURL || "",
              role: isInitialAdmin ? UserRole.ADMIN : UserRole.CUSTOMER,
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: serverTimestamp()
            });
            
            // If admin, also add to admins collection for rules check
            if (isInitialAdmin) {
              await setDoc(doc(db, "admins", firebaseUser.uid), {
                email: firebaseUser.email,
                grantedAt: serverTimestamp()
              });
            }
            
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Don't use handleFirestoreError here to avoid infinite loop or blocking app start
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = profile?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
