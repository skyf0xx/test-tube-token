import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <ToastContainer position="top-right" theme="light" />
        </>
    );
}

export default MyApp;
