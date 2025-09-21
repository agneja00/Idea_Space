import cn from "classnames";
import css from "./Button.module.scss";
import { Link } from "react-router-dom";

type ButtonColor = "red" | "green" | "blue";

export type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  color?: ButtonColor;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Button = ({
  children,
  loading = false,
  color = "green",
  type = "submit",
  disabled,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      className={cn(
        css.button,
        css[`color-${color}`],
        { [css.disabled]: disabled || loading, [css.loading]: loading },
        className,
      )}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <span className={css.text}>{children}</span>
    </button>
  );
};

export const LinkButton = ({
  children,
  to,
  color = "green",
  className,
}: {
  children: React.ReactNode;
  to: string;
  color?: ButtonColor;
  className?: string;
}) => {
  return (
    <Link className={cn(css.button, css[`color-${color}`], className)} to={to}>
      {children}
    </Link>
  );
};

export const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className={css.buttons}>{children}</div>;
};
