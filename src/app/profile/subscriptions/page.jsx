'use client';

import { getCollectionData, profileApi } from '@/features/profile/api/profileApi';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/shared/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import styles from '../ProfileWorkspaces.module.css';

export default function ParentSubscriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'parent') {
      return;
    }

    const loadSubscriptions = async () => {
      try {
        const payload = await profileApi.getParentSubscriptions();
        setSubscriptions(getCollectionData(payload));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, [user]);

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) => subscription.effective_status === 'active',
      ),
    [subscriptions],
  );

  if (authLoading) {
    return <div className={styles.status}>{t('profile.loading')}</div>;
  }

  if (!user || user.role !== 'parent') {
    return <div className={styles.status}>Раздел доступен только родителю.</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionProfile')}</span>
          <h1>{t('profile.subscriptions')}</h1>
          <p>Активные абонементы, даты окончания, остаток дней и история продлений.</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Активные</span>
            <h2>Текущие абонементы</h2>
          </div>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.empty}>{t('profile.loading')}</div>
          ) : activeSubscriptions.length ? (
            activeSubscriptions.map((subscription) => (
              <div className={styles.card} key={subscription.id}>
                <span>{subscription.student?.full_name || t('profile.student')}</span>
                <strong>{subscription.name}</strong>
                <p>
                  До {subscription.end_date}. Осталось {subscription.remaining_days} дн.
                </p>
                <div className={styles.meta}>
                  <span>{subscription.status_text}</span>
                  <span>{subscription.start_date} - {subscription.end_date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>Активных абонементов пока нет.</div>
          )}
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>История</span>
            <h2>Все абонементы и продления</h2>
          </div>
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.empty}>{t('profile.loading')}</div>
          ) : subscriptions.length ? (
            subscriptions.map((subscription) => (
              <div className={styles.row} key={subscription.id}>
                <div>
                  <strong>
                    {subscription.student?.full_name || t('profile.student')} -{' '}
                    {subscription.name}
                  </strong>
                  <span>
                    {subscription.start_date} - {subscription.end_date} -{' '}
                    {subscription.status_text} - осталось {subscription.remaining_days} дн.
                  </span>
                  {subscription.extensions?.length ? (
                    <div className={styles.meta}>
                      {subscription.extensions.map((extension) => (
                        <span key={extension.id}>
                          +{extension.days} дн. - {extension.reason || 'Продление'} - до{' '}
                          {extension.new_end_date}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>Абонементы пока не найдены.</div>
          )}
        </div>
      </article>
    </section>
  );
}
