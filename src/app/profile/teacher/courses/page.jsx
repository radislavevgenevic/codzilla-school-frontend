'use client';

import { useAuth } from '@/hooks/useAuth';
import { API_URL } from '@/shared/config/api';
import { useI18n } from '@/shared/config/i18n';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import styles from '../../ProfileWorkspaces.module.css';

export default function TeacherCoursesPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.is_teacher) {
      return;
    }

    const fetchCourses = async () => {
      try {
        const token = getCookie('access_token');
        const response = await fetch(`${API_URL}/api/v1/teacher/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load courses');
        }

        setCourses(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user?.is_teacher]);

  if (loading) {
    return <div className={styles.status}>{t('profile.loadingCourses')}</div>;
  }

  if (!user?.is_teacher) {
    return <div className={styles.status}>{t('profile.teacherOnly')}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t('profile.sectionTeacher')}</span>
          <h1>{t('profile.myCourses')}</h1>
          <p>{t('profile.learning')}</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.grid}>
        {isLoading ? (
          <div className={styles.empty}>{t('profile.loadingCourses')}</div>
        ) : courses.length ? (
          courses.map((course) => (
            <article className={styles.card} key={course.id}>
              <span>{course.age_range || t('profile.ageNotSpecified')}</span>
              <strong>{course.name}</strong>
              <div className={styles.meta}>
                <span>
                  {t('profile.studentsCount')}: {course.students_count || 0}
                </span>
                <span>
                  {t('profile.groups')}: {course.groups_count || 0}
                </span>
                <span>
                  {t('profile.lessons')}: {course.lessons_count || 0}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.empty}>{t('profile.coursesEmpty')}</div>
        )}
      </div>
    </section>
  );
}
