"use client";

import { profileApi } from "@/features/profile/api/profileApi";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/shared/config/i18n";
import { useEffect, useState } from "react";
import styles from "../../ProfileWorkspaces.module.css";

const emptyForm = {
  email: "",
  telegram_bot_token: "",
  telegram_chat_id: "",
  telegram_recipient: "",
  resolve_telegram_chat: false,
};

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.is_admin) {
      return;
    }

    let ignore = false;

    const loadSettings = async () => {
      setError("");

      try {
        const payload = await profileApi.getAdminNotificationSettings();
        const settings = payload?.data || {};

        if (!ignore) {
          setForm({
            email: settings.email || "",
            telegram_bot_token: settings.telegram_bot_token || "",
            telegram_chat_id: settings.telegram_chat_id || "",
            telegram_recipient: "",
            resolve_telegram_chat: false,
          });
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      ignore = true;
    };
  }, [user?.is_admin]);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        email: form.email || null,
        telegram_bot_token: form.telegram_bot_token || null,
        telegram_chat_id: form.telegram_chat_id || null,
        telegram_recipient: form.telegram_recipient || null,
        resolve_telegram_chat: Boolean(form.resolve_telegram_chat),
      };
      const response = await profileApi.updateAdminNotificationSettings(payload);
      const settings = response?.data || {};

      setForm({
        email: settings.email || "",
        telegram_bot_token: settings.telegram_bot_token || "",
        telegram_chat_id: settings.telegram_chat_id || "",
        telegram_recipient: "",
        resolve_telegram_chat: false,
      });
      setMessage(response?.message || "Настройки сохранены");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className={styles.status}>{t("profile.loadingAdmin")}</div>;
  }

  if (!user?.is_admin) {
    return <div className={styles.status}>{t("profile.adminOnly")}</div>;
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{t("profile.sectionAdmin")}</span>
          <h1>{t("profile.settings")}</h1>
          <p>{t("profile.settingsDescription")}</p>
        </div>
      </div>

      {message ? <div className={styles.message}>{message}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>Уведомления</span>
            <h2>Telegram и email</h2>
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>{t("profile.loading")}</div>
        ) : (
          <form className={styles.form} onSubmit={saveSettings}>
            <label>
              Email для уведомлений
              <input
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
              />
            </label>
            <label>
              Telegram bot token
              <input
                value={form.telegram_bot_token}
                onChange={(event) =>
                  setField("telegram_bot_token", event.target.value)
                }
              />
            </label>
            <label>
              Telegram chat_id
              <input
                value={form.telegram_chat_id}
                onChange={(event) => setField("telegram_chat_id", event.target.value)}
              />
            </label>
            <label>
              Username или chat_id
              <input
                value={form.telegram_recipient}
                onChange={(event) =>
                  setField("telegram_recipient", event.target.value)
                }
              />
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.resolve_telegram_chat}
                onChange={(event) =>
                  setField("resolve_telegram_chat", event.target.checked)
                }
              />
              Найти chat_id автоматически
            </label>
            <button className={styles.button} type="submit" disabled={saving}>
              {t("profile.save")}
            </button>
          </form>
        )}
      </article>
    </section>
  );
}
