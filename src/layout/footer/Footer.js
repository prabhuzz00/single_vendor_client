// import Link from "next/link";
// import Image from "next/image";
// import dynamic from "next/dynamic";
// import useTranslation from "next-translate/useTranslation";
// import {
//   FacebookIcon,
//   LinkedinIcon,
//   PinterestIcon,
//   TwitterIcon,
//   WhatsappIcon,
// } from "react-share";

// //internal import
// import { getUserSession } from "@lib/auth";
// import useGetSetting from "@hooks/useGetSetting";
// import CMSkeleton from "@components/preloader/CMSkeleton";
// import useUtilsFunction from "@hooks/useUtilsFunction";

// const Footer = () => {
//   const { t } = useTranslation();
//   const userInfo = getUserSession();

//   const { showingTranslateValue } = useUtilsFunction();
//   const { loading, storeCustomizationSetting } = useGetSetting();

//   return (
//     <div className="pb-16 lg:pb-0 xl:pb-0 bg-black">
//       <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
//         <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-10 lg:py-16 justify-between">
//           {storeCustomizationSetting?.footer?.block1_status && (
//             <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
//               <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5 text-white">
//                 <CMSkeleton
//                   count={1}
//                   height={20}
//                   loading={loading}
//                   data={storeCustomizationSetting?.footer?.block1_title}
//                 />
//               </h3>
//               <ul className="text-sm flex flex-col space-y-3">
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block1_sub_link1}`}
//                     className="!text-white inline-block w-full hover:text-white"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block1_sub_title1
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block1_sub_link2}`}
//                     className="!text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block1_sub_title2
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block1_sub_link3}`}
//                     className="!text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     {showingTranslateValue(
//                       storeCustomizationSetting?.footer_block_one_link_three_title
//                     )}
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block1_sub_title3
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block1_sub_link4}`}
//                     className="!text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block1_sub_title4
//                       }
//                     />
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           )}
//           {storeCustomizationSetting?.footer?.block2_status && (
//             <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
//               <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5 text-white">
//                 <CMSkeleton
//                   count={1}
//                   height={20}
//                   loading={loading}
//                   data={storeCustomizationSetting?.footer?.block2_title}
//                 />
//               </h3>
//               <ul className="text-sm lg:text-15px flex flex-col space-y-3">
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block2_sub_link1}`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block2_sub_title1
//                       }
//                     />
//                   </Link>
//                 </li>

//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block2_sub_link2}`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block2_sub_title2
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block2_sub_link3}`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block2_sub_title3
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${storeCustomizationSetting?.footer?.block2_sub_link4}`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block2_sub_title4
//                       }
//                     />
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           )}
//           {storeCustomizationSetting?.footer?.block3_status && (
//             <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
//               <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5 text-white">
//                 <CMSkeleton
//                   count={1}
//                   height={20}
//                   loading={loading}
//                   data={storeCustomizationSetting?.footer?.block3_title}
//                 />
//               </h3>
//               <ul className="text-sm lg:text-15px flex flex-col space-y-3">
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${
//                       userInfo?.email
//                         ? storeCustomizationSetting?.footer?.block3_sub_link1
//                         : "#"
//                     }`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block3_sub_title1
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${
//                       userInfo?.email
//                         ? storeCustomizationSetting?.footer?.block3_sub_link2
//                         : "#"
//                     }`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block3_sub_title2
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${
//                       userInfo?.email
//                         ? storeCustomizationSetting?.footer?.block3_sub_link3
//                         : "#"
//                     }`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block3_sub_title3
//                       }
//                     />
//                   </Link>
//                 </li>
//                 <li className="flex items-baseline">
//                   <Link
//                     href={`${
//                       userInfo?.email
//                         ? storeCustomizationSetting?.footer?.block3_sub_link4
//                         : "#"
//                     }`}
//                     className="text-white inline-block w-full hover:text-yellow-400"
//                   >
//                     <CMSkeleton
//                       count={1}
//                       height={10}
//                       loading={loading}
//                       data={
//                         storeCustomizationSetting?.footer?.block3_sub_title4
//                       }
//                     />
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           )}
//           {storeCustomizationSetting?.footer?.block4_status && (
//             <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
//               <Link
//                 href="/"
//                 className="mr-3 lg:mr-12 xl:mr-12"
//                 rel="noreferrer"
//               >
//                 <div className="relative w-32 h-10">
//                   <Image
//                     width={110}
//                     height={40}
//                     sizes="100vw"
//                     className="w-full h-auto"
//                     src={
//                       storeCustomizationSetting?.footer?.block4_logo ||
//                       "/logo/logo-color.svg"
//                     }
//                     alt="logo"
//                   />
//                 </div>
//               </Link>
//               <p className="leading-7 font-sans text-sm text-white mt-3">
//                 <CMSkeleton
//                   count={1}
//                   height={10}
//                   loading={loading}
//                   data={storeCustomizationSetting?.footer?.block4_address}
//                 />
//                 <br />
//                 <span>
//                   {" "}
//                   Tel : {storeCustomizationSetting?.footer?.block4_phone}
//                 </span>
//                 <br />
//                 <span>
//                   {" "}
//                   Email : {storeCustomizationSetting?.footer?.block4_email}
//                 </span>
//               </p>
//             </div>
//           )}
//         </div>

//         <hr className="hr-line"></hr>

//         <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 bg-yellow-400 shadow-sm border border-yellow-400 rounded-lg">
//           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-8 items-center justify-between">
//             <div className="col-span-1">
//               {storeCustomizationSetting?.footer?.social_links_status && (
//                 <div>
//                   {(storeCustomizationSetting?.footer?.social_facebook ||
//                     storeCustomizationSetting?.footer?.social_twitter ||
//                     storeCustomizationSetting?.footer?.social_pinterest ||
//                     storeCustomizationSetting?.footer?.social_linkedin ||
//                     storeCustomizationSetting?.footer?.social_whatsapp) && (
//                     <span className="text-base leading-7 font-medium block mb-2 pb-0.5 text-black">
//                       {t("common:footer-follow-us")}
//                     </span>
//                   )}
//                   <ul className="text-sm flex">
//                     {storeCustomizationSetting?.footer?.social_facebook && (
//                       <li className="flex items-center mr-3 transition ease-in-out duration-500">
//                         <Link
//                           href={`${storeCustomizationSetting?.footer?.social_facebook}`}
//                           aria-label="Social Link"
//                           rel="noreferrer"
//                           target="_blank"
//                           className="block text-center mx-auto text-gray-500 hover:text-white"
//                         >
//                           <FacebookIcon size={34} round />
//                         </Link>
//                       </li>
//                     )}
//                     {storeCustomizationSetting?.footer?.social_twitter && (
//                       <li className="flex items-center  mr-3 transition ease-in-out duration-500">
//                         <Link
//                           href={`${storeCustomizationSetting?.footer?.social_twitter}`}
//                           aria-label="Social Link"
//                           rel="noreferrer"
//                           target="_blank"
//                           className="block text-center mx-auto text-gray-500 hover:text-white"
//                         >
//                           <TwitterIcon size={34} round />
//                         </Link>
//                       </li>
//                     )}
//                     {storeCustomizationSetting?.footer?.social_pinterest && (
//                       <li className="flex items-center mr-3 transition ease-in-out duration-500">
//                         <Link
//                           href={`${storeCustomizationSetting?.footer?.social_pinterest}`}
//                           aria-label="Social Link"
//                           rel="noreferrer"
//                           target="_blank"
//                           className="block text-center mx-auto text-gray-500 hover:text-white"
//                         >
//                           <PinterestIcon size={34} round />
//                         </Link>
//                       </li>
//                     )}
//                     {storeCustomizationSetting?.footer?.social_linkedin && (
//                       <li className="flex items-center  mr-3 transition ease-in-out duration-500">
//                         <Link
//                           href={`${storeCustomizationSetting?.footer?.social_linkedin}`}
//                           aria-label="Social Link"
//                           rel="noreferrer"
//                           target="_blank"
//                           className="block text-center mx-auto text-gray-500 hover:text-white"
//                         >
//                           <LinkedinIcon size={34} round />
//                         </Link>
//                       </li>
//                     )}
//                     {storeCustomizationSetting?.footer?.social_whatsapp && (
//                       <li className="flex items-center  mr-3 transition ease-in-out duration-500">
//                         <Link
//                           href={`${storeCustomizationSetting?.footer?.social_whatsapp}`}
//                           aria-label="Social Link"
//                           rel="noreferrer"
//                           target="_blank"
//                           className="block text-center mx-auto text-gray-500 hover:text-white"
//                         >
//                           <WhatsappIcon size={34} round />
//                         </Link>
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </div>
//             <div className="col-span-1 text-center hidden lg:block md:block">
//               {storeCustomizationSetting?.footer?.bottom_contact_status && (
//                 <div>
//                   <p className="text-base leading-7 font-medium block text-black">
//                     {t("common:footer-call-us")}
//                   </p>
//                   <h5 className="text-2xl font-bold text-black leading-7">
//                     {/* +012345-67900 */}
//                     {storeCustomizationSetting?.footer?.bottom_contact}
//                   </h5>
//                 </div>
//               )}
//             </div>
//             {storeCustomizationSetting?.footer?.payment_method_status && (
//               <div className="col-span-1 hidden lg:block md:block">
//                 <ul className="lg:text-right">
//                   <li className="px-1 mb-2 md:mb-0 transition hover:opacity-80 inline-flex">
//                     <Image
//                       width={274}
//                       height={85}
//                       className="w-full"
//                       src={
//                         storeCustomizationSetting?.footer?.payment_method_img ||
//                         "/payment-method/payment-logo.png"
//                       }
//                       alt="payment method"
//                     />
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//           <div className="pt-6 pb-4 border-t border-yellow-500">
//             <p className="text-sm text-black leading-6 text-center">
//               Copyright 2025 @{" "}
//               <Link
//                 href="https://techculture.solutions/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-black font-semibold hover:text-gray-700"
//               >
//                 InfotechIndia
//               </Link>
//               , All rights reserved.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(Footer), { ssr: false });

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

//internal import
import { getUserSession } from "@lib/auth";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Footer = () => {
  const { t } = useTranslation();
  const userInfo = getUserSession();

  const { showingTranslateValue } = useUtilsFunction();
  const { loading, storeCustomizationSetting } = useGetSetting();

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-black text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        {/* Top Section - Links and Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-12 lg:py-16 items-start">
          {/* Block 1 */}
          {storeCustomizationSetting?.footer?.block1_status && (
            <div className="pb-3.5 sm:pb-0">
              <h3 className="text-lg lg:text-xl font-bold mb-6 pb-2 !text-white border-b-2 !border-yellow-400 inline-block">
                <CMSkeleton
                  count={1}
                  height={20}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block1_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-3">
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block1_sub_link1}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title1
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block1_sub_link2}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title2
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block1_sub_link3}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    {showingTranslateValue(
                      storeCustomizationSetting?.footer_block_one_link_three_title
                    )}
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title3
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block1_sub_link4}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title4
                      }
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Block 2 */}
          {storeCustomizationSetting?.footer?.block2_status && (
            <div className="pb-3.5 sm:pb-0">
              <h3 className="text-lg lg:text-xl font-bold mb-6 pb-2 !text-white border-b-2 !border-yellow-400 inline-block">
                <CMSkeleton
                  count={1}
                  height={20}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block2_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link1}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title1
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link2}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title2
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link3}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title3
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link4}`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title4
                      }
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Logo - Center */}
          {storeCustomizationSetting?.footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0 flex flex-col items-center justify-center">
              <Link href="/" className="inline-block" rel="noreferrer">
                <div className="relative w-32 h-32 bg-white rounded-full shadow-lg hover:shadow-yellow-400/50 transition-shadow duration-300 flex items-center justify-center overflow-hidden p-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      width={100}
                      height={100}
                      sizes="100vw"
                      className="object-contain"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                      }}
                      src={
                        storeCustomizationSetting?.footer?.block4_logo ||
                        "/logo/logo-color.svg"
                      }
                      alt="logo"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Block 3 */}
          {storeCustomizationSetting?.footer?.block3_status && (
            <div className="pb-3.5 sm:pb-0">
              <h3 className="text-lg lg:text-xl font-bold mb-6 pb-2 !text-white border-b-2 !border-yellow-400 inline-block">
                <CMSkeleton
                  count={1}
                  height={20}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block3_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link1
                        : "#"
                    }`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title1
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link2
                        : "#"
                    }`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title2
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link3
                        : "#"
                    }`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title3
                      }
                    />
                  </Link>
                </li>
                <li className="flex items-baseline transform transition-transform duration-300 hover:translate-x-2">
                  <span className="text-yellow-400 mr-2 flex-shrink-0">→</span>
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link4
                        : "#"
                    }`}
                    className="!text-white inline-block w-full hover:!text-yellow-400 visited:!text-white active:!text-yellow-400 transition-colors duration-300"
                  >
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title4
                      }
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {storeCustomizationSetting?.footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0">
              <h3 className="text-lg lg:text-xl font-bold mb-6 pb-2 !text-white border-b-2 !border-yellow-400 inline-block">
                Contact Us
              </h3>
              <div className="leading-7 font-sans text-sm text-gray-300 space-y-3">
                <p className="flex items-start">
                  <span className="text-yellow-400 mr-2 mt-1">📍</span>
                  <span>
                    <CMSkeleton
                      count={1}
                      height={10}
                      loading={loading}
                      data={storeCustomizationSetting?.footer?.block4_address}
                    />
                  </span>
                </p>
                <p className="flex items-center hover:text-yellow-400 transition-colors duration-300">
                  <span className="text-yellow-400 mr-2">📞</span>
                  <span>{storeCustomizationSetting?.footer?.block4_phone}</span>
                </p>
                <p className="flex items-center hover:text-yellow-400 transition-colors duration-300">
                  <span className="text-yellow-400 mr-2">✉️</span>
                  <span>{storeCustomizationSetting?.footer?.block4_email}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-yellow-400/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-black px-4 text-yellow-400 text-2xl">✦</span>
          </div>
        </div>

        {/* Bottom Section - Yellow Background */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-2xl rounded-3xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-8 items-center">
            {/* Social Links */}
            <div>
              {storeCustomizationSetting?.footer?.social_links_status && (
                <div>
                  {(storeCustomizationSetting?.footer?.social_facebook ||
                    storeCustomizationSetting?.footer?.social_twitter ||
                    storeCustomizationSetting?.footer?.social_pinterest ||
                    storeCustomizationSetting?.footer?.social_linkedin ||
                    storeCustomizationSetting?.footer?.social_whatsapp) && (
                    <span className="text-base leading-7 font-bold block mb-3 text-black">
                      {t("common:footer-follow-us")}
                    </span>
                  )}
                  <ul className="text-sm flex flex-wrap gap-2">
                    {storeCustomizationSetting?.footer?.social_facebook && (
                      <li className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_facebook}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block shadow-md hover:shadow-xl rounded-full"
                        >
                          <FacebookIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_twitter && (
                      <li className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_twitter}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block shadow-md hover:shadow-xl rounded-full"
                        >
                          <TwitterIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_pinterest && (
                      <li className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_pinterest}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block shadow-md hover:shadow-xl rounded-full"
                        >
                          <PinterestIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_linkedin && (
                      <li className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_linkedin}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block shadow-md hover:shadow-xl rounded-full"
                        >
                          <LinkedinIcon size={34} round />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_whatsapp && (
                      <li className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_whatsapp}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block shadow-md hover:shadow-xl rounded-full"
                        >
                          <WhatsappIcon size={34} round />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Call Us */}
            <div className="text-center">
              {storeCustomizationSetting?.footer?.bottom_contact_status && (
                <div className="bg-black/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs leading-6 font-semibold block text-black mb-1">
                    {t("common:footer-call-us")}
                  </p>
                  <h5 className="text-2xl font-extrabold text-black leading-6 tracking-wide">
                    {storeCustomizationSetting?.footer?.bottom_contact}
                  </h5>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            {storeCustomizationSetting?.footer?.payment_method_status && (
              <div className="flex justify-end">
                <div className="bg-white rounded-xl p-2 shadow-lg w-fit">
                  <Image
                    width={274}
                    height={85}
                    className="w-full h-auto"
                    src={
                      storeCustomizationSetting?.footer?.payment_method_img ||
                      "/payment-method/payment-logo.png"
                    }
                    alt="payment method"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="py-4 border-t-2 border-yellow-600 bg-gradient-to-r from-yellow-500 to-yellow-400">
            <p className="text-sm text-black leading-6 text-center font-medium">
              Copyright 2025 @{" "}
              <Link
                href="https://techculture.solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-bold hover:text-gray-800 transition-colors duration-300 underline decoration-2 decoration-black/30"
              >
                InfotechIndia
              </Link>
              , All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });
