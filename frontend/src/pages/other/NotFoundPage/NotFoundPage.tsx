import css from "./NotFoundPage.module.scss";
import { ErrorPageComponent } from "../../../components/ErrorPageComponent/ErrorPageComponent";
import image404 from "../../../assets/images/404-not-found.png";

export const NotFoundPage = ({
  title = "Not Found",
  message = "This page does not exist",
}: {
  title?: string;
  message?: string;
}) => (
  <ErrorPageComponent title={title} message={message}>
    <img src={image404} className={css.image} alt="" width="800" height="600" />
  </ErrorPageComponent>
);
