import React, { useEffect, useRef, useState } from 'react';

const FadeInOnScroll = ({ children, className }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} fade-in ${visible ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

export default FadeInOnScroll;
