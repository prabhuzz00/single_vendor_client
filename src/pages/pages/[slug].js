import React from "react";

import Layout from "@layout/Layout";
import PageHeader from "@components/header/PageHeader";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import PageServices from "@services/PageServices";

const DynamicPage = ({ page, error }) => {
  const { showingTranslateValue } = useUtilsFunction();

  if (error) {
    return (
      <Layout title="Page Not Found" description="Page not found">
        <div className="bg-white">
          <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-gray-600">
                The page you are looking for does not exist.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout title="Loading..." description="Loading page">
        <PageHeader title="Loading..." />
        <div className="bg-white">
          <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
            <div className="max-w-4xl mx-auto">
              <CMSkeleton count={15} height={15} loading={true} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const pageTitle = showingTranslateValue(page?.title) || "Page";
  const pageDescription =
    showingTranslateValue(page?.metaDescription) || pageTitle;
  const pageContent = showingTranslateValue(page?.description) || "";

  return (
    <Layout
      title={showingTranslateValue(page?.metaTitle) || pageTitle}
      description={pageDescription}
    >
      <PageHeader headerBg={page?.headerBg} title={pageTitle} />
      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div
              className="dynamic-page-content"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const page = await PageServices.getPageBySlug(slug);

    if (!page) {
      return {
        props: {
          page: null,
          error: "Page not found",
        },
      };
    }

    return {
      props: {
        page,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching page:", error);
    return {
      props: {
        page: null,
        error: error.message || "Failed to load page",
      },
    };
  }
}

export default DynamicPage;
