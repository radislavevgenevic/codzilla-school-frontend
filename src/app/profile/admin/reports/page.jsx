"use client";

import { getCollectionData, profileApi } from "@/features/profile/api/profileApi";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/shared/config/i18n";
import { useEffect, useMemo, useState } from "react";
import styles from "../../ProfileWorkspaces.module.css";

const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value || 0);

const getDates = (filter) => {
  const now = new Date();
  let start = new Date();
  
  if (filter === "month") {
    start.setMonth(now.getMonth() - 1);
  } else if (filter === "3months") {
    start.setMonth(now.getMonth() - 3);
  } else if (filter === "year") {
    start.setFullYear(now.getFullYear() - 1);
  } else if (filter === "all") {
    // Вернуть раннюю дату начала, чтобы охватить все данные
    return {
      start_date: "2025-01-01",
      end_date: now.toISOString().split("T")[0],
    };
  }
  
  return {
    start_date: start.toISOString().split("T")[0],
    end_date: now.toISOString().split("T")[0],
  };
};

const getReportTranslation = (locale) => {
  const dictionary = {
    ru: {
      financialReport: "Финансовый отчет",
      profit: "Чистая прибыль",
      revenue: "Выручка (Абонементы)",
      expenses: "Расходы (ЗП учителей)",
      period: "Период",
      month: "Месяц",
      threeMonths: "3 месяца",
      year: "Год",
      allTime: "Всё время",
      revenueDetails: "Детализация поступлений от абонементов",
      expensesDetails: "Детализация расходов на зарплаты учителей",
      coursePopularity: "Популярность курсов по активным ученикам",
      subscriptionStatus: "Статусы абонементов в периоде",
      courseName: "Курс",
      studentName: "Ученик",
      parentName: "Родитель",
      amount: "Сумма",
      date: "Дата начала",
      status: "Статус",
      teacherName: "Учитель",
      hourlyRate: "Ставка/час",
      hoursWorked: "Часы",
      lessonsCount: "Уроки",
      totalSalary: "Зарплата",
      studentCount: "Ученики",
      price: "Стоимость",
      emptyReport: "Нет данных за выбранный период"
    },
    kz: {
      financialReport: "Қаржылық есеп",
      profit: "Таза пайда",
      revenue: "Абонементтер түсімі",
      expenses: "Шығындар (Мұғалімдер жалақысы)",
      period: "Кезең",
      month: "Ай",
      threeMonths: "3 ай",
      year: "Жыл",
      allTime: "Барлық уақыт",
      revenueDetails: "Абонемент түсімдерінің егжей-тегжейі",
      expensesDetails: "Мұғалім жалақысы шығындарының егжей-тегжейі",
      coursePopularity: "Курстардың танымалдылығы (белсенді оқушылар)",
      subscriptionStatus: "Абонементтердің мәртебесі",
      courseName: "Курс",
      studentName: "Оқушы",
      parentName: "Ата-ана",
      amount: "Сома",
      date: "Басталған күні",
      status: "Мәртебе",
      teacherName: "Мұғалім",
      hourlyRate: "Тариф/сағат",
      hoursWorked: "Сағаттар",
      lessonsCount: "Сабақтар",
      totalSalary: "Жалақы",
      studentCount: "Оқушылар",
      price: "Құны",
      emptyReport: "Таңдалған кезеңге мәліметтер жоқ"
    }
  };
  return dictionary[locale] || dictionary.ru;
};

export default function AdminReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, locale } = useI18n();
  const rt = useMemo(() => getReportTranslation(locale), [locale]);

  const [state, setState] = useState({
    users: [],
    students: [],
    courses: [],
    groups: [],
    teachers: [],
    subscriptions: [],
    publicStats: null,
  });
  const [generalLoading, setGeneralLoading] = useState(true);

  const [financialData, setFinancialData] = useState(null);
  const [financialLoading, setFinancialLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("year"); // 'month', '3months', 'year', 'all'
  const [error, setError] = useState("");

  // Загрузка общих метрик (один раз на mount)
  useEffect(() => {
    if (!user?.is_admin) {
      return;
    }

    let ignore = false;

    const loadGeneralReports = async () => {
      try {
        const [
          usersPayload,
          studentsPayload,
          coursesPayload,
          groupsPayload,
          teachersPayload,
          subscriptionsPayload,
          publicStatsPayload,
        ] = await Promise.all([
          profileApi.getAdminUsers(),
          profileApi.getAdminStudents(),
          profileApi.getAdminCourses(),
          profileApi.getAdminGroups(),
          profileApi.getAdminTeachers(),
          profileApi.getAdminSubscriptions(),
          profileApi.getPublicStatistics(),
        ]);

        if (ignore) return;

        setState({
          users: getCollectionData(usersPayload),
          students: getCollectionData(studentsPayload),
          courses: getCollectionData(coursesPayload),
          groups: getCollectionData(groupsPayload),
          teachers: getCollectionData(teachersPayload),
          subscriptions: getCollectionData(subscriptionsPayload),
          publicStats: publicStatsPayload?.data || null,
        });
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setGeneralLoading(false);
        }
      }
    };

    loadGeneralReports();

    return () => {
      ignore = true;
    };
  }, [user?.is_admin]);

  // Загрузка финансового отчета (зависит от dateFilter)
  useEffect(() => {
    if (!user?.is_admin) {
      return;
    }

    let ignore = false;

    const loadFinancialReports = async () => {
      setFinancialLoading(true);
      setError("");
      try {
        const params = getDates(dateFilter);
        const financialPayload = await profileApi.getAdminFinancialReport(params);
        
        if (ignore) return;
        setFinancialData(financialPayload.data);
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setFinancialLoading(false);
        }
      }
    };

    loadFinancialReports();

    return () => {
      ignore = true;
    };
  }, [user?.is_admin, dateFilter]);

  const metrics = useMemo(() => {
    const parents = state.users.filter((item) => item.role === "parent").length;
    const admins = state.users.filter((item) => item.role === "admin").length;
    const activeGroups = state.groups.filter((item) => item.status === "active").length;
    const activeSubscriptions = state.subscriptions.filter(
      (item) => item.effective_status === "active" || item.status === "active",
    ).length;

    return [
      { label: t("profile.students"), value: state.publicStats?.total_students || state.students.length },
      { label: t("profile.parents"), value: parents },
      { label: t("profile.teachers"), value: state.teachers.length || state.publicStats?.total_teachers },
      { label: t("profile.admins"), value: admins },
      { label: t("profile.courses"), value: state.publicStats?.total_courses || state.courses.length },
      { label: t("profile.activeGroups"), value: activeGroups },
      { label: t("profile.subscriptions"), value: state.subscriptions.length },
      { label: t("profile.activeSubscriptions"), value: activeSubscriptions },
    ];
  }, [state, t]);

  // Вспомогательные данные для диаграмм/прогресс-баров
  const popularityMaxStudents = useMemo(() => {
    if (!financialData?.course_popularity?.length) return 1;
    return Math.max(...financialData.course_popularity.map(c => c.students_count), 1);
  }, [financialData]);

  const statusTotalCount = useMemo(() => {
    if (!financialData?.subscriptions_status) return 1;
    return Object.values(financialData.subscriptions_status).reduce((a, b) => a + b, 0) || 1;
  }, [financialData]);

  if (authLoading) {
    return <div className={styles.status}>{t("profile.loadingAdmin")}</div>;
  }

  if (!user?.is_admin) {
    return <div className={styles.status}>{t("profile.adminOnly")}</div>;
  }

  return (
    <section className={styles.page}>
      {/* Шапка */}
      <div className={styles.header}>
        <div>
          <span>{t("profile.sectionAdmin")}</span>
          <h1>{t("profile.reports")}</h1>
          <p>{t("profile.reportsDescription")}</p>
        </div>
        <div>
          <select
            className={styles.filterSelect}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="month">{rt.month}</option>
            <option value="3months">{rt.threeMonths}</option>
            <option value="year">{rt.year}</option>
            <option value="all">{rt.allTime}</option>
          </select>
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      {/* Панель финансовых показателей */}
      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{rt.financialReport}</span>
            <h2>{rt.profit}</h2>
          </div>
        </div>

        {financialLoading ? (
          <div className={styles.empty}>{t("profile.loading")}</div>
        ) : financialData ? (
          <div className={styles.statsGrid}>
            {/* Чистая прибыль */}
            <div className={`${styles.statCard} ${styles.profitCard}`}>
              <span>{rt.profit}</span>
              <strong>{formatNumber(financialData.summary.net_profit)} KZT</strong>
            </div>
            {/* Доходы от абонементов */}
            <div className={`${styles.statCard} ${styles.revenueCard}`}>
              <span>{rt.revenue}</span>
              <strong>{formatNumber(financialData.summary.total_revenue)} KZT</strong>
            </div>
            {/* Расходы на зарплаты учителям */}
            <div className={`${styles.statCard} ${styles.expensesCard}`}>
              <span>{rt.expenses}</span>
              <strong>{formatNumber(financialData.summary.total_expenses)} KZT</strong>
            </div>
            {/* Средний чек абонемента */}
            <div className={styles.statCard}>
              <span>Ср. чек абонемента</span>
              <strong>
                {formatNumber(
                  financialData.revenue_details.length 
                    ? Math.round(financialData.summary.total_revenue / financialData.revenue_details.length) 
                    : 0
                )} KZT
              </strong>
            </div>
          </div>
        ) : (
          <div className={styles.empty}>{rt.emptyReport}</div>
        )}
      </article>

      {/* Диаграммы популярности курсов и статусов абонементов */}
      {!financialLoading && financialData && (
        <div className={styles.financialGrid}>
          {/* Популярность курсов */}
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span>Операционная аналитика</span>
                <h2>{rt.coursePopularity}</h2>
              </div>
            </div>
            <div className={styles.chartBarWrapper}>
              {financialData.course_popularity.map((course) => {
                const percentage = Math.round((course.students_count / popularityMaxStudents) * 100);
                return (
                  <div key={course.id} className={styles.chartBarRow}>
                    <span className={styles.chartBarLabel} title={course.name}>
                      {course.name}
                    </span>
                    <div className={styles.chartBarProgress}>
                      <div
                        className={styles.chartBarFill}
                        style={{ width: `${percentage}%`, backgroundColor: "var(--blue)" }}
                      />
                    </div>
                    <span className={styles.chartBarValue}>{course.students_count}</span>
                  </div>
                );
              })}
              {!financialData.course_popularity.length && (
                <div className={styles.empty}>Нет данных о курсах</div>
              )}
            </div>
          </article>

          {/* Статусы абонементов */}
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span>Абонементы</span>
                <h2>{rt.subscriptionStatus}</h2>
              </div>
            </div>
            <div className={styles.chartBarWrapper}>
              {Object.entries(financialData.subscriptions_status).map(([status, count]) => {
                const percentage = Math.round((count / statusTotalCount) * 100);
                let color = "#7f8c8d";
                let label = status;
                
                if (status === "active") {
                  color = "#2ecc71";
                  label = "Активные";
                } else if (status === "paused") {
                  color = "#f1c40f";
                  label = "Приостановлены";
                } else if (status === "cancelled") {
                  color = "#e74c3c";
                  label = "Отменены";
                } else if (status === "expired") {
                  color = "#7f8c8d";
                  label = "Истекшие";
                }

                return (
                  <div key={status} className={styles.chartBarRow}>
                    <span className={styles.chartBarLabel}>{label}</span>
                    <div className={styles.chartBarProgress}>
                      <div
                        className={styles.chartBarFill}
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className={styles.chartBarValue}>{count}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      )}

      {/* Детализация поступлений */}
      {!financialLoading && financialData && (
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span>Касса</span>
              <h2>{rt.revenueDetails}</h2>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{rt.studentName}</th>
                  <th>{rt.parentName}</th>
                  <th>{rt.courseName}</th>
                  <th>{rt.amount}</th>
                  <th>{rt.date}</th>
                  <th>{rt.status}</th>
                </tr>
              </thead>
              <tbody>
                {financialData.revenue_details.map((sub) => {
                  let badgeClass = styles.badge;
                  if (sub.status === "active") badgeClass += ` ${styles.badgeActive}`;
                  else if (sub.status === "paused") badgeClass += ` ${styles.badgePaused}`;
                  else if (sub.status === "cancelled") badgeClass += ` ${styles.badgeCancelled}`;
                  else if (sub.status === "expired") badgeClass += ` ${styles.badgeExpired}`;

                  return (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td><strong>{sub.student_name}</strong></td>
                      <td>{sub.parent_name}</td>
                      <td>{sub.course_name}</td>
                      <td><strong>{formatNumber(sub.amount)} KZT</strong></td>
                      <td>{sub.start_date}</td>
                      <td>
                        <span className={badgeClass}>{sub.status_text}</span>
                      </td>
                    </tr>
                  );
                })}
                {!financialData.revenue_details.length && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }} className={styles.empty}>
                      {rt.emptyReport}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* Детализация расходов */}
      {!financialLoading && financialData && (
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span>Фонд оплаты труда</span>
              <h2>{rt.expensesDetails}</h2>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>{rt.teacherName}</th>
                  <th>{rt.hourlyRate}</th>
                  <th>{rt.hoursWorked}</th>
                  <th>{rt.lessonsCount}</th>
                  <th>{rt.totalSalary}</th>
                </tr>
              </thead>
              <tbody>
                {financialData.expenses_details.map((teacher) => (
                  <tr key={teacher.teacher_id}>
                    <td><strong>{teacher.name}</strong></td>
                    <td>{formatNumber(teacher.rate)} KZT/ч</td>
                    <td>{teacher.hours} ч</td>
                    <td>{teacher.lessons_count}</td>
                    <td><strong>{formatNumber(teacher.total_salary)} KZT</strong></td>
                  </tr>
                ))}
                {!financialData.expenses_details.length && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }} className={styles.empty}>
                      Нет данных о выплатах преподавателям
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* Общие метрики школы */}
      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t("profile.summary")}</span>
            <h2>{t("profile.mainMetrics")}</h2>
          </div>
        </div>

        {generalLoading ? (
          <div className={styles.empty}>{t("profile.loading")}</div>
        ) : (
          <div className={styles.statsGrid}>
            {metrics.map((metric) => (
              <div className={styles.statCard} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{formatNumber(metric.value)}</strong>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Проверка разделов */}
      <article className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <span>{t("profile.control")}</span>
            <h2>{t("profile.sectionsToCheck")}</h2>
          </div>
        </div>
        <div className={styles.meta}>
          <span>{t("profile.checkStudents")}</span>
          <span>{t("profile.checkTeachers")}</span>
          <span>{t("profile.checkSubscriptions")}</span>
          <span>{t("profile.checkAttendance")}</span>
        </div>
      </article>
    </section>
  );
}
