"use client";

import { useAdminStudentsManager } from "../../model/useAdminStudentsManager";
import styles from "../AdminUsersManager/AdminUsersManager.module.css";
import ProfileSelect from "../ProfileSelect/ProfileSelect";
import { useI18n } from "@/shared/config/i18n";

const genderOptions = [
  { value: "", labelKey: "profile.notSpecifiedOption" },
  { value: "male", labelKey: "profile.boy" },
  { value: "female", labelKey: "profile.girl" },
];

const statusOptions = [
  { value: "active", labelKey: "profile.activeOne" },
  { value: "graduated", labelKey: "profile.graduate" },
  { value: "left", labelKey: "profile.left" },
];

export default function AdminStudentsManager({ enabled, onCreated }) {
  const { t } = useI18n();
  const {
    students,
    form,
    loading,
    saving,
    message,
    error,
    parentOptions,
    courseOptions,
    groupOptions,
    setField,
    resetForm,
    editStudent,
    saveStudent,
    deleteStudent,
  } = useAdminStudentsManager(enabled, onCreated);

  if (!enabled) {
    return null;
  }

  return (
    <article className={styles.manager}>
      <div className={styles.header}>
        <div>
          <span>{t("profile.sectionAdmin")}</span>
          <h2>{t("profile.newStudent")}</h2>
        </div>
        <button type="button" onClick={resetForm}>
          {form.id ? t("profile.newStudent") : t("profile.clear")}
        </button>
      </div>

      <form className={styles.form} onSubmit={saveStudent}>
        <label>
          {t("profile.studentFullName")}
          <input
            required
            value={form.full_name}
            onChange={(event) => setField("full_name", event.target.value)}
          />
        </label>

        <label>
          {t("profile.parentLabel")}
          <ProfileSelect
            required
            value={form.parent_id}
            onChange={(event) => setField("parent_id", event.target.value)}
          >
            {parentOptions.map((parent) => (
              <option key={parent.value} value={parent.value}>
                {parent.label}
              </option>
            ))}
          </ProfileSelect>
        </label>

        <label>
          {t("profile.group")}
          <ProfileSelect
            value={form.group_id}
            onChange={(event) => setField("group_id", event.target.value)}
          >
            <option value="">{t("profile.noGroup")}</option>
            {groupOptions.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </ProfileSelect>
        </label>

        <label>
          {t("profile.course")}
          <ProfileSelect
            value={form.current_course_id}
            onChange={(event) =>
              setField("current_course_id", event.target.value)
            }
          >
            {courseOptions.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </ProfileSelect>
        </label>

        <label>
          {t("profile.age")}
          <input
            min="3"
            max="18"
            type="number"
            value={form.age}
            onChange={(event) => setField("age", event.target.value)}
          />
        </label>

        <label>
          {t("profile.gender")}
          <ProfileSelect
            value={form.gender}
            onChange={(event) => setField("gender", event.target.value)}
          >
            {genderOptions.map((gender) => (
              <option key={gender.value} value={gender.value}>
                {t(gender.labelKey)}
              </option>
            ))}
          </ProfileSelect>
        </label>

        <label>
          {t("profile.status")}
          <ProfileSelect
            value={form.status}
            onChange={(event) => setField("status", event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {t(status.labelKey)}
              </option>
            ))}
          </ProfileSelect>
        </label>

        <button
          type="submit"
          disabled={saving || loading || !parentOptions.length}
        >
          {form.id ? t("profile.save") : t("profile.createAndAdd")}
        </button>
      </form>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.list}>
        {students.length ? (
          students.map((student) => (
            <div className={styles.row} key={student.id}>
              <div>
                <strong>{student.full_name}</strong>
                <span>
                  {student.parent?.name || t("profile.parent")} -{" "}
                  {student.current_group?.name || t("profile.noGroup")} -{" "}
                  {student.status_text || student.status}
                </span>
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => editStudent(student)}>
                  {t("profile.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t("profile.confirmDelete"))) {
                      deleteStudent(student.id);
                    }
                  }}
                  disabled={saving}
                >
                  {t("profile.delete")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>{t("profile.studentsEmpty")}</div>
        )}
      </div>
    </article>
  );
}
