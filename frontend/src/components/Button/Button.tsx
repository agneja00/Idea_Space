import cn from "classnames";
import css from "./Button.module.scss";
import { Link } from "react-router-dom";

type ButtonColor = "red" | "green";
export type ButtonProps = { children: React.ReactNode; loading?: boolean; color?: ButtonColor };
export const Button = ({ children, loading = false, color = "green" }: ButtonProps) => {
  return (
    <button
      className={cn({
        [css.button]: true,
        [css[`color-${color}`]]: true,
        [css.disabled]: loading,
        [css.loading]: loading,
      })}
      type="submit"
      disabled={loading}
    >
      <span className={css.text}>{children}</span>
    </button>
  );
};

export const LinkButton = ({
  children,
  to,
  color = "green",
}: {
  children: React.ReactNode;
  to: string;
  color?: ButtonColor;
}) => {
  return (
    <Link className={cn({ [css.button]: true, [css[`color-${color}`]]: true })} to={to}>
      {children}
    </Link>
  );
};
