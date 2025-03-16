import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const CommunityIcon: React.FC<IconProps> = ({ className, ...props }) => {
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
      {/* Updated SVG content to represent a community icon */}
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"></path>
      <path d="M15 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"></path>
      <path d="M12 15c-1.1 0-2 .9-2 2v1h4v-1c0-1.1-.9-2-2-2z"></path>
      <path d="M12 9c-1.1 0-2-.9-2-2V6h4v1c0 1.1-.9 2-2 2z"></path>
    </svg>
  );
};

export default CommunityIcon;
