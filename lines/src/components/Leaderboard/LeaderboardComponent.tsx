import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchLeaderboard} from '../../store/actions/leaderboard.actions';
import {useTranslation} from 'react-i18next';
import './LeaderboardComponent.scss';

export const LeaderboardComponent: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.leaderboard.entries);
  const isLoading = useAppSelector((state) => state.leaderboard.isLoading);
  const currentUser = useAppSelector((state) => state.google.user);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (isLoading) {
    return <div className="leaderboard-loading">...</div>;
  }

  if (entries.length === 0) {
    return <div className="leaderboard-empty">{t('leaderboardEmpty')}</div>;
  }

  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>{t('player')}</th>
          <th>{t('bestScore')}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => {
          const isCurrentUser = currentUser?.email === entry.user;
          return (
            <tr key={entry.user} className={isCurrentUser ? 'leaderboard-row leaderboard-row--current' : 'leaderboard-row'}>
              <td className="leaderboard-rank">{index + 1}</td>
              <td className="leaderboard-player">
                {entry.photoURL && <img className="leaderboard-avatar" src={entry.photoURL} alt="" referrerPolicy="no-referrer" />}
                <span>{entry.displayName ?? entry.user}</span>
              </td>
              <td className="leaderboard-score">{entry.score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
