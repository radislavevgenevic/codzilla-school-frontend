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
      { label: t("profile.students"), value: state.publicStats?.total_students || state.students.length },
      { label: t("profile.parents"), value: parents },
      { label: t("profile.teachers"), value: state.teachers.length || state.publicStats?.total_teachers },
      { label: t("profile.admins"), value: admins },
      { label: t("profile.courses"), value: state.publicStats?.total_courses || state.courses.length },
      { label: t("profile.activeGroups"), value: activeGroups },
      { label: t("profile.subscriptions"), value: state.subscriptions.length },
      { label: t("profile.activeSubscriptions"), value: activeSubscriptions },
    ];
  }, [state, t]);

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
            <span>{t("profile.summary")}</span>
            <h2>{t("profile.mainMetrics")}</h2>
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
            <span>{t("profile.control")}</span>
            <h2>{t("profile.sectionsToCheck")}</h2>
          </div>
        </div>
        <div className={styles.meta}>
          <span>{t("profile.checkStudents")}</span>
          <span>{t("profile.checkTeachers")}</span>
          <span>{t("profile.checkSubscriptions")}</span>
          <span>{t("profile.checkAttendance")}</span>
        </div>
      </article>
    </section>
  );
}
