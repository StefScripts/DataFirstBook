// // This script mimics the PHP site's JavaScript functionality

// // Initialize AOS (Animate on Scroll)
// export function initializeAOS() {
//   if (typeof window !== 'undefined') {
//     import('aos').then((AOS) => {
//       AOS.init({
//         duration: 800,
//         easing: 'ease-in-out',
//         once: true,
//         startEvent: 'DOMContentLoaded'
//       });
//     });
//   }
// }

// // Mobile menu toggle
// export function setupMobileMenu() {
//   if (typeof window !== 'undefined') {
//     const mobileMenuButton = document.getElementById('mobile-menu-button');
//     const mobileMenu = document.getElementById('mobile-menu');

//     if (mobileMenuButton && mobileMenu) {
//       mobileMenuButton.addEventListener('click', () => {
//         mobileMenu.classList.toggle('hidden');
//       });
//     }
//   }
// }

// // Navbar scroll effect
// export function setupNavbarScroll() {
//   if (typeof window !== 'undefined') {
//     const navbar = document.getElementById('navbar');

//     if (navbar) {
//       // Initial check on page load
//       if (window.scrollY > 50) {
//         navbar.classList.add('nav-scrolled');
//       }

//       window.addEventListener('scroll', () => {
//         if (window.scrollY > 50) {
//           navbar.classList.add('nav-scrolled');
//         } else {
//           navbar.classList.remove('nav-scrolled');
//         }
//       });
//     }
//   }
// }

// // Smooth scroll for anchor links
// export function setupSmoothScroll() {
//   if (typeof window !== 'undefined') {
//     document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//       anchor.addEventListener('click', function (e) {
//         const targetId = this.getAttribute('href');

//         // Only proceed if the target element exists
//         const targetElement = document.querySelector(targetId);
//         if (targetElement) {
//           e.preventDefault();

//           targetElement.scrollIntoView({
//             behavior: 'smooth'
//           });

//           // Close mobile menu if open
//           const mobileMenu = document.getElementById('mobile-menu');
//           if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
//             mobileMenu.classList.add('hidden');
//           }
//         }
//       });
//     });
//   }
// }

// // Initialize all scripts
// export function initializePhpScripts() {
//   initializeAOS();
//   setupMobileMenu();
//   setupNavbarScroll();
//   setupSmoothScroll();
// }

// // Export default for direct import
// export default initializePhpScripts;
