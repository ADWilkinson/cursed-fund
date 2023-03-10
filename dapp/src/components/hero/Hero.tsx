import { useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [experiment, setExperiment] = useState<string>("");

  const projects = [
    {
      name: "Cursed Fund",
      value: "DBL",
      description: "Social Fund Experiment",
      experiment: "CURSEDPIRATES",
      router: "vote",
    },
    // {
    //   name: "Control Point Fund",
    //   value: "ETH",
    //   description: "Capture to Earn",
    //   experiment: "CONTROL",
    //   router: "control",
    // },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="relative px-6 lg:px-8">
      <div className="mx-auto max-w-3xl pt-20 pb-8 sm:pt-48 sm:pb-8">
        <div>
          <div>
            <h1 className="text-4xl font-morion font-bold tracking-tight sm:text-center sm:text-6xl">
              Cursed Fund
            </h1>
            <p className="mt-6 text-lg leading-8 text-theme-pan-navy sm:text-center">
              Returning with new social experiments in the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
