// =========================
// File: HomePage.jsx
//
// SUMMARY:
// This is the main landing page component for SplitUp. It serves as the entry point for new visitors
// and combines the hero section with testimonials to create a compelling first impression that
// communicates the value proposition and builds trust through social proof.
//
// WHAT IT DOES:
// - Renders the main hero section with value proposition and CTAs
// - Displays customer testimonials in a scrolling carousel
// - Provides the primary conversion path for new users
// - Creates an engaging and trustworthy first impression
//
// WHY IT'S IMPORTANT:
// - First page most visitors see - critical for conversions
// - Needs to quickly communicate value and build trust
// - Primary driver of user acquisition and engagement
// - Sets the tone for the entire user experience
//
// HOW IT WORKS:
// - Combines two main components: HeroSection and Marquee
// - HeroSection handles value proposition and user education
// - Marquee provides social proof through customer testimonials
// - Both components are fully responsive and optimized for conversion
// =========================

// Import React for component creation
import React from 'react';
// Import the hero section component (main value proposition)
import HeroSection from "../components/HeroSection";
// Import the testimonials carousel component (social proof)
import Marquee from "../components/Marquee";

function HomePage() {
    return (
        <>
            {/* Hero Section: Main value proposition, CTAs, and "How it Works" explanation */}
            <HeroSection />
            
            {/* Testimonials Section: Customer reviews in animated carousel for social proof */}
            <Marquee />
        </>
    )
}

export default HomePage; 