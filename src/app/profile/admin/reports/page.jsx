"use client";

import { getCollectionData, profileApi } from "@/features/profile/api/profileApi";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/shared/config/i18n";
import { useEffect, useMemo, useState } from "react";
import styles from "../../ProfileWorkspaces.module.css";

const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value || 0);

export default function AdminReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [state, setState] = useState({
    users: [],
    students: [],
    courses: [],
    groups: [],
    teachers: [],
    subscriptions: [],
    publicStats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.is_admin) {
      return;
    }

    let ignore = false;

    const loadReports = async () => {
      setError("");

      try {
        const [
          usersPayload,
          studentsPayload,
          coursesPayload,
          groupsPayload,
          teachersPayload,
          subscriptionsPayload,
          publicStatsPayload,
        ] = await Promise.all([
          profileApi.getAdminUsers(),
          profileApi.getAdminStudents(),
          profileApi.getAdminCourses(),
          profileApi.getAdminGroups(),
          profileApi.getAdminTeachers(),
          profileApi.getAdminSubscriptions(),
          profileApi.getPublicStatistics(),
        ]);

        if (ignore) {
          return;
        }

        setState({
          users: getCollectionData(usersPayload),
          students: getCollectionData(studentsPayload),
          courses: getCollectionData(coursesPayload),
          groups: getCollectionData(groupsPayload),
          teachers: getCollectionData(teachersPayload),
          subscriptions: getCollectionData(subscriptionsPayload),
          publicStats: publicStatsPayload?.data || null,
        });
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      ignore = true;
    };
  }, [user?.is_admin]);

  const metrics = useMemo(() => {
    const parents = state.users.filter((item) => item.role === "parent").length;
    const admins = state.users.filter((item) => item.role === "admin").length;
    const activeGroups = state.groups.filter((item) => item.status === "active").length;
    const activeSubscriptions = state.subscriptions.filter(
      (item) => item.effective_status === "active" || item.status === "active",
    ).length;

    return [
      { label: "Ученики", value: state.publicStats?.total_students || state.students.length },
      { label: "Родители", value: parents },
      { label: "Преподаватели", value: state.teachers.length || state.publicStats?.total_teachers },
      { label: "Администраторы", value: admins },
      { label: "Курсы", value: state.publicStats?.total_courses || state.courses.length },
      { label: "Активные группы", value: activeGroups },
      { label: "Абонементы", value: state.subscriptions.length },
      { label: "Активные абонементы", value: activeSubscriptions },
    ];
  }, [state]);

  if (authLoading) {
    return <div className={styles.status}>{t("profile.loadingAdmin")}</div>;
  }

  if (!user?.is_admin) {
    return <div className={styles.status}>{t("profile.adminOnly")}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t("profile.sectionAdmin")}</span>
          <h1>{t("profile.reports")}</h1>
          <p>{t("profile.reportsDescription")}</p>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Сводка</span>
            <h2>Основные показатели</h2>
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>{t("profile.loading")}</div>
        ) : (
          <div className={styles.statsGrid}>
            {metrics.map((metric) => (
              <div className={styles.statCard} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{formatNumber(metric.value)}</strong>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Контроль</span>
            <h2>Разделы для проверки</h2>
          </div>
        </div>
        <div className={styles.meta}>
          <span>Ученики: список, редактирование, привязка к родителю, курсу и группе</span>
          <span>Преподаватели: ставка, курсы, группы и доступ к личному кабинету</span>
          <span>Абонементы: срок действия, остаток дней и история продлений</span>
          <span>Посещаемость: уважительные и неуважительные пропуски</span>
        </div>
      </article>
    </section>
  );
}
