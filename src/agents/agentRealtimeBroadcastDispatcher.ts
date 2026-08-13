import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { logAdminAction } from '../lib/admin/auditLog';

export interface DispatchResult {
  eventType: string;
  firestoreSynced: boolean;
  timestamp: string;
}

export async function dispatchRealtimeBroadcast(
  eventType: string,
  payload: any
): Promise<DispatchResult> {
  let firestoreSynced = false;

  // Mirror to Firestore live_state collection for real-time synchronization
  try {
    const docRef = doc(db, 'live_state', eventType);
    await setDoc(docRef, {
      payload,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    firestoreSynced = true;
  } catch (err) {
    console.warn('[Realtime Broadcast] Firestore mirror warning:', err);
  }

  logAdminAction(
    'Agent Realtime Broadcast Dispatcher',
    `Broadcast Dispatch: Event [${eventType}] -> Firestore Sync: ${firestoreSynced ? 'OK' : 'FAIL'}`,
    'system',
    'Agent Realtime Dispatcher'
  );

  return {
    eventType,
    firestoreSynced,
    timestamp: new Date().toISOString(),
  };
}
