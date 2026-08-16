"use client";

import styles from "./Button.module.scss";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const buttonStyles = cva(styles.button, {
  variants: {
    variant: { primary: styles.primary, secondary: styles.secondary },
    size: { sm: styles.sm, md: styles.md },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = clsx(buttonStyles({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
