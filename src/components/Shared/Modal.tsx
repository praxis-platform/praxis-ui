import { Close } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  SxProps,
  Toolbar,
  Typography,
} from "@mui/material";
import { KeyboardEvent, ReactNode } from "react";
import { KeyCodes } from "../../constants/common.constants";
import { useIsDesktop } from "../../hooks/common.hooks";
import { Blurple } from "../../styles/theme";

interface Props {
  actionLabel?: string;
  appBarContent?: ReactNode;
  children: ReactNode;
  closingAction?(): void;
  contentStyles?: SxProps;
  onClose(): void;
  open: boolean;
  title?: string;
  topGap?: string | number;
}

const Modal = ({
  actionLabel,
  appBarContent,
  children,
  closingAction,
  contentStyles,
  onClose,
  open,
  title,
  topGap,
}: Props) => {
  const isDesktop = useIsDesktop();

  const titleStyles: SxProps = {
    flex: 1,
    marginLeft: 1.25,
  };
  const dialogContentStyles: SxProps = isDesktop
    ? {
        minHeight: "65vh",
        width: "600px",
        ...contentStyles,
      }
    : contentStyles || {};

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code !== KeyCodes.Escape) {
      return;
    }
    onClose();
  };

  const renderAppBarContent = () => {
    if (appBarContent) {
      return appBarContent;
    }
    return (
      <Toolbar>
        <IconButton
          aria-label="close"
          color="primary"
          edge="start"
          onClick={onClose}
        >
          <Close sx={{ color: "primary.main" }} />
        </IconButton>
        <Typography component="div" sx={titleStyles} variant="h6">
          {title}
        </Typography>
        {actionLabel && (
          <Button sx={{ color: "primary.main" }} onClick={closingAction}>
            {actionLabel}
          </Button>
        )}
      </Toolbar>
    );
  };

  return (
    <Dialog
      fullScreen={!isDesktop}
      onKeyDown={handleKeyDown}
      open={open}
      sx={{ marginTop: topGap }}
      // Required for mobile
      BackdropProps={{ onClick: onClose }}
      // Required for desktop
      onClose={onClose}
    >
      <AppBar sx={{ position: "relative", backgroundColor: Blurple.Primary }}>
        {renderAppBarContent()}
      </AppBar>
      <DialogContent sx={dialogContentStyles}>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
