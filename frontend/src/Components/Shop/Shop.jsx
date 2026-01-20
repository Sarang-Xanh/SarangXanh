import React from "react";
import Banner from "../Banner";

const Shop = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Shop"
        subtitle="Our store is getting ready. Stay tuned for new items and updates."
        buttonText="Get Updates"
        onButtonClick={() =>
          document.getElementById("shop-content")?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <div id="shop-content" className="py-20 flex justify-center px-6">
        <h1 className="text-3xl font-semibold text-gray-800">Coming soon!</h1>
      </div>
    </section>
  );
};

export default Shop;
