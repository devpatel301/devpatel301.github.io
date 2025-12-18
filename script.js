document.addEventListener('DOMContentLoaded', function() {
    // Event tracking function to capture all clicks and views
    function trackUserInteractions() {
        // Track page view on load
        console.log(`${new Date().toISOString()}, view, page_loaded`);
        
        // Track all click events using event delegation
        document.addEventListener('click', function(event) {
            const target = event.target;
            let elementType = target.tagName.toLowerCase();
            let elementDescription = '';
            
            // Determine more specific element type and description
            if (target.tagName === 'IMG') {
                elementDescription = `image:${target.alt || 'unnamed-image'}`;
            } else if (target.tagName === 'A') {
                elementDescription = `link:${target.textContent.trim() || target.href}`;
            } else if (target.tagName === 'BUTTON') {
                elementDescription = `button:${target.textContent.trim() || 'unnamed-button'}`;
            } else if (target.classList.contains('nav-link')) {
                elementDescription = `nav-item:${target.textContent.trim()}`;
            } else if (target.classList.contains('project-card')) {
                elementDescription = `project-card:${target.querySelector('h3')?.textContent || 'unnamed-project'}`;
            } else if (target.classList.contains('skill-card')) {
                elementDescription = `skill-card:${target.querySelector('p')?.textContent || 'unnamed-skill'}`;
            } else if (target.closest('.social-link')) {
                const socialLink = target.closest('.social-link');
                elementDescription = `social-link:${socialLink.textContent.trim() || 'unnamed-social-link'}`;
            } else {
                // For any other element, try to get some identifying information
                elementDescription = target.id ? `${elementType}:${target.id}` : 
                                     target.className ? `${elementType}:${target.className}` : 
                                     target.textContent ? `${elementType}:${target.textContent.trim().substring(0, 20)}` : 
                                     `${elementType}`;
            }
            
            console.log(`${new Date().toISOString()}, click, ${elementDescription}`);
        });
        
        // Track all view events when elements enter viewport
        const observableElements = document.querySelectorAll('section, .project-card, .skill-card, .education-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    let elementType = target.tagName.toLowerCase();
                    let elementDescription = '';
                    
                    if (target.id) {
                        elementDescription = `section:${target.id}`;
                    } else if (target.classList.contains('project-card')) {
                        elementDescription = `project-card:${target.querySelector('h3')?.textContent || 'unnamed-project'}`;
                    } else if (target.classList.contains('skill-card')) {
                        elementDescription = `skill-card:${target.querySelector('p')?.textContent || 'unnamed-skill'}`;
                    } else if (target.classList.contains('education-card')) {
                        elementDescription = `education-card`;
                    } else {
                        elementDescription = target.className ? `${elementType}:${target.className}` : elementType;
                    }
                    
                    console.log(`${new Date().toISOString()}, view, ${elementDescription}`);
                }
            });
        }, { threshold: 0.5 });
        
        observableElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize tracking
    trackUserInteractions();
    
    // Mobile hamburger menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }
    
    // Navigation active state
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function getCurrentSection() {
        let current = '';
        let scrollPosition = window.scrollY + window.innerHeight/2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Special case for the last section (Text Analyzer)
        const lastSection = sections[sections.length - 1];
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // If we're near the bottom of the page, highlight the last section
        if (window.scrollY + windowHeight > documentHeight - 50) {
            current = lastSection.getAttribute('id');
        }
        
        return current;
    }
    
    
    function updateNavigation() {
        const currentSection = getCurrentSection();
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Project card tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 5;
            const yPercent = (y / rect.height - 0.5) * 5;
            
            card.style.transform = `perspective(1000px) rotateY(${xPercent}deg) rotateX(${-yPercent}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
    
    // Text analyzer functionality
    const textInput = document.getElementById('text-input');
    const analyzeButton = document.getElementById('analyze-button');
    const resultsGrid = document.getElementById('analysis-results');
    
    analyzeButton.addEventListener('click', function() {
        // Validate input
        if (!textInput.value.trim()) {
            alert('Please enter some text to analyze');
            return;
        }
        
        const text = textInput.value;
        
        // Word lists
        const pronouns = [
            'i', 'me', 'my', 'mine', 'myself', 
            'you', 'your', 'yours', 'yourself', 
            'he', 'him', 'his', 'himself', 
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            'this', 'that', 'these', 'those',
            'who', 'whom', 'whose', 'which', 'what'
        ];
        
        const prepositions = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
            'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
            'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during',
            'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
            'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
            'round', 'since', 'through', 'throughout', 'to', 'toward', 'under',
            'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        const articles = ['a', 'an', 'the'];
        
        // Analysis calculations
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const words = text.trim().split(/\s+/).length;
        const spaces = (text.match(/\s/g) || []).length;
        const newlines = (text.match(/\n/g) || []).length;
        const specialSymbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
        
        // Tokenize text for word analysis
        const tokenizedText = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
        
        // Count specific word types
        const pronounCount = tokenizedText.filter(word => pronouns.includes(word)).length;
        const prepositionCount = tokenizedText.filter(word => prepositions.includes(word)).length;
        const articleCount = tokenizedText.filter(word => articles.includes(word)).length;
        
        // Update result boxes
        document.getElementById('letters-count').textContent = `Letters: ${letters}`;
        document.getElementById('words-count').textContent = `Words: ${words}`;
        document.getElementById('spaces-count').textContent = `Spaces: ${spaces}`;
        document.getElementById('newlines-count').textContent = `Newlines: ${newlines}`;
        document.getElementById('special-symbols-count').textContent = `Special Symbols: ${specialSymbols}`;
        document.getElementById('pronouns-count').textContent = `Pronouns: ${pronounCount}`;
        document.getElementById('prepositions-count').textContent = `Prepositions: ${prepositionCount}`;
        document.getElementById('articles-count').textContent = `Articles: ${articleCount}`;
        
        // Show results with animation
        resultsGrid.classList.add('active');
        
        // Log analyze event
        console.log(`${new Date().toISOString()}, analyze, text-analyzer:${words} words analyzed`);
    });
    
    // Add scroll event listener for navigation updates
    window.addEventListener('scroll', updateNavigation);
    
    // Trigger initial navigation update
    updateNavigation();
});
