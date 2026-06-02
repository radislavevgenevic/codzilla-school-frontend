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
    return <div className={styles.status}>{t('profile.parentOnly')}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionProfile')}</span>
          <h1>{t('profile.subscriptions')}</h1>
          <p>{t('profile.parentSubscriptionsDescription')}</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t('profile.active')}</span>
            <h2>{t('profile.currentSubscriptions')}</h2>
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
                  {t('profile.until')} {subscription.end_date}. {t('profile.daysLeft')}: {subscription.remaining_days} {t('profile.daysShort')}
                </p>
                <div className={styles.meta}>
                  <span>{subscription.status_text}</span>
                  <span>{subscription.start_date} - {subscription.end_date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>{t('profile.activeSubscriptionsEmpty')}</div>
          )}
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t('profile.history')}</span>
            <h2>{t('profile.allSubscriptionsAndExtensions')}</h2>
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
                    {subscription.status_text} - {t('profile.daysLeftLower')} {subscription.remaining_days} {t('profile.daysShort')}
                  </span>
                  {subscription.extensions?.length ? (
                    <div className={styles.meta}>
                      {subscription.extensions.map((extension) => (
                        <span key={extension.id}>
                          +{extension.days} {t('profile.daysShort')} - {extension.reason || t('profile.extension')} - {t('profile.until')}{' '}
                          {extension.new_end_date}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>{t('profile.subscriptionsEmpty')}</div>
          )}
        </div>
      </article>
    </section>
  );
}
