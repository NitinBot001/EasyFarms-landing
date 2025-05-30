// Page Loader
document.addEventListener('DOMContentLoaded', function() {
  // Hide loader after page loads
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 1500);
  
  // Initialize scroll animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const revealTop = element.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  }
  
  // Initial check
  checkReveal();
  
  // Add scroll event listener
  window.addEventListener('scroll', checkReveal);
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or use device preference
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply saved theme
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
  }
  
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    
    // Save preference
    const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  });
  
  // Chat button functionality
  const chatButton = document.getElementById('chat-btn');
  const chatPopup = document.getElementById('chat-popup');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendMessage = document.getElementById('send-message');
  const typingIndicator = document.getElementById('typing-indicator');
  
  chatButton.addEventListener('click', () => {
    chatPopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  });
  
  closeChat.addEventListener('click', () => {
    chatPopup.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
  });
  
  function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Add user message
      const chatMessages = document.querySelector('#chat-popup .bg-gray-50');
      chatMessages.innerHTML += `
        <div class="flex items-start justify-end mb-6">
          <div class="mr-3 bg-accent/10 dark:bg-accent/20 rounded-xl p-4 max-w-xs shadow-md">
            <p class="text-gray-700 dark:text-white">${message}</p>
          </div>
          <div class="flex-shrink-0 bg-accent text-white rounded-full h-12 w-12 flex items-center justify-center shadow-md">
            <i class="fas fa-user"></i>
          </div>
        </div>
      `;
      
      // Clear input
      chatInput.value = '';
      
      // Show typing indicator
      typingIndicator.classList.remove('hidden');
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Simulate AI response after delay
      setTimeout(() => {
        typingIndicator.classList.add('hidden');
        
        // Add AI response
        const responses = [
          "I've analyzed your farm data and noticed your corn crop might benefit from additional nitrogen. Would you like specific recommendations?",
          "Based on the weather forecast for your area, I'd recommend delaying irrigation until Thursday to avoid water runoff during the expected rainfall.",
          "Your soil analysis indicates optimal conditions for planting winter wheat next month. Would you like me to prepare a planting schedule?",
          "I've detected a potential early sign of fungal infection in your recent crop images. Let me suggest some preventative measures you can take."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        chatMessages.innerHTML += `
          <div class="flex items-start mb-6">
            <div class="flex-shrink-0 bg-gradient-to-r from-primary to-darkgreen text-white rounded-full h-12 w-12 flex items-center justify-center shadow-md">
              <i class="fas fa-robot"></i>
            </div>
            <div class="ml-3 bg-white dark:bg-gray-600 rounded-xl p-4 max-w-xs shadow-md">
              <p class="text-gray-700 dark:text-white">${randomResponse}</p>
            </div>
          </div>
        `;
        
        // Scroll to bottom again
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1500);
    }
  }
  
  sendMessage.addEventListener('click', sendChatMessage);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if(targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if(targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Development popup handling
document.addEventListener('DOMContentLoaded', function() {
  // Check if this is the first visit
  if (!localStorage.getItem('devPopupShown')) {
    setTimeout(function() {
      document.getElementById('development-popup').style.display = 'block';
      // Mark as shown
      localStorage.setItem('notFirstVisit', 'true');
    }, 2000);
  }
  
  // Close button functionality
  document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('development-popup').style.display = 'none';
  });
});