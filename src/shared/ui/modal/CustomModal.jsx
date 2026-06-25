import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
} from "@mui/material";

import Close from "@/shared/assets/icons/close.svg";
import { cloneElement, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";

export default function CustomModal({
  trigger,
  title,
  children,
  actions,
  openState,
  onClose,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = Array.isArray(openState) && openState.length === 2;
  const open = isControlled ? openState[0] : internalOpen;
  const setOpen = isControlled ? openState[1] : setInternalOpen;
  const isMobile = useIsMobile();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const triggerWithProps = trigger
    ? cloneElement(trigger, { onClick: handleOpen })
    : null;

  return (
    <>
      {triggerWithProps}

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                borderTopLeftRadius: "18px",
                borderTopRightRadius: "18px",
                padding: "18px",
                maxHeight: "88dvh",
                overflowY: "auto",
                boxShadow: "0 -18px 48px rgba(7, 12, 32, 0.18)",
                backgroundColor: "#fff",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              pb: 1,
            }}
          >
            <Box
              sx={{ color: "var(--secondary)", fontWeight: 700, fontSize: 18 }}
            >
              {title}
            </Box>
            <IconButton onClick={handleClose}>
              <Image src={Close} alt="Close" width={20} height={20} />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2 }}>{children}</Box>

          {actions && <Box sx={{ mt: 2 }}>{actions}</Box>}
        </Drawer>
      ) : (
        <Dialog
          disableScrollLock={true}
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": {
              minWidth: "320px",
              maxWidth: "calc(100vw - 32px)",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pr: 4,
            }}
          >
            {title}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
              }}
            >
              <Image src={Close} alt="Close" width={20} height={20} />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>{children}</DialogContent>

          {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
      )}
    </>
  );
}
