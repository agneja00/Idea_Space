import "./styles/global.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getAllIdeasRoute.definition} element={<AllIdeasPage />} />
                <Route path={routes.getViewIdeaRoute.definition} element={<ViewIdeaPage />} />
                <Route path={routes.getEditIdeaRoute.definition} element={<EditIdeaPage />} />
                <Route path={routes.getNewIdeaRoute.definition} element={<NewIdeaPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  );
};
