"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Eyebrow, Period } from "@/components/ui/Section";
import { reviewCategories, type Review, type ReviewCategory } from "@/content/reviews";
import { cn } from "@/lib/cn";

function Stars({ rating }: { rating: number }) {
  return (
    <p role="img" aria-label={`Note : ${rating} sur 5`} className="flex gap-1 text-terra">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("size-4", i < rating ? "fill-current" : "text-line-strong")}
          strokeWidth={1.5}
        />
      ))}
    </p>
  );
}

function ReviewCard({ review, example }: { review: Review; example: boolean }) {
  const category = reviewCategories[review.category].label;
  return (
    <figure className="flex h-full flex-col gap-6 rounded-[var(--radius-card)] bg-surface p-7 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        {example ? (
          <span className="rounded-full border border-dashed border-terra-text/60 px-2.5 py-1 text-[0.75rem] font-semibold text-terra-text">
            Exemple
          </span>
        ) : (
          <Quote aria-hidden="true" className="size-6 text-olive" strokeWidth={1.25} />
        )}
      </div>
      {/* Le texte est toujours affiché en entier. */}
      <blockquote className="flex-1 font-display text-[1.125rem] leading-relaxed text-maison">
        {review.text}
      </blockquote>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-small">
        <span className="text-ink">
          <span className="font-semibold">{review.name}</span>
          {review.city ? <span className="text-ink-soft">, {review.city}</span> : null}
          {review.source || review.date ? (
            <span className="block text-ink-soft">{[review.source, review.date].filter(Boolean).join(" · ")}</span>
          ) : null}
        </span>
        <span className="rounded-full bg-olive-light px-3 py-1 text-[0.8125rem] font-semibold text-maison">{category}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Avis clients : filtres par catégorie et carrousel au défilement natif
 * (glisser au doigt, flèches, ou clavier une fois la liste sélectionnée).
 */
export function Reviews({ items, examples }: { items: Review[]; examples: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<ReviewCategory | "all">("all");
  const [edges, setEdges] = useState({ start: true, end: false });

  const present = (Object.keys(reviewCategories) as ReviewCategory[]).filter((c) =>
    items.some((review) => review.category === c),
  );
  const shown = filter === "all" ? items : items.filter((review) => review.category === filter);

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setEdges({
      start: list.scrollLeft <= 4,
      end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ left: 0 });
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(list);
    return () => observer.disconnect();
  }, [filter, updateEdges]);

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    const card = list?.querySelector("li");
    if (!list || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * (card.clientWidth + 20), behavior: reduce ? "auto" : "smooth" });
  };

  const arrowClass =
    "grid size-12 place-items-center rounded-full border border-maison/40 text-maison transition-colors hover:bg-maison hover:text-cream disabled:pointer-events-none disabled:opacity-35";

  return (
    <section id="avis" aria-labelledby="avis-title" className="bg-stone py-[4.5rem] text-ink sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[40rem] flex-col gap-5">
            <Eyebrow>Avis clients</Eyebrow>
            <h2 id="avis-title" className="text-h2 text-maison">
              Propriétaires et voyageurs en parlent
              <Period />
            </h2>
            {examples ? (
              <p className="text-small text-ink-soft">
                Exemples de mise en page : les premiers avis de nos propriétaires et voyageurs seront publiés
                ici.
              </p>
            ) : null}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => scroll(-1)} disabled={edges.start} className={arrowClass}>
              <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
              <span className="sr-only">Avis précédent</span>
            </button>
            <button type="button" onClick={() => scroll(1)} disabled={edges.end} className={arrowClass}>
              <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
              <span className="sr-only">Avis suivant</span>
            </button>
          </div>
        </div>

        {present.length > 1 ? (
          <div role="group" aria-label="Filtrer les avis" className="mt-10 flex flex-wrap gap-2">
            {(["all", ...present] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                  "min-h-10 rounded-full border px-4 text-[0.875rem] font-semibold transition-colors",
                  filter === key
                    ? "border-maison bg-maison text-cream"
                    : "border-maison/30 text-maison hover:border-maison",
                )}
              >
                {key === "all" ? "Tous" : reviewCategories[key].plural}
              </button>
            ))}
          </div>
        ) : null}

        <ul
          ref={listRef}
          onScroll={updateEdges}
          tabIndex={0}
          aria-label="Avis clients, faire défiler horizontalement"
          className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {shown.map((review, i) => (
            <li
              key={`${review.name}-${review.category}-${i}`}
              className="shrink-0 basis-[85%] snap-start sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)]"
            >
              <ReviewCard review={review} example={examples} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
