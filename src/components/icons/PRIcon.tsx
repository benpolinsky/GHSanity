import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const PRIcon: React.FC<IconProps> = ({ className, ...props }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="6" cy="6" r="2"></circle>
      <circle cx="6" cy="18" r="2"></circle>
      <circle cx="18" cy="12" r="2"></circle>
      <line x1="6" y1="8" x2="6" y2="16"></line>
      <line x1="6" y1="12" x2="18" y2="12"></line>
    </svg>
  );
};

export default PRIcon;
