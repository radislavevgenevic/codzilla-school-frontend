'use client';

import { useAuth } from '@/hooks/useAuth';
import { API_URL } from '@/shared/config/api';
import { useI18n } from '@/shared/config/i18n';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import styles from '../../ProfileWorkspaces.module.css';

function formatTime(dateTime) {
  try {
    return new Date(dateTime).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateTime;
  }
}

function formatDate(dateTime) {
  try {
    return new Date(dateTime).toLocaleDateString('ru-RU');
  } catch {
    return dateTime;
  }
}

export default function TeacherSchedulePage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.is_teacher) {
      return;
    }

    const fetchSchedule = async () => {
      try {
        const token = getCookie('access_token');
        const response = await fetch(`${API_URL}/api/v1/teacher/schedule`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load schedule');
        }

        setSchedule(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.is_teacher]);

  if (loading) {
    return <div className={styles.status}>{t('profile.loadingLessons')}</div>;
  }

  if (!user?.is_teacher) {
    return <div className={styles.status}>{t('profile.teacherOnly')}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionTeacher')}</span>
          <h1>{t('profile.mySchedule')}</h1>
          <p>{t('profile.lessonsDescription')}</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.empty}>{t('profile.loadingLessons')}</div>
          ) : schedule.length ? (
            schedule.map((item) => (
              <div className={styles.row} key={item.id}>
                <div>
                  <strong>{item.lesson_name}</strong>
                  <span>
                    {formatDate(item.start_time)} · {formatTime(item.start_time)} -{' '}
                    {formatTime(item.end_time)} · {t('profile.group')}:{' '}
                    {item.group_name || t('profile.noGroup')} · {item.duration_minutes} мин
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>{t('profile.scheduleEmpty')}</div>
          )}
        </div>
      </article>
    </section>
  );
}
