import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function useInterval(callback: any, delay: any) {
  const savedCallback = useRef<any>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const Slider = () => {
  const [windowWidth, windowHeight] = useWindowSize();
  const items = [
    'https://images.unsplash.com/photo-1648737966900-730a5b2d673e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2344&q=80',
    'https://images.unsplash.com/photo-1652361561624-09537e993eb4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2334&q=80',
    'https://images.unsplash.com/photo-1615992174118-9b8e9be025e7?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340',
  ];
  const itemSize = items.length;
  const sliderPadding = 40;
  const sliderPaddingStyle = `0 ${sliderPadding}px`;
  const newItemWidth: any = getNewItemWidth();
  const transitionTime = 500;
  const transitionStyle = `transform ${transitionTime}ms ease 0s`;
  const 양끝에_추가될_데이터수 = 2;
  const [currentIndex, setCurrentIndex] = useState(양끝에_추가될_데이터수);
  const [slideTransition, setTransition] = useState(transitionStyle);
  const [isSwiping, setIsSwiping] = useState(false);
  const [slideX, setSlideX] = useState<any>();
  const [prevSlideX, setPrevSlideX] = useState<any>(false);
  let isResizing = useRef(false);

  let slides = setSlides();
  function setSlides() {
    let addedFront = [];
    let addedLast = [];
    var index = 0;
    while (index < 양끝에_추가될_데이터수) {
      addedLast.push(items[index % items.length]);
      addedFront.unshift(items[items.length - 1 - (index % items.length)]);
      index++;
    }
    return [...addedFront, ...items, ...addedLast];
  }

  function getNewItemWidth() {
    // let itemWidth = windowWidth * 0.9 - sliderPadding * 2;
    // itemWidth = itemWidth > 1060 ? 1060 : itemWidth;
    let itemWidth = 1220;
    return itemWidth;
  }

  useEffect(() => {
    isResizing.current = true;
    setIsSwiping(true);
    setTransition('');
    setTimeout(() => {
      isResizing.current = false;
      if (!isResizing.current) setIsSwiping(false);
    }, 1000);
  }, [windowWidth]);

  useInterval(
    () => {
      handleSlide(currentIndex + 1);
    },
    !isSwiping && !prevSlideX ? 2000 : null
  );

  function replaceSlide(index: any) {
    setTimeout(() => {
      setTransition('');
      setCurrentIndex(index);
    }, transitionTime);
  }

  function handleSlide(index: any) {
    setCurrentIndex(index);
    if (index - 양끝에_추가될_데이터수 < 0) {
      index += itemSize;
      replaceSlide(index);
    } else if (index - 양끝에_추가될_데이터수 >= itemSize) {
      index -= itemSize;
      replaceSlide(index);
    }
    setTransition(transitionStyle);
  }

  function handleSwipe(direction: any) {
    setIsSwiping(true);
    handleSlide(currentIndex + direction);
  }

  function getItemIndex(index: any) {
    index -= 양끝에_추가될_데이터수;
    if (index < 0) {
      index += itemSize;
    } else if (index >= itemSize) {
      index -= itemSize;
    }
    return index;
  }

  function getClientX(event: any) {
    return event._reactName == 'onTouchStart'
      ? event.touches[0].clientX
      : event._reactName == 'onTouchMove' || event._reactName == 'onTouchEnd'
      ? event.changedTouches[0].clientX
      : event.clientX;
  }

  function handleTouchStart(e: any) {
    setPrevSlideX((prevSlideX: any) => getClientX(e));
  }

  function handleTouchMove(e: any) {
    if (prevSlideX) {
      setSlideX((slideX: any) => getClientX(e) - prevSlideX);
    }
  }

  function handleMouseSwipe(e: any) {
    if (slideX) {
      const currentTouchX = getClientX(e);
      if (prevSlideX > currentTouchX + 100) {
        handleSlide(currentIndex + 1);
      } else if (prevSlideX < currentTouchX - 100) {
        handleSlide(currentIndex - 1);
      }
      setSlideX((slideX: any) => null);
    }
    setPrevSlideX((prevSlideX: any) => null);
  }

  return (
    <div className="slider-area">
      <div className="slider">
        {/* <SlideButton direction="prev" onClick={() => handleSwipe(-1)} /> */}
        {/* <SlideButton direction="next" onClick={() => handleSwipe(1)} /> */}
        <div className="slider-list" style={{ padding: sliderPaddingStyle }}>
          <div
            className="slider-track"
            onMouseOver={() => setIsSwiping(true)}
            onMouseOut={() => setIsSwiping(false)}
            style={{
              transform: `translateX(calc(${(-100 / slides.length) * (0.5 + currentIndex)}% + ${slideX || 0}px))`,
              transition: slideTransition,
            }}>
            {slides.map((slide, slideIndex) => {
              const itemIndex = getItemIndex(slideIndex);
              return (
                <div
                  key={slideIndex}
                  className={`slider-item ${currentIndex === slideIndex ? 'current-slide' : ''}`}
                  style={{ width: newItemWidth || 'auto' }}
                  onMouseDown={handleTouchStart}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onMouseMove={handleTouchMove}
                  onMouseUp={handleMouseSwipe}
                  onTouchEnd={handleMouseSwipe}
                  onMouseLeave={handleMouseSwipe}>
                  <a>
                    {/* <img src={items[itemIndex]} alt={`banner${itemIndex}`} /> */}
                    <div className="bg-img" style={{ backgroundImage: `url(${items[itemIndex]})` }}>
                      {itemIndex === 0 && (
                        <div style={{ padding: '50px 30px' }}>
                          <p style={{ fontSize: 24 }}>탄탄한 커리어를 쌓는 방법</p>
                          <p style={{ fontSize: 20 }}>
                            <span style={{ color: '#FB9310' }}>bithumb X Codestates</span>와 함께하세요!
                          </p>
                        </div>
                      )}

                      {itemIndex === 1 && (
                        <div style={{ padding: '80px 30px' }}>
                          <p style={{ fontSize: 24, margin: 0 }}>입금만 해도</p>
                          <p style={{ fontSize: 24, margin: 0 }}>비트코인 증정</p>
                          <p style={{ fontSize: 20, margin: 0 }}>
                            <span style={{ color: '#FB9310' }}>#첫시작은빗썸#빠른빗썸</span>
                          </p>
                        </div>
                      )}

                      {itemIndex === 2 && (
                        <div style={{ padding: '50px 30px' }}>
                          <p style={{ fontSize: 24, margin: 0 }}>암호화폐 모의투자</p>

                          <p style={{ fontSize: 20, margin: 0 }}>
                            <span style={{ color: '#FB9310' }}>BITMOI</span>
                            에서 실전처럼 암호화폐 투자를 체험해보세요!
                            <br /> 참가자들의 수익률 현황은 랭킹에서 확인하실 수 있습니다!
                          </p>
                        </div>
                      )}

                      {/* <p>{JSON.stringify(itemIndex)}</p> */}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
