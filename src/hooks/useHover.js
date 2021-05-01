import { useRef, useState, useEffect } from 'react';

const useHover = () => {
  const [isHover, setIsHover] = useState(false);

  const hoverRef = useRef(null);

  const handleMouseOver = () => setIsHover(true);
  const handleMouseOut = () => setIsHover(false);

  useEffect(() => {
    const node = hoverRef.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [hoverRef, isHover]);

  return { hoverRef, isHover };
};

export default useHover;
