import { useState } from "react";
import Page from "components/Page";
import Footer from "components/Footer";
import GalleonExperiment from "./views/Galleon";
import ControlExperiment from "./views/Control";

const HomePage = () => {
  const [experiment, setExperiment] = useState<string>("GALLEON");
  
  const projects = [
    { name: 'Royal Fortune Fund', value: 'DBL', description: 'Galleon DAO $ETH Fund', experiment: 'GALLEON' },
    { name: 'Control Point Fund', value: 'ETH', description: 'Capture to Earn', experiment: 'CONTROL' },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Page>
      <>
        <div className="border-b border-b-theme-pan-navy pb-6">
          <h2 className="text-2xl  font-morion font-bold text-theme-pan-navy">Cursed Fund Experiments</h2>
          <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {projects.map((project) => (
              <li onClick={() => { setExperiment(project.experiment) }} className="col-span-1 hover:bg-theme-sky  cursor-pointer flex rounded-2xl">
                <div
                  className={classNames(
                    experiment === project.experiment ? 'bg-theme-pan-sky' : 'bg-theme-pan-navy',
                    ' flex-shrink-0 flex items-center justify-center w-16 text-theme-pan-champagne text-sm font-medium border border-theme-pan-navy rounded-l-2xl'
                  )}
                >
                  {project.value}
                </div>
                <div className="flex flex-1 items-center justify-between truncate rounded-r-2xl border-t border-r border-b border-theme-pan-navy bg-white">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <div className="font-medium text-theme-pan-navy hover:text-theme-pan-navy">
                      {project.name}
                    </div>
                    <p className="text-theme-pan-sky">{project.description}</p>
                  </div>

                </div>

              </li>

            ))}
          </ul>
        </div>
        {
          experiment === 'GALLEON' ? <GalleonExperiment></GalleonExperiment> :
            experiment === 'CONTROL' ? <ControlExperiment></ControlExperiment> :
              <GalleonExperiment></GalleonExperiment>
        }
        <Footer></Footer>
      </>
    </Page>
  );
};

export default HomePage;
