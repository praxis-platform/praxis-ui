import {
  Card,
  CardContent as MuiCardContent,
  CardProps,
  FormGroup,
  styled,
} from "@mui/material";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import produce from "immer";
import { useState } from "react";
import { ColorResult } from "react-color";
import { useTranslation } from "react-i18next";
import { toastVar } from "../../apollo/cache";
import {
  CreateServerRoleInput,
  RoleFragment,
  ServerRolesDocument,
  ServerRolesQuery,
  useCreateServerRoleMutation,
  useUpdateServerRoleMutation,
} from "../../apollo/gen";
import { FieldNames } from "../../constants/common.constants";
import { DEFAULT_ROLE_COLOR } from "../../constants/role.constants";
import { getRandomString } from "../../utils/common.utils";
import ColorPicker from "../Shared/ColorPicker";
import Flex from "../Shared/Flex";
import PrimaryActionButton from "../Shared/PrimaryActionButton";
import { TextField } from "../Shared/TextField";

const CardContent = styled(MuiCardContent)(() => ({
  "&:last-child": {
    paddingBottom: 18,
  },
}));

interface Props extends CardProps {
  editRole?: RoleFragment;
}

const ServerRoleForm = ({ editRole, ...cardProps }: Props) => {
  const [color, setColor] = useState(
    editRole ? editRole.color : DEFAULT_ROLE_COLOR
  );
  const [colorPickerKey, setColorPickerKey] = useState("");
  const [createRole] = useCreateServerRoleMutation();
  const [updateRole] = useUpdateServerRoleMutation();

  const { t } = useTranslation();

  const initialValues = {
    name: editRole ? editRole.name : "",
  };

  const handleCreate = async (
    formValues: Omit<CreateServerRoleInput, "color">,
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<Omit<CreateServerRoleInput, "color">>
  ) =>
    await createRole({
      variables: {
        roleData: { color, ...formValues },
      },
      update(cache, { data }) {
        if (!data) {
          return;
        }
        const {
          createServerRole: { role },
        } = data;
        cache.updateQuery<ServerRolesQuery>(
          { query: ServerRolesDocument },
          (postsData) =>
            produce(postsData, (draft) => {
              draft?.serverRoles.unshift(role);
            })
        );
      },
      onCompleted() {
        setColor(DEFAULT_ROLE_COLOR);
        setSubmitting(false);
        resetForm();
      },
    });

  const handleSubmit = async (
    formValues: Omit<CreateServerRoleInput, "color">,
    formHelpers: FormikHelpers<Omit<CreateServerRoleInput, "color">>
  ) => {
    try {
      if (editRole) {
        await updateRole({
          variables: {
            roleData: {
              id: editRole.id,
              ...formValues,
              color,
            },
          },
        });
        return;
      }
      await handleCreate(formValues, formHelpers);
    } catch (err) {
      toastVar({
        status: "error",
        title: String(err),
      });
    } finally {
      setColorPickerKey(getRandomString());
    }
  };

  const handleChangeComplete = (color: ColorResult) => setColor(color.hex);

  const unsavedColorChange = () => {
    if (!editRole) {
      return false;
    }
    return editRole.color !== color;
  };

  const isSubmitButtonDisabled = ({
    dirty,
    isSubmitting,
  }: FormikProps<Omit<CreateServerRoleInput, "color">>) => {
    if (isSubmitting) {
      return true;
    }
    if (unsavedColorChange()) {
      return false;
    }
    return !dirty;
  };

  return (
    <Card {...cardProps}>
      <CardContent>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => (
            <Form>
              <FormGroup>
                <TextField
                  autoComplete="off"
                  label={t("groups.form.name")}
                  name={FieldNames.Name}
                />

                <ColorPicker
                  color={color}
                  key={colorPickerKey}
                  label={t("roles.form.colorPickerLabel")}
                  onChange={handleChangeComplete}
                  sx={{ marginBottom: 1.25 }}
                />
              </FormGroup>

              <Flex justifyContent="end">
                <PrimaryActionButton
                  disabled={isSubmitButtonDisabled(formik)}
                  isLoading={formik.isSubmitting}
                  sx={{ marginTop: 1.5 }}
                  type="submit"
                >
                  {editRole ? t("actions.save") : t("actions.create")}
                </PrimaryActionButton>
              </Flex>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default ServerRoleForm;
