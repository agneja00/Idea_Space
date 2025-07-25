import { format } from "date-fns/format";
import css from "./ViewIdeaPage.module.scss";
import { Segment } from "../../../components/Segment/Segment";
import { withPageWrapper } from "../../../lib/pageWrapper";
import { LinkButton } from "../../../components/Button/Button";
import { useParams } from "react-router-dom";
import { getEditIdeaRoute, type ViewIdeaRouteParams } from "../../../lib/routes";
import { trpc } from "../../../lib/trpc";

export const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { ideaNick } = useParams() as ViewIdeaRouteParams;
    return trpc.getIdea.useQuery({
      ideaNick,
    });
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, "Idea not found"),
    me: ctx.me,
  }),
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={css.createdAt}>Created At: {format(idea.createdAt, "yyyy-MM-dd")}</div>
    <div className={css.author}>
      Author: {idea.author.nick}
      {idea.author.name ? ` (${idea.author.name})` : ""}
    </div>
    <div className={css.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
    {me?.id === idea.authorId && (
      <div className={css.editButton}>
        <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
  </Segment>
));
