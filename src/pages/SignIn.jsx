// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
// import login_image from '../assets/login.svg'
// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Sign in:', { email, password });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="font-[sans-serif]">
//       <div className="min-h-screen flex items-center justify-center py-6 px-4">
//         <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
//           <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 max-w-md shadow-lg dark:shadow-gray-800 transition-all duration-300 max-md:mx-auto">
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <div className="mb-8">
//                 <h3 className="text-gray-800 dark:text-gray-100 text-3xl font-bold">Sign in</h3>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 leading-relaxed">
//                   Sign in to your account and explore a world of possibilities. Your journey begins here.
//                 </p>
//               </div>

//               <div>
//                 <label className="text-gray-800 dark:text-gray-100 text-sm mb-2 block">Email</label>
//                 <div className="relative flex items-center">
//                   <input
//                     name="email"
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full text-sm text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 pl-4 pr-10 py-3 rounded-lg outline-blue-600 dark:bg-gray-800 transition-colors duration-300"
//                     placeholder="Enter email"
//                   />
//                   <FiMail className="absolute right-4 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-gray-800 dark:text-gray-100 text-sm mb-2 block">Password</label>
//                 <div className="relative flex items-center">
//                   <input
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full text-sm text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 pl-4 pr-10 py-3 rounded-lg outline-blue-600 dark:bg-gray-800 transition-colors duration-300"
//                     placeholder="Enter password"
//                   />
//                   {showPassword ? (
//                     <FiEyeOff
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-4 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-300"
//                     />
//                   ) : (
//                     <FiEye
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-4 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-300"
//                     />
//                   )}
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center justify-between gap-4">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800 dark:text-gray-100">
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <Link to="/forgot-password" className="text-blue-600 hover:underline font-semibold">
//                     Forgot your password?
//                   </Link>
//                 </div>
//               </div>

//               <div className="!mt-8">
//                 <button
//                   type="submit"
//                   className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all duration-300"
//                 >
//                   Sign in
//                 </button>
//               </div>

//               <p className="text-sm !mt-8 text-center text-gray-500 dark:text-gray-400">
//                 Don't have an account
//                 <Link to="/signup" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
//                   Register here
//                 </Link>
//               </p>
//             </form>
//           </div>
//           <div className="max-md:mt-8">
//             <img
//               src={login_image}
//               className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
//               alt="auth"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import axiosInstance from '../AxiosInstance'; // Ensure this is correctly configured
import login_image from '../assets/login.svg';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/login', { email, password });

      // Extract and store user details in localStorage
      const { token, id, name } = response.data;
      localStorage.setItem('idToken', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('name', name);

      // Redirect to the dashboard or home page
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 max-w-md shadow-lg dark:shadow-gray-800 transition-all duration-300 max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-8">
                <h3 className="text-gray-800 dark:text-gray-100 text-3xl font-bold">Sign in</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 leading-relaxed">
                  Sign in to your account and explore a world of possibilities. Your journey begins here.
                </p>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div>
                <label className="text-gray-800 dark:text-gray-100 text-sm mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 pl-4 pr-10 py-3 rounded-lg outline-blue-600 dark:bg-gray-800 transition-colors duration-300"
                    placeholder="Enter email"
                  />
                  <FiMail className="absolute right-4 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="text-gray-800 dark:text-gray-100 text-sm mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 pl-4 pr-10 py-3 rounded-lg outline-blue-600 dark:bg-gray-800 transition-colors duration-300"
                    placeholder="Enter password"
                  />
                  {showPassword ? (
                    <FiEyeOff
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-300"
                    />
                  ) : (
                    <FiEye
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-300"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800 dark:text-gray-100">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="text-blue-600 hover:underline font-semibold">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="!mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <p className="text-sm !mt-8 text-center text-gray-500 dark:text-gray-400">
                Don't have an account
                <Link to="/signup" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                  Register here
                </Link>
              </p>
            </form>
          </div>
          <div className="max-md:mt-8">
            <img
              src={login_image}
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="auth"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
