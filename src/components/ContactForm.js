export function renderContactForm() {
    const section = document.createElement('section');
    section.className = 'contact-sec';
    
    section.innerHTML = `
        <div class="contact-layout">
            <div>
                <div class="sec-label" style="border-color: rgba(255,255,255,0.2);">INQUIRIES</div>
                <h2 class="contact-head">Let's build<br>something<br>measurable.</h2>
            </div>
            <form class="contact-form" id="contact-form">
                <input type="text" name="name" placeholder="Name" required>
                <input type="email" name="email" placeholder="Email" required>
                <textarea name="message" rows="4" placeholder="Tell us about your KPIs" required></textarea>
                <button type="submit" class="submit-btn">SEND</button>
            </form>
        </div>
    `;
    
    return section;
}

