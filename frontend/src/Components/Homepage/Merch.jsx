import React, { useEffect } from 'react';
import AOS from 'aos';

const products = [
  {
    name: 'Ocean Tag Keychain',
    price: '$7.99',
    img: '/bg.jpg',
  },
  {
    name: 'Seafoam Bottle Sticker',
    price: '$3.49',
    img: '/bg.jpg',
  },
  {
    name: 'Eco Wave Wristband',
    price: '$5.99',
    img: '/bg.jpg',
  },
];

const MerchStore = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation speed (1s)
      once: true, // only animate on first scroll
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <section
      className="relative w-full bg-cover bg-center px-6 md:px-20 py-20"
      style={{ backgroundImage: `url('/bg.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#042f2e]/30 backdrop-blur-sm z-0" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
          <div className="max-w-lg" data-aos="fade-right">
            <p className="text-sm text-yellow-400 font-semibold flex items-center gap-2">
              What We Sell
            </p>
            <h2 className="text-4xl font-bold text-white leading-snug mt-2">
              Support the Ocean With <br /> Every Purchase
            </h2>
          </div>
          <div className="text-white max-w-md" data-aos="fade-left" data-aos-delay="150">
            <p className="text-xl leading-relaxed">
              “Each item is crafted to raise awareness and reduce microplastic waste in our seas.”
            </p>
            <a
              href="#"
              className="inline-block mt-3 text-yellow-400 text-md font-semibold hover:underline"
            >
              View All Products →
            </a>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg group"
              data-aos="fade-up"
              data-aos-delay={200 + index * 150} // stagger each card
            >
              {/* Image */}
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Info Box */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/30 backdrop-blur-md rounded-lg shadow-md px-4 py-3 h-16 group-hover:h-28 transition-all duration-500 overflow-hidden">
                {/* Product Name */}
                <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                  {product.name}
                </h3>

                {/* Price - Slides UP from bottom */}
                <p className="text-xl font-bold text-teal-100 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 mt-2">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchStore;
