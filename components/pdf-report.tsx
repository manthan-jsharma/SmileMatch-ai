"use client";

import { useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PDFReportProps {
  results: {
    faceShape: string;
    teethAnalysis: {
      color: string;
      alignment: string;
      size: string;
    };
    recommendedStyles: Array<{
      id: string;
      name: string;
      description: string;
      compatibility: number;
      imageUrl: string;
    }>;
  };
}

export default function PDFReport({ results }: PDFReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={reportRef}
      id="pdf-report"
      className="bg-white p-8 max-w-4xl mx-auto"
    >
      {/* Report Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            SmileMatch AI Veneer Analysis
          </h1>
          <p className="text-gray-500">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            SmileMatch AI
          </div>
          <p className="text-sm text-gray-500">
            Professional Veneer Recommendation
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
          Smile Analysis Summary
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-gray-700">
              Facial Features
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-600">Face Shape</span>
                <Badge
                  variant="outline"
                  className="bg-cyan-50 text-cyan-700 border-cyan-200"
                >
                  {results.faceShape}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 italic">
                Your face shape influences which veneer styles will complement
                your overall appearance.
              </p>
            </div>
          </Card>

          <Card className="p-5 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-gray-700">
              Teeth Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-600">Color Shade</span>
                <Badge
                  variant="outline"
                  className="bg-cyan-50 text-cyan-700 border-cyan-200"
                >
                  {results.teethAnalysis.color}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-600">Alignment</span>
                <Badge
                  variant="outline"
                  className="bg-cyan-50 text-cyan-700 border-cyan-200"
                >
                  {results.teethAnalysis.alignment}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-600">Size Proportion</span>
                <Badge
                  variant="outline"
                  className="bg-cyan-50 text-cyan-700 border-cyan-200"
                >
                  {results.teethAnalysis.size}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
          Recommended Veneer Styles
        </h2>

        <div className="space-y-8">
          {results.recommendedStyles.map((style, index) => (
            <Card key={style.id} className="p-5 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={style.imageUrl || "/placeholder.svg"}
                    alt={style.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{style.name}</h3>
                    <Badge
                      className={`${
                        index === 0
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {index === 0 ? "Best Match" : `Option ${index + 1}`}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">
                    {style.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Compatibility</span>
                      <span className="font-bold text-cyan-700">
                        {style.compatibility}%
                      </span>
                    </div>
                    <Progress value={style.compatibility} className="h-2" />
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">Key Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {index === 0 && (
                        <>
                          <li>
                            • Perfect complement to your{" "}
                            {results.faceShape.toLowerCase()} face shape
                          </li>
                          <li>• Enhances your natural smile aesthetics</li>
                          <li>
                            • Optimal balance of aesthetics and durability
                          </li>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <li>• Creates a dramatic transformation</li>
                          <li>• High-impact aesthetic improvement</li>
                          <li>• Popular choice for complete smile makeovers</li>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <li>• Subtle, natural-looking enhancement</li>
                          <li>
                            • Preserves most of your natural tooth
                            characteristics
                          </li>
                          <li>• Minimal tooth preparation required</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
          Recommended Next Steps
        </h2>
        <Card className="p-5 shadow-sm">
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">
                  Consult with a Dental Professional
                </h4>
                <p className="text-sm text-gray-600">
                  Share this report with your dentist to discuss which veneer
                  option is best for your specific needs.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Request a Digital Mock-Up</h4>
                <p className="text-sm text-gray-600">
                  Ask your dentist for a digital preview of how each veneer
                  style would look on your smile.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Discuss Material Options</h4>
                <p className="text-sm text-gray-600">
                  Learn about different veneer materials (porcelain, composite,
                  etc.) and their benefits.
                </p>
              </div>
            </li>
          </ol>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 border-t pt-4 mt-8">
        <p className="mb-1">
          <strong>Disclaimer:</strong> This report is generated by AI and is
          meant for informational purposes only.
        </p>
        <p>
          The recommendations provided should be reviewed by a dental
          professional before making any decisions about dental procedures.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} SmileMatch AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   AlertCircle,
//   Brush,
//   Droplets,
//   Wine,
//   Calendar,
//   ShoppingBag,
// } from "lucide-react";

// interface PDFReportProps {
//   results: any;
// }

// export default function PDFReport({ results }: PDFReportProps) {
//   // Determine health status colors
//   const getHealthStatusColor = (status: string) => {
//     const statusLower = status.toLowerCase();
//     if (
//       statusLower.includes("excellent") ||
//       statusLower.includes("minimal") ||
//       statusLower.includes("strong")
//     ) {
//       return "bg-green-100 text-green-800 border-green-200";
//     } else if (
//       statusLower.includes("good") ||
//       statusLower.includes("low") ||
//       statusLower.includes("normal")
//     ) {
//       return "bg-blue-100 text-blue-800 border-blue-200";
//     } else if (
//       statusLower.includes("fair") ||
//       statusLower.includes("moderate")
//     ) {
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     } else {
//       return "bg-red-100 text-red-800 border-red-200";
//     }
//   };

//   return (
//     <div id="pdf-report" className="bg-white p-8 max-w-4xl mx-auto">
//       {/* Report Header */}
//       <div className="flex items-center justify-between mb-8 border-b pb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             SmileMatch AI Dental Analysis
//           </h1>
//           <p className="text-gray-500">
//             Generated on {new Date().toLocaleDateString()}
//           </p>
//         </div>
//         <div className="text-right">
//           <div className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
//             SmileMatch AI
//           </div>
//           <p className="text-sm text-gray-500">
//             Professional Dental Assessment
//           </p>
//         </div>
//       </div>

//       {/* Basic Analysis */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
//           Basic Analysis
//         </h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           <Card className="p-5 shadow-sm">
//             <h3 className="text-lg font-medium mb-3 text-gray-700">
//               Facial Features
//             </h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <span className="text-gray-600">Face Shape</span>
//                 <Badge
//                   variant="outline"
//                   className="bg-cyan-50 text-cyan-700 border-cyan-200"
//                 >
//                   {results.faceShape}
//                 </Badge>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-5 shadow-sm">
//             <h3 className="text-lg font-medium mb-3 text-gray-700">
//               Teeth Analysis
//             </h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <span className="text-gray-600">Color Shade</span>
//                 <Badge
//                   variant="outline"
//                   className="bg-cyan-50 text-cyan-700 border-cyan-200"
//                 >
//                   {results.teethAnalysis.color}
//                 </Badge>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <span className="text-gray-600">Alignment</span>
//                 <Badge
//                   variant="outline"
//                   className="bg-cyan-50 text-cyan-700 border-cyan-200"
//                 >
//                   {results.teethAnalysis.alignment}
//                 </Badge>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <span className="text-gray-600">Size Proportion</span>
//                 <Badge
//                   variant="outline"
//                   className="bg-cyan-50 text-cyan-700 border-cyan-200"
//                 >
//                   {results.teethAnalysis.size}
//                 </Badge>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Dental Health Assessment */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
//           Dental Health Assessment
//         </h2>
//         <Card className="p-5 shadow-sm">
//           <div className="mb-6">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium text-gray-700">
//                 Overall Dental Health Score
//               </span>
//               <span className="text-sm font-bold">
//                 {results.dentalHealth.overallScore}%
//               </span>
//             </div>
//             <Progress
//               value={results.dentalHealth.overallScore}
//               className="h-2"
//             />
//           </div>

//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <div className="flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4 text-gray-500" />
//                   <span className="text-gray-600">Bacterial Tendencies</span>
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className={getHealthStatusColor(
//                     results.dentalHealth.bacterialTendencies
//                   )}
//                 >
//                   {results.dentalHealth.bacterialTendencies.includes("Low")
//                     ? "Low"
//                     : results.dentalHealth.bacterialTendencies.includes(
//                         "Moderate"
//                       )
//                     ? "Moderate"
//                     : "High"}
//                 </Badge>
//               </div>

//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <div className="flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4 text-gray-500" />
//                   <span className="text-gray-600">Plaque Level</span>
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className={getHealthStatusColor(
//                     results.dentalHealth.plaqueLevel
//                   )}
//                 >
//                   {results.dentalHealth.plaqueLevel}
//                 </Badge>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <div className="flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4 text-gray-500" />
//                   <span className="text-gray-600">Gum Health</span>
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className={getHealthStatusColor(
//                     results.dentalHealth.gumHealth
//                   )}
//                 >
//                   {results.dentalHealth.gumHealth}
//                 </Badge>
//               </div>

//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
//                 <div className="flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4 text-gray-500" />
//                   <span className="text-gray-600">Enamel Strength</span>
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className={getHealthStatusColor(
//                     results.dentalHealth.enamelStrength
//                   )}
//                 >
//                   {results.dentalHealth.enamelStrength}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-md text-sm text-cyan-800">
//             <p className="font-medium mb-1">Bacterial Analysis:</p>
//             <p>
//               {results.dentalHealth.bacterialTendencies}.{" "}
//               {results.dentalHealth.plaqueLevel} plaque levels observed.
//             </p>
//           </div>
//         </Card>
//       </div>

//       {/* Care Recommendations */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
//           Personalized Care Recommendations
//         </h2>
//         <Card className="p-5 shadow-sm">
//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="p-4 bg-gray-50 rounded-md">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="bg-cyan-100 p-2 rounded-full">
//                   <Brush className="h-4 w-4 text-cyan-700" />
//                 </div>
//                 <h4 className="font-medium text-gray-700">
//                   Brushing Technique
//                 </h4>
//               </div>
//               <p className="text-sm text-gray-600">
//                 {results.careRecommendations.brushingTechnique}
//               </p>
//             </div>

//             <div className="p-4 bg-gray-50 rounded-md">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="bg-cyan-100 p-2 rounded-full">
//                   <Droplets className="h-4 w-4 text-cyan-700" />
//                 </div>
//                 <h4 className="font-medium text-gray-700">Flossing</h4>
//               </div>
//               <p className="text-sm text-gray-600">
//                 {results.careRecommendations.flossingRecommendation}
//               </p>
//             </div>

//             <div className="p-4 bg-gray-50 rounded-md">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="bg-cyan-100 p-2 rounded-full">
//                   <Wine className="h-4 w-4 text-cyan-700" />
//                 </div>
//                 <h4 className="font-medium text-gray-700">Mouthwash</h4>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Recommended: {results.careRecommendations.mouthwashType}
//               </p>
//             </div>

//             <div className="p-4 bg-gray-50 rounded-md">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="bg-cyan-100 p-2 rounded-full">
//                   <Calendar className="h-4 w-4 text-cyan-700" />
//                 </div>
//                 <h4 className="font-medium text-gray-700">Professional Care</h4>
//               </div>
//               <p className="text-sm text-gray-600">
//                 {results.careRecommendations.professionalCleaning}
//               </p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Product Recommendations */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-cyan-500 pl-3">
//           Recommended Products
//         </h2>
//         <Card className="p-5 shadow-sm">
//           <div className="space-y-4">
//             {results.recommendedProducts.map((product: any, index: number) => (
//               <div key={index} className="p-4 border rounded-md bg-gray-50">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <ShoppingBag className="h-4 w-4 text-cyan-600" />
//                       <h4 className="font-medium text-gray-700">
//                         {product.category}: {product.name}
//                       </h4>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">
//                       {product.description}
//                     </p>
//                     <Badge
//                       variant="outline"
//                       className="bg-cyan-50 text-cyan-700 border-cyan-200"
//                     >
//                       Recommended Price: {product.price}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Disclaimer */}
//       <div className="text-xs text-gray-500 border-t pt-4 mt-8">
//         <p className="mb-1">
//           <strong>Disclaimer:</strong> This report is generated by AI and is
//           meant for informational purposes only.
//         </p>
//         <p>
//           The recommendations provided should be reviewed by a dental
//           professional before making any decisions about dental procedures or
//           changing your oral care routine.
//         </p>
//         <p className="mt-2">
//           © {new Date().getFullYear()} SmileMatch AI. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }
