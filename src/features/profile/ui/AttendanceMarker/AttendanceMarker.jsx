"use client";

import { useAttendanceMarker } from "../../model/useAttendanceMarker";
import { formatDateTimeRange } from "../../model/normalizers";
import styles from "./AttendanceMarker.module.css";
import ProfileSelect from "../ProfileSelect/ProfileSelect";
import { useI18n } from "@/shared/config/i18n";

const statuses = [
  { value: "present", labelKey: "profile.statusPresent" },
  { value: "late", labelKey: "profile.statusLate" },
  { value: "absent_justified", labelKey: "profile.absentJustified" },
  { value: "absent_unjustified", labelKey: "profile.absentUnjustified" },
];

export default function AttendanceMarker({ enabled }) {
  const { t } = useI18n();
  const {
    groups,
    schedules,
    selectedGroupId,
    selectedScheduleId,
    selectedSchedule,
    students,
    marks,
    loading,
    saving,
    message,
    error,
    setSelectedGroupId,
    setSelectedScheduleId,
    setStudentMark,
    saveMarks,
  } = useAttendanceMarker(enabled);

  if (!enabled) {
    return null;
  }

  return (
    <article className={styles.marker}>
      <div className={styles.header}>
        <div>
          <span>{t("profile.teacher")}</span>
          <h2>{t("profile.attendanceMarker")}</h2>
        </div>
        <button
          type="button"
          onClick={saveMarks}
          disabled={saving || !students.length}
        >
          {t("profile.save")}
        </button>
      </div>

      <div className={styles.controls}>
        <label>
          {t("profile.group")}
          <ProfileSelect
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </ProfileSelect>
        </label>

        <label>
          {t("profile.lesson")}
          <ProfileSelect
            value={selectedScheduleId}
            onChange={(event) => setSelectedScheduleId(event.target.value)}
          >
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.title ||
                  formatDateTimeRange(schedule.start_time, schedule.end_time)}
              </option>
            ))}
          </ProfileSelect>
        </label>
      </div>

      {selectedSchedule ? (
        <div className={styles.note}>
          {formatDateTimeRange(
            selectedSchedule.start_time,
            selectedSchedule.end_time,
          )} ·{" "}
          {selectedSchedule.room || t("profile.roomNotSpecified")}
        </div>
      ) : null}

      {loading ? <div className={styles.note}>{t("profile.loading")}</div> : null}
      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.list}>
        {students.length ? (
          students.map((student) => (
            <div className={styles.row} key={student.id}>
              <strong>{student.full_name}</strong>
              <ProfileSelect
                value={marks[student.id]?.status || "present"}
                onChange={(event) =>
                  setStudentMark(student.id, "status", event.target.value)
                }
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {t(status.labelKey)}
                  </option>
                ))}
              </ProfileSelect>
              <input
                value={marks[student.id]?.reason || ""}
                onChange={(event) =>
                  setStudentMark(student.id, "reason", event.target.value)
                }
                placeholder={t("profile.comment")}
              />
            </div>
          ))
        ) : (
          <div className={styles.note}>{t("profile.studentsForAttendanceEmpty")}</div>
        )}
      </div>
    </article>
  );
}
