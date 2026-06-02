"use client";

import { useEffect, useMemo, useState } from "react";
import { getCollectionData, profileApi } from "../api/profileApi";

const emptyForm = {
  id: null,
  full_name: "",
  age: "",
  gender: "",
  status: "active",
  parent_id: "",
  current_course_id: "",
  group_id: "",
};

export function useAdminStudentsManager(enabled, onCreated) {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsPayload, usersPayload, coursesPayload, groupsPayload] =
        await Promise.all([
          profileApi.getAdminStudents(),
          profileApi.getAdminUsers(),
          profileApi.getAdminCourses(),
          profileApi.getAdminGroups(),
        ]);
      const nextParents = getCollectionData(usersPayload).filter(
        (user) => user.role === "parent",
      );
      const nextCourses = getCollectionData(coursesPayload);
      const nextGroups = getCollectionData(groupsPayload);

      setStudents(getCollectionData(studentsPayload));
      setParents(nextParents);
      setCourses(nextCourses);
      setGroups(nextGroups);
      setForm((current) => ({
        ...current,
        parent_id: current.parent_id || String(nextParents[0]?.id || ""),
        current_course_id:
          current.current_course_id || String(nextCourses[0]?.id || ""),
        group_id: current.group_id || String(nextGroups[0]?.id || ""),
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(loadData, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled]);

  const setField = (name, value) => {
    setForm((current) => {
      if (name !== "group_id") {
        return { ...current, [name]: value };
      }

      const group = groups.find((item) => String(item.id) === String(value));

      return {
        ...current,
        group_id: value,
        current_course_id: group?.course_id
          ? String(group.course_id)
          : current.current_course_id,
      };
    });
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      parent_id: String(parents[0]?.id || ""),
      current_course_id: String(courses[0]?.id || ""),
      group_id: String(groups[0]?.id || ""),
    });
    setMessage("");
    setError("");
  };

  const getStudentGroupId = (student) => {
    const group =
      student?.current_group ||
      student?.groups?.find?.((item) => item?.pivot?.status === "active") ||
      student?.groups?.[0];

    return group?.id ? String(group.id) : "";
  };

  const editStudent = (student) => {
    setMessage("");
    setError("");
    setForm({
      id: student.id,
      full_name: student.full_name || "",
      age: student.age || "",
      gender: student.gender || "",
      status: student.status || "active",
      parent_id: String(student.parent_id || student.parent?.id || parents[0]?.id || ""),
      current_course_id: String(
        student.current_course_id ||
          student.current_course?.id ||
          student.current_group?.course_id ||
          courses[0]?.id ||
          "",
      ),
      group_id: getStudentGroupId(student),
    });
  };

  const getPayload = () => ({
    full_name: form.full_name,
    age: form.age ? Number(form.age) : null,
    gender: form.gender || null,
    status: form.status,
    parent_id: Number(form.parent_id),
    current_course_id: form.current_course_id
      ? Number(form.current_course_id)
      : null,
  });

  const saveStudent = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (form.id) {
        const previousStudent = students.find((student) => student.id === form.id);
        const previousGroupId = getStudentGroupId(previousStudent);
        const nextGroupId = form.group_id ? String(form.group_id) : "";

        await profileApi.updateAdminStudent(form.id, getPayload());

        if (previousGroupId && previousGroupId !== nextGroupId) {
          await profileApi.removeStudentFromAdminGroup(previousGroupId, form.id);
        }

        if (nextGroupId && previousGroupId !== nextGroupId) {
          await profileApi.addStudentToAdminGroup(nextGroupId, form.id);
        }

        setMessage("Ученик обновлен");
      } else {
        await profileApi.createAdminStudent({
          ...getPayload(),
          group_id: form.group_id ? Number(form.group_id) : null,
        });
        setMessage("Ученик создан и добавлен в группу");
      }

      resetForm();
      await loadData();
      await onCreated?.();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async (studentId) => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await profileApi.deleteAdminStudent(studentId);
      setMessage("Ученик удален");
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const parentOptions = useMemo(
    () => parents.map((parent) => ({ value: parent.id, label: parent.name })),
    [parents],
  );
  const courseOptions = useMemo(
    () => courses.map((course) => ({ value: course.id, label: course.name })),
    [courses],
  );
  const groupOptions = useMemo(
    () =>
      groups.map((group) => ({
        value: group.id,
        label: `${group.name} - ${group.course?.name || "курс"}`,
      })),
    [groups],
  );

  return {
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
  };
}
