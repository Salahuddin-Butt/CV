// Contact Form Handler
class ContactFormHandler {
  constructor() {
    this.form = document.querySelector('[data-form]');
    this.submitBtn = document.querySelector('[data-form-btn]');
    this.inputs = document.querySelectorAll('[data-form-input]');
    
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
  }

  setupFormValidation() {
    // Enable/disable submit button based on form validity
    this.inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.validateForm();
      });
    });
  }

  validateForm() {
    let isValid = true;
    
    this.inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    // Email validation
    const emailInput = this.form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        isValid = false;
      }
    }

    this.submitBtn.disabled = !isValid;
    return isValid;
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm()) {
        return;
      }

      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      try {
        await this.submitForm(data);
        this.showSuccessMessage();
        this.resetForm();
      } catch (error) {
        this.showErrorMessage();
        console.error('Form submission error:', error);
      }
    });
  }

  async submitForm(data) {
    // For now, we'll use a simple approach
    // In production, you'd want to send this to your backend
    
    // Option 1: Send to your email using mailto
    const mailtoLink = `mailto:${this.getConfigEmail()}?subject=CV Contact from ${data.fullname}&body=Name: ${data.fullname}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMessage:%0D%0A${data.message}`;
    
    // Option 2: Log to console (for development)
    console.log('Form submitted:', data);
    
    // Option 3: Send to a service like Formspree or Netlify Forms
    // You can uncomment and configure this:
    /*
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Form submission failed');
    }
    */
    
    // For now, we'll use the mailto approach
    window.open(mailtoLink);
  }

  getConfigEmail() {
    // Try to get email from config, fallback to a default
    try {
      // You can modify this to read from your config
      return 'salahuddinnasirbutt@gmail.com';
    } catch {
      return 'your-email@example.com';
    }
  }

  showSuccessMessage() {
    this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
  }

  showErrorMessage() {
    this.showMessage('Failed to send message. Please try again or contact me directly.', 'error');
  }

  showMessage(text, type) {
    // Create and show a temporary message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = text;
    
    // Style the message
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;

    // Add animation CSS
    if (!document.querySelector('#message-styles')) {
      const style = document.createElement('style');
      style.id = 'message-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  resetForm() {
    this.form.reset();
    this.submitBtn.disabled = true;
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormHandler();
});
