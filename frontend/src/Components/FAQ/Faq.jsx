import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Banner from "../Banner";

// FAQ items data
const FAQ_ITEMS = [
  {
    question: "What is SarangXanh?",
    answer:
      "SarangXanh is an initiative focused on promoting sustainable practices and green living. We offer a range of products and services designed to help individuals and communities reduce their environmental impact.",
  },
  {
    question: "How can I get involved?",
    answer:
      "There are many ways to get involved with SarangXanh! You can participate in our events, volunteer for projects, or simply spread the word about our mission. Visit our Get Involved page for more information.",
  },
  {
    question: "Where can I find your products?",
    answer:
      "Our products are available online through our website and at select retail locations. Check out our Shop page for more details on where to buy our products.",
  },
  {
    question: "Do you organize community events?",
    answer:
      "Yes! We regularly host cleanups, workshops, and awareness campaigns. Follow us on social media or check our Events page for upcoming activities.",
  },
  {
    question: "How do I contact SarangXanh?",
    answer:
      "You can reach us via our Contact page, email, or direct message on Instagram. We’re always happy to connect and answer your questions.",
  },
  {
    question: "Can I volunteer if I’m not in Vietnam?",
    answer:
      "Absolutely! We welcome international volunteers for online campaigns, content creation, and remote support. Get in touch to learn more about global opportunities.",
  },
];

const Faq = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about SarangXanh, our projects, and how you can contribute."
        buttonText="Explore FAQ"
        onButtonClick={() =>
          document
            .getElementById("faq-list")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* FAQ content */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div id="faq-list" className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white shadow-md rounded-lg transition-all duration-300 ${
                hoverIdx === idx
                  ? "ring-2 ring-blue-300 scale-[1.01] shadow-lg"
                  : ""
              }`}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 focus:outline-none"
                onClick={() => toggleFaq(idx)}
                aria-expanded={openIdx === idx}
                aria-controls={`faq-panel-${idx}`}
              >
                <span
                  className={`text-lg font-semibold text-gray-800 text-left transition-colors ${
                    hoverIdx === idx ? "text-blue-600" : ""
                  }`}
                >
                  {item.question}
                </span>
                {openIdx === idx ? (
                  <ChevronUp className="text-blue-500" />
                ) : (
                  <ChevronDown className="text-blue-500" />
                )}
              </button>
              <div
                id={`faq-panel-${idx}`}
                className={`overflow-hidden transition-all duration-400 ${
                  openIdx === idx
                    ? "max-h-40 opacity-100 py-2 px-6"
                    : "max-h-0 opacity-0 px-6"
                }`}
                style={{
                  transition: "max-height 0.4s, opacity 0.4s, padding 0.4s",
                }}
                aria-hidden={openIdx !== idx}
              >
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
