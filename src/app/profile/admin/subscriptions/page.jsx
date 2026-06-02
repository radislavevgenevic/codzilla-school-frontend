'use client';

import { getCollectionData, profileApi } from '@/features/profile/api/profileApi';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/shared/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../ProfileWorkspaces.module.css';

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  id: null,
  student_id: '',
  name: '',
  start_date: today,
  end_date: today,
  status: 'active',
  notes: '',
};

const statusLabels = {
  active: 'Активный',
  paused: 'Приостановлен',
  cancelled: 'Отменен',
  expired: 'Истек',
};

export default function AdminSubscriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [subscriptions, setSubscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [extendForm, setExtendForm] = useState({
    subscription_id: '',
    days: 1,
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const selectedSubscription = useMemo(
    () =>
      subscriptions.find(
        (subscription) => String(subscription.id) === String(extendForm.subscription_id),
      ),
    [extendForm.subscription_id, subscriptions],
  );

  const loadData = async () => {
    setError('');

    try {
      const [subscriptionsPayload, studentsPayload] = await Promise.all([
        profileApi.getAdminSubscriptions(),
        profileApi.getAdminStudents(),
      ]);
      const nextSubscriptions = getCollectionData(subscriptionsPayload);
      const nextStudents = getCollectionData(studentsPayload);

      setSubscriptions(nextSubscriptions);
      setStudents(nextStudents);
      setForm((current) => ({
        ...current,
        student_id: current.student_id || String(nextStudents[0]?.id || ''),
      }));
      setExtendForm((current) => ({
        ...current,
        subscription_id: current.subscription_id || String(nextSubscriptions[0]?.id || ''),
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      Promise.resolve().then(loadData);
    }
  }, [user?.is_admin]);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      student_id: String(students[0]?.id || ''),
    });
    setMessage('');
    setError('');
  };

  const editSubscription = (subscription) => {
    setForm({
      id: subscription.id,
      student_id: String(subscription.student_id || ''),
      name: subscription.name || '',
      start_date: subscription.start_date || today,
      end_date: subscription.end_date || today,
      status: subscription.status || 'active',
      notes: subscription.notes || '',
    });
    setMessage('');
    setError('');
  };

  const saveSubscription = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        student_id: Number(form.student_id),
        name: form.name,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        notes: form.notes || null,
      };

      if (form.id) {
        await profileApi.updateAdminSubscription(form.id, payload);
        setMessage('Абонемент обновлен');
      } else {
        await profileApi.createAdminSubscription(payload);
        setMessage('Абонемент создан');
      }

      resetForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSubscription = async (subscriptionId) => {
    if (!confirm(t('profile.confirmDelete'))) {
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    try {
      await profileApi.deleteAdminSubscription(subscriptionId);
      setMessage('Абонемент удален');
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const extendSubscription = async (event) => {
    event.preventDefault();

    if (!extendForm.subscription_id) {
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    try {
      await profileApi.extendAdminSubscription(extendForm.subscription_id, {
        days: Number(extendForm.days),
        reason: extendForm.reason || null,
      });
      setMessage('Абонемент продлен');
      setExtendForm((current) => ({ ...current, days: 1, reason: '' }));
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className={styles.status}>{t('profile.loadingAdmin')}</div>;
  }

  if (!user?.is_admin) {
    return <div className={styles.status}>{t('profile.adminOnly')}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionAdmin')}</span>
          <h1>{t('profile.subscriptions')}</h1>
          <p>Создание, редактирование, продление и удаление абонементов учеников.</p>
        </div>
      </div>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Управление</span>
            <h2>{form.id ? 'Редактировать абонемент' : 'Новый абонемент'}</h2>
          </div>
          <button className={styles.secondaryButton} type="button" onClick={resetForm}>
            {form.id ? 'Новый абонемент' : t('profile.clear')}
          </button>
        </div>

        <form className={styles.form} onSubmit={saveSubscription}>
          <label>
            Ученик
            <select
              required
              value={form.student_id}
              onChange={(event) => setField('student_id', event.target.value)}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Название
            <input
              required
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
            />
          </label>
          <label>
            Статус
            <select
              value={form.status}
              onChange={(event) => setField('status', event.target.value)}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Дата начала
            <input
              required
              type="date"
              value={form.start_date}
              onChange={(event) => setField('start_date', event.target.value)}
            />
          </label>
          <label>
            Дата окончания
            <input
              required
              type="date"
              value={form.end_date}
              onChange={(event) => setField('end_date', event.target.value)}
            />
          </label>
          <label className={styles.wide}>
            Заметки
            <textarea
              value={form.notes}
              onChange={(event) => setField('notes', event.target.value)}
            />
          </label>
          <button
            className={styles.button}
            type="submit"
            disabled={saving || isLoading || !students.length}
          >
            {form.id ? t('profile.save') : t('profile.create')}
          </button>
        </form>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Продление</span>
            <h2>Продлить абонемент</h2>
          </div>
        </div>
        <form className={styles.form} onSubmit={extendSubscription}>
          <label>
            Абонемент
            <select
              value={extendForm.subscription_id}
              onChange={(event) =>
                setExtendForm((current) => ({
                  ...current,
                  subscription_id: event.target.value,
                }))
              }
            >
              {subscriptions.map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  {subscription.student?.full_name || 'Ученик'} - {subscription.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Дней
            <input
              min="1"
              max="365"
              required
              type="number"
              value={extendForm.days}
              onChange={(event) =>
                setExtendForm((current) => ({ ...current, days: event.target.value }))
              }
            />
          </label>
          <label>
            Причина
            <input
              value={extendForm.reason}
              onChange={(event) =>
                setExtendForm((current) => ({ ...current, reason: event.target.value }))
              }
            />
          </label>
          <button
            className={styles.button}
            type="submit"
            disabled={saving || !extendForm.subscription_id}
          >
            Продлить
          </button>
        </form>
        {selectedSubscription ? (
          <div className={styles.meta}>
            <span>Текущая дата окончания: {selectedSubscription.end_date}</span>
            <span>Осталось дней: {selectedSubscription.remaining_days}</span>
          </div>
        ) : null}
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Список</span>
            <h2>Абонементы учеников</h2>
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
                    {subscription.student?.full_name || 'Ученик'} - {subscription.name}
                  </strong>
                  <span>
                    {subscription.start_date} - {subscription.end_date} -{' '}
                    {subscription.status_text || statusLabels[subscription.effective_status]} -{' '}
                    осталось {subscription.remaining_days} дн.
                  </span>
                  {subscription.extensions?.length ? (
                    <div className={styles.meta}>
                      {subscription.extensions.map((extension) => (
                        <span key={extension.id}>
                          +{extension.days} дн. до {extension.new_end_date}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => editSubscription(subscription)}
                  >
                    {t('profile.edit')}
                  </button>
                  <button
                    className={styles.dangerButton}
                    type="button"
                    onClick={() => deleteSubscription(subscription.id)}
                    disabled={saving}
                  >
                    {t('profile.delete')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>Абонементы пока не созданы.</div>
          )}
        </div>
      </article>
    </section>
  );
}
