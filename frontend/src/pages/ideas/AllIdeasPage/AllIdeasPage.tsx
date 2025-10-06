import { zGetIdeasTrpcInput } from "@ideanick/backend/src/router/ideas/getIdeas/input";
import css from "./AllIdeasPage.module.scss";
import InfiniteScroll from "react-infinite-scroller";
import { withPageWrapper } from "@/lib/pageWrapper";
import { layoutContentElRef } from "@/components/Layout/Layout";
import { Loader } from "@/components/Loader/Loader";
import { Segment } from "@/components/Segment/Segment";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { Alert } from "@/components/Alert/Alert";
import { Input } from "@/components/Input/Input";
import { useForm } from "@/lib/form";
import { getViewIdeaRoute } from "@/lib/routes";
import { trpc } from "@/lib/trpc";

export const AllIdeasPage = withPageWrapper({
  title: "Idea Space",
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: { search: "" },
    validationSchema: zGetIdeasTrpcInput.pick({ search: true }),
  });
  const [search] = useDebounceValue(formik.values.search, 500);
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getIdeas.useInfiniteQuery(
      {
        search,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    );

  return (
    <Segment title="All Ideas">
      <div className={css.filter}>
        <Input maxWidth={"100%"} label="Search" name="search" formik={formik} />
      </div>
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !data?.pages[0].ideas.length ? (
        <Alert color="brown">Nothing found by search</Alert>
      ) : (
        <div className={css.ideas}>
          <InfiniteScroll
            threshold={250}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage();
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className={css.more} key="loader">
                <Loader type="section" />
              </div>
            }
            getScrollParent={() => layoutContentElRef.current}
            useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== "auto"}
          >
            {data?.pages
              .flatMap((page) => page.ideas)
              .map((idea) => (
                <div className={css.idea} key={idea.nick}>
                  <Segment
                    size={2}
                    title={
                      <Link className={css.ideaLink} to={getViewIdeaRoute({ ideaNick: idea.nick })}>
                        {idea.name}
                      </Link>
                    }
                    description={idea.description}
                  >
                    Likes: {idea.likesCount}
                  </Segment>
                </div>
              ))}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  );
});
