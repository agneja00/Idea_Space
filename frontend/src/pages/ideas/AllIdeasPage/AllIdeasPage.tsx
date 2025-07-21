import css from "./AllIdeasPage.module.scss";
import { Segment } from "../../../components/Segment/Segment";
import { Link } from "react-router-dom";
import { getViewIdeaRoute } from "../../../lib/routes";
import { trpc } from "../../../lib/trpc";

export const AllIdeasPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getIdeas.useQuery();

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Segment title="All Ideas">
      <div className={css.ideas}>
        {data?.ideas.map((idea) => (
          <div className={css.idea} key={idea.nick}>
            <Segment
              size={2}
              title={
                <Link className={css.ideaLink} to={getViewIdeaRoute({ ideaNick: idea.nick })}>
                  {idea.name}
                </Link>
              }
              description={idea.description}
            />
          </div>
        ))}
      </div>
    </Segment>
  );
};
