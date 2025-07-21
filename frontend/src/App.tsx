import "./styles/global.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { AppContextProvider } from "./lib/ctx";
import * as routes from "./lib/routes";
import { TrpcProvider } from "./lib/trpc";
import { AllIdeasPage } from "./pages/ideas/AllIdeasPage/AllIdeasPage";
import { ViewIdeaPage } from "./pages/ideas/ViewIdeaPage/ViewIdeaPage";
import { EditIdeaPage } from "./pages/ideas/EditIdeaPage/EditIdeaPage";
import { NewIdeaPage } from "./pages/ideas/NewIdeaPage/NewIdeaPage";
import { NotFoundPage } from "./pages/other/NotFoundPage/NotFoundPage";
import { EditProfilePage } from "./pages/auth/EditProfilePage/EditProfilePage";
import { SignUpPage } from "./pages/auth/SignUpPage/SignUpPage";
import { SignInPage } from "./pages/auth/SignInPage/SignInPage";
import { SignOutPage } from "./pages/auth/SignOutPage/SignOutPage";

export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
              <Route path={routes.getSignInRoute()} element={<SignInPage />} />
              <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />
              <Route path={routes.getNewIdeaRoute()} element={<NewIdeaPage />} />
              <Route path={routes.getEditProfileRoute()} element={<EditProfilePage />} />
              <Route path={routes.getViewIdeaRoute(routes.viewIdeaRouteParams)} element={<ViewIdeaPage />} />
              <Route path={routes.getEditIdeaRoute(routes.editIdeaRouteParams)} element={<EditIdeaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  );
};
