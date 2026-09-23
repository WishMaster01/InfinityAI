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
      className: `rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] ${className}`,
      ...props,
    },
    children,
  );

export default Card;
