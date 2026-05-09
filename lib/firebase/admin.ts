import * as admin from "firebase-admin";

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  try {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || "{}";
    // Handle escaped newlines from env files
    const serviceAccount = JSON.parse(
      rawServiceAccount.replace(/\\n/g, "\n")
    );

    if (serviceAccount.project_id) {
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