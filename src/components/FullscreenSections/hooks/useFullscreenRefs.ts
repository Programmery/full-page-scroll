import {useRef} from 'react';

export const useFullscreenRefs = () => {
  const containerRef = useRef(null);
  return {containerRef};
};
