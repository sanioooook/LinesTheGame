import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {firestore} from '../firebase';

export function createScore(score: number, playerID: string) {
  addDoc(collection(firestore, 'scores'), {
    user: playerID,
    score: score,
  }).catch((error) => {
    console.error('Error adding document: ', error);
  }).then();
}

export function updateScore(playerID: string, newScore: number) {
  getDocs(
    query(collection(firestore, 'scores'), where('user', '==', playerID)),
  ).then((playerSnapshot) => {
    if (playerSnapshot.size !== 1) {
      createScore(newScore, playerID);
      return;
    }
    const document = playerSnapshot.docs[0];
    if (document.data().score < newScore) {
      updateDoc(document.ref, {score: newScore}).then();
    }
  });
}

export function getScore(playerID: string): Promise<number> {
  return getDocs(
    query(collection(firestore, 'scores'), where('user', '==', playerID)),
  ).then((playerSnapshot) => {
    if (playerSnapshot.size === 1) {
      const document = playerSnapshot.docs[0];
      return document.data().score;
    }
    return 0;
  });
}
