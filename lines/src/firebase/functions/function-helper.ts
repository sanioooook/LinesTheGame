import {collection, addDoc, updateDoc, query, where, getDocs, orderBy, limit} from 'firebase/firestore';
import {firestore} from '../firebase';

export type LeaderboardEntry = {
  user: string;
  score: number;
  displayName: string | null;
  photoURL: string | null;
};

export function createScore(score: number, playerID: string, displayName?: string | null, photoURL?: string | null) {
  addDoc(collection(firestore, 'scores'), {
    user: playerID,
    score: score,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
  }).catch((error) => {
    console.error('Error adding document: ', error);
  });
}

export function updateScore(playerID: string, newScore: number, displayName?: string | null, photoURL?: string | null) {
  getDocs(query(collection(firestore, 'scores'), where('user', '==', playerID))).then((playerSnapshot) => {
    if (playerSnapshot.size !== 1) {
      createScore(newScore, playerID, displayName, photoURL);
      return;
    }
    const document = playerSnapshot.docs[0];
    const data = document.data();
    const updates: Record<string, unknown> = {};
    if (data.score < newScore) updates.score = newScore;
    // Always sync profile fields so leaderboard shows name/avatar even if score didn't improve
    if (displayName !== undefined && data.displayName !== displayName) updates.displayName = displayName ?? null;
    if (photoURL !== undefined && data.photoURL !== photoURL) updates.photoURL = photoURL ?? null;
    if (Object.keys(updates).length > 0) {
      updateDoc(document.ref, updates).catch(console.error);
    }
  });
}

// Called on login to ensure profile fields are up to date without changing score
export function syncUserProfile(playerID: string, displayName: string | null, photoURL: string | null) {
  getDocs(query(collection(firestore, 'scores'), where('user', '==', playerID))).then((playerSnapshot) => {
    if (playerSnapshot.size !== 1) return; // no record yet — will be created on first score
    const document = playerSnapshot.docs[0];
    const data = document.data();
    const updates: Record<string, unknown> = {};
    if (data.displayName !== displayName) updates.displayName = displayName;
    if (data.photoURL !== photoURL) updates.photoURL = photoURL;
    if (Object.keys(updates).length > 0) {
      updateDoc(document.ref, updates).catch(console.error);
    }
  });
}

export function getScore(playerID: string): Promise<number> {
  return getDocs(query(collection(firestore, 'scores'), where('user', '==', playerID))).then((playerSnapshot) => {
    if (playerSnapshot.size === 1) {
      const document = playerSnapshot.docs[0];
      return document.data().score;
    }
    return 0;
  });
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const q = query(collection(firestore, 'scores'), orderBy('score', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    user: doc.data().user as string,
    score: doc.data().score as number,
    displayName: (doc.data().displayName as string) ?? null,
    photoURL: (doc.data().photoURL as string) ?? null,
  }));
}
