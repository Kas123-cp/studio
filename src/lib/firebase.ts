
import admin from 'firebase-admin';

let firestore: admin.firestore.Firestore;

// This prevents us from initializing the app multiple times
if (!admin.apps.length) {
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace escaped newlines from environment variables
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        const hasAllCredentials = serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey;

        if (hasAllCredentials) {
            // Using service account credentials from .env file
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Firebase Admin SDK initialized successfully with service account.");
        } else if (process.env.NODE_ENV !== 'development') {
             // Use Application Default Credentials (intended for deployed Firebase/GCP environments)
            admin.initializeApp();
            console.log("Firebase Admin SDK initialized successfully with Application Default Credentials.");
        } else {
             // In local development, if credentials are not set, we should log a warning.
            console.warn("Missing Firebase credentials in .env file. Firestore functionality will be disabled.");
        }
    } catch (error) {
        console.error("FIREBASE INITIALIZATION FAILED:", error);
        // We do not throw an error here to prevent the build from crashing.
        // The application will fail at runtime if Firestore is used without being initialized.
    }
} 

// Assign firestore instance after initialization
// This will be undefined if initialization failed, and any subsequent calls will fail at runtime.
if (admin.apps.length > 0) {
    firestore = admin.firestore();
}

export { firestore };
