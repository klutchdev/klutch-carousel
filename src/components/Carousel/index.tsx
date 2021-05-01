/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, RefObject, useState, useRef } from 'react';
import './carousel.css';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';

export const images = [
  'https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png',
  'https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png',
  'https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png',
];

const swipeConfidenceThreshold = 10000;

const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

const Carousel = ({
  height,
  width,
  controls,
  indicators,
  marginTop,
  shadow,
  radius,
  images,
}: CarouselProps & typeof defaultCarouselProps): JSX.Element => {
  const [dir, setDir] = useState(0);
  const [page, setPage] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);

  const imageIndex = wrap(0, images.length, page);

  const variants = {
    enter: (dir: number) => {
      return {
        x: dir > 0 ? 900 : -900,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => {
      return {
        x: dir < 0 ? 900 : -900,
        opacity: 0,
      };
    },
  };

  // Pagination
  const nextPage = () => {
    if (page >= images.length - 1) {
      setDir(1);
      setPage(0);
    } else {
      setDir(1);
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page <= 0) {
      setDir(-1);
      setPage(images.length - 1);
    } else {
      setDir(-1);
      setPage(page - 1);
    }
  };

  const Prev = ({ handleClick }: PaginateProps) => {
    return (
      <motion.div className="prev" onClick={handleClick}>
        <LeftSVG />
      </motion.div>
    );
  };

  const Next = ({ handleClick }: PaginateProps) => (
    <motion.div className="next" onClick={handleClick}>
      <LeftSVG />
    </motion.div>
  );

  const getIndex = () => {
    for (let i = 0; i < images.length - 1; i++) {
      setImgIndex(i);
      console.log(imgIndex);
    }
  };

  useEffect(() => {
    getIndex();
  }, [page]);

  return (
    <>
      <AnimatePresence initial={false} custom={dir}>
        <div
          key="wrapper"
          className="carousel-wrapper"
          style={{
            marginTop: `${marginTop ? marginTop : 0}rem`,
            height: `calc(${height ? height : 75}vh)`,
          }}
        >
          <motion.img
            key={page}
            style={{
              width: `calc(${width ? width : 100}vw)`,
              height: `calc(${height ? height : 75}vh)`,
              boxShadow: `${shadow && '2px 2px 18px #000000'}`,
              borderRadius: `${radius ? radius : 0}px`,
            }}
            src={images[imageIndex]}
            custom={dir}
            variants={variants}
            exit="exit"
            animate="center"
            initial="enter"
            transition={{
              x: { type: 'spring', stiffness: 200, damping: 35 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              swipe < -swipeConfidenceThreshold
                ? prevPage()
                : nextPage();
            }}
          />

          {controls && (
            <>
              <Prev handleClick={prevPage} />
              <Next handleClick={nextPage} />
            </>
          )}
        </div>
        {indicators && (
          <div className="slider-position">
            {images.map((image) => (
              <Indicator
                key={image}
                id={images.indexOf(image)}
                page={page}
                setPage={setPage}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Position indicator
const Indicator = ({
  id,
  page,
  setPage,
}: IndicatorProps): JSX.Element => {
  const [active, setActive] = useState(false);
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  const handleClick = () => setPage(id);

  useEffect(() => {
    id === page ? setActive(true) : setActive(false);
  }, [page]);

  return (
    <div
      style={{
        cursor: `pointer`,
        margin: `auto 0.25rem`,
        color: isHover || active ? '#fefefe' : '#aaaaaa',
        transition: `color 100ms ease`,
        fontSize: active ? `1.5rem` : `1.25rem`,
      }}
      ref={hoverRef}
      onClick={handleClick}
    >
      {active ? '●' : '○'}{' '}
    </div>
  );
};

// Prev and next icon
const LeftSVG = (): JSX.Element => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <svg
      color={isHover ? '#fefefe' : '#cccccc'}
      style={{
        transition: `all 250ms ease`,
        color: isHover ? '#fefefe' : '#cccccc',
        width: isHover ? 40 : 35,
        height: isHover ? 40 : 35,
      }}
      ref={hoverRef}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
      />
    </svg>
  );
};

function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEffect(() => {
    const node = elementRef?.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [elementRef]);

  return value;
}

interface CarouselProps {
  width?: number;
  height?: number;
  controls?: boolean;
  indicators?: boolean;
  marginTop?: number;
  shadow?: boolean;
  radius?: number;
  images: Array<string>;
}

const defaultCarouselProps = {
  width: 100,
  height: 75,
  controls: true,
  indicators: true,
  marginTop: 0,
  shadow: true,
  radius: 0,
};

type IndicatorProps = {
  id: number;
  page: number;
  setPage: Function;
};

type PaginateProps = {
  handleClick: () => void;
};

Carousel.defaultProps = defaultCarouselProps;
export default Carousel;
