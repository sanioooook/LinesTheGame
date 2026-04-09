import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchLeaderboard} from '../../store/actions/leaderboard.actions';
import {useTranslation} from 'react-i18next';
import './LeaderboardComponent.scss';

function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex <= 1) return email;
  return `${email[0]}***${email.slice(atIndex)}`;
}

function getDisplayName(displayName: string | null, email: string): string {
  if (displayName) return displayName;
  return maskEmail(email);
}

type AvatarProps = {src: string | null; name: string};

const Avatar: React.FC<AvatarProps> = ({src, name}) => {
  if (src) {
    return <img className="leaderboard-avatar" src={src} alt="" referrerPolicy="no-referrer" />;
  }
  return <div className="leaderboard-avatar leaderboard-avatar--placeholder">{name.charAt(0).toUpperCase()}</div>;
};

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
          const displayName = getDisplayName(entry.displayName, entry.user);
          return (
            <tr key={entry.user} className={isCurrentUser ? 'leaderboard-row leaderboard-row--current' : 'leaderboard-row'}>
              <td className="leaderboard-rank">{index + 1}</td>
              <td className="leaderboard-player">
                <Avatar src={entry.photoURL} name={displayName} />
                <span>{displayName}</span>
              </td>
              <td className="leaderboard-score">{entry.score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
