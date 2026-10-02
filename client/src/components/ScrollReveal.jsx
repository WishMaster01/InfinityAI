import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 750,
  threshold = 0.1,
  className = "",
  once = true,
  distance = "24px",
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Compute transform based on animation type and visibility
  const getTransform = () => {
    if (isVisible) return "none";
    switch (animation) {
      case "fade-up":
        return `translate3d(0, ${distance}, 0)`;
      case "fade-down":
        return `translate3d(0, -${distance}, 0)`;
      case "fade-left":
        return `translate3d(${distance}, 0, 0)`;
      case "fade-right":
        return `translate3d(-${distance}, 0, 0)`;
      case "scale-up":
        return "scale(0.94)";
      default:
        return "none";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
