"use client";

import { useProfileAttendance } from "../../model/useProfileAttendance";
import styles from "./ProfileAttendance.module.css";
import ProfileSelect from "../ProfileSelect/ProfileSelect";
import { useI18n } from "@/shared/config/i18n";

export default function ProfileAttendance() {
  const {
    authLoading,
    user,
    loading,
    error,
    groups,
    children,
    students,
    selectedGroupId,
    selectedStudentId,
    setSelectedGroupId,
    setSelectedStudentId,
    records,
    stats,
  } = useProfileAttendance();
  const { t } = useI18n();

  if (loading || authLoading) {
    return <div className={styles.status}>{t("profile.loadingAttendance")}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span>{user?.role === "admin" ? t("profile.groupAndStudents") : t("profile.myChildren")}</span>
        <h1>{t("profile.attendance")}</h1>
        <p>{t("profile.attendanceDescription")}</p>
      </div>

      {error ? <div className={styles.status}>{error}</div> : null}

      <div className={styles.controls}>
        {user?.role === "admin" ? (
          <label>
            {t("profile.group")}
            <ProfileSelect
              value={selectedGroupId}
              onChange={(event) => setSelectedGroupId(event.target.value)}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} - {group.course?.name || t("profile.course")}
                </option>
              ))}
            </ProfileSelect>
          </label>
        ) : null}

        <label>
          {t("profile.student")}
          <ProfileSelect
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
          >
            {(user?.role === "admin" ? students : children).map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </ProfileSelect>
        </label>
      </div>

      <div className={styles.statsGrid}>
        <article>
          <span>{t("profile.total")}</span>
          <strong>{stats.total || records.length || 0}</strong>
        </article>
        <article>
          <span>{t("profile.present")}</span>
          <strong>{stats.present || 0}</strong>
        </article>
        <article>
          <span>{t("profile.absentJustified")}</span>
          <strong>{stats.absent_justified || 0}</strong>
        </article>
        <article>
          <span>{t("profile.absentUnjustified")}</span>
          <strong>{stats.absent_unjustified || 0}</strong>
        </article>
        <article>
          <span>{t("profile.late")}</span>
          <strong>{stats.late || 0}</strong>
        </article>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span>{t("profile.date")}</span>
          <span>{t("profile.lesson")}</span>
          <span>{t("profile.group")}</span>
          <span>{t("profile.status")}</span>
        </div>

        {records.length ? (
          records.map((record, index) => (
            <div className={styles.tableRow} key={`${record.date}-${index}`}>
              <span>{record.date || t("profile.noDate")}</span>
              <strong>{record.lesson || t("profile.lesson")}</strong>
              <span>{record.group || t("profile.noGroup")}</span>
              <mark>{record.status || t("profile.notMarked")}</mark>
            </div>
          ))
        ) : (
          <div className={styles.empty}>{t("profile.noAttendance")}</div>
        )}
      </div>
    </section>
  );
}
