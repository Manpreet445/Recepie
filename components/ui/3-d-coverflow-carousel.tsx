"use client";

import React, { useState, useEffect, useCallback, useRef, useId } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from "lucide-react";

export interface CarouselItem {
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img: string;
  /** Alt text for the slide photo. Falls back to the title when omitted. */
  imgAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface CoverFlowCarouselProps {
  items?: CarouselItem[];
  sectionLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  onCtaClick?: (item: CarouselItem) => void;
}

export const defaultDishes: CarouselItem[] = [
  {
    tag: "#Signature",
    titleLine1: "Butter Chicken",
    titleLine2: "Delhi heritage",
    desc: "Velvety roasted tomato and fenugreek gravy with tender charred chicken",
    img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
    imgAlt: "Butter chicken in a copper bowl with fresh coriander",
    ctaText: "View recipe",
    ctaUrl: "#",
  },
  {
    tag: "#ChefSpecial",
    titleLine1: "Tandoori Chops",
    titleLine2: "Smoked spice",
    desc: "Grass-fed lamb chops charred in a live charcoal tandoor with Kashmiri spices",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    imgAlt: "Charred lamb chops resting on a dark board",
    ctaText: "View recipe",
    ctaUrl: "#",
  },
  {
    tag: "#Vegetarian",
    titleLine1: "Paneer Tikka",
    titleLine2: "Clay roasted",
    desc: "Cottage cheese marinated in spiced yoghurt with bell peppers and saffron",
    img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
    imgAlt: "Skewers of paneer tikka with peppers and onion",
    ctaText: "View recipe",
    ctaUrl: "#",
  },
  {
    tag: "#CoastalCatch",
    titleLine1: "Malabar Prawns",
    titleLine2: "Coconut gravy",
    desc: "Wild tiger prawns simmered in fragrant curry leaves and coconut milk",
    img: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80",
    imgAlt: "Prawn curry in a shallow bowl with curry leaves",
    ctaText: "View recipe",
    ctaUrl: "#",
  },
  {
    tag: "#ArtisanBake",
    titleLine1: "Truffle Naan",
    titleLine2: "Charcoal oven",
    desc: "Puffed leavened bread brushed with ghee and black winter truffle",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    imgAlt: "Freshly baked naan bread torn open on a board",
    ctaText: "View recipe",
    ctaUrl: "#",
  },
];

/**
 * 3D coverflow carousel.
 *
 * The depth effect is driven by per-slide transforms whose translate distances
 * come from CSS custom properties, so the same offsets scale down on small
 * screens instead of pushing slides outside the viewport.
 *
 * Autoplay is paused on hover, on focus within the carousel, when the user has
 * requested reduced motion, and by an explicit control — a rotating carousel
 * that cannot be stopped fails WCAG 2.2.
 */
export function CoverFlowCarousel({
  items = defaultDishes,
  sectionLabel = "Best sellers",
  autoplay = true,
  autoplayDelay = 5000,
  className = "",
  onCtaClick,
}: CoverFlowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchStartX = useRef(0);
  const reduceMotion = useReducedMotion();
  const labelId = useId();

  const total = items.length;
  const isPlaying = autoplay && !reduceMotion && !userPaused;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => setCurrentIndex(idx % total);

  useEffect(() => {
    if (!isPlaying || isPaused || total <= 1) return;
    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, autoplayDelay, nextSlide, total]);

  /**
   * Scoped to the carousel rather than bound to window — a global arrow-key
   * listener would hijack scrolling and every other control on the page.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];
  const transition = reduceMotion ? "none" : "all 800ms cubic-bezier(0.25, 1, 0.5, 1)";

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={sectionLabel ? labelId : undefined}
      aria-label={sectionLabel ? undefined : "Featured recipes"}
      className={`relative flex w-full select-none items-center justify-center overflow-hidden bg-roast py-16 text-on-roast md:py-20 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      {/* Ambient wash of the active photo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          key={current.img}
          src={current.img}
          alt=""
          fill
          aria-hidden="true"
          className="scale-115 object-cover blur-3xl brightness-[0.28]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(42,26,18,0.35)_0%,var(--roast-deep)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4">
        {sectionLabel && (
          <div className="mb-10 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-9 bg-gradient-to-r from-transparent to-sand"
            />
            <h2 id={labelId} className="kicker text-[11px] text-sand">
              {sectionLabel}
            </h2>
            <span
              aria-hidden="true"
              className="h-px w-9 bg-gradient-to-r from-sand to-transparent"
            />
          </div>
        )}

        {/* Stage. The --cf-* values drive the depth offsets per breakpoint. */}
        <div
          className="relative mb-10 flex h-[380px] w-full items-center justify-center [--cf-h:300px] [--cf-w:210px] [--cf-x1:118px] [--cf-x2:196px] [perspective:1400px] sm:h-[460px] sm:[--cf-h:380px] sm:[--cf-w:260px] sm:[--cf-x1:190px] sm:[--cf-x2:330px] md:h-[540px] md:[--cf-h:500px] md:[--cf-w:330px] md:[--cf-x1:285px] md:[--cf-x2:510px]"
        >
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = "translateX(0) scale(0.4) rotateY(0deg)";
            let opacity = 0;
            let zIndex = 0;
            let filter = "brightness(0.4) blur(2px)";
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = "translateX(0) scale(1) rotateY(0deg)";
              opacity = 1;
              zIndex = 30;
              filter = "brightness(1)";
            } else if (offset === 1) {
              transform = "translateX(var(--cf-x1)) scale(0.84) rotateY(-24deg)";
              opacity = 0.65;
              zIndex = 20;
              filter = "brightness(0.75)";
            } else if (offset === 2) {
              transform = "translateX(var(--cf-x2)) scale(0.68) rotateY(-38deg)";
              opacity = 0.38;
              zIndex = 10;
              filter = "brightness(0.55) blur(1px)";
            } else if (offset === total - 1) {
              transform = "translateX(calc(var(--cf-x1) * -1)) scale(0.84) rotateY(24deg)";
              opacity = 0.65;
              zIndex = 20;
              filter = "brightness(0.75)";
            } else if (offset === total - 2) {
              transform = "translateX(calc(var(--cf-x2) * -1)) scale(0.68) rotateY(38deg)";
              opacity = 0.38;
              zIndex = 10;
              filter = "brightness(0.55) blur(1px)";
            }

            return (
              <div
                key={item.titleLine1 + idx}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${total}: ${item.titleLine1}`}
                // Off-centre slides are decorative depth; every one of them is
                // reachable through the dots and arrows below.
                aria-hidden={!isCenter}
                onClick={() => !isCenter && goToSlide(idx)}
                className="absolute overflow-hidden rounded-lg border border-on-roast/12 bg-roast-raised"
                style={{
                  width: "var(--cf-w)",
                  height: "var(--cf-h)",
                  transform,
                  opacity,
                  zIndex,
                  filter,
                  transformOrigin: "center center",
                  transition,
                  boxShadow: isCenter
                    ? "0 25px 60px rgba(0,0,0,0.55), 0 0 35px rgba(224,183,131,0.22)"
                    : "0 15px 35px rgba(0,0,0,0.4)",
                  cursor: isCenter ? "default" : "pointer",
                }}
              >
                <Image
                  src={item.img}
                  alt={isCenter ? (item.imgAlt ?? item.titleLine1) : ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 210px, (max-width: 768px) 260px, 330px"
                  priority={idx === 0}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.68)_60%,rgba(0,0,0,0.96)_100%)]"
                />

                <div
                  className="relative z-20 flex h-full w-full flex-col justify-between px-4 pb-5 pt-4 text-center md:px-5 md:pb-6"
                  style={{
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? "translateY(0)" : "translateY(16px)",
                    transition: reduceMotion
                      ? "none"
                      : "opacity 500ms ease, transform 500ms ease",
                    pointerEvents: isCenter ? "auto" : "none",
                  }}
                >
                  {item.tag && (
                    <p className="w-full pr-1 text-right text-xs font-semibold text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]">
                      {item.tag}
                    </p>
                  )}

                  <div className="mt-auto flex flex-col items-center gap-1">
                    <h3 className="font-headline text-xl leading-tight text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.95)] md:text-2xl">
                      {item.titleLine1}
                    </h3>

                    {item.titleLine2 && (
                      <p className="kicker text-[10px] text-sand [text-shadow:0_3px_10px_rgba(0,0,0,0.9)]">
                        {item.titleLine2}
                      </p>
                    )}

                    <span
                      aria-hidden="true"
                      className="my-2 h-0.5 w-9 rounded-pill bg-sand shadow-[0_0_8px_rgba(224,183,131,0.7)]"
                    />

                    {item.desc && (
                      <p className="mb-3 hidden max-w-[280px] text-[13px] leading-snug text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:block">
                        {item.desc}
                      </p>
                    )}

                    <a
                      href={item.ctaUrl || "#"}
                      tabIndex={isCenter ? 0 : -1}
                      onClick={(e) => {
                        if (onCtaClick) {
                          e.preventDefault();
                          onCtaClick(item);
                        }
                      }}
                      className="kicker inline-flex min-h-9 items-center gap-1.5 rounded-pill bg-sand px-4 text-[10px] text-roast-deep transition-transform duration-200 hover:scale-105"
                    >
                      {item.ctaText || "View recipe"}
                      <ArrowRight aria-hidden="true" className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-on-roast/20 bg-black/40 text-on-roast backdrop-blur-sm transition-colors hover:border-sand hover:text-sand"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 px-1">
            {items.map((item, idx) => (
              <button
                key={item.titleLine1 + idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${item.titleLine1}`}
                aria-current={idx === currentIndex ? "true" : undefined}
                className="flex h-11 w-5 cursor-pointer items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-pill transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-7 bg-sand shadow-[0_0_10px_rgba(224,183,131,0.7)]"
                      : "w-2 bg-on-roast/25"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-on-roast/20 bg-black/40 text-on-roast backdrop-blur-sm transition-colors hover:border-sand hover:text-sand"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>

          {autoplay && !reduceMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused ? "Start automatic rotation" : "Stop automatic rotation"}
              className="ml-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-on-roast/20 bg-black/40 text-on-roast backdrop-blur-sm transition-colors hover:border-sand hover:text-sand"
            >
              {userPaused ? (
                <Play aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Pause aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Announced only when rotation is stopped, so autoplay does not spam
            screen readers with every tick. */}
        <p aria-live={isPlaying && !isPaused ? "off" : "polite"} className="sr-only">
          {`Slide ${currentIndex + 1} of ${total}: ${current.titleLine1}`}
        </p>
      </div>
    </section>
  );
}

export const Component = CoverFlowCarousel;
export default CoverFlowCarousel;
