import { useEffect, useState } from "react";
import PageTitle from "components/PageTitle";
import { query, orderBy, limit, DocumentData } from "firebase/firestore";
import { db } from "index";
import { collection, getDocs } from "firebase/firestore";
import { CONTROL_SNAPSHOT, GALLEON_SNAPSHOT } from "constants/index";
import { Link } from "react-router-dom";

const Snapshots = () => {
  const [galleonSnapshots, setGalleonSnapshots] = useState<DocumentData[]>([]);
  const [controlSnapshots, setControlSnapshots] = useState<DocumentData[]>([]);

  useEffect(() => {
    const galleonQuery = query(
      collection(db, GALLEON_SNAPSHOT),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    getDocs(galleonQuery).then((snapshot) => {
      const galleonSnapshots = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setGalleonSnapshots(galleonSnapshots);
    });

    const controlQuery = query(
      collection(db, CONTROL_SNAPSHOT),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    getDocs(controlQuery).then((snapshot) => {
      const controlSnapshots = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setControlSnapshots(controlSnapshots);
    });
  }, []);

  return (
    <>
      <div className="block border-none col-span-1 text-center md:w-1/2 m-auto bg-theme-pan-champagne  border-theme-pan-navy  divide-y divide-theme-pan-navy">
        <span className="text-md  text-theme-pan-navy hover:text-theme-pan-sky">
          <Link to="/">Back to Experiments</Link>
        </span>
      </div>

      <PageTitle
        title="Fund Snapshots"
        subtitle="Rebalance weights and participation winners."
      />

      <div className="block  bg-theme-pan-champagne border-t border-b mb-3 border-theme-pan-navy   divide-theme-pan-navy">
        <div className="w-full items-center justify-between p-6 border-none space-x-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-theme-pan-navy">
                  Royal Fortune Fund Snapshots
                </h1>
                <p className="mt-2 text-sm text-theme-pan-sky">
                  Target rebalance weights for the Royal Fortune Fund.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-theme-pan-navy rounded-2xl">
                    <table className="min-w-full divide-y divide-theme-pan-navy">
                      <thead className="bg-white">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-theme-pan-navy sm:pl-6"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-theme-pan-navy"
                          >
                            Total Votes
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-theme-pan-navy"
                          >
                            WETH Allocation
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-theme-pan-navy"
                          >
                            USDC Allocation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-pan-navy bg-white">
                        {galleonSnapshots.length === 0 ? (
                          <>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-theme-pan-navy sm:pl-6">
                              -
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                              -
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                              -
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                              -
                            </td>
                          </>
                        ) : (
                          <>
                            {galleonSnapshots.map((snapshot) => (
                              <tr key={snapshot.timestamp}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-theme-pan-navy sm:pl-6">
                                  {new Date(
                                    snapshot.timestamp
                                  ).toLocaleString()}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                                  {snapshot.totalVotes}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                                  {snapshot.percentBullish}%
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                                  {snapshot.percentBearish}%
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full items-center justify-between p-6 border-none space-x-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-theme-pan-navy">
                  Control Point Snapshots
                </h1>
                <p className="mt-2 text-sm text-theme-pan-sky">
                  Winner of the weekly Control Point Fund & target fund
                  allocation.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-theme-pan-navy rounded-2xl">
                    <table className="min-w-full divide-y divide-theme-pan-navy">
                      <thead className="bg-white">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-theme-pan-navy sm:pl-6"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-theme-pan-navy"
                          >
                            Winner
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-theme-pan-navy"
                          >
                            Fund Allocation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-pan-navy bg-white">
                        {galleonSnapshots.length === 0 ? (
                          <>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-theme-pan-navy sm:pl-6">
                              -
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                              -
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                              -
                            </td>
                          </>
                        ) : (
                          <>
                            {controlSnapshots.map((snapshot) => (
                              <tr key={snapshot.timestamp}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-theme-pan-navy sm:pl-6">
                                  {new Date(
                                    snapshot.timestamp
                                  ).toLocaleString()}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">{`${snapshot.account.slice(
                                  0,
                                  6
                                )}...${snapshot.account.slice(
                                  snapshot.account.length - 4,
                                  snapshot.account.length
                                )}`}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-theme-pan-navy">
                                  100% {snapshot.isBullish ? "WETH" : "USDC"}
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Snapshots;
