import requests from "./httpServices";

const PageServices = {
  getAllPages: async () => {
    return requests.get("/pages/all");
  },

  getPageBySlug: async (slug) => {
    return requests.get(`/pages/slug/${slug}`);
  },
};

export default PageServices;
