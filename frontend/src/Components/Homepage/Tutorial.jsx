import { useEffect } from "react";
import AOS from "aos";
import { Globe, Recycle, TreePine, ArrowRightLeft } from "lucide-react";

export default function Tutorial() {
  const steps = [
    {
      icon: <Globe className="w-12 h-12 text-[#0092b8]" />,
      title: "Collect Microplastics",
      description:
        "Capture microplastic particles from oceans, rivers, and waste sources before they spread further.",
    },
    {
      icon: <Recycle className="w-12 h-12 text-[#0092b8]" />,
      title: "Recycle Materials",
      description:
        "Transform collected microplastics into reusable resources through sustainable recycling systems.",
    },
    {
      icon: <TreePine className="w-12 h-12 text-[#0092b8]" />,
      title: "Restore Ecosystems",
      description:
        "Rebuild healthy ecosystems and promote awareness to reduce future microplastic pollution.",
    },
  ];

  // ✅ Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-35 px-6 md:px-20 bg-white text-center text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Subtitle */}
        <h2
          className="text-md text-[#0092b8] font-medium mb-2 uppercase tracking-wide"
          data-aos="fade-down"
        >
          🌱 Our Mission
        </h2>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-bold mb-12 text-blue-900"
          data-aos="fade-up"
        >
          Process To Reduce Microplastic Pollution
        </h1>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step Card */}
              <div
                className="flex flex-col items-center space-y-4 max-w-[250px] transition-transform hover:-translate-y-2 duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 200} // stagger animation
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-[#0092b8] flex items-center justify-center shadow-md">
                    {step.icon}
                  </div>
                  {/* Decorative tree pine */}
                  <div className="absolute -top-4 -left-4 text-[#0092b8]">
                    <TreePine className="w-6 h-6 rotate-12" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              {/* Show arrow only between items */}
              {index !== steps.length - 1 && (
                <>
                  {/* Desktop arrow */}
                  <div
                    className="hidden md:flex mx-6"
                    data-aos="fade-in"
                    data-aos-delay={index * 200 + 100}
                  >
                    <ArrowRightLeft className="w-10 h-10 text-[#0092b8]" />
                  </div>

                  {/* Mobile vertical arrow */}
                  <div
                    className="flex md:hidden my-6"
                    data-aos="fade-in"
                    data-aos-delay={index * 200 + 100}
                  >
                    <ArrowRightLeft className="w-6 h-6 text-[#0092b8] rotate-90" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
