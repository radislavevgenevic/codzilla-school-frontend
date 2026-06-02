"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import styles from "./ProfileAdmin.module.css";
import { useI18n } from "@/shared/config/i18n";

const adminSections = [
  {
    href: "/profile/admin/users",
    titleKey: "profile.users",
    descriptionKey: "profile.usersDescription",
    metaKey: "profile.accounts",
  },
  {
    href: "/profile/admin/parents",
    titleKey: "profile.parents",
    descriptionKey: "profile.parentsDescription",
    metaKey: "profile.accounts",
  },
  {
    href: "/profile/admin/students",
    titleKey: "profile.studentsAndGroups",
    descriptionKey: "profile.studentsGroupsDescription",
    metaKey: "profile.groupRoster",
  },
  {
    href: "/profile/admin/courses",
    titleKey: "nav.courses",
    descriptionKey: "profile.programsDescription",
    metaKey: "profile.programs",
  },
  {
    href: "/profile/admin/groups",
    titleKey: "profile.groups",
    descriptionKey: "profile.streamsDescription",
    metaKey: "profile.streams",
  },
  {
    href: "/profile/admin/teachers",
    titleKey: "profile.teachers",
    descriptionKey: "profile.teachersDescription",
    metaKey: "profile.teachers",
  },
  {
    href: "/profile/admin/lessons",
    titleKey: "profile.lessons",
    descriptionKey: "profile.lessonsDescription",
    metaKey: "profile.lesson",
  },
  {
    href: "/profile/admin/attendance",
    titleKey: "profile.attendanceMarker",
    descriptionKey: "profile.attendanceMarkerDescription",
    metaKey: "profile.attendance",
  },
  {
    href: "/profile/admin/subscriptions",
    titleKey: "profile.subscriptions",
    descriptionKey: "profile.subscriptionsDescription",
    metaKey: "profile.subscriptions",
  },
  {
    href: "/profile/admin/reports",
    titleKey: "profile.reports",
    descriptionKey: "profile.reportsDescription",
    metaKey: "profile.reports",
  },
  {
    href: "/profile/admin/settings",
    titleKey: "profile.settings",
    descriptionKey: "profile.settingsDescription",
    metaKey: "profile.settings",
  },
];

export default function ProfileAdmin() {
  const { user, loading } = useAuth() || {};
  const { t } = useI18n();

  if (loading) {
    return <div className={styles.status}>{t("profile.loadingAdmin")}</div>;
  }

  if (user?.role !== "admin") {
    return (
      <div className={styles.status}>
        {t("profile.adminOnlyLong")}
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span>{t("profile.sectionAdmin")}</span>
        <h1>{t("profile.adminPanel")}</h1>
        <p>{t("profile.adminDescription")}</p>
      </div>

      <div className={styles.grid}>
        {adminSections.map((section) => (
          <Link className={styles.card} href={section.href} key={section.href}>
            <span>{t(section.metaKey)}</span>
            <strong>{t(section.titleKey)}</strong>
            <p>{t(section.descriptionKey)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
