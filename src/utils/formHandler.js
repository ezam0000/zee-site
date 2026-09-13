/**
 * Contact form → mailto:hello@zee-studio.com
 * Opens the visitor's email client with the form fields filled in.
 */

const CONTACT_EMAIL = "hello@zee-studio.com";

export function handleFormSubmission(form, { onSubmit } = {}) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (typeof onSubmit === "function") {
      onSubmit({ name, email, message });
    }

    const subject = encodeURIComponent(
      name ? `Inquiry from ${name}` : "Website inquiry"
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}
