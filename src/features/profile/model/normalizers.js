"use client";

import { getCollectionData } from "../api/profileApi";

export const getNestedCollection = (value) => getCollectionData(value);

export const getCourseTitle = (course) =>
  course?.name || course?.title || "Курс без названия";

export const getCourseGroupsCount = (course) =>
  course?.groups_count || getNestedCollection(course?.groups).length || 0;

export const getStudentGroups = (student) =>
  student?.groups_list || getNestedCollection(student?.groups);

export const roleLabels = {
  admin: "Администратор",
  parent: "Родитель",
  teacher: "Учитель",
};

export const studentStatusLabels = {
  active: "Активный",
  graduated: "Выпускник",
  left: "Выбыл",
};

export const groupStatusLabels = {
  forming: "Формируется",
  active: "Активная",
  completed: "Завершена",
  cancelled: "Отменена",
};

export const attendanceStatusLabels = {
  present: "Присутствовал",
  absent: "Отсутствовал",
  late: "Опоздал",
  not_marked: "Не отмечено",
};

const attendanceStatusKeys = {
  present: "present",
  absent: "absent",
  late: "late",
  not_marked: "not_marked",
  Присутствовал: "present",
  Отсутствовал: "absent",
  Опоздал: "late",
  "Не отмечено": "not_marked",
};

export const getRoleLabel = (role) => roleLabels[role] || "Роль не указана";

export const getStudentStatusLabel = (student) =>
  student?.status_text || studentStatusLabels[student?.status] || "Статус не указан";

export const getGroupStatusLabel = (group) =>
  group?.status_text || groupStatusLabels[group?.status] || "Статус не указан";

export const getAttendanceStatusLabel = (status) =>
  attendanceStatusLabels[status] || status || "Не отмечено";

export const getAttendanceStatusKey = (status) =>
  attendanceStatusKeys[status] || "not_marked";

export const getActivityLabel = (isActive) => (isActive === false ? "Отключен" : "Активен");

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDateTime = (value, fallback = "Дата не указана") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
};

export const formatDate = (value, fallback = "Дата не указана") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
};

export const formatTime = (value, fallback = "Время не указано") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return timeFormatter.format(date);
};

export const formatDateTimeRange = (start, end, fallback = "Дата не указана") => {
  if (!start) {
    return fallback;
  }

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  if (Number.isNaN(startDate.getTime())) {
    return start;
  }

  if (!endDate || Number.isNaN(endDate.getTime())) {
    return dateTimeFormatter.format(startDate);
  }

  return `${dateFormatter.format(startDate)}, ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
};

export const formatDateTimeInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return offsetDate.toISOString().slice(0, 16);
};

export const getStudentCourseTitle = (student) => {
  const groups = getStudentGroups(student);

  return (
    student?.current_course?.name ||
    student?.currentCourse?.name ||
    groups[0]?.course?.name ||
    "не назначен"
  );
};

export const getAttendanceRecord = (item) => ({
  date: formatDateTime(
    item?.date || item?.marked_at || item?.created_at || item?.schedule?.start_time,
  ),
  lesson:
    item?.lesson ||
    item?.lesson_title ||
    item?.schedule?.lesson?.title ||
    "Занятие",
  group: item?.group || item?.group_name || item?.schedule?.group?.name || "Без группы",
  status: item?.status_text || getAttendanceStatusLabel(item?.status),
  statusKey: getAttendanceStatusKey(item?.status || item?.status_text),
});
