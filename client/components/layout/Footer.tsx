// import Link from 'next/link';
// import { Car, Mail, Phone, MapPin } from 'lucide-react';

// export default function Footer() {
//   return (
//     <footer className="bg-gray-900 text-gray-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <Car className="w-8 h-8 text-primary-400" />
//               <span className="text-xl font-bold text-white">DriveHub</span>
//             </div>
//             <p className="text-sm text-gray-400">
//               Your trusted destination for quality vehicles. Find your perfect
//               drive with us.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-white font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link
//                   href="/vehicles"
//                   className="hover:text-white transition-colors"
//                 >
//                   Browse Inventory
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/about"
//                   className="hover:text-white transition-colors"
//                 >
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/contact"
//                   className="hover:text-white transition-colors"
//                 >
//                   Contact Us
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Vehicle Types */}
//           <div>
//             <h3 className="text-white font-semibold mb-4">Vehicle Types</h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link
//                   href="/vehicles?bodyType=SEDAN"
//                   className="hover:text-white transition-colors"
//                 >
//                   Sedans
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/vehicles?bodyType=SUV"
//                   className="hover:text-white transition-colors"
//                 >
//                   SUVs
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/vehicles?bodyType=TRUCK"
//                   className="hover:text-white transition-colors"
//                 >
//                   Trucks
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/vehicles?bodyType=COUPE"
//                   className="hover:text-white transition-colors"
//                 >
//                   Coupes
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/vehicles?condition=NEW"
//                   className="hover:text-white transition-colors"
//                 >
//                   New Cars
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="text-white font-semibold mb-4">Contact Info</h3>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 flex-shrink-0" /> 123 Auto Drive, Car
//                 City, CA 90210
//               </li>
//               <li className="flex items-center gap-2">
//                 <Phone className="w-4 h-4 flex-shrink-0" /> (555) 123-4567
//               </li>
//               <li className="flex items-center gap-2">
//                 <Mail className="w-4 h-4 flex-shrink-0" /> info@drivehub.com
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
//           © {new Date().getFullYear()} DriveHub. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }

import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 dark:border-t dark:border-gray-800 text-gray-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">DriveHub</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted destination for quality vehicles. Find your perfect
              drive with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/vehicles"
                  className="hover:text-white transition-colors"
                >
                  Browse Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Vehicle Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/vehicles?bodyType=SEDAN"
                  className="hover:text-white transition-colors"
                >
                  Sedans
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles?bodyType=SUV"
                  className="hover:text-white transition-colors"
                >
                  SUVs
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles?bodyType=TRUCK"
                  className="hover:text-white transition-colors"
                >
                  Trucks
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles?bodyType=COUPE"
                  className="hover:text-white transition-colors"
                >
                  Coupes
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles?condition=NEW"
                  className="hover:text-white transition-colors"
                >
                  New Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> 123 Auto Drive, Car
                City, CA 90210
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" /> (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" /> info@drivehub.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DriveHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
