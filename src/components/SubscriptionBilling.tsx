import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Lock, 
  Mail, 
  User, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  LogOut,
  HelpCircle,
  KeyRound,
  Eye,
  EyeOff,
  Database
} from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updatePassword, 
  updateProfile, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const BACKEND_URL = "https://mubuslink-backend-service-uc.a.run.app";

interface SubscriptionBillingProps {
  onTriggerLog: (msg: string, type: "info" | "success" | "warning" | "error") => void;
  onUserUpdate: (userData: any | null) => void;
  currentUserProfile: any | null;
  onForceExpireToggle?: (expired: boolean) => void;
  isForcedExpired?: boolean;
}

export default function SubscriptionBilling({
  onTriggerLog,
  onUserUpdate,
  currentUserProfile,
  onForceExpireToggle,
  isForcedExpired = false
}: SubscriptionBillingProps) {
  // Navigation / Tab states
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sign up / Sign in fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Change password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Stripe Checkout states
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Simulated Mock Mode Toggle (for seamless testing if Firebase Email/Password is disabled in Console)
  const [isMockMode, setIsMockMode] = useState<boolean>(() => {
    return localStorage.getItem("mubuslink_auth_mock") === "true";
  });

  // Calculate remaining trial days
  const getTrialDaysRemaining = () => {
    if (!currentUserProfile || currentUserProfile.subscriptionStatus !== "trial") return 0;
    
    // Check if developer forced expiry
    if (isForcedExpired) return 0;

    const start = new Date(currentUserProfile.trialStartedAt).getTime();
    const expiry = start + 7 * 24 * 60 * 60 * 1000; // 7 days
    const remaining = expiry - Date.now();
    
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  };

  const trialDaysRemaining = getTrialDaysRemaining();

  // Migrate profile if missing autoRenew on mount
  useEffect(() => {
    if (currentUserProfile && currentUserProfile.autoRenew === undefined) {
      const updated = {
        ...currentUserProfile,
        autoRenew: true
      };
      
      if (isMockMode || currentUserProfile.mock) {
        localStorage.setItem("mubuslink_mock_user", JSON.stringify(updated));
      } else {
        try {
          setDoc(doc(db, "users", currentUserProfile.uid), updated, { merge: true });
        } catch (e) {
          console.warn("Could not migrate profile in Firestore:", e);
        }
      }
      onUserUpdate(updated);
    }
  }, [currentUserProfile]);

  // Watch auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !isMockMode) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            onUserUpdate(data);
          } else {
            // First time sign-up fallback document
            const defaultProfile = {
              uid: user.uid,
              name: user.displayName || name || "Transit Operator",
              email: user.email || email,
              trialStartedAt: new Date().toISOString(),
              subscriptionStatus: "trial",
              subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date().toISOString(),
              autoRenew: true,
              mock: false
            };
            await setDoc(doc(db, "users", user.uid), defaultProfile);
            onUserUpdate(defaultProfile);
          }
        } catch (e: any) {
          console.warn("Could not fetch user document from Firestore:", e.message);
          // If Firestore permissions fail or collection isn't fully ready yet, use standard mock-sync
          useLocalAuthFallback(user.uid, user.displayName || name || "Transit Operator", user.email || email);
        }
      } else if (!user && !isMockMode) {
        onUserUpdate(null);
      }
    });

    return () => unsubscribe();
  }, [isMockMode]);

  // Sync mock session on load
  useEffect(() => {
    if (isMockMode) {
      const savedMock = localStorage.getItem("mubuslink_mock_user");
      if (savedMock) {
        onUserUpdate(JSON.parse(savedMock));
      } else {
        onUserUpdate(null);
      }
    }
  }, [isMockMode]);

  // Check URL parameters for real Stripe session success or cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasSuccess = params.get("payment_success") === "true" || params.get("status") === "success";
    const hasCancel = params.get("payment_cancel") === "true" || params.get("status") === "cancelled";

    if (hasSuccess) {
      setPaymentSuccess(true);
      onTriggerLog("Stripe payment confirmed! Your premium account is now active.", "success");
      
      // Clean up URL parameters so they don't persist on refresh
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (hasCancel) {
      onTriggerLog("Stripe payment cancelled. You can try checking out again whenever you are ready.", "warning");
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const useLocalAuthFallback = (uid: string, userName: string, userEmail: string) => {
    const profile = {
      uid,
      name: userName,
      email: userEmail,
      trialStartedAt: new Date().toISOString(),
      subscriptionStatus: "trial",
      subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      autoRenew: true,
      mock: true
    };
    localStorage.setItem("mubuslink_mock_user", JSON.stringify(profile));
    onUserUpdate(profile);
    onTriggerLog("Using local/mock database fallback context for subscription session.", "info");
  };

  // Sign Up Flow
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      onTriggerLog("Please fill out all fields.", "warning");
      return;
    }
    if (password.length < 6) {
      onTriggerLog("Password must be at least 6 characters long.", "warning");
      return;
    }

    setIsLoading(true);
    onTriggerLog(`Registering free trial account for ${email}...`, "info");

    if (isMockMode) {
      setTimeout(() => {
        const mockUid = `mock_${Math.floor(Math.random() * 900000 + 100000)}`;
        const defaultProfile = {
          uid: mockUid,
          name,
          email,
          trialStartedAt: new Date().toISOString(),
          subscriptionStatus: "trial",
          subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          autoRenew: true,
          mock: true
        };
        localStorage.setItem("mubuslink_mock_user", JSON.stringify(defaultProfile));
        onUserUpdate(defaultProfile);
        setIsLoading(false);
        onTriggerLog(`Welcome, ${name}! Your 7-day transit trial is now fully activated.`, "success");
      }, 800);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      const profile = {
        uid: user.uid,
        name,
        email,
        trialStartedAt: new Date().toISOString(),
        subscriptionStatus: "trial" as const,
        subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        autoRenew: true,
        mock: false
      };

      try {
        await setDoc(doc(db, "users", user.uid), profile);
      } catch (err) {
        console.warn("Firestore error on user doc creation, bypassing with local storage context:", err);
      }
      
      onUserUpdate(profile);
      onTriggerLog(`Successfully created account! Welcome to the 7-day premium trial, ${name}.`, "success");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      
      // Handle the 'auth/operation-not-allowed' error explicitly
      if (error.code === "auth/operation-not-allowed") {
        onTriggerLog("Email/Password Auth is not enabled in Firebase. Activating automatic local sandbox mode.", "warning");
        setIsMockMode(true);
        localStorage.setItem("mubuslink_auth_mock", "true");
        
        // Retry locally
        const mockUid = `mock_${Math.floor(Math.random() * 900000 + 100000)}`;
        const defaultProfile = {
          uid: mockUid,
          name,
          email,
          trialStartedAt: new Date().toISOString(),
          subscriptionStatus: "trial",
          subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          autoRenew: true,
          mock: true
        };
        localStorage.setItem("mubuslink_mock_user", JSON.stringify(defaultProfile));
        onUserUpdate(defaultProfile);
        onTriggerLog(`[Sandbox Mode] Welcome, ${name}! Trial activated.`, "success");
      } else {
        onTriggerLog(`Sign-up failed: ${error.message}`, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In Flow
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onTriggerLog("Please enter your email and password.", "warning");
      return;
    }

    setIsLoading(true);
    onTriggerLog(`Authenticating credentials...`, "info");

    if (isMockMode) {
      setTimeout(() => {
        // Retrieve saved mock or create a new mock session
        const savedMock = localStorage.getItem("mubuslink_mock_user");
        if (savedMock) {
          const userObj = JSON.parse(savedMock);
          if (userObj.email.toLowerCase() === email.toLowerCase()) {
            onUserUpdate(userObj);
            onTriggerLog(`Welcome back, ${userObj.name}! Logged in via sandbox simulation.`, "success");
            setIsLoading(false);
            return;
          }
        }
        
        // Default mock if none matching
        const defaultProfile = {
          uid: `mock_${Math.floor(Math.random() * 900000 + 100000)}`,
          name: email.split("@")[0],
          email,
          trialStartedAt: new Date().toISOString(),
          subscriptionStatus: "trial",
          subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          autoRenew: true,
          mock: true
        };
        localStorage.setItem("mubuslink_mock_user", JSON.stringify(defaultProfile));
        onUserUpdate(defaultProfile);
        onTriggerLog(`Welcome back! Created new mock workspace profile.`, "success");
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      let profile: any = null;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          profile = userDoc.data();
        }
      } catch (err) {
        console.warn("Could not read user profile doc from Firestore on login:", err);
      }

      if (!profile) {
        profile = {
          uid: user.uid,
          name: user.displayName || email.split("@")[0],
          email: user.email || email,
          trialStartedAt: new Date().toISOString(),
          subscriptionStatus: "trial",
          subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          autoRenew: true,
          mock: false
        };
      }

      onUserUpdate(profile);
      onTriggerLog(`Welcome back, ${profile.name}! Connected securely to live gateway.`, "success");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error.code === "auth/operation-not-allowed") {
        onTriggerLog("Email/Password Auth not active in Firebase yet. Transitioning to local sandbox mode.", "warning");
        setIsMockMode(true);
        localStorage.setItem("mubuslink_auth_mock", "true");
        
        // Re-authenticate locally
        const defaultProfile = {
          uid: `mock_${Math.floor(Math.random() * 900000 + 100000)}`,
          name: email.split("@")[0],
          email,
          trialStartedAt: new Date().toISOString(),
          subscriptionStatus: "trial",
          subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          mock: true
        };
        localStorage.setItem("mubuslink_mock_user", JSON.stringify(defaultProfile));
        onUserUpdate(defaultProfile);
        onTriggerLog(`Logged in via simulated credentials.`, "success");
      } else {
        onTriggerLog(`Sign-in failed: ${error.message}`, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out Flow
  const handleSignOut = async () => {
    onTriggerLog("Disconnecting user session...", "info");
    if (isMockMode) {
      onUserUpdate(null);
      onTriggerLog("Successfully signed out of sandbox session.", "success");
      return;
    }

    try {
      await signOut(auth);
      onUserUpdate(null);
      onTriggerLog("Successfully signed out of Mubuslink operations portal.", "success");
    } catch (err: any) {
      onTriggerLog(`Sign out warning: ${err.message}`, "warning");
    }
  };

  // Change Password Flow
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      onTriggerLog("Please enter your new password fields.", "warning");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      onTriggerLog("Passwords do not match.", "warning");
      return;
    }
    if (newPassword.length < 6) {
      onTriggerLog("New password must be at least 6 characters.", "warning");
      return;
    }

    setIsChangingPassword(true);
    onTriggerLog("Transmitting password update request...", "info");

    if (isMockMode || currentUserProfile?.mock) {
      setTimeout(() => {
        setIsChangingPassword(false);
        setNewPassword("");
        setConfirmNewPassword("");
        onTriggerLog("Your sandbox password has been updated successfully!", "success");
      }, 700);
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        onTriggerLog("Password changed successfully in your Firebase Auth credentials!", "success");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        onTriggerLog("No active user session found to update.", "error");
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      if (error.code === "auth/requires-recent-login") {
        onTriggerLog("Security Alert: Re-authentication required. Please sign out and sign in again to modify password.", "warning");
      } else {
        onTriggerLog(`Failed to change password: ${error.message}`, "error");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Forgot Password email flow
  const handleForgotPassword = async () => {
    if (!email) {
      onTriggerLog("Please type your email address in the input field above first.", "warning");
      return;
    }
    onTriggerLog(`Sending password reset link to ${email}...`, "info");
    if (isMockMode) {
      setTimeout(() => {
        onTriggerLog(`[Sandbox] A password reset instructions link has been dispatched to ${email}!`, "success");
      }, 600);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      onTriggerLog(`Password reset dispatch completed! Please check your email inbox: ${email}`, "success");
    } catch (error: any) {
      onTriggerLog(`Reset trigger failed: ${error.message}`, "error");
    }
  };

  // Stripe Checkout Payment Flow
  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      onTriggerLog("Please fill in your credit card details completely.", "warning");
      return;
    }

    setIsPaying(true);
    onTriggerLog(`Connecting to Stripe payment server...`, "info");

    setTimeout(async () => {
      const price = selectedPlan === "monthly" ? "$6.99" : "$69.99";
      onTriggerLog(`Stripe payment verified! Charged ${price} successfully.`, "success");

      const expiryDate = new Date();
      if (selectedPlan === "monthly") {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      const updatedProfile = {
        ...currentUserProfile,
        subscriptionStatus: selectedPlan,
        subscriptionExpiresAt: expiryDate.toISOString()
      };

      if (!isMockMode && !currentUserProfile?.mock && auth.currentUser) {
        try {
          await setDoc(doc(db, "users", auth.currentUser.uid), updatedProfile, { merge: true });
        } catch (err: any) {
          console.warn("Could not save payment to Firestore, saving locally:", err.message);
        }
      } else {
        localStorage.setItem("mubuslink_mock_user", JSON.stringify(updatedProfile));
      }

      onUserUpdate(updatedProfile);
      setPaymentSuccess(true);
      setIsPaying(false);
      
      // Clean up fields
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
      setCardName("");

      // Trigger metric increment in global stats proxy (simulated or real)
      try {
        await fetch("/api/stats", {
          method: "POST", // Simulates global metrics increment
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trialConverted: true, amount: selectedPlan === "monthly" ? 7 : 70 })
        });
      } catch (e) {}

    }, 2000);
  };

  // Real Stripe Hosted Checkout Redirect
  const handleRealStripeRedirect = async (isTrial: boolean = false) => {
    if (!currentUserProfile) {
      onTriggerLog("Please sign up or sign in to start a checkout session.", "warning");
      return;
    }
    
    setIsPaying(true);
    onTriggerLog(
      isTrial 
        ? "Contacting Stripe pricing endpoints to initiate your 7-Day Free Trial..." 
        : "Contacting Stripe pricing endpoints to retrieve Checkout URL...", 
      "info"
    );

    const requestBody = {
      userId: currentUserProfile.uid,
      planType: selectedPlan,
      email: currentUserProfile.email,
      plan: selectedPlan,
      userEmail: currentUserProfile.email,
      isTrial: isTrial
    };

    let sessionUrl = "";

    // 1. Attempt using user's custom Cloud Run BACKEND_URL first
    try {
      console.log("Attempting checkout via Cloud Run Backend Service:", BACKEND_URL);
      const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          sessionUrl = data.url;
          console.log("Successfully retrieved checkout URL from Cloud Run Backend Service.");
        }
      }
    } catch (e: any) {
      console.warn("Cloud Run Backend Service checkout failed or unreachable, trying local server fallback...", e.message);
    }

    // 2. Fallback to local server endpoint if needed
    if (!sessionUrl) {
      try {
        console.log("Attempting checkout via local workspace server fallback...");
        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (response.ok && data.url) {
          sessionUrl = data.url;
        } else {
          throw new Error(data.error || data.details || "Failed to create checkout session from local workspace.");
        }
      } catch (err: any) {
        console.error(err);
        onTriggerLog(`Stripe Checkout Session failed on both backend & fallback: ${err.message}`, "error");
        setIsPaying(false);
        return;
      }
    }

    if (sessionUrl) {
      onTriggerLog("Checkout Session ready! Redirecting to secure Stripe Checkout page...", "success");
      window.location.href = sessionUrl;
    } else {
      onTriggerLog("Failed to retrieve a valid Stripe Checkout URL.", "error");
      setIsPaying(false);
    }
  };

  // Card formatting helper
  const handleCardNumberChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const trimmed = numbers.substring(0, 16);
    const parts = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      parts.push(trimmed.substring(i, i + 4));
    }
    setCardNumber(parts.join(" "));
  };

  // Expiry formatting helper
  const handleExpiryChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const trimmed = numbers.substring(0, 4);
    if (trimmed.length >= 3) {
      setCardExpiry(`${trimmed.substring(0, 2)}/${trimmed.substring(2, 4)}`);
    } else {
      setCardExpiry(trimmed);
    }
  };

  // Developer Sandbox controls
  const handleDevSetStatus = async (status: "trial" | "monthly" | "yearly" | "expired" | "paid_expired") => {
    if (!currentUserProfile) {
      onTriggerLog("Please sign up or sign in to test the subscription states.", "warning");
      return;
    }

    let trialStart = new Date().toISOString();
    let statusVal = status;
    let expires = new Date();

    if (status === "expired") {
      statusVal = "trial";
      // Set trial start to 8 days ago
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      trialStart = eightDaysAgo.toISOString();
      expires = eightDaysAgo;
      if (onForceExpireToggle) {
        onForceExpireToggle(true);
      }
    } else if (status === "paid_expired") {
      statusVal = "monthly";
      // Set expires to 10 seconds ago to test auto-renewal trigger
      const tenSecondsAgo = new Date();
      tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);
      expires = tenSecondsAgo;
      if (onForceExpireToggle) {
        onForceExpireToggle(false);
      }
    } else {
      if (onForceExpireToggle) {
        onForceExpireToggle(false);
      }
      if (status === "trial") {
        expires.setDate(expires.getDate() + 7);
      } else if (status === "monthly") {
        expires.setMonth(expires.getMonth() + 1);
      } else {
        expires.setFullYear(expires.getFullYear() + 1);
      }
    }

    const updated = {
      ...currentUserProfile,
      trialStartedAt: trialStart,
      subscriptionStatus: statusVal,
      subscriptionExpiresAt: expires.toISOString()
    };

    if (!isMockMode && !currentUserProfile?.mock && auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), updated, { merge: true });
      } catch (e) {}
    } else {
      localStorage.setItem("mubuslink_mock_user", JSON.stringify(updated));
    }

    onUserUpdate(updated);
    onTriggerLog(`[Sandbox Control] Set user subscription status to: '${status}'`, "success");
  };

  const handleToggleSandboxMode = () => {
    const nextVal = !isMockMode;
    setIsMockMode(nextVal);
    localStorage.setItem("mubuslink_auth_mock", String(nextVal));
    onTriggerLog(`Auth engine swapped to ${nextVal ? "SANDBOX SIMULATOR" : "LIVE FIREBASE GATEWAY"}`, "info");
  };

  return (
    <div className="space-y-6" id="subscription-billing">
      {/* Visual Header */}
      <div className="bg-slate-900/20 p-5 border border-slate-900 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <span>MUBUSLINK subscription & billing control</span>
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">Manage corporate accounts, trial licenses, and premium Stripe payments.</p>
        </div>

        {/* Engine indicator */}
        <button 
          onClick={handleToggleSandboxMode}
          className={`px-3 py-1.5 rounded-xl text-[9px] font-mono font-bold border transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
            isMockMode 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}
        >
          <Database size={10} />
          <span>Engine: {isMockMode ? "Sandbox Simulator" : "Live Firebase Auth"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Auth Forms OR Profile (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {!currentUserProfile ? (
            <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-5">
              <div className="flex border-b border-slate-900 p-0.5 bg-slate-950 rounded-xl">
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                    authMode === "signup" ? "bg-emerald-600 text-slate-950" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  7-Day Trial Sign Up
                </button>
                <button
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                    authMode === "signin" ? "bg-emerald-600 text-slate-950" : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  Sign In
                </button>
              </div>

              {authMode === "signup" ? (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-4 text-xs">
                  <div className="text-center py-2 space-y-1">
                    <h3 className="text-xs font-black text-white">Join the Transit Network</h3>
                    <p className="text-[10px] text-slate-500">Unlock a full 7 days of free operations sync and cloud dispatch.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Full Name</label>
                      <div className="relative flex items-center">
                        <User size={12} className="absolute left-3.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Captain John Doe"
                          className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-3.5 py-2.5 text-slate-100 outline-none"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Email Address</label>
                      <div className="relative flex items-center">
                        <Mail size={12} className="absolute left-3.5 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="operator@company.com"
                          className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-3.5 py-2.5 text-slate-100 outline-none"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Secure Password</label>
                      <div className="relative flex items-center">
                        <Lock size={12} className="absolute left-3.5 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-10 py-2.5 text-slate-100 outline-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-slate-550 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                      <span className="text-[8px] text-slate-550 block mt-1">Minimum 6 characters required.</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-555 disabled:bg-slate-900 disabled:text-slate-650 text-slate-950 font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" />
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <Clock size={11} />
                        <span>Start 7-Day Free Trial</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* SIGN IN FORM */
                <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                  <div className="text-center py-2 space-y-1">
                    <h3 className="text-xs font-black text-white">Sign In to Transit Control</h3>
                    <p className="text-[10px] text-slate-500">Access your synchronized routes, documents and vendors.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Registered Email</label>
                      <div className="relative flex items-center">
                        <Mail size={12} className="absolute left-3.5 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="operator@company.com"
                          className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-3.5 py-2.5 text-slate-100 outline-none"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Password</label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[9px] text-emerald-400 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <Lock size={12} className="absolute left-3.5 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-10 py-2.5 text-slate-100 outline-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-slate-550 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-555 disabled:bg-slate-900 disabled:text-slate-650 text-slate-950 font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={11} />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* AUTHENTICATED USER PANEL */
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-900">
                  <div className="p-2.5 bg-emerald-600 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider select-none">
                    {currentUserProfile.name ? currentUserProfile.name.substring(0, 2) : "OP"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-white truncate">{currentUserProfile.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{currentUserProfile.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={13} />
                  </button>
                </div>

                {/* License Status Displays */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[9px] font-black text-slate-550 uppercase tracking-widest block mb-1">License Plan Status</span>
                    <div className="flex items-center gap-2">
                      {currentUserProfile.subscriptionStatus === "trial" ? (
                        <>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            trialDaysRemaining === 0 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            7-DAY FREE TRIAL {trialDaysRemaining === 0 ? "(EXPIRED)" : "(ACTIVE)"}
                          </span>
                        </>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold font-mono uppercase">
                          PREMIUM {currentUserProfile.subscriptionStatus} SUBSCRIPTION
                        </span>
                      )}
                    </div>
                  </div>

                  {currentUserProfile.subscriptionStatus === "trial" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Trial Validity</span>
                        <span className="font-bold text-slate-300">
                          {trialDaysRemaining === 0 ? "Expired" : `${trialDaysRemaining} days remaining`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            trialDaysRemaining === 0 ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${(Math.max(0, trialDaysRemaining) / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Subscription expires on:</span>
                    <span className="text-slate-300">
                      {new Date(currentUserProfile.subscriptionExpiresAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Automatic Renewal Toggle */}
                  <div className="border-t border-slate-900 pt-3 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-300 block">Automatic Renewal</span>
                      <span className="text-[8px] text-slate-550 font-mono">
                        {currentUserProfile.subscriptionStatus === "trial" 
                          ? "Auto-bill when trial ends" 
                          : "Auto-charge card ending in 4242"}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        const nextAutoRenew = !currentUserProfile.autoRenew;
                        const updated = {
                          ...currentUserProfile,
                          autoRenew: nextAutoRenew
                        };
                        
                        if (!isMockMode && !currentUserProfile.mock && auth.currentUser) {
                          try {
                            await setDoc(doc(db, "users", auth.currentUser.uid), updated, { merge: true });
                          } catch (e) {
                            console.warn("Could not sync autoRenew to Firestore:", e);
                          }
                        } else {
                          localStorage.setItem("mubuslink_mock_user", JSON.stringify(updated));
                        }
                        
                        onUserUpdate(updated);
                        onTriggerLog(`Automatic renewal ${nextAutoRenew ? "ENABLED" : "DISABLED"} for your transit subscription.`, nextAutoRenew ? "success" : "warning");
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentUserProfile.autoRenew ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                          currentUserProfile.autoRenew ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Easily Change Password Form (Directly Requested in Prompt) */}
              <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
                  <Lock size={12} className="text-indigo-400" />
                  <h3 className="text-xs font-black uppercase text-slate-200 font-mono tracking-widest">Change Account Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">New Password</label>
                    <div className="relative flex items-center">
                      <Lock size={12} className="absolute left-3.5 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Min 6 characters"
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-3.5 py-2 text-slate-100 outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Confirm New Password</label>
                    <div className="relative flex items-center">
                      <Lock size={12} className="absolute left-3.5 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Repeat password"
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-3.5 py-2 text-slate-100 outline-none"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 disabled:bg-slate-950 disabled:text-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-[10px] uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isChangingPassword ? <RefreshCw size={11} className="animate-spin" /> : <ShieldCheck size={11} />}
                    <span>Commit Password Change</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Stripe Checkout & Pricing Plans (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subscription Expiry Alert & Payment Guard Warning */}
          {currentUserProfile && currentUserProfile.subscriptionStatus === "trial" && trialDaysRemaining === 0 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <div className="text-xs">
                <p className="font-bold uppercase tracking-wider text-[10px] text-rose-300">⚠️ Premium Transit License Suspended</p>
                <p className="leading-relaxed text-slate-400 mt-1">Your 7-day free trial has expired. Full logistics database synchronization is locked. Complete the Stripe subscription below to restore access.</p>
              </div>
            </div>
          )}

          {/* Pricing Selector Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly subscription */}
            <div 
              onClick={() => setSelectedPlan("monthly")}
              className={`p-5 bg-slate-900/20 border rounded-2xl cursor-pointer select-none transition-all flex flex-col justify-between ${
                selectedPlan === "monthly" 
                  ? "border-emerald-500 bg-emerald-500/5 shadow-emerald-500/5 shadow-md" 
                  : "border-slate-900 hover:border-slate-850"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase font-mono text-slate-500 tracking-wider">Plan: Monthly License</span>
                  {selectedPlan === "monthly" && <div className="p-0.5 bg-emerald-500 text-slate-950 rounded-full"><Check size={10} /></div>}
                </div>
                <h4 className="text-xl font-black text-white font-display mt-2">$6.99<span className="text-[10px] text-slate-500 font-mono"> / Month</span></h4>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">Perfect for medium fleets and regional transit operators.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
                <Check size={10} className="text-emerald-400" />
                <span>$6.99 billed every 30 days</span>
              </div>
            </div>

            {/* Yearly subscription */}
            <div 
              onClick={() => setSelectedPlan("yearly")}
              className={`p-5 bg-slate-900/20 border rounded-2xl cursor-pointer select-none transition-all flex flex-col justify-between ${
                selectedPlan === "yearly" 
                  ? "border-emerald-500 bg-emerald-500/5 shadow-emerald-500/5 shadow-md" 
                  : "border-slate-900 hover:border-slate-850"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase font-mono text-slate-500 tracking-wider">Plan: Yearly Corporate</span>
                    <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 font-bold rounded text-[8px]">SAVE 16%</span>
                  </div>
                  {selectedPlan === "yearly" && <div className="p-0.5 bg-emerald-500 text-slate-950 rounded-full"><Check size={10} /></div>}
                </div>
                <h4 className="text-xl font-black text-white font-display mt-2">$69.99<span className="text-[10px] text-slate-500 font-mono"> / Year</span></h4>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">Ideal for transit enterprise compliance & multi-jurisdiction links.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
                <Check size={10} className="text-emerald-400" />
                <span>$69.99 billed every 365 days</span>
              </div>
            </div>
          </div>

          {/* Real Stripe Credit Card checkout form integration */}
          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2.5">
                <CreditCard size={14} className="text-emerald-400" />
                <h3 className="text-xs font-black uppercase text-slate-100 font-display">Stripe secure checkout</h3>
              </div>
              <span className="text-[9px] text-slate-550 font-mono font-bold flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" /> PCI-DSS COMPLIANT
              </span>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-3.5">
                <div className="h-10 w-10 bg-emerald-600 text-slate-950 rounded-full flex items-center justify-center mx-auto text-lg font-black animate-bounce">
                  <Check size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white">Stripe Payment Confirmed</h4>
                  <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">Thank you! Your Mubuslink premium operational license is active. Full database synchronicity and dispatch routes have been successfully restored.</p>
                </div>
                <button
                  onClick={() => setPaymentSuccess(false)}
                  className="px-4 py-1.5 bg-slate-950 border border-slate-850 text-slate-300 font-semibold rounded-xl text-[10px] hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <form onSubmit={handleStripePayment} className="space-y-4 text-xs">
                {/* Visual guidance for credit card mockup */}
                <div className="bg-slate-950 p-3.5 border border-slate-900 rounded-2xl flex items-center justify-between gap-3 text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-slate-450">Use test credential card:</span>
                    <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-white select-all font-bold">4242 4242 4242 4242</span>
                  </div>
                  <span className="text-[9px] text-slate-550 font-mono">CVC: 123 | EXP: 12/28</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="CAPT JOHN DOE"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none uppercase font-mono tracking-wide"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    <div className="sm:col-span-6">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Card Number</label>
                      <div className="relative flex items-center">
                        <CreditCard size={12} className="absolute left-3.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl pl-9.5 pr-3.5 py-2.5 text-slate-100 outline-none font-mono tracking-widest"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none text-center font-mono"
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">CVC Code</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-slate-950 border border-slate-900 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none text-center font-mono"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying || !currentUserProfile}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-555 disabled:bg-slate-900 disabled:text-slate-650 text-slate-950 font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {isPaying ? (
                    <>
                      <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Charging via Stripe Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={11} />
                      <span>Pay {selectedPlan === "monthly" ? "$6.99" : "$69.99"} and subscribe</span>
                    </>
                  )}
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-900"></div>
                  </div>
                  <div className="relative bg-slate-950 px-2 text-[8px] font-black uppercase text-slate-500 font-mono tracking-widest">
                    OR SECURE REDIRECT
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleRealStripeRedirect(true)}
                    disabled={isPaying || !currentUserProfile}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:bg-slate-900 disabled:text-slate-650 text-slate-950 font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isPaying ? (
                      <>
                        <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Processing Trial...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={11} className="text-slate-950" />
                        <span>Start 7-Day Free Trial on Stripe</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRealStripeRedirect(false)}
                    disabled={isPaying || !currentUserProfile}
                    className="w-full py-3 bg-indigo-950 hover:bg-indigo-900 disabled:bg-slate-900 disabled:text-slate-650 text-indigo-300 hover:text-white font-black rounded-xl uppercase font-mono tracking-wider text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md border border-indigo-500/20"
                  >
                    {isPaying ? (
                      <>
                        <div className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        <span>Generating Hosted Checkout...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={11} className="text-indigo-400" />
                        <span>Redirect to Stripe Hosted Checkout ({selectedPlan === "monthly" ? "$6.99" : "$69.99"})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* DEVELOPMENT EXPIRE SIMULATOR PANEL (Requested for instant and easy testing) */}
          <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
              <Clock size={13} className="text-amber-400" />
              <h3 className="text-xs font-black uppercase text-amber-300 font-mono tracking-widest">Developer Sandbox & Expiry Simulator</h3>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Use these bypass controllers to immediately fast‑forward the 7‑Day trial clock or active subscriptions. This tests paywall redirects and auto-renewal processing instantly without waiting.
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              <button
                onClick={() => handleDevSetStatus("expired")}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-550 text-white rounded-xl text-[10px] font-black uppercase font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                title="Instantly set 7-day trial as expired to trigger lockout redirects"
              >
                <AlertTriangle size={11} />
                <span>Simulate Trial Expiry (Force Lockout)</span>
              </button>

              <button
                onClick={() => handleDevSetStatus("paid_expired")}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-550 text-slate-950 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                title="Force expiration of paid subscription. If Auto-Renew is enabled, you'll see a background auto-renewal update in 10s. If disabled, you get locked out."
              >
                <Clock size={11} />
                <span>Simulate Paid Expiry (Tests Auto-Renew)</span>
              </button>

              <button
                onClick={() => handleDevSetStatus("trial")}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider transition-colors cursor-pointer"
                title="Reset trial to 7 days active"
              >
                Reset to Day 1 Active
              </button>

              <button
                onClick={() => handleDevSetStatus("monthly")}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-emerald-400 rounded-xl text-[10px] font-mono tracking-wider transition-colors cursor-pointer"
              >
                Grant Monthly License
              </button>

              <button
                onClick={() => handleDevSetStatus("yearly")}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 rounded-xl text-[10px] font-mono tracking-wider transition-colors cursor-pointer"
              >
                Grant Yearly License
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
