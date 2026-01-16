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
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: false,
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
    <div className="space-y-4">
      {/* Header with Navigation Controls - always visible on desktop */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`hidden md:flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
              canScrollPrev
                ? "bg-card border-border hover:bg-accent hover:border-accent-foreground/20 cursor-pointer"
                : "bg-muted/30 border-border/50 cursor-not-allowed opacity-50"
            }`}
            aria-label="Previous cards"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`hidden md:flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
              canScrollNext
                ? "bg-card border-border hover:bg-accent hover:border-accent-foreground/20 cursor-pointer"
                : "bg-muted/30 border-border/50 cursor-not-allowed opacity-50"
            }`}
            aria-label="Next cards"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex gap-3 md:gap-4 touch-pan-y">{children}</div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-primary to-primary/70 transition-all duration-150 rounded-full"
          style={{
            width: `${(1 / 6) * 100 + scrollProgress * (5 / 6) * 100}%`,
          }}
        />
      </div>

      {/* Scroll Hint - only on mobile */}
      {(canScrollPrev || canScrollNext) && (
        <p className="text-xs text-muted-foreground text-center md:hidden opacity-60">
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
  return (
    <div className="flex-shrink-0 w-[85%] min-[480px]:w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(16.666%-13.5px)]">
      {children}
    </div>
  );
}
