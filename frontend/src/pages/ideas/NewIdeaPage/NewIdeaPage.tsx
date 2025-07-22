import { zCreateIdeaTrpcInput } from "@ideanick/backend/src/router/ideas/createIdea/input";
import { Alert } from "../../../components/Alert/Alert";
import { Button } from "../../../components/Button/Button";
import { FormItems } from "../../../components/FormItems/FormItems";
import { Input } from "../../../components/Input/Input";
import { Segment } from "../../../components/Segment/Segment";
import { Textarea } from "../../../components/Textarea/Textarea";
import { useForm } from "../../../lib/form";
import { withPageWrapper } from "../../../lib/pageWrapper";
import { trpc } from "../../../lib/trpc";

export const NewIdeaPage = withPageWrapper({
  authorizedOnly: true,
  title: "New Idea",
})(() => {
  const createIdea = trpc.createIdea.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: "",
      nick: "",
      description: "",
      text: "",
    },

    validationSchema: zCreateIdeaTrpcInput,

    onSubmit: async (values) => {
      await createIdea.mutateAsync(values);
      formik.resetForm();
    },
    successMessage: "Idea created!",
    showValidationAlert: true,
  });

  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <FormItems>
          <Input name="name" label="Name" formik={formik} />
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="description" label="Description" formik={formik} maxWidth={500} />
          <Textarea name="text" label="Text" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Create Idea</Button>
        </FormItems>
      </form>
    </Segment>
  );
});
