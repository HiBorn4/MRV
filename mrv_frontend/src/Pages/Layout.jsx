import React from "react";
import Header from "../Components/shared/Header";
import Footer from "../Components/shared/Footer";


const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
