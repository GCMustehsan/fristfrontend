// import { FiCheck } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// export default function Pricing() {
//   return (
//     <section
//       className="py-20 px-4 bg-fixed bg-cover bg-center"
//       style={{
//         backgroundImage: "url('https://png.pngtree.com/background/20230426/original/pngtree-fashion-store-interior-of-a-men-s-clothing-store-picture-image_2490200.jpg')", 
//       }}
//     >
//       <div className="bg-white bg-opacity-70 dark:bg-opacity-80 rounded-xl py-16 px-8 max-w-7xl mx-auto shadow-xl">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
//             Choose the Perfect Plan for Your Business
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//             Whether you're just starting out or looking to expand, we offer affordable and flexible plans to meet your needs. Start with our free plan or upgrade for advanced features that will help you take your designs to the next level.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
//           <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-8 shadow-lg flex flex-col justify-between h-full">
//             <div>
//               <h3 className="text-2xl font-bold mb-4 dark:text-white">Basic</h3>
//               <p className="text-3xl font-bold mb-6 dark:text-white">Free forever</p>
//               <ul className="space-y-4 mb-8">
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <FiCheck className="mr-2 text-green-500" />
//                   Create 3D Mockups
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <FiCheck className="mr-2 text-green-500" />
//                   HD Image Export
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <FiCheck className="mr-2 text-green-500" />
//                   Adjust Garment Color
//                 </li>
//               </ul>
//             </div>
//             <button className="w-full px-6 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600 mt-auto">
//               Get started
//             </button>
//           </div>

//           <div className="bg-indigo-600 rounded-lg p-8 shadow-lg flex flex-col justify-between h-full">
//             <div>
//               <h3 className="text-2xl font-bold mb-4 text-white">PRO</h3>
//               <p className="text-3xl font-bold mb-6 text-white">$25/month</p>
//               <ul className="space-y-4 mb-8">
//                 <li className="flex items-center text-white">
//                   <FiCheck className="mr-2" />
//                   Garment Animation
//                 </li>
//                 <li className="flex items-center text-white">
//                   <FiCheck className="mr-2" />
//                   Video Export (Beta)
//                 </li>
//                 <li className="flex items-center text-white">
//                   <FiCheck className="mr-2" />
//                   3D Model Export
//                 </li>
//                 <li className="flex items-center text-white">
//                   <FiCheck className="mr-2" />
//                   Custom Background Image
//                 </li>
//                 <li className="flex items-center text-white">
//                   <FiCheck className="mr-2" />
//                   Unlock All Garments
//                 </li>
//               </ul>
//             </div>
//             <Link to='/payment'>
//             <button className="w-full px-6 py-3 text-sm font-medium text-indigo-600 bg-white rounded-md hover:bg-gray-50 mt-auto">
//               Get started
//             </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import { FiCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    if (userId) {
      navigate('/payment'); // Redirect to payment if userId exists
    } else {
      navigate('/signin'); // Redirect to signin if userId doesn't exist
    }
  };

  return (
    <section
      className="py-20 px-4 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('https://png.pngtree.com/background/20230426/original/pngtree-fashion-store-interior-of-a-men-s-clothing-store-picture-image_2490200.jpg')", 
      }}
    >
      <div className="bg-white bg-opacity-70 dark:bg-opacity-80 rounded-xl py-16 px-8 max-w-7xl mx-auto shadow-xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Choose the Perfect Plan for Your Business
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Whether you're just starting out or looking to expand, we offer affordable and flexible plans to meet your needs. Start with our free plan or upgrade for advanced features that will help you take your designs to the next level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-8 shadow-lg flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Basic</h3>
              <p className="text-3xl font-bold mb-6 dark:text-white">Free forever</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiCheck className="mr-2 text-green-500" />
                  Create 3D Mockups
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiCheck className="mr-2 text-green-500" />
                  HD Image Export
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiCheck className="mr-2 text-green-500" />
                  Adjust Garment Color
                </li>
              </ul>
            </div>
            <Link to='/design'>
            <button
              className="w-full px-6 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600 mt-auto"
              onClick={handleGetStarted}
            >
              Get started
            </button>
            </Link>
          </div>

          <div className="bg-indigo-600 rounded-lg p-8 shadow-lg flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">PRO</h3>
              <p className="text-3xl font-bold mb-6 text-white">$25/month</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <FiCheck className="mr-2" />
                  Garment Animation
                </li>
                <li className="flex items-center text-white">
                  <FiCheck className="mr-2" />
                  Video Export (Beta)
                </li>
                <li className="flex items-center text-white">
                  <FiCheck className="mr-2" />
                  3D Model Export
                </li>
                {/* <li className="flex items-center text-white">
                  <FiCheck className="mr-2" />
                  Custom Background Image
                </li> */}
                <li className="flex items-center text-white">
                  <FiCheck className="mr-2" />
                  Unlock All Garments
                </li>
              </ul>
            </div>
            <button
              className="w-full px-6 py-3 text-sm font-medium text-indigo-600 bg-white rounded-md hover:bg-gray-50 mt-auto"
              onClick={handleGetStarted}
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
