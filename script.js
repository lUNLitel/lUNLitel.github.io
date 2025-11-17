const scrollIndicator = document.querySelector('.scroll-indicator');
const navBar = document.querySelector('.nav-bar');

// Track scroll position for direction detection
let lastScrollY = window.scrollY;
let ticking = false;

// Hide/show scroll indicator based on scroll position
// Hide/show nav bar based on scroll direction
function handleScroll() {
  const currentScrollY = window.scrollY;

  // Handle scroll indicator
  if (scrollIndicator) {
    if (currentScrollY > 100) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  }

  // Handle nav bar visibility based on scroll direction
  if (navBar) {
    // Always show at the very top
    if (currentScrollY < 10) {
      navBar.classList.remove('hidden');
      navBar.classList.add('visible');
    }
    // Scrolling down - hide
    else if (currentScrollY > lastScrollY && currentScrollY > 50) {
      navBar.classList.add('hidden');
      navBar.classList.remove('visible');
    }
    // Scrolling up - show
    else if (currentScrollY < lastScrollY) {
      navBar.classList.remove('hidden');
      navBar.classList.add('visible');
    }
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

// Optimize scroll event with requestAnimationFrame for smooth performance
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

// Initialize nav bar as visible on page load
if (navBar) {
  navBar.classList.add('visible');
}

// ========== PROJECT NAVIGATION ==========
// Dynamically add previous/next project navigation based on index.html order

async function initProjectNavigation() {
  // Only run on project pages (pages in the projects/ directory)
  const currentPath = window.location.pathname;
  const currentHref = window.location.href;
  
  // Check if we're on a project page
  const isProjectPage = currentPath.includes('/projects/') && 
                        currentPath !== '/projects/' &&
                        currentPath.endsWith('.html');
  
  if (!isProjectPage) {
    return;
  }

  try {
    // Fetch index.html to get project order
    // Determine the correct path based on current location
    let indexPath;
    if (currentPath.startsWith('/')) {
      // Absolute path (e.g., /projects/dreamAway.html)
      indexPath = '/index.html';
    } else {
      // Relative path (e.g., projects/dreamAway.html)
      indexPath = '../index.html';
    }
    
    const response = await fetch(indexPath);
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract all project links in order
    const projectLinks = Array.from(doc.querySelectorAll('#projects .project-link'));
    const projects = projectLinks.map(link => {
      const href = link.getAttribute('href');
      const title = link.querySelector('.project-title')?.textContent || '';
      return { href, title };
    });

    if (projects.length === 0) {
      return;
    }

    // Get current project filename (handle both absolute and relative paths)
    const currentFile = currentPath.split('/').pop() || currentHref.split('/').pop();
    const currentIndex = projects.findIndex(p => {
      // Match by filename (handles both relative and absolute paths)
      const projectFile = p.href.split('/').pop();
      return projectFile === currentFile || p.href.includes(currentFile);
    });

    if (currentIndex === -1) {
      return;
    }

    // Find previous and next projects
    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

    // Normalize project hrefs to work from project pages
    // Links in index.html are relative to root (e.g., "projects/autorig.html")
    // From a project page, we need to adjust them
    const normalizeHref = (href) => {
      // If href already starts with ../ or /, use as-is
      if (href.startsWith('../') || href.startsWith('/')) {
        return href;
      }
      // If href is like "projects/file.html", make it relative to current page
      if (href.startsWith('projects/')) {
        // From projects/dreamAway.html, "projects/autorig.html" should be "./autorig.html"
        const filename = href.replace('projects/', '');
        return filename;
      }
      return href;
    };

    // Create navigation HTML
    const navHTML = `
      <div class="project-navigation">
        ${prevProject 
          ? `<a href="${normalizeHref(prevProject.href)}" class="nav-link nav-link-prev">
               <span class="nav-arrow">←</span>
               <span class="nav-text">
                 <span class="nav-label">Previous</span>
                 <span class="nav-title">${prevProject.title}</span>
               </span>
             </a>`
          : '<div class="nav-link nav-link-prev nav-link-empty"></div>'
        }
        ${nextProject 
          ? `<a href="${normalizeHref(nextProject.href)}" class="nav-link nav-link-next">
               <span class="nav-text">
                 <span class="nav-label">Next</span>
                 <span class="nav-title">${nextProject.title}</span>
               </span>
               <span class="nav-arrow">→</span>
             </a>`
          : '<div class="nav-link nav-link-next nav-link-empty"></div>'
        }
      </div>
    `;

    // Insert navigation at the end of main, before closing tag
    const main = document.querySelector('main');
    if (main) {
      main.insertAdjacentHTML('beforeend', navHTML);
    }
  } catch (error) {
    console.error('Error initializing project navigation:', error);
  }
}

// Initialize project navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectNavigation);
} else {
  initProjectNavigation();
}