"use client";

import style from "./Footer.module.css";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/shared/config/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className={style.Footer}>
      <Box className={style.mainBox}>
        <div className={style.mainName}>
          <h1>CODZILLA</h1>
          <p>{t("footer.description")}</p>
        </div>
        <div className={style.linksBox}>
          <Box className={style.links + " flex row ai-center gap-10"}>
            <a href={"https://www.instagram.com/codzilla_school/"} target="_blank" rel="noopener noreferrer">
              <Image
                src={"/icons/social/inst.svg"}
                alt={"inst"}
                width={40}
                height={40}
              />
            </a>
            <a href={"https://wa.me/77002094540"} target="_blank" rel="noopener noreferrer">
              <Image
                src={"/icons/social/whatsapp.svg"}
                alt={"whatsapp"}
                width={40}
                height={40}
              />
            </a>
            <a href="tel:+77002094540" target="_blank" rel="noopener noreferrer">
              <Image
                src={"/icons/social/phone.svg"}
                alt={"phone"}
                width={40}
                height={40}
              />
            </a>
          </Box>
          <p>{t("footer.socials")}</p>
        </div>
      </Box>
      <Box className={style.mapBox}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <iframe
            src={
              "https://yandex.kz/map-widget/v1/?ll=69.144765%2C54.892018&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoyMTk5MDc0ODM5EpUB0prQsNC30LDSm9GB0YLQsNC9LCDQodC-0LvRgtKv0YHRgtGW0Log0prQsNC30LDSm9GB0YLQsNC9INC-0LHQu9GL0YHRiywg0J_QtdGC0YDQvtC_0LDQstC7LCDQndKx0YDRgdKx0LvRgtCw0L0g0J3QsNC30LDRgNCx0LDQtdCyINC606nRiNC10YHRliwgMjQ20JEiCg04SopCFUSRW0I%2C&z=17.45"
            }
            width="100%"
            height="215"
            frameBorder="1"
            allowFullScreen={true}
            style={{
              position: "relative",
              border: "none",
              borderRadius: "20px",
            }}
          ></iframe>
        </div>

        <p className={style.mapDescription}>
          {t("footer.address").split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </Box>

      <Box className={style.navBox}>
        <Link href={"/"} className={style.navLink}>
          {t("nav.home")}
        </Link>
        <Link href={"/courses"} className={style.navLink}>
          {t("nav.courses")}
        </Link>
        <Link href={"/about"} className={style.navLink}>
          {t("nav.about")}
        </Link>
      </Box>
    </footer>
  );
}
