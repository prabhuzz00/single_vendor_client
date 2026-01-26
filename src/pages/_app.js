import "@styles/custom.css";
import { CartProvider } from "react-use-cart";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy load Tawk chat widget
const TawkMessengerReact = dynamic(
  () => import("@tawk.to/tawk-messenger-react"),
  { ssr: false },
);

// Internal imports
import store from "@redux/store";
import { handlePageView } from "@lib/analytics";
import { UserProvider } from "@context/UserContext";
import DefaultSeo from "@components/common/DefaultSeo";
import { SidebarProvider } from "@context/SidebarContext";
import SettingServices from "@services/SettingServices";

let persistor = persistStore(store);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [storeSetting, setStoreSetting] = useState(null);

  // Register service worker for caching third-party assets (Stripe)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {})
          .catch(() => {});
      });
    }
  }, []);

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const settings = await queryClient.fetchQuery({
          queryKey: ["storeSetting"],
          queryFn: async () => await SettingServices.getStoreSetting(),
          staleTime: 4 * 60 * 1000,
        });

        setStoreSetting(settings);

        // Defer Google Analytics to reduce initial execution time
        if (settings?.google_analytic_status) {
          setTimeout(() => {
            import("react-ga4").then((ReactGA) => {
              ReactGA.default.initialize(settings?.google_analytic_key || "");
              import("@lib/analytics").then(({ handlePageView }) => {
                handlePageView();

                const handleRouteChange = (url) => {
                  handlePageView(`/${router.pathname}`, "InfotechIndia");
                };

                router.events.on("routeChangeComplete", handleRouteChange);
              });
            });
          }, 1000);
        }
      } catch (error) {}
    };

    fetchStoreSettings();
  }, [router]);

  return (
    <>
      <Head>
        <meta name="theme-color" content="#ffffff" />
        {/* Preconnect to image and third-party hosts to reduce resource load delay */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="true"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </Head>

      {/* Render TawkMessengerReact only if tawk_chat_status is enabled */}
      {storeSetting?.tawk_chat_status && (
        <TawkMessengerReact
          propertyId={storeSetting?.tawk_chat_property_id || ""}
          widgetId={storeSetting?.tawk_chat_widget_id || ""}
        />
      )}

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <UserProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <SidebarProvider>
                  <CartProvider>
                    <DefaultSeo />
                    <Component {...pageProps} />
                  </CartProvider>
                </SidebarProvider>
              </PersistGate>
            </Provider>
          </UserProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
