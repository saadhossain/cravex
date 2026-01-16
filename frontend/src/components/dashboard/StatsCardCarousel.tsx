"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface StatsCardCarouselProps {
  children: React.ReactNode;
  title?: string;
}

export function StatsCardCarousel({ children, title }: StatsCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    slidesToScroll: 1,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    onScroll();
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, onScroll]);

  return (
    <div className="w-full max-w-full">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          <div className="text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg whitespace-nowrap">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`hidden md:flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              canScrollPrev
                ? "bg-card border-border hover:bg-accent hover:border-primary/30 cursor-pointer shadow-sm"
                : "bg-muted/30 border-border/50 cursor-not-allowed opacity-40"
            }`}
            aria-label="Previous cards"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`hidden md:flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              canScrollNext
                ? "bg-card border-border hover:bg-accent hover:border-primary/30 cursor-pointer shadow-sm"
                : "bg-muted/30 border-border/50 cursor-not-allowed opacity-40"
            }`}
            aria-label="Next cards"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Carousel Viewport - clips overflow */}
      <div className="overflow-hidden w-full min-w-0" ref={emblaRef}>
        {/* Carousel Container - holds all slides */}
        <div className="flex touch-pan-y -ml-4">{children}</div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-primary transition-all duration-150 rounded-full"
          style={{
            width: `${Math.max(
              20,
              (1 / 6) * 100 + scrollProgress * (5 / 6) * 100
            )}%`,
          }}
        />
      </div>

      {/* Scroll Hint - only on mobile */}
      {(canScrollPrev || canScrollNext) && (
        <p className="text-xs text-muted-foreground text-center md:hidden opacity-60 mt-2">
          ← Swipe to see more →
        </p>
      )}
    </div>
  );
}

interface StatsCardSlideProps {
  children: React.ReactNode;
}

export function StatsCardSlide({ children }: StatsCardSlideProps) {
  // Embla works with flex-basis for sizing
  // Mobile: 1 card visible (100%)
  // Tablet (sm): 2 cards visible (50%)
  // Desktop (md): 3 cards visible (33.333%)
  // pl-4 creates the gap between cards
  return (
    <div className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 md:basis-1/3 pl-4">
      {children}
    </div>
  );
}
