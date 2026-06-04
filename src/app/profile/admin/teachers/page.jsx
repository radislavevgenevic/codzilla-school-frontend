'use client';

import { useAuth } from '@/hooks/useAuth';
import { getCollectionData, profileApi } from '@/features/profile/api/profileApi';
import { useI18n } from '@/shared/config/i18n';
import { useEffect, useState } from 'react';
import styles from '../../ProfileWorkspaces.module.css';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  hourly_rate: '',
  bio: '',
  password: '',
};

export default function AdminTeachersPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [assignedCourseIds, setAssignedCourseIds] = useState([]);
  const [originalCourseIds, setOriginalCourseIds] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  async function loadData() {
    try {
      const [teachersPayload, coursesPayload, groupsPayload] = await Promise.all([
        profileApi.getAdminTeachers(),
        profileApi.getAdminCourses(),
        profileApi.getAdminGroups(),
      ]);
      const nextTeachers = getCollectionData(teachersPayload);

      setTeachers(nextTeachers);
      setCourses(getCollectionData(coursesPayload));
      setGroups(getCollectionData(groupsPayload));
      setSelectedTeacherId((current) =>
        nextTeachers.some((teacher) => String(teacher.id) === String(current))
          ? current
          : String(nextTeachers[0]?.id || ''),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.is_admin) {
      Promise.resolve().then(loadData);
    }
  }, [user?.is_admin]);

  useEffect(() => {
    if (!selectedTeacherId) {
      return;
    }

    let ignore = false;

    const loadTeacherCourses = async () => {
      try {
        const payload = await profileApi.getAdminTeacher(selectedTeacherId);
        const courseIds = (payload?.data?.courses || []).map((course) =>
          String(course.id),
        );

        if (!ignore) {
          setAssignedCourseIds(courseIds);
          setOriginalCourseIds(courseIds);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      }
    };

    loadTeacherCourses();

    return () => {
      ignore = true;
    };
  }, [selectedTeacherId]);

  const setField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingTeacher(null);
    setFormData(emptyForm);
    setMessage(null);
    setError(null);
  };

  const editTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      hourly_rate: teacher.hourly_rate || '',
      bio: teacher.bio || '',
      password: '',
    });
    setMessage(null);
    setError(null);
  };

  const saveTeacher = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = { ...formData };

      if (editingTeacher && !payload.password) {
        delete payload.password;
      }

      if (payload.password) {
        payload.password_confirmation = payload.password;
      }

      if (editingTeacher) {
        await profileApi.updateAdminTeacher(editingTeacher.id, payload);
      } else {
        await profileApi.createAdminTeacher(payload);
      }

      resetForm();
      setMessage(t('profile.save'));
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTeacher = async (teacherId) => {
    if (!confirm(t('profile.confirmDelete'))) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await profileApi.deleteAdminTeacher(teacherId);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCourseAssignment = (courseId) => {
    const nextCourseId = String(courseId);

    setAssignedCourseIds((current) =>
      current.includes(nextCourseId)
        ? current.filter((id) => id !== nextCourseId)
        : [...current, nextCourseId],
    );
  };

  const saveAssignments = async () => {
    if (!selectedTeacherId) {
      return;
    }

    setAssignmentSaving(true);
    setError(null);
    setMessage(null);

    try {
      const removedCourseIds = originalCourseIds.filter(
        (courseId) => !assignedCourseIds.includes(courseId),
      );
      const numericAssignedIds = assignedCourseIds.map((courseId) =>
        Number(courseId),
      );

      await Promise.all(
        removedCourseIds.map((courseId) =>
          profileApi.unassignAdminTeacherCourse(selectedTeacherId, Number(courseId)),
        ),
      );

      if (numericAssignedIds.length) {
        await profileApi.assignAdminTeacherCourses(
          selectedTeacherId,
          numericAssignedIds,
        );
      }

      setOriginalCourseIds(assignedCourseIds);
      setMessage(t('profile.save'));
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAssignmentSaving(false);
    }
  };

  const assignedGroups = groups.filter((group) =>
    assignedCourseIds.includes(String(group.course_id)),
  );

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
          <h1>{t('profile.teachers')}</h1>
          <p>{t('profile.teachersDescription')}</p>
        </div>
        {/* <button className={styles.secondaryButton} type="button" onClick={resetForm}>
          {t('profile.addTeacher')}
        </button> */}
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t('profile.management')}</span>
            <h2>{editingTeacher ? t('profile.editTeacher') : t('profile.addTeacher')}</h2>
          </div>
        </div>

        <form className={styles.form} onSubmit={saveTeacher}>
          <label>
            {t('profile.name')}
            <input
              required
              value={formData.name}
              onChange={(event) => setField('name', event.target.value)}
            />
          </label>
          <label>
            {t('profile.email')}
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => setField('email', event.target.value)}
            />
          </label>
          <label>
            {t('profile.phone')}
            <input
              value={formData.phone}
              onChange={(event) => setField('phone', event.target.value)}
            />
          </label>
          <label>
            {t('profile.hourlyRate')}
            <input
              min="0"
              required
              step="0.01"
              type="number"
              value={formData.hourly_rate}
              onChange={(event) => setField('hourly_rate', event.target.value)}
            />
          </label>
          <label>
            {t('profile.password')}
            <input
              minLength="6"
              required={!editingTeacher}
              type="password"
              value={formData.password}
              placeholder={editingTeacher ? t('profile.keepPassword') : ''}
              onChange={(event) => setField('password', event.target.value)}
            />
          </label>
          <label className={styles.wide}>
            {t('profile.bio')}
            <textarea
              value={formData.bio}
              onChange={(event) => setField('bio', event.target.value)}
            />
          </label>
          <button className={styles.button} type="submit" disabled={saving || isLoading}>
            {editingTeacher ? t('profile.save') : t('profile.create')}
          </button>
        </form>

        {message ? <div className={styles.message}>{message}</div> : null}
        {error ? <div className={styles.error}>{error}</div> : null}
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t('profile.teachers')}</span>
            <h2>{t('profile.assignCourses')}</h2>
          </div>
          <button
            className={styles.button}
            type="button"
            onClick={saveAssignments}
            disabled={!selectedTeacherId || assignmentSaving}
          >
            {t('profile.save')}
          </button>
        </div>

        <div className={styles.form}>
          <label>
            {t('profile.teacher')}
            <select
              value={selectedTeacherId}
              onChange={(event) => setSelectedTeacherId(event.target.value)}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.list}>
          {courses.length ? (
            courses.map((course) => {
              const isAssigned = assignedCourseIds.includes(String(course.id));

              return (
                <div className={styles.row} key={course.id}>
                  <div>
                    <strong>{course.name}</strong>
                    <span>
                      {course.age_range || t('profile.ageNotSpecified')} -{' '}
                      {t('profile.groups')}: {course.groups_count || 0}
                    </span>
                  </div>
                  <button
                    className={isAssigned ? styles.button : styles.secondaryButton}
                    type="button"
                    onClick={() => toggleCourseAssignment(course.id)}
                  >
                    {isAssigned ? t('profile.assigned') : t('profile.assign')}
                  </button>
                </div>
              );
            })
          ) : (
            <div className={styles.empty}>{t('profile.coursesEmpty')}</div>
          )}
        </div>

        <div className={styles.meta}>
          {assignedGroups.length ? (
            assignedGroups.map((group) => (
              <span key={group.id}>
                {group.name} - {group.course?.name || t('profile.course')}
              </span>
            ))
          ) : (
            <span>{t('profile.noGroups')}</span>
          )}
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t('profile.teachers')}</span>
            <h2>{t('profile.teachers')}</h2>
          </div>
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.empty}>{t('profile.loading')}</div>
          ) : teachers.length ? (
            teachers.map((teacher) => (
              <div className={styles.row} key={teacher.id}>
                <div>
                  <strong>{teacher.name}</strong>
                  <span>
                    {teacher.email} - {teacher.phone || t('profile.notSpecified')} -{' '}
                    {teacher.hourly_rate} KZT/ч - {t('profile.courses')}: {teacher.courses_count || 0}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => editTeacher(teacher)}
                  >
                    {t('profile.edit')}
                  </button>
                  <button
                    className={styles.dangerButton}
                    type="button"
                    onClick={() => deleteTeacher(teacher.id)}
                    disabled={saving}
                  >
                    {t('profile.delete')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>{t('profile.teachersEmpty')}</div>
          )}
        </div>
      </article>
    </section>
  );
}
