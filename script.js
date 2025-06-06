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
  
      // Add the three-dot bouncing animation to the typing indicator
      typingIndicator.innerHTML = `
        <div class="three-dots-bouncing">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      `;
      typingIndicator.classList.remove('hidden');
  
      // Add CSS for three-dots-bouncing animation if not already added
      if (!document.getElementById('dot-animation-style')) {
        const style = document.createElement('style');
        style.id = 'dot-animation-style';
        style.innerHTML = `
          .three-dots-bouncing {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            padding: 10px;
          }
          
          .three-dots-bouncing .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--primary, #1E8449);
            animation: bounce 1.4s infinite ease-in-out both;
          }
          
          .three-dots-bouncing .dot:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .three-dots-bouncing .dot:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .dark-mode .three-dots-bouncing .dot {
            background-color: var(--accent, #F39C12);
          }
        `;
        document.head.appendChild(style);
      }
  
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
  
      // Send user message to server
      fetch('https://crop-chatbot-millet.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
      })
      .then(response => response.json())
      .then(data => {
        // Hide typing indicator
        typingIndicator.classList.add('hidden');
  
        // Add AI response
        chatMessages.innerHTML += `
          <div class="flex items-start mb-6">
            <div class="flex-shrink-0 bg-gradient-to-r from-primary to-darkgreen text-white rounded-full h-12 w-12 flex items-center justify-center shadow-md">
              <i class="fas fa-robot"></i>
            </div>
            <div class="ml-3 bg-white dark:bg-gray-600 rounded-xl p-4 max-w-xs shadow-md">
              <p class="text-gray-700 dark:text-white">${data.response}</p>
            </div>
          </div>
        `;
  
        // Scroll to bottom again
        chatMessages.scrollTop = chatMessages.scrollHeight;
      })
      .catch(error => {
        console.error('Error:', error);
        // Hide typing indicator on error too
        typingIndicator.classList.add('hidden');
      });
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