import { TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/shared/config/i18n";

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  return password.length >= 8;
}

export default function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const { t } = useI18n();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!values.name) {
      nextErrors.name = t("auth.nameRequired");
    }

    if (!values.email) {
      nextErrors.email = t("auth.emailRequired");
    } else if (!validateEmail(values.email)) {
      nextErrors.email = t("auth.emailInvalid");
    }

    if (values.phone && values.phone.length > 20) {
      nextErrors.phone = t("auth.phoneTooLong");
    }

    if (!values.password) {
      nextErrors.password = t("auth.passwordRequired");
    } else if (!validatePassword(values.password)) {
      nextErrors.password = t("auth.passwordMin");
    }

    if (!values.password_confirmation) {
      nextErrors.password_confirmation = t("auth.confirmPassword");
    } else if (values.password !== values.password_confirmation) {
      nextErrors.password_confirmation = t("auth.passwordsMismatch");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      const serverMessage =
        error?.errors?.name?.[0] ||
        error?.errors?.email?.[0] ||
        error?.errors?.phone?.[0] ||
        error?.errors?.password?.[0] ||
        error?.errors?.password_confirmation?.[0] ||
        error?.message ||
        t("auth.registerError");
      setServerError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      sx={{ display: "grid", gap: 2 }}
    >
      <TextField
        label={t("auth.name")}
        name="name"
        value={values.name}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, name: event.target.value }))
        }
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
         sx={{
          transition: "all 0.3s ease",
          "& .MuiFormLabel-root": {
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
          },
        }}
      />
      <TextField
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, email: event.target.value }))
        }
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
         sx={{
          transition: "all 0.3s ease",
          "& .MuiFormLabel-root": {
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
          },
        }}
      />
      <TextField
        label={t("auth.phone")}
        name="phone"
        value={values.phone}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, phone: event.target.value }))
        }
        error={!!errors.phone}
        helperText={errors.phone || t("auth.phoneOptional")}
        fullWidth
         sx={{
          transition: "all 0.3s ease",
          "& .MuiFormLabel-root": {
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
          },
        }}
      />
      <TextField
        label={t("auth.password")}
        type="password"
        name="password"
        value={values.password}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, password: event.target.value }))
        }
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
         sx={{
          transition: "all 0.3s ease",
          "& .MuiFormLabel-root": {
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
          },
        }}
      />
      <TextField
        label={t("auth.confirmPassword")}
        type="password"
        name="password_confirmation"
        value={values.password_confirmation}
        onChange={(event) =>
          setValues((prev) => ({
            ...prev,
            password_confirmation: event.target.value,
          }))
        }
        error={!!errors.password_confirmation}
        helperText={errors.password_confirmation}
        fullWidth
         sx={{
          transition: "all 0.3s ease",
          "& .MuiFormLabel-root": {
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
          },
        }}
      />

      {serverError && (
        <Box sx={{ color: "error.main", fontSize: 14, mt: -1 }}>
          {serverError}
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        sx={{
          borderRadius: "12px",
          padding: "8px 20px",
          transition: "all .3s ease",
          color: "#fff",
          "&:hover": {
            opacity: "0.8",
            backgroundColor: "#FF48F2",
          },
        }}
      >
        {loading ? t("auth.signingUp") : t("auth.signUp")}
      </Button>
    </Box>
  );
}
