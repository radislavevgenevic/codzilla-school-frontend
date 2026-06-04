 "use client";

import JsonLd from "@/shared/config/seo/JsonLd";
import { Box, Divider, Typography } from "@mui/material";
import styles from "./PageContent.module.css";
import Image from "next/image";
import FeedbackForm from "@/shared/ui/forms/FeedbackForm";
import { useI18n } from "@/shared/config/i18n";
import { SITE_URL } from "@/shared/config/site";

export default function PageContent() {
  const { t } = useI18n();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Codzilla School",
    url: SITE_URL,
    logo: "/logo.svg",
    description: t("about.schemaDescription"),
    sameAs: ["https://instagram.com/codzilla", "https://facebook.com/codzilla"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+7-705-209-4540",
      email: "info@codzilla-school.com",
    },
  };

  return (
    <>
      <JsonLd pageType="about" additionalData={organizationJsonLd} />
      <div className="page">
        <Box
          className={"flex gap-40 col w-100 ai-center"}
          style={{ maxWidth: 700 }}
        >
          <Typography variant="h1" component="h1">
            {t("about.title")}
          </Typography>
          <Typography variant="body2" align="center">
            {t("about.description")}
          </Typography>
        </Box>

        <Box className={styles.contentWrapper}>
          <Box className={styles.sideInfoWrapper}>
            <Box className={styles.infoItem}>
              <Image
                src="/icons/about/shop.svg"
                alt={t("about.altContacts")}
                width={18}
                height={18}
              />
              <Box className={styles.infoText}>
                <h4>{t("about.contacts")}</h4>
              </Box>
            </Box>

            <Divider orientation="horizontal" variant="fullWidth" flexItem />

            <Box className={styles.infoItem}>
              <Image
                src="/icons/about/map.svg"
                alt={t("about.altMap")}
                width={18}
                height={18}
              />
              <Box className={styles.infoText}>
                <h4>{t("about.addressTitle")}</h4>
                <p>
                  {t("about.address").split("\n").map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < t("about.address").split("\n").length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </Box>
            </Box>

            <Divider orientation="horizontal" variant="fullWidth" flexItem />

            <Box className={styles.infoItem}>
              <Image
                src="/icons/about/time.svg"
                alt={t("about.altTime")}
                width={18}
                height={18}
              />
              <Box className={styles.infoText}>
                <h4>{t("about.workTime")}</h4>
                <p>
                  {t("about.workTimeValue").split("\n").map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < t("about.workTimeValue").split("\n").length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </Box>
            </Box>

            <Divider orientation="horizontal" variant="fullWidth" flexItem />

            <Box className={styles.infoItem}>
              <Image
                src="/icons/about/phone.svg"
                alt={t("about.altPhone")}
                width={18}
                height={18}
              />
              <Box className={styles.infoText}>
                <h4>{t("about.phoneTitle")}</h4>
                <p>
                  +7 (700) 209 45 40
                </p>
              </Box>
            </Box>

            {/* <Divider orientation="horizontal" variant="fullWidth" flexItem />

            <Box className={styles.infoItem}>
              <Image
                src="/icons/about/mail.svg"
                alt={t("about.altMail")}
                width={18}
                height={18}
              />
              <Box className={styles.infoText}>
                <h4>{t("about.emailTitle")}</h4>
                <p>
                  codzilla@gmail.com
                  <br />
                  droneschool@email.ru
                </p>
              </Box> */}
            {/* </Box> */}
          </Box>
          <Box className={styles.map}>
            <div style={{ position: "relative", overflow: "hidden" }}>
              <a
                href="https://yandex.kz/maps/ru/10298/petropavlovsk/?utm_medium=mapframe&utm_source=maps"
                style={{
                  color: "#eee",
                  fontSize: "12px",
                  position: "absolute",
                  top: "0px",
                }}
              >
                {t("about.city")}
              </a>
              <a
                href="https://yandex.kz/maps/ru/10298/petropavlovsk/house/nursultan_nazarbaev_koshesi_246b/YkAYdwNkQEMFQFtufXR4cHRlZg==/?ll=69.144963%2C54.891862&utm_medium=mapframe&utm_source=maps&z=17.3"
                style={{
                  color: "#eee",
                  fontSize: "12px",
                  position: "absolute",
                  top: "14px",
                }}
              >
                {t("about.mapLabel")}
              </a>
              <iframe
                src="https://yandex.kz/map-widget/v1/?ll=69.144963%2C54.891862&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoyMTk5MDc0ODM5EpUB0prQsNC30LDSm9GB0YLQsNC9LCDQodC-0LvRgtKv0YHRgtGW0Log0prQsNC30LDSm9GB0YLQsNC9INC-0LHQu9GL0YHRiywg0J_QtdGC0YDQvtC_0LDQstC7LCDQndKx0YDRgdKx0LvRgtCw0L0g0J3QsNC30LDRgNCx0LDQtdCyINC606nRiNC10YHRliwgMjQ20JEiCg04SopCFUSRW0I%2C&z=17.3"
                width="100%"
                height="100%"
                frameBorder="1"
                allowFullScreen={true}
                style={{ position: "relative" }}
              ></iframe>
            </div>
          </Box>
        </Box>
      </div>

      <div className="page">
        <Box
          className={"flex gap-40 col w-100 ai-center"}
          style={{ maxWidth: 700 }}
        >
          <Typography variant="h1" component="h1">
            {t("about.questionsTitle")}
          </Typography>
          <Typography variant="body2" align="center">
            {t("about.questionsDescription")}
          </Typography>
        </Box>

        <FeedbackForm />
      </div>
    </>
  );
}
