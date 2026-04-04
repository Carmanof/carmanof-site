type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

function getMetricaId() {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}

export function trackEvent(
  eventName: string,
  params: AnalyticsEventParams = {},
) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  const metricaId = getMetricaId();

  if (metricaId && typeof window.ym === "function") {
    window.ym(metricaId, "reachGoal", eventName, params);
  }
}

export function trackPhoneClick(phone?: string) {
  trackEvent("phone_click", {
    phone: phone || "unknown",
  });
}

export function trackMessengerClick(messenger: "telegram" | "whatsapp" | "vk") {
  trackEvent("messenger_click", {
    messenger,
  });
}

export function trackFormSubmit(formName: string) {
  trackEvent("form_submit", {
    form_name: formName,
  });
}

export function trackFormSuccess(formName: string) {
  trackEvent("form_success", {
    form_name: formName,
  });
}

export function trackCtaClick(location: string, label: string) {
  trackEvent("cta_click", {
    location,
    label,
  });
}
