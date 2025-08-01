import { zUpdateIdeaTrpcInput } from "@ideanick/backend/src/router/ideas/updateIdea/input";
import { canEditIdea } from "@ideanick/backend/src/utils/can";
import pick from "lodash/pick";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "../../../components/Alert/Alert";
import { Button } from "../../../components/Button/Button";
import { FormItems } from "../../../components/FormItems/FormItems";
import { Input } from "../../../components/Input/Input";
import { Segment } from "../../../components/Segment/Segment";
import { Textarea } from "../../../components/Textarea/Textarea";
import { useForm } from "../../../lib/form";
import { withPageWrapper } from "../../../lib/pageWrapper";
import { type EditIdeaRouteParams, getViewIdeaRoute } from "../../../lib/routes";
import { trpc } from "../../../lib/trpc";

export const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = useParams() as EditIdeaRouteParams;
    return trpc.getIdea.useQuery({
      ideaNick,
    });
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const idea = checkExists(queryResult.data.idea, "Idea not found");
    checkAccess(canEditIdea(ctx.me, idea), "An idea can only be edited by the author");
    return {
      idea,
    };
  },
  title: ({ idea }) => `Edit Idea "${idea.name}"`,
})(({ idea }) => {
  const navigate = useNavigate();
  const updateIdea = trpc.updateIdea.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(idea, ["name", "nick", "description", "text"]),
    validationSchema: zUpdateIdeaTrpcInput.omit({ ideaId: true }),
    onSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values });
      navigate(getViewIdeaRoute({ ideaNick: values.nick }));
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  });

  return (
    <Segment title={`Edit Idea: ${idea.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Description" name="description" maxWidth={500} formik={formik} />
          <Textarea label="Text" name="text" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  );
});
