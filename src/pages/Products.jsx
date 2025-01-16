// import React from "react";
// import { FiUpload } from "react-icons/fi";
// import shirt from '../assets/TShirts.png';
// import hoodie from '../assets/hoodies.png';
// import DressShirt from '../assets/DressShirts.png';

// export default function Products() {
//   const products = [
//     { name: "T-Shirt", image: shirt, free: true },
//     { name: "Hoodies", image: hoodie, free: false },
//     { name: "Dress Shirt", image: DressShirt, free: true },
//     { name: "Coming Soon", image: null, free: false, comingSoon: true }, // New product
//   ];

//   return (
//     <section className="py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
//           Let's Customize Your Design
//         </h2>
//         <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
//           Create your own product using our product designing editor according
//           to your own to order us and showcase your work to the world.
//         </p>

//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           {products.map((product, index) => (
//             <div
//               key={index}
//               className="relative bg-white dark:bg-gray-800 rounded-lg p-4 group"
//             >
//               {product.comingSoon ? (
//                 <div className="w-full aspect-square mb-4 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
//                   <span className="text-gray-500 dark:text-gray-400">Coming Soon</span>
//                 </div>
//               ) : (
//                 <>
//                   {product.free && (
//                     <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded z-10">
//                       Free
//                     </span>
//                   )}
//                   <div className="w-full aspect-square mb-4">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover rounded-md"
//                     />
//                   </div>
//                   <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
//                     <FiUpload className="mr-2" />
//                     Select
//                   </button>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "aos/dist/aos.css";
import AOS from "aos";
import shirt from '../assets/TShirts.png';
import hoodie from '../assets/hoodies.png';
import DressShirt from '../assets/DressShirts.png';

// Initialize AOS
AOS.init({ duration: 1000 });

export default function Products() {
  const products = [
    { name: "T-Shirt", image: shirt, free: true },
    // { name: "Hoodies", image: hoodie, free: false },
    // { name: "Dress Shirt", image: DressShirt, free: true },
    { name: "Coming Soon", image: null, free: false, comingSoon: true },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Let's Customize Your Design
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 dark:text-gray-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Create your own product using our product designing editor to order us
          and showcase your work to the world.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const [ref, inView] = useInView({ triggerOnce: true });
            return (
              <motion.div
                ref={ref}
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg group"
                data-aos="fade-up"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                {product.comingSoon ? (
                  <div className="w-full aspect-square mb-4 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                    <span className="text-gray-500 dark:text-gray-400">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <>
                    {product.free && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded z-10">
                        Free
                      </span>
                    )}
                    <div className="w-full aspect-square mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <motion.button
                      className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiUpload className="mr-2" />
                      Select
                    </motion.button>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
