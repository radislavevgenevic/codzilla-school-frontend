"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminUsersManager from "../AdminUsersManager/AdminUsersManager";
import styles from "../ProfileStudents/ProfileStudents.module.css";
import { useI18n } from "@/shared/config/i18n";

export default function ProfileUsers({
  roleFilter,
  lockedRole,
  titleKey = "profile.users",
  descriptionKey = "profile.usersDescription",
  managerTitleKey = "profile.users",
  newButtonKey = "profile.newUser",
  emptyKey = "profile.usersEmpty",
}) {
  const { user, loading } = useAuth() || {};
  const { t } = useI18n();

  if (loading) {
    return <div className={styles.status}>{t("profile.loadingUsers")}</div>;
  }

  if (user?.role !== "admin") {
    return <div className={styles.status}>{t("profile.adminOnly")}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span>{t("profile.sectionAdmin")}</span>
        <h1>{t(titleKey)}</h1>
        <p>{t(descriptionKey)}</p>
      </div>

      <AdminUsersManager
        enabled
        roleFilter={roleFilter}
        lockedRole={lockedRole}
        titleKey={managerTitleKey}
        newButtonKey={newButtonKey}
        emptyKey={emptyKey}
      />
    </section>
  );
}
