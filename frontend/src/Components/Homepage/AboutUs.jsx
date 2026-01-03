import { useEffect } from "react";
import AOS from "aos";
import { Leaf, PiggyBank, ShieldCheck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
export default function AboutUs() {
  const navigate = useNavigate();
  // ✅ Initialize AOS once
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (1s)
      once: true,     // run animation only once
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-10 md:px-20 pt-45">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-26 items-center ">
        
        {/* Left Image */}
        <div className="relative" data-aos="fade-right">
          <div className="overflow-hidden rounded-3xl shadow-xl h-[400px]">
            <img
              src="/bg.jpg"
              alt="Eco-friendly car"
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Green vertical line with dots */}
          <div className="absolute -left-6 top-10 bottom-10 flex flex-col items-center space-y-2">
            <div className="w-1 bg-cyan-600 h-30 rounded-full"></div>
            <div className="h-1 w-1 bg-cyan-600 rounded-full"></div>
            <div className="h-1 w-1 bg-cyan-600 rounded-full"></div>
            <div className="h-1 w-1 bg-cyan-600 rounded-full"></div>
          </div>
        </div>

        {/* Right Content */}
        <div data-aos="fade-left">
          {/* Section Title */}
          <div
            className="text-cyan-700 font-semibold flex items-center gap-2 mb-2"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Leaf className="w-5 h-5" />
            <span>ABOUT SARANGXANH</span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight mb-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Environmental Sustainable <br /> Forever Green Future
          </h2>

          {/* Economic Benefits */}
          <div
            className="flex items-start gap-4 mb-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <PiggyBank className="text-cyan-600 w-7 h-7 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-blue-800">
                Economic Benefits
              </h3>
              <p className="text-blue-700/80 mt-1">
                Alternative innovation after ethical to network environmental
                whiteboard transparent growth natural done.
              </p>
            </div>
          </div>

          {/* Safe Environment */}
          <div
            className="flex items-start gap-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <ShieldCheck className="text-cyan-600 w-7 h-7 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-blue-800">
                Safe Environment
              </h3>
              <p className="text-blue-700/80 mt-1">
                Alternative innovation after ethical to network environmental
                whiteboard transparent growth natural done.
              </p>
            </div>
          </div>

          {/* Button */}
          <button
           onClick={() => navigate('/about')}
            className="mt-10 w-fit px-6 py-3 rounded-xl text-white font-medium bg-cyan-600 hover:bg-cyan-700 transition shadow-md hover:shadow-lg flex gap-2 items-center"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            About Us <Leaf className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
