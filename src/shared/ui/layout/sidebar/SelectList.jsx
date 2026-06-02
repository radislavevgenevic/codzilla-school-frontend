"use client";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import ExitButton from "@/features/auth/ui/ExitButton";
import { useI18n } from "@/shared/config/i18n";

const menuSections = [
  {
    titleKey: "profile.sectionProfile",
    items: [
      {
        href: "/profile/panel",
        labelKey: "profile.summary",
        icon: "/icons/profile/sidebar/dashboard.svg",
        alt: "dashboard",
        roles: ["admin", "parent"],
      },
      {
        href: "/profile/attendance",
        labelKey: "profile.attendance",
        icon: "/icons/profile/sidebar/calendar.svg",
        alt: "calendar",
        roles: ["admin", "parent"],
      },
      {
        href: "/profile/courses",
        labelKey: "nav.courses",
        icon: "/icons/profile/sidebar/school.svg",
        alt: "school",
        roles: ["admin", "parent"],
      },
      {
        href: "/profile/students",
        labelKey: "profile.students",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "students",
        roles: ["admin", "parent"],
      },
      {
        href: "/profile/subscriptions",
        labelKey: "profile.subscriptions",
        icon: "/icons/profile/sidebar/calendar.svg",
        alt: "subscriptions",
        roles: ["parent"],
      },
    ],
  },
  {
    titleKey: "profile.sectionTeacher",
    items: [
      {
        href: "/profile/teacher/courses",
        labelKey: "profile.myCourses",
        icon: "/icons/profile/sidebar/school.svg",
        alt: "my courses",
        roles: ["teacher"],
      },
      {
        href: "/profile/teacher/students",
        labelKey: "profile.myStudents",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "my students",
        roles: ["teacher"],
      },
      {
        href: "/profile/teacher/schedule",
        labelKey: "profile.mySchedule",
        icon: "/icons/profile/sidebar/calendar.svg",
        alt: "my schedule",
        roles: ["teacher"],
      },
      {
        href: "/profile/teacher/salary",
        labelKey: "profile.mySalary",
        icon: "/icons/profile/sidebar/dashboard.svg",
        alt: "my salary",
        roles: ["teacher"],
      },
    ],
  },
  {
    titleKey: "profile.sectionAdmin",
    items: [
      {
        href: "/profile/admin",
        labelKey: "profile.adminPanel",
        icon: "/icons/profile/sidebar/dashboard.svg",
        alt: "admin dashboard",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/users",
        labelKey: "profile.users",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "users",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/parents",
        labelKey: "profile.parents",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "parents",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/students",
        labelKey: "profile.studentsAndGroups",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "admin students",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/teachers",
        labelKey: "profile.teachers",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "admin teachers",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/courses",
        labelKey: "nav.courses",
        icon: "/icons/profile/sidebar/school.svg",
        alt: "admin courses",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/groups",
        labelKey: "profile.groups",
        icon: "/icons/profile/sidebar/students.svg",
        alt: "groups",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/lessons",
        labelKey: "profile.lessons",
        icon: "/icons/profile/sidebar/calendar.svg",
        alt: "lessons",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/attendance",
        labelKey: "profile.attendanceMarker",
        icon: "/icons/profile/sidebar/calendar.svg",
        alt: "attendance marker",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/subscriptions",
        labelKey: "profile.subscriptions",
        icon: "/icons/profile/sidebar/calendar.svg",
        alt: "admin subscriptions",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/reports",
        labelKey: "profile.reports",
        icon: "/icons/profile/sidebar/dashboard.svg",
        alt: "reports",
        roles: ["admin"],
      },
      {
        href: "/profile/admin/settings",
        labelKey: "profile.settings",
        icon: "/icons/profile/sidebar/dashboard.svg",
        alt: "settings",
        roles: ["admin"],
      },
    ],
  },
];

export default function SelectList() {
  const router = useRouter();
  const path = usePathname();
  const { user, loading } = useAuth() || {};
  const { t } = useI18n();

  const availableSections = useMemo(() => {
    if (loading) {
      return [];
    }

    return menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(user?.role)),
      }))
      .filter((section) => section.items.length);
  }, [loading, user?.role]);

  const isSelected = (href) => {
    if (href === "/profile/admin") {
      return path === href;
    }

    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <List
      component="nav"
      aria-label={t("profile.navigation")}
      sx={{
        gap: "14px",
        height: "100%",
        overflowY: "auto",
        paddingRight: "4px",
        display: "flex",
        flexDirection: "column",

        "& .sidebar-section-title": {
          color: "#586edf",
          fontSize: "12px",
          fontWeight: "800",
          letterSpacing: 0,
          margin: "6px 8px 8px",
          textTransform: "uppercase",
        },
        "& .MuiListItemButton-root.Mui-selected": {
          backgroundColor: "rgba(0, 170, 255, 0.08);",
        },
        "& .MuiListItemButton-root.Mui-selected:hover": {
          backgroundColor: "rgba(0, 170, 255, 0.12);",
        },
        "& .MuiListItemButton-root": {
          borderRadius: "6px",
          minHeight: "40px",
          display: "flex",
          flexGrow: "0",
          marginBottom: "4px",
        },
        "& .MuiListItemText-primary": {
          fontWeight: "500",
          fontSize: "15px",
        },
      }}
    >
      {availableSections.map((section) => (
        <div key={section.titleKey}>
          <div className="sidebar-section-title">{t(section.titleKey)}</div>
          {section.items.map((item) => (
            <ListItemButton
              key={item.href}
              selected={isSelected(item.href)}
              onClick={() => router.push(item.href)}
            >
              <ListItemIcon>
                <Image src={item.icon} alt={item.alt} width={18} height={18} />
              </ListItemIcon>
              <ListItemText primary={t(item.labelKey)} />
            </ListItemButton>
          ))}
        </div>
      ))}

      <ExitButton />
    </List>
  );
}
