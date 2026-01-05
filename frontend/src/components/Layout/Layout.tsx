import css from "./Layout.module.scss";
import { ReactComponent as Logo } from "@/assets/images/logo.svg";
import { createRef } from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import {
  getAllIdeasRoute,
  getEditProfileRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from "@/lib/routes";
import { useMe } from "@/lib/ctx";

export const layoutContentElRef = createRef<HTMLDivElement>();

export const Layout = () => {
  const me = useMe();

  return (
    <>
      <div className={css.layout}>
        <div className={css.navigation}>
          <Logo className={css.logo} />
          <ul className={css.menu}>
            <li className={css.item}>
              <Link className={css.link} to={getAllIdeasRoute()}>
                All Ideas
              </Link>
            </li>

            {me ? (
              <>
                <li className={css.item}>
                  <Link className={css.link} to={getNewIdeaRoute()}>
                    Add Idea
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getEditProfileRoute()}>
                    Edit Profile
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getSignOutRoute()}>
                    Log Out ({me.nick})
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className={css.item}>
                  <Link className={css.link} to={getSignUpRoute()}>
                    Sign Up
                  </Link>
                </li>
                <li className={css.item}>
                  <Link className={css.link} to={getSignInRoute()}>
                    Sign In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <main className={css.content} ref={layoutContentElRef}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};
