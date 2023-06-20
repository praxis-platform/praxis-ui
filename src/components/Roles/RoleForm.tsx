import {
  Card,
  CardContent as MuiCardContent,
  CardProps,
  FormGroup,
  styled,
} from "@mui/material";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { ColorResult } from "react-color";
import { useTranslation } from "react-i18next";
import { RoleFragment } from "../../apollo/gen";
import { FieldNames } from "../../constants/common.constants";
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
  color: string;
  colorPickerKey: string;
  editRole?: RoleFragment;
  handleSubmit(
    formValues: { name: string },
    formHelpers: FormikHelpers<{ name: string }>
  ): Promise<void>;
  initialValues: { name: string };
  setColor(color: string): void;
}

const RoleForm = ({
  color,
  colorPickerKey,
  editRole,
  handleSubmit,
  initialValues,
  setColor,
  ...cardProps
}: Props) => {
  const { t } = useTranslation();

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
  }: FormikProps<typeof initialValues>) => {
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

export default RoleForm;
