import cn from "classnames";
import css from "./Button.module.scss";
import { Link } from "react-router-dom";

export type ButtonProps = { children: React.ReactNode; loading?: boolean };
export const Button = ({ children, loading = false }: ButtonProps) => {
  return (
    <button className={cn({ [css.button]: true, [css.disabled]: loading })} type="submit" disabled={loading}>
      {loading ? "Submitting..." : children}
    </button>
  );
};

export const LinkButton = ({ children, to }: { children: React.ReactNode; to: string }) => {
  return (
    <Link className={cn({ [css.button]: true })} to={to}>
      {children}
    </Link>
  );
};
