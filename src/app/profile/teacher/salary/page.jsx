'use client';

import { useAuth } from '@/hooks/useAuth';
import { API_URL } from '@/shared/config/api';
import { useI18n } from '@/shared/config/i18n';
import { getCookie } from 'cookies-next';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../ProfileWorkspaces.module.css';

function formatMoney(value) {
  const amount = Number(value || 0);
  return `${amount.toLocaleString('ru-RU')} ₸`;
}

export default function TeacherSalaryPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [dailySalary, setDailySalary] = useState(null);
  const [weeklySalary, setWeeklySalary] = useState(null);
  const [monthlySalary, setMonthlySalary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    if (!user?.is_teacher) {
      return;
    }

    const fetchSalary = async () => {
      try {
        const token = getCookie('access_token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/teacher/salary/daily`, { headers }),
          fetch(`${API_URL}/api/v1/teacher/salary/weekly`, { headers }),
          fetch(`${API_URL}/api/v1/teacher/salary/monthly`, { headers }),
        ]);
        const [dailyData, weeklyData, monthlyData] = await Promise.all([
          dailyRes.json(),
          weeklyRes.json(),
          monthlyRes.json(),
        ]);

        if (!dailyRes.ok || !weeklyRes.ok || !monthlyRes.ok) {
          throw new Error('Failed to load salary data');
        }

        setDailySalary(dailyData.data);
        setWeeklySalary(weeklyData.data);
        setMonthlySalary(monthlyData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalary();
  }, [user?.is_teacher]);

  const tabs = useMemo(
    () => [
      { value: 'daily', label: t('profile.salaryDaily'), data: dailySalary },
      { value: 'weekly', label: t('profile.salaryWeekly'), data: weeklySalary },
      {
        value: 'monthly',
        label: monthlySalary?.month_name || t('profile.salaryMonthly'),
        data: monthlySalary,
      },
    ],
    [dailySalary, monthlySalary, t, weeklySalary],
  );

  const activeData = tabs.find((tab) => tab.value === activeTab)?.data;

  if (loading) {
    return <div className={styles.status}>{t('profile.loading')}</div>;
  }

  if (!user?.is_teacher) {
    return <div className={styles.status}>{t('profile.teacherOnly')}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionTeacher')}</span>
          <h1>{t('profile.mySalary')}</h1>
          <p>{t('profile.salary')}</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      {isLoading ? (
        <div className={styles.empty}>{t('profile.loading')}</div>
      ) : (
        <>
          <div className={styles.metrics}>
            {tabs.map((tab) => (
              <article className={styles.metric} key={tab.value}>
                <span>{tab.label}</span>
                <strong>{formatMoney(tab.data?.salary)}</strong>
                <p>
                  {t('profile.lessons')}: {tab.data?.lessons_count || 0} ·{' '}
                  {t('profile.hours')}: {tab.data?.hours || 0} · {t('profile.rate')}:{' '}
                  {formatMoney(tab.data?.rate)}/ч
                </p>
              </article>
            ))}
          </div>

          <article className={styles.panel}>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  className={`${styles.tabButton} ${
                    activeTab === tab.value ? styles.tabButtonActive : ''
                  }`}
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.list}>
              {activeData?.details?.length ? (
                activeData.details.map((item) => (
                  <div className={styles.row} key={item.id}>
                    <div>
                      <strong>{item.lesson}</strong>
                      <span>
                        {item.date} · {item.time} · {t('profile.group')}:{' '}
                        {item.group || t('profile.noGroup')} · {item.duration_hours} ч
                      </span>
                    </div>
                    <strong>{formatMoney(item.salary)}</strong>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>{t('profile.salaryEmpty')}</div>
              )}
            </div>
          </article>
        </>
      )}
    </section>
  );
}
