import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function LiveTimer() {
  const [timeAgo, setTimeAgo] = useState('');
  const [deployTime, setDeployTime] = useState(null);

  useEffect(() => {
    // This would be read from your config.ini or similar
    // For now, using a placeholder that will be updated by deploy script
    const getLastDeployTime = () => {
      try {
        // In production, this would be read from config or API
        return localStorage.getItem('lastDeployTime') || new Date().toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    const calculateTimeAgo = (deployTime) => {
      const now = new Date();
      const deploy = new Date(deployTime);
      const diffMs = now - deploy;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    };

    const deployTimeStr = getLastDeployTime();
    setDeployTime(deployTimeStr);

    const updateTime = () => {
      setTimeAgo(calculateTimeAgo(deployTimeStr));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!timeAgo) return null;

  return (
    <div className={styles.liveTimer}>
      <span className={styles.timerLabel}>Last Update</span>
      <span className={styles.timerValue}>{timeAgo}</span>
    </div>
  );
}
