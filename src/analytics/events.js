export const events = {
  track(eventName, data = {}) {
    // Custom event tracking
    if (window.hj) {
      window.hj("event", eventName);
    }

    // Also log for debugging
    if (window.location.hostname === "localhost") {
      console.log("Event:", eventName, data);
    }
  },

  trackMetricView(metricLabel) {
    this.track("metric_view", { label: metricLabel });
  },

  trackMetricClick(metricLabel) {
    this.track("metric_click", { label: metricLabel });
  },

  trackCaseHover(caseSlug) {
    this.track("case_hover", { slug: caseSlug });
  },

  trackCaseView(caseSlug, scrollPercent) {
    this.track("case_view", { slug: caseSlug, scroll: scrollPercent });
  },

  trackPlaygroundOpen() {
    this.track("playground_open");
  },

  trackPlaygroundInteraction(action) {
    this.track("playground_interaction", { action });
  },

  trackCTAClick(ctaType) {
    this.track("cta_click", { type: ctaType });
  },
};

