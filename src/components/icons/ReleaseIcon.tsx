import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const ReleaseIcon: React.FC<IconProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2l6 6h-4v8h-4V8H6l6-6z"/>
    </svg>
  );
};

export default ReleaseIcon; 