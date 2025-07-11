import { format } from "date-fns/format";
import css from "./ViewIdeaPage.module.scss";
import { Segment } from "../../components/Segment/Segment";
import { useParams } from "react-router-dom";
import { type ViewIdeaRouteParams } from "../../lib/routes";
import { trpc } from "../../lib/trpc";

export const ViewIdeaPage = () => {
  const { ideaNick } = useParams() as ViewIdeaRouteParams;

  const { data, error, isLoading, isFetching, isError } = trpc.getIdea.useQuery({
    ideaNick,
  });

  if (isLoading || isFetching) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data?.idea) {
    return <span>Idea not found</span>;
  }

  return (
    <Segment title={data.idea.name} description={data.idea.description}>
      <div className={css.createdAt}>Created At: {format(data.idea.createdAt, "yyyy-MM-dd")}</div>
      <div className={css.text} dangerouslySetInnerHTML={{ __html: data.idea.text }} />
    </Segment>
  );
};
