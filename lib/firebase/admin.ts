import * as admin from "firebase-admin";

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  try {
    let rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || "{}";
    
    // Strip surrounding quotes if Vercel added them
    if (rawServiceAccount.startsWith('"') && rawServiceAccount.endsWith('"')) {
      rawServiceAccount = rawServiceAccount.slice(1, -1);
    } else if (rawServiceAccount.startsWith("'") && rawServiceAccount.endsWith("'")) {
      rawServiceAccount = rawServiceAccount.slice(1, -1);
    }

    let serviceAccount;
    try {
      // First try standard parsing
      serviceAccount = JSON.parse(rawServiceAccount);
    } catch (e) {
      // If Vercel converted literal \n to actual newlines, JSON.parse will fail.
      // We fix the JSON string by escaping real newlines back to \n
      const fixedRaw = rawServiceAccount.replace(/\n/g, "\\n");
      serviceAccount = JSON.parse(fixedRaw);
    }

    if (serviceAccount.project_id) {
      // Firebase requires actual newlines in the private key, not the string "\n"
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }
      
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }

  // Fallback: use project ID only (for build/dev without service account)
  if (admin.apps.length > 0) return admin.apps[0]!;
  return admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Lazy getters — only initialized when first called at runtime, not at build time
export function getAdminDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}

// Keep backward-compat exports as getters for any direct usage
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    return (getAdminDb() as never)[prop as keyof admin.firestore.Firestore];
  },
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_, prop) {
    return (getAdminAuth() as never)[prop as keyof admin.auth.Auth];
  },
});