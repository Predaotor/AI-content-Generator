import type { ReactNode } from 'react';

type IBackgroundProps = {
  children: ReactNode;
  color: string;
  smoothScroll?: boolean; // Optional prop to enable smooth scroll behavior
};

const Background = ({ children, color, smoothScroll }: IBackgroundProps) => {
  return (
    <div
      className={`${color} ${smoothScroll ? 'scroll-smooth' : ''}`}
      style={{ scrollBehavior: smoothScroll ? 'smooth' : 'auto' }} // inline style to enable smooth scroll if the prop is true
    >
      {children}
    </div>
  );
};

export { Background };
