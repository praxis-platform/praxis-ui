import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, SxProps } from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { redirectTo } from "../../utils/common.utils";
import GhostButton from "./GhostButton";

interface Props {
  anchorEl: HTMLElement | null;
  buttonStyles?: SxProps;
  canDelete?: boolean;
  canUpdate?: boolean;
  children?: ReactNode;
  deleteItem?: (id: number) => void;
  deletePrompt?: string;
  editPath?: string;

  // TODO: Remove itemId prop
  itemId: number;

  prependChildren?: boolean;
  setAnchorEl: (el: HTMLElement | null) => void;
  variant?: "ghost" | "default";
}

const ItemMenu = ({
  anchorEl,
  buttonStyles,
  canDelete,
  canUpdate,
  children,
  deleteItem,
  deletePrompt,
  editPath,
  itemId,
  prependChildren,
  setAnchorEl,
  variant,
}: Props) => {
  const { t } = useTranslation();

  if (!canUpdate && !canDelete && !children) {
    return null;
  }
  const showEditButton = canUpdate && editPath;
  const showDeleteButton = canDelete && deleteItem && deletePrompt;
  const Button = variant === "ghost" ? GhostButton : IconButton;

  const editIconStyles: SxProps = {
    marginBottom: 0.8,
    marginRight: 1,
    transform: "rotateY(180deg) translateY(2px)",
  };

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleDelete = () => {
    if (!deleteItem) {
      return;
    }
    deleteItem(itemId);
    handleClose();
  };

  const handleDeleteWithPrompt = () =>
    window.confirm(deletePrompt) && handleDelete();

  return (
    <>
      <Button
        aria-label={t("labels.menuButton")}
        onClick={handleMenuButtonClick}
        sx={buttonStyles}
      >
        <MoreHoriz sx={{ color: "text.secondary" }} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        sx={{
          transform: `translateY(${variant === "ghost" ? 4 : 1}px)`,
        }}
      >
        {prependChildren && children}

        {showEditButton && (
          <MenuItem onClick={() => redirectTo(editPath)}>
            <Edit fontSize="small" sx={editIconStyles} />
            {t("actions.edit")}
          </MenuItem>
        )}

        {showDeleteButton && (
          <MenuItem onClick={handleDeleteWithPrompt}>
            <Delete fontSize="small" sx={{ marginRight: 1 }} />
            {t("actions.delete")}
          </MenuItem>
        )}

        {!prependChildren && children}
      </Menu>
    </>
  );
};

export default ItemMenu;
