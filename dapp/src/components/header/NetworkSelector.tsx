import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { useEthers } from "@usedapp/core";

import { MAINNET, SUPPORTED_CHAINS } from "constants/chains";
import { useNetwork } from "hooks/useNetwork";
import { classNames } from "utils";

const NetworkSelector = () => {
  const { chainId } = useEthers();
  const { changeNetwork } = useNetwork();

  const [selected, setSelected] = useState(
    SUPPORTED_CHAINS.find((x) => x.chainId === chainId) ?? MAINNET
  );

  const setNetwork = (network) => {
    changeNetwork(network.chainId);
    setSelected(network);
  };

  useEffect(() => {
    setNetwork(SUPPORTED_CHAINS.find((x) => x.chainId === chainId) ?? MAINNET);
  }, [chainId]);

  return (
    <div className="inline-flex ml-4">
      <Listbox value={selected} onChange={setNetwork}>
        {({ open }) => (
          <>
            <div className="mt-1 relative">
              <Listbox.Button className="theme-sky relative  w-full border-2 border-theme-pan-champagne cursor-pointer  bg-theme-pan-champagne rounded-xl pl-3 pr-10 py-1.5 text-left  focus:outline-none focus:ring-1 focus:ring-theme-pan-champagne focus:border-theme-pan-champagne font-medium ">
                <span className="block truncat  text-theme-pan-navy">
                  {selected.name}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-theme-pan-navy"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="fixed bg-white z-10 mt-1 theme-sky shadow-md max-h-60 rounded-xl py-1 text-base ring-1 ring-theme-pan-navy ring-opacity-5 overflow-auto focus:outline-none font-medium ">
                  {SUPPORTED_CHAINS.map((network) => (
                    <Listbox.Option
                      key={network.chainId}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "text-theme-pan-navy bg-theme-pan-champagne"
                            : "text-gray-900",
                          "select-none relative py-2 pl-3 pr-9 cursor-pointer "
                        )
                      }
                      value={network}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "" : "font-normal",
                              "block truncate"
                            )}
                          >
                            <img
                              className="h-5 -translate-y-1 inline-flex w-auto pr-2"
                              src={
                                network.name === "Ethereum"
                                  ? "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/81d9f/eth-diamond-black.webp"
                                  : network.icon
                              }
                              alt="network logo"
                            />
                            {network.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active
                                  ? "text-theme-pan-navy"
                                  : "text-indigo-600",
                                "absolute  inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5 pl-1"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};
export default NetworkSelector;
