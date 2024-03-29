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
    {
      name: "Control Point Fund",
      value: "ETH",
      description: "Capture to Earn",
      experiment: "CONTROL",
      router: "control",
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="relative px-6 lg:px-8">
      <div className="mx-auto max-w-3xl pt-20 pb-8 sm:pt-48 sm:pb-8">
        <div>
          <p className="mb-6 py-4 text-xl rounded-2xl border border-theme-pan-sky font-bold leading-8 text-theme-pan-copper sm:text-center">
            Cursed Fund & the below experiments are currently dormant.
          </p>
          <div className="opacity-50">
            <h1 className="text-4xl font-morion font-bold tracking-tight sm:text-center sm:text-6xl">
              Cursed Fund
            </h1>
            <p className="mt-6 text-lg leading-8 text-theme-pan-navy sm:text-center">
              Social fund experiment with the
              <a
                target={"_blank"}
                className="text-theme-pan-sky"
                href="https://twitter.com/cursedpirates"
                rel="noreferrer"
              >
                {" "}
                Cursed Pirates{" "}
              </a>
              NFT Community.
            </p>

            <div className="mt-8 flex gap-x-4 sm:justify-center">
              <div className="border-b border-b-theme-pan-navy pb-6">
                <h2 className="text-2xl  font-morion font-bold text-theme-pan-navy text-center"></h2>
                <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-1 sm:gap-6 md:grid-cols-2">
                  {projects.map((project) => (
                    <Link key={project.name} to={project.router}>
                      <li
                        onClick={() => {
                          setExperiment(project.experiment);
                        }}
                        className="col-span-1 hover:bg-theme-sky  cursor-pointer flex rounded-2xl"
                      >
                        <div
                          className={classNames(
                            experiment === project.experiment
                              ? "bg-theme-pan-sky"
                              : "bg-theme-pan-navy",
                            " flex-shrink-0 flex items-center justify-center w-16 text-theme-pan-champagne text-sm font-medium border border-theme-pan-navy rounded-l-2xl"
                          )}
                        >
                          {project.value}
                        </div>
                        <div className="flex flex-1 items-center justify-between truncate rounded-r-2xl border-t border-r border-b border-theme-pan-navy bg-white">
                          <div className="flex-1 truncate px-4 py-2 text-sm">
                            <div className="font-medium text-theme-pan-navy hover:text-theme-pan-navy">
                              {project.name}
                            </div>
                            <p className="text-theme-pan-sky">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
