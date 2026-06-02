"use client";

import { useAdminUsersManager } from "../../model/useAdminUsersManager";
import { getActivityLabel, getRoleLabel } from "../../model/normalizers";
import styles from "./AdminUsersManager.module.css";
import ProfileSelect from "../ProfileSelect/ProfileSelect";
import { useI18n } from "@/shared/config/i18n";

const roleOptions = [
  { value: "parent", labelKey: "profile.parent" },
  { value: "admin", labelKey: "profile.adminTeacher" },
];

export default function AdminUsersManager({
  enabled,
  roleFilter,
  lockedRole,
  titleKey = "profile.users",
  newButtonKey = "profile.newUser",
  emptyKey = "profile.usersEmpty",
}) {
  const { t } = useI18n();
  const {
    users,
    form,
    loading,
    saving,
    message,
    error,
    setField,
    resetForm,
    editUser,
    saveUser,
    deleteUser,
  } = useAdminUsersManager(enabled, { roleFilter, lockedRole });

  if (!enabled) {
    return null;
  }

  return (
    <article className={styles.manager}>
      <div className={styles.header}>
        <div>
          <span>{t("profile.sectionAdmin")}</span>
          <h2>{t(titleKey)}</h2>
        </div>
        <button type="button" onClick={resetForm}>
          {t(newButtonKey)}
        </button>
      </div>

      <form className={styles.form} onSubmit={saveUser}>
        <label>
          {t("profile.name")}
          <input
            required
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
          />
        </label>

        <label>
          {t("profile.phone")}
          <input
            value={form.phone}
            onChange={(event) => setField("phone", event.target.value)}
          />
        </label>

        {lockedRole ? null : (
          <label>
            {t("profile.role")}
            <ProfileSelect
              value={form.role}
              onChange={(event) => setField("role", event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {t(role.labelKey)}
                </option>
              ))}
            </ProfileSelect>
          </label>
        )}

        <label>
          {t("profile.password")}
          <input
            minLength="6"
            required={!form.id}
            type="password"
            value={form.password}
            placeholder={form.id ? t("profile.keepPassword") : ""}
            onChange={(event) => setField("password", event.target.value)}
          />
        </label>

        <label>
          {t("profile.active")}
          <ProfileSelect
            value={String(form.is_active)}
            onChange={(event) =>
              setField("is_active", event.target.value === "true")
            }
          >
            <option value="true">{t("profile.yes")}</option>
            <option value="false">{t("profile.no")}</option>
          </ProfileSelect>
        </label>

        <button type="submit" disabled={saving || loading}>
          {form.id ? t("profile.save") : t("profile.create")}
        </button>
      </form>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.list}>
        {users.length ? (
          users.map((user) => (
            <div className={styles.row} key={user.id}>
              <div>
                <strong>{user.name || user.full_name}</strong>
                <span>
                  {user.email} · {getRoleLabel(user.role)} ·{" "}
                  {getActivityLabel(user.is_active)}
                </span>
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => editUser(user)}>
                  {t("profile.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => deleteUser(user.id)}
                  disabled={saving}
                >
                  {t("profile.delete")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>{t(emptyKey)}</div>
        )}
      </div>
    </article>
  );
}
