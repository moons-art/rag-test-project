import { db } from './firebase-admin';

export interface AppSettings {
  isAppActive: boolean;
  appPassword?: string;
}

const SETTINGS_DOC_PATH = 'appConfig/settings';

/**
 * Initializes default settings if they don't exist
 */
export async function initializeSettings(): Promise<AppSettings> {
  const defaultSettings: AppSettings = {
    isAppActive: true,
    appPassword: '0000',
  };

  try {
    const docRef = db.doc(SETTINGS_DOC_PATH);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      await docRef.set(defaultSettings);
    } else {
      return docSnap.data() as AppSettings;
    }
  } catch (error) {
    console.error('Firestore initialization error (DB might not be enabled):', error);
  }
  
  return defaultSettings;
}

/**
 * Gets the current app settings
 */
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const docRef = db.doc(SETTINGS_DOC_PATH);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return await initializeSettings();
    }
    
    return docSnap.data() as AppSettings;
  } catch (error) {
    console.error('Failed to get settings from Firestore. Falling back to defaults.', error);
    return {
      isAppActive: true,
      appPassword: '0000',
    };
  }
}

/**
 * Updates the app settings
 */
export async function updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const docRef = db.doc(SETTINGS_DOC_PATH);
    await docRef.set(settings, { merge: true });
  } catch (error) {
    console.error('Failed to update settings in Firestore:', error);
    throw error;
  }
}
