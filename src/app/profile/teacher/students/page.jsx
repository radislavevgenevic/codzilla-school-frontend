'use client';

import { useAuth } from '@/hooks/useAuth';
import { API_URL } from '@/shared/config/api';
import { useI18n } from '@/shared/config/i18n';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import styles from '../../ProfileWorkspaces.module.css';

export default function TeacherStudentsPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.is_teacher) {
      return;
    }

    const fetchStudents = async () => {
      try {
        const token = getCookie('access_token');
        const response = await fetch(`${API_URL}/api/v1/teacher/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load students');
        }

        setStudents(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [user?.is_teacher]);

  if (loading) {
    return <div className={styles.status}>{t('profile.loadingStudents')}</div>;
  }

  if (!user?.is_teacher) {
    return <div className={styles.status}>{t('profile.teacherOnly')}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionTeacher')}</span>
          <h1>{t('profile.myStudents')}</h1>
          <p>{t('profile.groupAndStudents')}</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.empty}>{t('profile.loadingStudents')}</div>
          ) : students.length ? (
            students.map((student) => {
              const studentName = student.full_name || student.name || t('profile.student');
              const parentName =
                student.parent_name && student.parent_name !== 'N/A'
                  ? student.parent_name
                  : t('profile.notSpecified');
              const phone =
                student.parent_phone && student.parent_phone !== 'N/A'
                  ? student.parent_phone
                  : student.phone || t('profile.notSpecified');

              return (
                <div className={styles.row} key={student.id}>
                  <div>
                    <strong>{studentName}</strong>
                    <span>
                      {t('profile.group')}: {student.group_name || t('profile.noGroup')} -{' '}
                      {t('profile.parent')}: {parentName} -{' '}
                      {t('profile.phone')}: {phone}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.empty}>{t('profile.studentsEmpty')}</div>
          )}
        </div>
      </article>
    </section>
  );
}
