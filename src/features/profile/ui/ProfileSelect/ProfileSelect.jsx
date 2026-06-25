"use client";

import { Children } from "react";
import { MenuItem, Select } from "@mui/material";

const menuProps = {
  disableScrollLock: true,
  // PaperProps: {
    sx: {
      mt: 0.5,
      border: "1px solid #d2d2d2",
      borderRadius: "12px",
      boxShadow: "0 12px 28px rgba(0, 21, 125, 0.12)",
      overflow: "hidden",
      // bgcolor: "#fff",
      "& .MuiList-root": {
        p: "6px",
        bgcolor: "#fff",
      },
      "& .MuiMenuItem-root": {
        minHeight: 42,
        borderRadius: "8px",
        color: "var(--secondary)",
        fontSize: "16px",
        fontWeight: 500,
      },
      "& .MuiMenuItem-root.Mui-selected": {
        bgcolor: "var(--primary) !important",
        color: "#fff",
      },
      "& .MuiMenuItem-root.Mui-selected:hover": {
        bgcolor: "var(--primary) !important",
        color: "#fff",
      },
    },
  // },
};

const selectSx = {
  width: "100%",
  minHeight: "56px",
  bgcolor: "#fff",
  borderRadius: "12px",
  color: "#171717",
  fontSize: "16px",
  fontWeight: 500,
  "& .Mui-selected": {
    backgroundColor:"var(--primary)"
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d2d2d2",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d2d2d2",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--primary)",
    borderWidth: "1px",
  },
  "& .MuiSelect-select": {
    minHeight: "auto",
    py: "16px",
    pr: "44px !important",
    pl: "14px",
  },
  "& .MuiSvgIcon-root": {
    color: "#586EDF",
    right: "14px",
  },
};

export default function ProfileSelect({ children, ...props }) {
  const options = Children.toArray(children)
    .filter(Boolean)
    .map((child) => ({
      key: child.key ?? child.props.value,
      value: child.props.value,
      disabled: child.props.disabled,
      label: child.props.children,
    }));

  return (
    <Select {...props} displayEmpty fullWidth size="medium" sx={selectSx} MenuProps={menuProps}>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
