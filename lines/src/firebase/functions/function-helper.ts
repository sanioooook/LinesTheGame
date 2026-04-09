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
    const updates: Record<string, unknown> = {};
    if (document.data().score < newScore) {
      updates.score = newScore;
    }
    if (displayName !== undefined) updates.displayName = displayName ?? null;
    if (photoURL !== undefined) updates.photoURL = photoURL ?? null;
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
