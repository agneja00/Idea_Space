import type { TrpcRouterOutput } from "@ideanick/backend/src/router";
import { zUpdateIdeaTrpcInput } from "@ideanick/backend/src/router/updateIdea/input";
import pick from "lodash/pick";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "../../components/Alert/Alert";
import { Button } from "../../components/Button/Button";
import { FormItems } from "../../components/FormItems/FormItems";
import { Input } from "../../components/Input/Input";
import { Segment } from "../../components/Segment/Segment";
import { Textarea } from "../../components/Textarea/Textarea";
import { useForm } from "../../lib/form";
import { type EditIdeaRouteParams, getViewIdeaRoute } from "../../lib/routes";
import { trpc } from "../../lib/trpc";

const EditIdeaComponent = ({ idea }: { idea: NonNullable<TrpcRouterOutput["getIdea"]["idea"]> }) => {
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
};

export const EditIdeaPage = () => {
  const { ideaNick } = useParams() as EditIdeaRouteParams;

  const getIdeaResult = trpc.getIdea.useQuery({
    ideaNick,
  });
  const getMeResult = trpc.getMe.useQuery();

  if (getIdeaResult.isLoading || getIdeaResult.isFetching || getMeResult.isLoading || getMeResult.isFetching) {
    return <span>Loading...</span>;
  }

  if (getIdeaResult.isError) {
    return <span>Error: {getIdeaResult.error.message}</span>;
  }

  if (getMeResult.isError) {
    return <span>Error: {getMeResult.error.message}</span>;
  }

  if (!getIdeaResult.data?.idea) {
    return <span>Idea not found</span>;
  }

  const idea = getIdeaResult.data?.idea;
  const me = getMeResult.data?.me;

  if (!me) {
    return <span>Only for authorized</span>;
  }

  if (me.id !== idea.authorId) {
    return <span>An idea can only be edited by the author</span>;
  }

  return <EditIdeaComponent idea={idea} />;
};
