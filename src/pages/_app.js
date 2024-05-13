import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import MainLayout from "@/components/MainLayout";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  );
}
