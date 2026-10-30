"use client";

import { useEffect, useLayoutEffect, useRef, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenisRef = useRef<Lenis | null>(null);
  const previousRouteRef = useRef<string | null>(null);
  const isHistoryNavigationRef = useRef(false);
  const saveFrameRef = useRef<number | null>(null);
  const queryString = searchParams.toString();
  const routeKey = queryString ? `${pathname}?${queryString}` : pathname;

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const currentRouteKey = () => `${window.location.pathname}${window.location.search}`;

    const saveScrollPosition = (key = currentRouteKey()) => {
      try {
        const scrollY = lenisRef.current?.scroll ?? window.scrollY;
        window.sessionStorage.setItem(`scroll-position:${key}`, String(Math.round(scrollY)));
      } catch {
        // Scroll restoration is an enhancement; it must not block navigation if storage is unavailable.
      }
    };

    const saveCurrentScrollPosition = () => saveScrollPosition();

    const scheduleSave = () => {
      if (saveFrameRef.current !== null) return;

      saveFrameRef.current = window.requestAnimationFrame(() => {
        saveFrameRef.current = null;
        saveCurrentScrollPosition();
      });
    };

    const onHistoryNavigation = () => {
      // popstate updates window.location before this event. Save the page we are
      // leaving under its previous key so the destination's saved position stays intact.
      saveScrollPosition(previousRouteRef.current ?? currentRouteKey());
      isHistoryNavigationRef.current = true;
    };

    // Next.js owns SPA navigation, so the browser's automatic restoration can race it.
    // This provider becomes the one owner of restoration for Back and Forward navigation.
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    window.addEventListener("scroll", scheduleSave, { passive: true });
    window.addEventListener("pointerdown", saveCurrentScrollPosition, { capture: true });
    window.addEventListener("click", saveCurrentScrollPosition, { capture: true });
    window.addEventListener("pagehide", saveCurrentScrollPosition);
    window.addEventListener("popstate", onHistoryNavigation);

    return () => {
      if (saveFrameRef.current !== null) {
        window.cancelAnimationFrame(saveFrameRef.current);
      }
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("scroll", scheduleSave);
      window.removeEventListener("pointerdown", saveCurrentScrollPosition, { capture: true });
      window.removeEventListener("click", saveCurrentScrollPosition, { capture: true });
      window.removeEventListener("pagehide", saveCurrentScrollPosition);
      window.removeEventListener("popstate", onHistoryNavigation);
    };
  }, []);

  useLayoutEffect(() => {
    // Do not disturb the very first render (including a browser refresh).
    if (previousRouteRef.current === null) {
      previousRouteRef.current = routeKey;
      return;
    }

    // React Strict Mode can replay an effect without a route change.
    if (previousRouteRef.current === routeKey) return;
    previousRouteRef.current = routeKey;

    const shouldRestore = isHistoryNavigationRef.current;
    isHistoryNavigationRef.current = false;
    let savedPosition = 0;

    if (shouldRestore) {
      try {
        savedPosition = Number(
          window.sessionStorage.getItem(`scroll-position:${routeKey}`) ?? 0,
        );
      } catch {
        savedPosition = 0;
      }
    }

    const moveToExpectedPosition = () => {
      const target = Number.isFinite(savedPosition) ? savedPosition : 0;
      const lenis = lenisRef.current;

      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        window.scrollTo(0, target);
      }
    };

    // A second frame runs after Next has committed the destination page and prevents its
    // own route-scroll work from winning the race with Lenis.
    moveToExpectedPosition();
    const frame = window.requestAnimationFrame(moveToExpectedPosition);

    return () => window.cancelAnimationFrame(frame);
  }, [routeKey]);

  return <>{children}</>;
}
