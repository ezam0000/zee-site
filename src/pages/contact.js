import { initHotjar } from "../analytics/hotjar.js";
import { events } from "../analytics/events.js";
import { handleFormSubmission } from "../utils/formHandler.js";

export default function initContact() {
  const form = document.querySelector("form");
  if (form) {
    handleFormSubmission(form, {
      onSubmit: () => events.trackCTAClick("contact_form"),
    });
  }

  initHotjar();
}

initContact();
