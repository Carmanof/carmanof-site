import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Section.module.scss";

type Props = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  variant?: "default" | "alt";
};

export default function Section({
  children,
  variant = "default",
  className = "",
  ...props
}: Props) {
  const sectionClassName =
    variant === "alt"
      ? `${styles.section} ${styles.alt} ${className}`.trim()
      : `${styles.section} ${className}`.trim();

  return (
    <section className={sectionClassName} {...props}>
      {children}
    </section>
  );
}
