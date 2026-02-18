import ProductServices from "@services/ProductServices";
import CategoryServices from "@services/CategoryServices";
import PageServices from "@services/PageServices";
import SettingServices from "@services/SettingServices";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://stickersrhino.com";

function isoSafe(date) {
  try {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch (e) {
    return null;
  }
}

function generateSiteMap(products, categories, pages, options = {}) {
  const staticPages = [
    "",
    "about-us",
    "contact-us",
    "faq",
    "privacy-policy",
    "terms-and-conditions",
    "offer",
    "search",
    "checkout",
    "create_own_design",
  ];

  // build sitemap in a safe way to avoid Date parsing errors
  const parts = [];
  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  // prepare normalized exclusion set (supports full URLs, leading slash paths, and bare slugs)
  const rawExclusions = (options.exclusion_list || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const normalize = (input) => {
    if (!input) return null;
    let u = input.trim();
    // if input is full URL starting with SITE_URL, strip origin
    if (u.startsWith(SITE_URL)) u = u.slice(SITE_URL.length);
    // try to parse as URL relative to SITE_URL
    try {
      const url = new URL(u, SITE_URL);
      u = url.pathname + (url.search || "");
    } catch (e) {
      // leave as-is
    }
    if (!u.startsWith("/")) u = "/" + u;
    // remove trailing slash for consistency (keep root as '/')
    if (u.length > 1 && u.endsWith("/")) u = u.slice(0, -1);
    return u.toLowerCase();
  };

  const exclusionSet = new Set(rawExclusions.map(normalize).filter(Boolean));

  // static pages
  if (options.include_static_pages) {
    staticPages.forEach((page) => {
      const staticPath = `/${page}`.replace(/\/+/g, "/");
      const normalizedStatic = normalize(
        staticPath === "//" ? "/" : staticPath,
      );
      if (normalizedStatic && exclusionSet.has(normalizedStatic)) return;

      parts.push("  <url>");
      parts.push(`    <loc>${SITE_URL}/${page}</loc>`);
      parts.push("    <changefreq>weekly</changefreq>");
      // priority: homepage 1.0, static pages 0.5
      parts.push(`    <priority>${page === "" ? "1.0" : "0.5"}</priority>`);
      parts.push("  </url>");
    });
  }

  // products
  if (options.include_products) {
    products.forEach((product) => {
      // exclusion by slug, id, or full url
      const slugPath = `/product/${product.slug}`;
      const idStr = product._id || product.id || product.productId || "";
      const candidates = [
        slugPath,
        `/${product.slug}`,
        idStr,
        `${SITE_URL}${slugPath}`,
        `${SITE_URL}/${product.slug}`,
      ]
        .map(normalize)
        .filter(Boolean);
      if (candidates.some((c) => exclusionSet.has(c))) return;
      // exclude out of stock if requested - best-effort: skip if status not 'show'
      if (
        options.exclude_out_of_stock &&
        product.status &&
        product.status !== "show"
      )
        return;

      parts.push("  <url>");
      parts.push(`    <loc>${SITE_URL}/product/${product.slug}</loc>`);
      const iso = isoSafe(product.updatedAt || product.createdAt);
      if (iso) parts.push(`    <lastmod>${iso}</lastmod>`);
      parts.push("    <changefreq>daily</changefreq>");
      // priority for products: 0.8
      parts.push("    <priority>0.8</priority>");
      parts.push("  </url>");
    });
  }

  // categories
  if (options.include_categories) {
    categories.forEach((category) => {
      const iso = isoSafe(category.updatedAt || category.createdAt);
      parts.push("  <url>");
      parts.push(`    <loc>${SITE_URL}/search?category=${category.slug}</loc>`);
      if (iso) parts.push(`    <lastmod>${iso}</lastmod>`);
      parts.push("    <changefreq>weekly</changefreq>");
      // priority for categories: 0.8
      parts.push("    <priority>0.8</priority>");
      parts.push("  </url>");
    });
  }

  // pages (static content pages)
  if (options.include_static_pages) {
    pages.forEach((p) => {
      const iso = isoSafe(p.updatedAt || p.createdAt || p.publishedAt);
      const pagePath = `/pages/${p.slug}`;
      const candidates = [
        pagePath,
        `/${p.slug}`,
        `/${p.slug}`.replace(/\/+/g, "/"),
        `${SITE_URL}${pagePath}`,
        `${SITE_URL}/${p.slug}`,
      ]
        .map(normalize)
        .filter(Boolean);
      if (candidates.some((c) => exclusionSet.has(c))) return;
      parts.push("  <url>");
      parts.push(`    <loc>${SITE_URL}/pages/${p.slug}</loc>`);
      if (iso) parts.push(`    <lastmod>${iso}</lastmod>`);
      parts.push("    <changefreq>monthly</changefreq>");
      // priority for static pages: 0.5
      parts.push("    <priority>0.5</priority>");
      parts.push("  </url>");
    });
  }

  parts.push("</urlset>");

  return parts.join("\n");
}

export async function getServerSideProps({ res }) {
  try {
    // simple in-memory cache to avoid rebuilding on every request
    const TTL = 1000 * 60 * 60; // 1 hour
    if (!global.__sitemapCache) global.__sitemapCache = { xml: null, ts: 0 };
    const now = Date.now();

    if (global.__sitemapCache.xml && now - global.__sitemapCache.ts < TTL) {
      res.setHeader("Content-Type", "text/xml");
      res.write(global.__sitemapCache.xml);
      res.end();
      return { props: {} };
    }

    // Fetch settings to decide what to include
    const settings = await SettingServices.getGlobalSetting().catch(() => null);
    const sitemapOptions =
      settings && settings.sitemap_options
        ? settings.sitemap_options
        : {
            include_products: true,
            include_categories: true,
            include_static_pages: true,
            include_blog_posts: false,
            exclude_out_of_stock: false,
            exclusion_list: "",
          };

    // Fetch all published products, categories, and pages
    const [products, categories, pages] = await Promise.all([
      ProductServices.getShowingStoreProducts({}).then(
        (data) => data.products || [],
      ),
      CategoryServices.getShowingCategory().then((data) => data || []),
      PageServices.getAllPages().then((data) => data || []),
    ]);

    // Generate the XML sitemap
    const sitemap = generateSiteMap(
      products,
      categories,
      pages,
      sitemapOptions,
    );

    // cache
    global.__sitemapCache = { xml: sitemap, ts: Date.now() };

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

export default function SiteMap() {
  // getServerSideProps will handle this
  return null;
}
