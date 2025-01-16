// import React, { useState, useEffect, Suspense } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ErrorBoundary } from "react-error-boundary";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Products from "./pages/Products";
// import Pricing from "./pages/Pricing";
// import Testimonials from "./components/Testimonials";
// import FAQ from "./components/FAQ";
// import Footer from "./components/Footer";
// import PaymentForm from "./pages/Payment";
// import ShirtDisplaySection from "./pages/ShirtDisplay";

// const DesignTool = React.lazy(() => import("./pages/Sample"));
// const SignUp = React.lazy(() => import("./pages/SignUp"));
// const SignIn = React.lazy(() => import("./pages/SignIn"));
// const ShirtCustomizer = React.lazy(() => import("./pages/ShirtCustomizer"));

// function ErrorFallback({ error }) {
//   return (
//     <div role="alert">
//       <p>Something went wrong:</p>
//       <pre style={{ color: "red" }}>{error.message}</pre>
//     </div>
//   );
// }

// function App() {
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("darkMode");
//       return saved !== null
//         ? JSON.parse(saved)
//         :  false;
//     }
//     return false;
//   });

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <Router>
//         <div className={darkMode ? "dark" : ""}>
//           <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
//             <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
//             <Suspense
//               fallback={
//                 <div>
//                   <div className="flex items-center justify-center h-screen dark:bg-gray-900">
//                     <div className="relative">
//                       <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
//                       <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
//                     </div>
//                   </div>
//                 </div>
//               }
//             >
//               <Routes>
//                 <Route
//                   path="/design"
//                   element={<DesignTool darkMode={darkMode} />}
//                 />
//                 <Route path="/signup" element={<SignUp />} />
//                 <Route path="/signin" element={<SignIn />} />
//                 <Route
//                   path="/"
//                   element={
//                     <main>
//                       {/* <ShirtDisplaySection/> */}
//                       <Hero />
//                       <Products />
//                       <Pricing />
//                       <ShirtCustomizer />
//                       <Testimonials />
//                       <FAQ />
//                     </main>
//                   }
//                 />
//               </Routes>
//             </Suspense>
//             <Footer />
//           </div>
//         </div>
//       </Router>
//     </ErrorBoundary>
//   );
// }

// export default App;
import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./pages/Products";
import Pricing from "./pages/Pricing";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Payment from "./pages/Payment";
const DesignTool = React.lazy(() => import("./pages/DesignTool"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const ShirtCustomizer = React.lazy(() => import("./pages/ShirtCustomizer"));

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <div className={darkMode ? "dark" : ""}>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Suspense
              fallback={
                <div>
                  <div className="flex items-center justify-center h-screen dark:bg-gray-900">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
                    </div>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/design" element={<DesignTool />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/payment" element={<Payment />} />
                <Route
                  path="/"
                  element={
                    <main>
                      <Hero />
                      <Products />
                      <Pricing />
                      <ShirtCustomizer />
                      <Testimonials />
                      <FAQ />
                    </main>
                  }
                />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
