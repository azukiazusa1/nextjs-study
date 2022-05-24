import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import SEO from '@/components/SEO/SEO';
import { socket, SocketContext } from '@/context/socket';
import usePageView from '@/hooks/usePageview';

function MyApp({ Component, pageProps }: AppProps) {
  usePageView();
  return (
    <>
      <SEO />
      <GoogleAnalytics />
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SocketContext.Provider>
    </>
  );
}
export default MyApp;
