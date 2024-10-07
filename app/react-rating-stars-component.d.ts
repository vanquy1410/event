declare module 'react-rating-stars-component' {
  import { FC } from 'react';

  interface ReactStarsProps {
    count?: number;
    value?: number;
    char?: string;
    color?: string;
    activeColor?: string;
    size?: number;
    edit?: boolean;
    isHalf?: boolean;
    emptyIcon?: JSX.Element;
    halfIcon?: JSX.Element;
    filledIcon?: JSX.Element;
    a11y?: boolean;
    onChange?: (newValue: number) => void;
  }

  const ReactStars: FC<ReactStarsProps>;

  export default ReactStars;
}
