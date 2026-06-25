"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import styles from "./CourseCardsBlock.module.css";
import { useI18n } from "@/shared/config/i18n";

const selectMenuProps = {
  disableScrollLock: true,
  sx: {
    "& .MuiMenuItem-root": { fontWeight: 500 },
    "& .MuiMenuItem-root.Mui-selected": { backgroundColor: "#eef2fe" },
  },
};

export default function CourseFilters({ age, direction, setAge, setDirection }) {
  const { t } = useI18n();
  const handleChangeAge = (event) => setAge(event.target.value);
  const handleChangeDirection = (event) => setDirection(event.target.value);

  return (
    <div className={styles.filters}>
      <FormControl
        fullWidth
        color="blue"
        sx={{
          "& .MuiFormLabel-root": { fontWeight: 500 },
          "& .MuiInputBase-input": { fontWeight: 500 },
        }}
      >
        <InputLabel id="age-select-label" color="blue">
          {t("courses.filters.age")}
        </InputLabel>
        <Select
          labelId="age-select-label"
          id="age-select"
          value={age}
          label={t("courses.filters.age")}
          onChange={handleChangeAge}
          color="blue"
          MenuProps={selectMenuProps}
        >
          <MenuItem color="blue" value={""}>
            {t("courses.filters.notSelected")}
          </MenuItem>
          <MenuItem color="blue" value={"3-6"}>
            3-6 {t("courses.filters.years")}
          </MenuItem>
          <MenuItem color="blue" value={"7-10"}>
            7-10 {t("courses.filters.years")}
          </MenuItem>
          <MenuItem color="blue" value={"11-14"}>
            11-14 {t("courses.filters.years")}
          </MenuItem>
          <MenuItem color="blue" value={"15-18"}>
            15-18 {t("courses.filters.years")}
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl
        fullWidth
        color="blue"
        sx={{
          "& .MuiFormLabel-root": { fontWeight: 500 },
          "& .MuiInputBase-input": { fontWeight: 500 },
        }}
      >
        <InputLabel id="direction-select-label" color="blue">
          {t("courses.filters.direction")}
        </InputLabel>
        <Select
          labelId="direction-select-label"
          id="direction-select"
          value={direction}
          label={t("courses.filters.direction")}
          onChange={handleChangeDirection}
          color="blue"
          MenuProps={selectMenuProps}
        >
          <MenuItem color="blue" value={""}>
            {t("courses.filters.notSelected")}
          </MenuItem>
          <MenuItem color="blue" value={"pacman"}>
            {t("courses.filters.games")}
          </MenuItem>
          <MenuItem color="blue" value={"robot"}>
            {t("courses.filters.robotics")}
          </MenuItem>
          <MenuItem color="blue" value={"dron"}>
            {t("courses.filters.drones")}
          </MenuItem>
          <MenuItem color="blue" value={"programming"}>
            {t("courses.filters.programming")}
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
