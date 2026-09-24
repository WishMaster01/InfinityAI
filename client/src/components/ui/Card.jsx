import React from "react";

const Card = ({
  as: component = "section",
  className = "",
  children,
  ...props
}) =>
  React.createElement(
    component,
    {
      className: `rounded-[var(--ia-radius-card)] border border-slate-200/80 bg-[var(--ia-surface)] shadow-[var(--ia-shadow-card)] ${className}`,
      ...props,
    },
    children,
  );

export default Card;
