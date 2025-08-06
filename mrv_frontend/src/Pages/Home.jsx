// Pages/Home.js
import React from "react";
import { MainHeading } from "../Components/ui/MainHeading";
import { CardsSection } from "../Components/layouts/CardsSection";
import ReportsButton from "../Components/ui/ReportsButtons";

const Home = () => {
  return (
    <main>
      <div className="flex justify-between mx-2">
        <MainHeading />
        <ReportsButton />
      </div>
      <div className="mx-6">
        <CardsSection />
      </div>
    </main>
  );
};

export default Home;
