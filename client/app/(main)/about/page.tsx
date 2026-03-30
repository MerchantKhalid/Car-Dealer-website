// import { Shield, Award, Users, Clock } from 'lucide-react';

// export default function AboutPage() {
//   return (
//     <div>
//       {/* Hero */}
//       <section className="bg-gray-900 text-white py-20">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             About DriveHub
//           </h1>
//           <p className="text-xl text-gray-300">
//             Your trusted partner in finding the perfect vehicle since 2009.
//           </p>
//         </div>
//       </section>

//       {/* Story */}
//       <section className="py-16">
//         <div className="max-w-4xl mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-6">Our Story</h2>
//           <div className="prose prose-lg text-gray-600 space-y-4">
//             <p>
//               Founded in 2009, DriveHub began with a simple mission: to make car
//               buying a transparent, enjoyable experience. We believed that
//               purchasing a vehicle shouldn&apos;t be stressful or confusing.
//             </p>
//             <p>
//               Over the past 15 years, we&apos;ve grown from a small lot with 20
//               cars to a premier dealership with over 500 vehicles, serving
//               thousands of happy customers across the country.
//             </p>
//             <p>
//               Our commitment to quality, transparency, and customer satisfaction
//               has made us one of the most trusted names in the automotive
//               industry.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Values */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
//           <div className="grid md:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: Shield,
//                 title: 'Integrity',
//                 desc: 'Honest pricing and transparent dealings in every transaction.',
//               },
//               {
//                 icon: Award,
//                 title: 'Quality',
//                 desc: 'Every vehicle meets our rigorous inspection standards.',
//               },
//               {
//                 icon: Users,
//                 title: 'Community',
//                 desc: 'Building lasting relationships with our customers.',
//               },
//               {
//                 icon: Clock,
//                 title: 'Reliability',
//                 desc: 'Consistent service you can count on, every time.',
//               },
//             ].map((v) => (
//               <div key={v.title} className="text-center">
//                 <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//                   <v.icon className="w-7 h-7 text-primary-600" />
//                 </div>
//                 <h3 className="text-lg font-bold mb-2">{v.title}</h3>
//                 <p className="text-gray-600 text-sm">{v.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Our Leadership Team
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: 'James Wilson',
//                 role: 'CEO & Founder',
//                 bio: '15+ years in automotive industry.',
//               },
//               {
//                 name: 'Sarah Johnson',
//                 role: 'Sales Director',
//                 bio: 'Expert in customer relations and sales strategy.',
//               },
//               {
//                 name: 'Michael Chen',
//                 role: 'Service Manager',
//                 bio: 'ASE certified with 10 years experience.',
//               },
//             ].map((m) => (
//               <div key={m.name} className="text-center">
//                 <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
//                   <Users className="w-12 h-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-bold">{m.name}</h3>
//                 <p className="text-primary-600 text-sm font-medium">{m.role}</p>
//                 <p className="text-gray-600 text-sm mt-2">{m.bio}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
