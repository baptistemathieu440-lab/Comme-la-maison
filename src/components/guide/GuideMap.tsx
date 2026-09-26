"use client";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, List } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";

import { cn } from "@/lib/cn";
import { placeHref } from "@/lib/guide/place";
import type { PlaceSummary } from "@/lib/guide/summary";
import { budgets, kindKeys, kinds, type Kind } from "@/lib/guide/taxonomy";

const BORDEAUX: [number, number] = [44.8412, -0.5725];

/** Fond de carte : OpenStreetMap (gratuit, attribution obligatoire). Remplaçable par une variable d'environnement. */
const TILES_URL = process.env.NEXT_PUBLIC_MAP_TILES_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILES_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">contributeurs OpenStreetMap</a>';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function popupHtml(place: PlaceSummary) {
  const category = escapeHtml(place.subcategory ?? kinds[place.kind].label);
  const rating =
    place.rating !== null && place.ratingSource
      ? `<span>★ ${place.rating.toFixed(1).replace(".", ",")} <span style="color:var(--color-ink-soft)">(${escapeHtml(place.ratingSource)})</span></span>`
      : "";
  return `
    <div class="guide-popup">
      <p class="guide-popup__category">${category}</p>
      <p class="guide-popup__name">${escapeHtml(place.name)}</p>
      <p class="guide-popup__meta"><span class="guide-popup__budget">${escapeHtml(budgets[place.budget].symbol)}</span>${rating}</p>
      <a class="guide-popup__link" href="${placeHref(place.slug)}">Découvrir</a>
    </div>`;
}

/**
 * Carte des adresses. Leaflet n'est chargé que sur cette page, après l'affichage :
 * le reste du guide reste léger.
 */
export function GuideMap({ places }: { places: PlaceSummary[] }) {
  const params = useSearchParams();
  const focus = params.get("lieu");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Kind[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const located = useMemo(() => places.filter((place) => place.lat !== null && place.lng !== null), [places]);
  const visible = useMemo(
    () =>
      located.filter(
        (place) => (selected.length === 0 || selected.includes(place.kind)) && (!favoritesOnly || place.isFavorite),
      ),
    [located, selected, favoritesOnly],
  );
  const presentKinds = useMemo(() => kindKeys.filter((kind) => located.some((place) => place.kind === kind)), [located]);

  // Création de la carte (une seule fois).
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;
      const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true }).setView(BORDEAUX, 14);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer(TILES_URL, { attribution: TILES_ATTRIBUTION, maxZoom: 19, detectRetina: true }).addTo(map);
      map.attributionControl.setPrefix(false);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Marqueurs selon les filtres.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;
    layer.clearLayers();
    const markers = new Map<string, Marker>();
    for (const place of visible) {
      const icon = L.divIcon({
        className: "guide-marker-wrap",
        html: `<span class="guide-marker${place.isFavorite ? " guide-marker--favorite" : ""}"></span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -12],
      });
      const marker = L.marker([place.lat as number, place.lng as number], { icon, title: place.name, alt: place.name, keyboard: true })
        .bindPopup(popupHtml(place), { closeButton: true, minWidth: 220, maxWidth: 260, autoPanPaddingTopLeft: [16, 140], autoPanPaddingBottomRight: [16, 96] })
        .addTo(layer);
      markers.set(place.slug, marker);
    }
    const target = focus ? markers.get(focus) : undefined;
    if (target) {
      map.setView(target.getLatLng(), 16, { animate: false });
      // Décale la vue pour que la bulle ne passe pas sous les filtres.
      map.panBy([0, -110], { animate: false });
      target.openPopup();
    } else if (selected.length > 0 || favoritesOnly) {
      const bounds = L.latLngBounds(visible.map((place) => [place.lat as number, place.lng as number] as [number, number]));
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    }
  }, [ready, visible, focus, selected.length, favoritesOnly]);

  return (
    <div className="relative h-[calc(100dvh-4rem-4rem-env(safe-area-inset-bottom))] min-h-[26rem] w-full lg:h-[calc(100dvh-5rem)]">
      <div ref={containerRef} className="absolute inset-0 z-0 bg-stone" aria-label="Carte des adresses du guide" role="region" />
      {!ready ? (
        <p className="absolute inset-0 grid place-items-center text-ink-soft" role="status">
          Chargement de la carte…
        </p>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-col gap-2 p-3">
        <div className="pointer-events-auto -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none]">
          <button
            type="button"
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((value) => !value)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-semibold shadow-float",
              favoritesOnly ? "bg-terra-text text-white" : "bg-surface text-ink",
            )}
          >
            <Heart aria-hidden="true" className={cn("size-4", favoritesOnly && "fill-white")} />
            Coups de cœur
          </button>
          {presentKinds.map((kind) => {
            const pressed = selected.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                aria-pressed={pressed}
                onClick={() => setSelected((values) => (pressed ? values.filter((value) => value !== kind) : [...values, kind]))}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-[0.9375rem] font-semibold shadow-float",
                  pressed ? "bg-maison text-cream" : "bg-surface text-ink",
                )}
              >
                {kinds[kind].plural}
              </button>
            );
          })}
        </div>
        <p className="pointer-events-auto self-start rounded-full bg-surface/95 px-3 py-1.5 text-[0.8125rem] font-semibold text-ink shadow-float" role="status">
          {visible.length} adresse{visible.length > 1 ? "s" : ""} sur la carte
        </p>
      </div>

      <Link
        href="/guide/explorer"
        className="absolute bottom-4 left-3 z-[500] inline-flex min-h-11 items-center gap-2 rounded-full bg-maison px-4 text-[0.9375rem] font-semibold text-cream shadow-float"
      >
        <List aria-hidden="true" className="size-4" />
        Voir en liste
      </Link>
    </div>
  );
}
