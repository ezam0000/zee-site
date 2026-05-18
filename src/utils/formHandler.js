/**
 * Form submission handler
 * Sends form data to info@modelista.org
 * 
 * For production, consider using:
 * - Formspree (https://formspree.io)
 * - EmailJS (https://www.emailjs.com)
 * - Serverless function (Vercel, Netlify)
 */

export function handleFormSubmission(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name') || form.querySelector('input[type="text"]')?.value || '';
    const email = formData.get('email') || form.querySelector('input[type="email"]')?.value || '';
    const message = formData.get('message') || form.querySelector('textarea')?.value || '';
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    try {
      // Option 1: Use mailto (fallback, opens email client)
      // This is a simple fallback - for production, use a proper service
      const subject = encodeURIComponent(`New Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:info@modelista.org?subject=${subject}&body=${body}`;
      
      // For now, use mailto as a simple solution
      // In production, replace this with a service like Formspree or EmailJS
      window.location.href = mailtoLink;
      
      // Show success message
      setTimeout(() => {
        submitBtn.textContent = 'SENT ✓';
        submitBtn.style.background = '#4CAF50';
        
        // Reset form
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 500);
      
    } catch (error) {
      console.error('Form submission error:', error);
      submitBtn.textContent = 'ERROR - TRY AGAIN';
      submitBtn.disabled = false;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
}

/**
 * Alternative: Use Formspree (recommended for production)
 * Replace the mailto approach with this:
 * 
 * const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name,
 *     email,
 *     message,
 *     _replyto: email,
 *     _subject: `New Inquiry from ${name}`
 *   })
 * });
 * 
 * if (response.ok) {
 *   // Success handling
 * }
 */

