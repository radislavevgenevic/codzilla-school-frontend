"use client";

import { getCookie } from "cookies-next";
import { API_URL } from "@/shared/config/api";

export const PROFILE_ENDPOINTS = {
  publicCourses: "public/courses?per_page=100",
  publicStatistics: "public/statistics",
  adminCourses: "admin/courses?per_page=100",
  adminGroups: "admin/groups?per_page=100",
  adminStudents: "admin/students?per_page=100",
  adminUsers: "admin/users?per_page=100",
  adminLessons: "admin/lessons?per_page=100",
  adminTeachers: "admin/teachers",
  adminSubscriptions: "admin/subscriptions?per_page=100",
  adminNotificationSettings: "admin/notification-settings",
  adminFinancialReport: "admin/reports/financial",
  parentSubscriptions: "parent/subscriptions",
  parentChildren: "parent/children",
};

export const getCollectionData = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  return [];
};

export async function profileRequest(endpoint, options = {}) {
  const token = getCookie("access_token");
  const response = await fetch(`${API_URL}/api/v1/${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Не удалось получить данные");
  }

  return data;
}

export const profileApi = {
  getPublicCourses: () => profileRequest(PROFILE_ENDPOINTS.publicCourses),
  getPublicStatistics: () => profileRequest(PROFILE_ENDPOINTS.publicStatistics),
  getAdminCourses: () => profileRequest(PROFILE_ENDPOINTS.adminCourses),
  createAdminCourse: (payload) =>
    profileRequest("admin/courses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminCourse: (courseId, payload) =>
    profileRequest(`admin/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminCourse: (courseId) =>
    profileRequest(`admin/courses/${courseId}`, {
      method: "DELETE",
    }),
  getAdminCourseIcons: () => profileRequest("admin/courses/icons"),
  getAdminGroups: () => profileRequest(PROFILE_ENDPOINTS.adminGroups),
  getAdminGroup: (groupId) => profileRequest(`admin/groups/${groupId}`),
  createAdminGroup: (payload) =>
    profileRequest("admin/groups", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminGroup: (groupId, payload) =>
    profileRequest(`admin/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminGroup: (groupId) =>
    profileRequest(`admin/groups/${groupId}`, {
      method: "DELETE",
    }),
  getAdminStudents: () => profileRequest(PROFILE_ENDPOINTS.adminStudents),
  createAdminStudent: (payload) =>
    profileRequest("admin/students", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminStudent: (studentId, payload) =>
    profileRequest(`admin/students/${studentId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminStudent: (studentId) =>
    profileRequest(`admin/students/${studentId}`, {
      method: "DELETE",
    }),
  getAdminUsers: () => profileRequest(PROFILE_ENDPOINTS.adminUsers),
  createAdminUser: (payload) =>
    profileRequest("admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminUser: (userId, payload) =>
    profileRequest(`admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminUser: (userId) =>
    profileRequest(`admin/users/${userId}`, {
      method: "DELETE",
    }),
  getAdminLessons: () => profileRequest(PROFILE_ENDPOINTS.adminLessons),
  getAdminTeachers: () => profileRequest(PROFILE_ENDPOINTS.adminTeachers),
  getAdminFinancialReport: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return profileRequest(`${PROFILE_ENDPOINTS.adminFinancialReport}${query ? `?${query}` : ""}`);
  },
  getAdminTeacher: (teacherId) => profileRequest(`admin/teachers/${teacherId}`),
  createAdminTeacher: (payload) =>
    profileRequest("admin/teachers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminTeacher: (teacherId, payload) =>
    profileRequest(`admin/teachers/${teacherId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminTeacher: (teacherId) =>
    profileRequest(`admin/teachers/${teacherId}`, {
      method: "DELETE",
    }),
  assignAdminTeacherCourses: (teacherId, courseIds) =>
    profileRequest(`admin/teachers/${teacherId}/assign-courses`, {
      method: "POST",
      body: JSON.stringify({ course_ids: courseIds }),
    }),
  unassignAdminTeacherCourse: (teacherId, courseId) =>
    profileRequest(`admin/teachers/${teacherId}/unassign-course`, {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    }),
  getAdminSubscriptions: () =>
    profileRequest(PROFILE_ENDPOINTS.adminSubscriptions),
  createAdminSubscription: (payload) =>
    profileRequest("admin/subscriptions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminSubscription: (subscriptionId, payload) =>
    profileRequest(`admin/subscriptions/${subscriptionId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminSubscription: (subscriptionId) =>
    profileRequest(`admin/subscriptions/${subscriptionId}`, {
      method: "DELETE",
    }),
  extendAdminSubscription: (subscriptionId, payload) =>
    profileRequest(`admin/subscriptions/${subscriptionId}/extend`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAdminNotificationSettings: () =>
    profileRequest(PROFILE_ENDPOINTS.adminNotificationSettings),
  updateAdminNotificationSettings: (payload) =>
    profileRequest(PROFILE_ENDPOINTS.adminNotificationSettings, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  createAdminLesson: (payload) =>
    profileRequest("admin/lessons", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAdminLesson: (lessonId, payload) =>
    profileRequest(`admin/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteAdminLesson: (lessonId) =>
    profileRequest(`admin/lessons/${lessonId}`, {
      method: "DELETE",
    }),
  getAdminGroupStudents: (groupId) =>
    profileRequest(`admin/groups/${groupId}/students`),
  addStudentToAdminGroup: (groupId, studentId) =>
    profileRequest(`admin/groups/${groupId}/add-student`, {
      method: "POST",
      body: JSON.stringify({ student_id: studentId }),
    }),
  removeStudentFromAdminGroup: (groupId, studentId) =>
    profileRequest(`admin/groups/${groupId}/remove-student/${studentId}`, {
      method: "DELETE",
    }),
  getAdminStudentAttendance: (studentId) =>
    profileRequest(`admin/attendance/student/${studentId}`),
  getScheduleForMarking: (scheduleId) =>
    profileRequest(`admin/attendance/schedule/${scheduleId}`),
  markScheduleAttendance: (scheduleId, marks) =>
    profileRequest(`admin/attendance/schedule/${scheduleId}/mark`, {
      method: "POST",
      body: JSON.stringify({ marks }),
    }),
  getParentChildren: () => profileRequest(PROFILE_ENDPOINTS.parentChildren),
  getParentSubscriptions: () =>
    profileRequest(PROFILE_ENDPOINTS.parentSubscriptions),
  getParentChildAttendance: (studentId) =>
    profileRequest(`parent/children/${studentId}/attendance`),
};
