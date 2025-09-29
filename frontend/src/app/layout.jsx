import NextThemeProvider from "@/context/ThemeProvider";
import "../styles/globals.css";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";
import { StepProvider } from "@/context/StepContext";
import iranYekanFont from "@/constants/localFont";

export const metadata = {
  title: {
    template: "%s |  ساپلینو ",
    default: "ساپلینو",
  },
  description: "",
};
export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${iranYekanFont.variable} font-sans min-h-screen `}>
        <NextThemeProvider>
          <Providers>
            <StepProvider>
              <Toaster />
              {children}
            </StepProvider>
          </Providers>
        </NextThemeProvider>
      </body>
    </html>
  );
}
