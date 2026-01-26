import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Layout from "@layout/Layout";
import Head from "next/head";
import Loading from "@components/preloader/Loading";
import ProductCard from "@components/product/ProductCard";
import HeroSection from "@components/hero/HeroSection";
import CMSkeleton from "@components/preloader/CMSkeleton";

// Lazy load below-the-fold components to reduce initial JS execution
const Banner = dynamic(() => import("@components/banner/Banner"));
const FeatureCategory = dynamic(
  () => import("@components/category/FeatureCategory"),
);
const BestSellingShowcase = dynamic(
  () => import("@components/home/BestSellingShowcase"),
);
const StickyCart = dynamic(() => import("@components/cart/StickyCart"));

import { SidebarContext } from "@context/SidebarContext";
import useGetSetting from "@hooks/useGetSetting";
import ProductServices from "@services/ProductServices";
import AttributeServices from "@services/AttributeServices";

const SectionTitle = ({ title, description, loading, error }) => (
  <div className="text-center w-full lg:w-2/5 mx-auto mb-12">
    <h2 className="text-3xl lg:text-4xl mb-3 font-bold tracking-tight text-black relative inline-block">
      <CMSkeleton count={1} height={36} loading={loading} data={title} />
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400 rounded-full"></div>
    </h2>

    <p className="text-base font-medium text-gray-700 leading-relaxed mt-4">
      <CMSkeleton
        count={4}
        height={10}
        error={error}
        loading={loading}
        data={description}
      />
    </p>
  </div>
);

const ProductGrid = ({ products, attributes, limit, loading, error }) => {
  if (loading) {
    return (
      <CMSkeleton count={20} height={20} error={error} loading={loading} />
    );
  }

  // Simple client-side virtualization using react-window when available
  const [canUseWindow, setCanUseWindow] = useState(false);
  useEffect(() => {
    setCanUseWindow(typeof window !== "undefined");
  }, []);

  const visibleProducts = products?.slice(0, limit) || [];

  if (canUseWindow && visibleProducts.length > 40) {
    try {
      const { FixedSizeList } = require("react-window");
      const columns = (() => {
        const w = window.innerWidth;
        if (w >= 1280) return 5;
        if (w >= 1024) return 4;
        if (w >= 768) return 3;
        return 2;
      })();

      const rowCount = Math.ceil(visibleProducts.length / columns);
      const Row = ({ index, style }) => {
        const start = index * columns;
        const items = visibleProducts.slice(start, start + columns);
        return (
          <div
            style={style}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-4"
          >
            {items.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                attributes={attributes}
              />
            ))}
          </div>
        );
      };

      return (
        <FixedSizeList
          height={Math.min(800, rowCount * 360)}
          itemCount={rowCount}
          itemSize={360}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      );
    } catch (e) {
      // react-window not installed; fall back to normal grid
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-4">
      {products?.slice(0, limit).map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          attributes={attributes}
        />
      ))}
    </div>
  );
};

const Home = ({
  popularProducts,
  discountProducts,
  trendingProducts,
  bestsellerProducts,
  attributes,
  heroImage,
}) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();

  useEffect(() => {
    setIsLoading(false);
  }, [router, setIsLoading]);

  if (isLoading) return <Loading loading={isLoading} />;

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <StickyCart />

        <div className="bg-white border-b border-gray-200">
          {heroImage && (
            <Head>
              <link rel="preload" as="image" href={heroImage} crossOrigin="" />
            </Head>
          )}
          <div className="mx-auto py-6 max-w-screen-2xl px-3 sm:px-10">
            <div className="flex w-full gap-4">
              <HeroSection serverHeroImage={heroImage} />
            </div>

            {storeCustomizationSetting?.home?.promotion_banner_status && (
              <div className="bg-yellow-50 border-2 border-yellow-400 px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6 rounded-xl sm:rounded-2xl mt-4 sm:mt-6">
                <Banner />
              </div>
            )}
          </div>
        </div>

        {storeCustomizationSetting?.home?.featured_status && (
          <div className="bg-white lg:py-16 py-10 border-b border-gray-200">
            <SectionTitle
              title={storeCustomizationSetting?.home?.feature_title}
              description={storeCustomizationSetting?.home?.feature_description}
              loading={loading}
              error={error}
            />
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              <FeatureCategory />
            </div>
          </div>
        )}

        {/* Best Selling Showcase Section */}
        <BestSellingShowcase
          bestSellingProducts={bestsellerProducts || popularProducts || []}
          trendingProducts={trendingProducts || []}
        />

        {storeCustomizationSetting?.home?.popular_products_status && (
          <div className="bg-gray-50 lg:py-16 py-10 border-b border-gray-200">
            <SectionTitle
              title={storeCustomizationSetting?.home?.popular_title}
              description={storeCustomizationSetting?.home?.popular_description}
              loading={loading}
              error={error}
            />
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              <ProductGrid
                products={popularProducts}
                attributes={attributes}
                limit={storeCustomizationSetting?.home?.popular_product_limit}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}

        {storeCustomizationSetting?.home?.discount_product_status && (
          <div
            className="bg-white lg:py-16 py-10 border-b border-gray-200"
            id="discount"
          >
            <SectionTitle
              title={storeCustomizationSetting?.home?.latest_discount_title}
              description={
                storeCustomizationSetting?.home?.latest_discount_description
              }
              loading={loading}
              error={error}
            />
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              {discountProducts?.length > 0 ? (
                <ProductGrid
                  products={discountProducts}
                  attributes={attributes}
                  limit={
                    storeCustomizationSetting?.home
                      ?.latest_discount_product_limit
                  }
                  loading={loading}
                  error={error}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No discounted products available at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  // Add cache headers to improve mobile performance
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120",
  );

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id || "",
      title: query || "",
    }),
    AttributeServices.getShowingAttributes(),
  ]);

  // Fetch store customization so we can server-preload hero image
  let heroImage = null;
  try {
    const storeCustomization = await import("@services/SettingServices");
    const sc = await storeCustomization.default.getStoreCustomizationSetting();
    heroImage = sc?.hero?.image || null;
    // if Cloudinary url exists, try to add auto-format/quality/width
    if (
      heroImage &&
      heroImage.includes("res.cloudinary.com") &&
      heroImage.includes("/upload/")
    ) {
      const transform = "f_auto,q_auto,c_fill,w_1200";
      const parts = heroImage.split("/upload/");
      if (parts.length >= 2) {
        const prefix = parts[0];
        const rest = parts.slice(1).join("/upload/");
        // if there's already a transform at the start of rest, leave it
        if (!rest.match(/^(f_auto|q_auto|c_|w_|h_|g_)/)) {
          heroImage = `${prefix}/upload/${transform}/${rest}`;
        }
      }
    }
  } catch (e) {
    heroImage = null;
  }

  return {
    props: {
      attributes,
      cookies,
      heroImage,
      popularProducts: data.popularProducts,
      discountProducts: data.discountedProducts,
      trendingProducts: data.trendingProducts || [],
      bestsellerProducts: data.bestsellerProducts || [],
    },
  };
};

export default Home;
