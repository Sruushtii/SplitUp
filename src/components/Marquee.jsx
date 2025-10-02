// Testimonials carousel with scrolling animation
import React from 'react';

// Testimonials data
const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'VIT Pune, B.Tech CSE Student',
    quote: "We split Netflix and Spotify in our hostel wing. No more awkward reminders for money—just a quick payment and done. Makes life so much easier!",
    avatarGradient: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Rohan Mehta',
    college: 'COEP Pune, 3rd Year IT',
    quote: "Honestly, I used to skip premium apps because of the cost. Now, I just pay my share and get everything. It's actually affordable for students.",
    avatarGradient: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Aditi Verma',
    college: 'PICT Pune, ECE Student',
    quote: "We share Hotstar and Prime in our flat. The payments are sorted automatically, and I never have to chase anyone. It just works, and the reminders are super helpful.",
    avatarGradient: 'from-green-400 to-cyan-500',
  },
  {
    name: 'Siddharth Singh',
    college: 'IIT Bombay, M.Tech',
    quote: "Was a bit skeptical about security, but Splitup feels safe. The UI is simple and it's perfect for our group. No more Excel sheets!",
    avatarGradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Sneha Patil',
    college: 'MIT Pune, 2nd Year Student',
    quote: "I can finally use all the streaming apps without burning a hole in my pocket. Best thing for students who want to save and still enjoy everything!",
    avatarGradient: 'from-violet-500 to-purple-600',
  }
];

// Duplicate testimonials for a seamless loop (marquee effect)
const extendedTestimonials = [...testimonials, ...testimonials];

// Custom CSS for the marquee animation
const marqueeStyle = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}
`;

function Marquee() {
  return (
    <section id="testimonials" className="w-full bg-white py-20 sm:py-24">
      {/* Inject custom CSS for marquee animation */}
      <style>{marqueeStyle}</style>
      <div className="max-w-6xl mx-auto text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by Thousands of Users</h2>
        <p className="text-lg text-slate-600 mt-3">Read what our members are saying about their experience.</p>
      </div>
      <div className="w-full overflow-hidden relative">
        {/* Marquee track: horizontally scrolling testimonials */}
        <div className="marquee-track">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-[80vw] sm:w-[24rem] mx-3 sm:mx-4 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-start shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                {/* Avatar with gradient background */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex-shrink-0`} />
                <div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs sm:text-sm">{testimonial.college}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">{testimonial.quote}</p>
            </div>
          ))}
        </div>
        {/* Left and right gradient overlays for fade effect */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}

export default Marquee; 