import React, { useState, useEffect } from "react";
import AOS from "aos";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQSection = () => {
  const faqs = [
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

  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white px-6 md:px-20 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="flex items-center justify-center gap-2 text-teal-600 mb-2"
          data-aos="fade-down"
        >
          <HelpCircle className="w-5 h-5" />
          <p className="text-sm font-medium uppercase tracking-wide">
            Frequently Asked Questions
          </p>
        </div>

        <h2
          className="text-4xl font-bold text-sky-900 mb-4"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          FAQ
        </h2>

        <div
          className="w-16 h-1 bg-teal-400 mx-auto rounded-full mb-10"
          data-aos="fade-up"
          data-aos-delay="200"
        ></div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-teal-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={300 + index * 100}
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-sky-900 font-medium hover:bg-teal-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-teal-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-teal-500" />
                  )}
                </button>

                <div
                  className={`px-6 text-left text-sky-700 text-sm overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-40 py-3" : "max-h-0 py-0"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
