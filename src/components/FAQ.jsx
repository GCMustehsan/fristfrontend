import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "How does the 3D mockup generator work?",
      answer:
        "Simply upload your design, choose a garment, customize the colors and settings, and our AI-powered system will generate a realistic 3D mockup instantly.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support PNG, JPG, and SVG files for design uploads. For best results, we recommend using PNG files with transparent backgrounds.",
    },
    {
      question: "Can I use the mockups commercially?",
      answer:
        "Yes! All mockups generated with our tool can be used for commercial purposes, including online stores, marketing materials, and social media.",
    },
    {
      question: "What's included in the Pro plan?",
      answer:
        "The Pro plan includes advanced features like custom animations, video export, multiple angle views, and access to our complete library of premium garment models.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <button
                className="w-full text-left p-6 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold mb-2 dark:text-white flex justify-between">
                  {faq.question}
                  <span>{openIndex === index ? "-" : "+"}</span>
                </h3>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
