"use client";

import { useEffect, useState } from "react";
import { getCollectionData, profileApi } from "../api/profileApi";

const emptyForm = {
  id: null,
  name: "",
  email: "",
  phone: "",
  role: "parent",
  password: "",
  is_active: true,
};

export function useAdminUsersManager(enabled, options = {}) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    ...emptyForm,
    role: options.lockedRole || emptyForm.role,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = await profileApi.getAdminUsers();
      const nextUsers = getCollectionData(payload);
      setUsers(
        options.roleFilter
          ? nextUsers.filter((user) => user.role === options.roleFilter)
          : nextUsers,
      );
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

    const timeoutId = window.setTimeout(loadUsers, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, options.roleFilter]);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      role: options.lockedRole || emptyForm.role,
    });
    setMessage("");
    setError("");
  };

  const editUser = (user) => {
    setMessage("");
    setError("");
    setForm({
      id: user.id,
      name: user.name || user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: options.lockedRole || user.role || "parent",
      password: "",
      is_active: user.is_active !== false,
    });
  };

  const getPayload = () => {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      role: options.lockedRole || form.role,
      is_active: Boolean(form.is_active),
    };

    if (form.password) {
      payload.password = form.password;
    }

    return payload;
  };

  const saveUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (form.id) {
        await profileApi.updateAdminUser(form.id, getPayload());
        setMessage("Пользователь обновлен");
      } else {
        await profileApi.createAdminUser(getPayload());
        setMessage("Пользователь создан");
      }

      resetForm();
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId) => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await profileApi.deleteAdminUser(userId);
      setMessage("Пользователь удален");
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
