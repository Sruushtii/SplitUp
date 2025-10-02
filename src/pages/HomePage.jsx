// Main landing page with hero section and testimonials
import React from 'react';
import HeroSection from "../components/HeroSection";
import Marquee from "../components/Marquee";

function HomePage() {
    return (
        <>
            {/* Show the main hero section */}
            <HeroSection />
            {/* Show the testimonials carousel */}
            <Marquee />
        </>
    )
}
//heelo
export default HomePage; 