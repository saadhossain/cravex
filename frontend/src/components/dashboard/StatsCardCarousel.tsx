"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface StatsCardCarouselProps {
  children: React.ReactNode;
}

export function StatsCardCarousel({ children }: StatsCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
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
    <div className="relative group">
      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-card border border-border shadow-lg transition-all duration-200 ${
          canScrollPrev
            ? "opacity-0 group-hover:opacity-100 hover:bg-accent"
            : "opacity-0 cursor-not-allowed"
        }`}
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-card border border-border shadow-lg transition-all duration-200 ${
          canScrollNext
            ? "opacity-0 group-hover:opacity-100 hover:bg-accent"
            : "opacity-0 cursor-not-allowed"
        }`}
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">{children}</div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-150 rounded-full"
          style={{
            width: `${(1 / 6) * 100 + scrollProgress * (5 / 6) * 100}%`,
          }}
        />
      </div>

      {/* Scroll Hint */}
      {(canScrollPrev || canScrollNext) && (
        <p className="text-xs text-muted-foreground text-center mt-2 opacity-60">
          ← Swipe or drag to see more stats →
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
    <div className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(16.666%-13px)]">
      {children}
    </div>
  );
}
