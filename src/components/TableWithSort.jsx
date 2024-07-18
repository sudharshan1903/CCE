import React, { useState, useEffect } from "react";
import ButtonComponent from "./ButtonComponent";
import { useRecoilState } from "recoil";
import { resultArray } from "../data/atoms";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import SuccessfullyAdded from "./SuccessfullyAdded";

const TableWithSort = ({ data, community }) => {
  const communityColor = community;
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  // Atoms data
  const [resultData, setResultData] = useRecoilState(resultArray);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedDataByKey = () => {
    if (sortConfig !== null) {
      const sorted = [...data].sort((a, b) => {
        if (
          sortConfig.key === "oc" ||
          sortConfig.key === "bc" ||
          sortConfig.key === "bcm" ||
          sortConfig.key === "mbc"
        ) {
          return sortConfig.direction === "ascending"
            ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
            : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  };

  // Add data to the ResultPage
  const handleResult = (row) => {
    setResultData([...resultData, row]);
    // atom data
    console.log("Atom Data");
    console.log(resultData.length);
    console.log([...resultData, row]);
  };

  React.useEffect(() => {
    sortedDataByKey();
  }, [sortConfig, data]);

  // Function to handle closing the popup
  const handleClosePopup = () => {
    // Set showPopup to false to hide the popup
    setShowPopup(false);
  };

  useEffect(() => {
    // Close the popup after 3 seconds
    const timeoutId = setTimeout(() => {
      handleClosePopup();
    }, 1000);

    // Cleanup the timeout when component unmounts or when showPopup changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showPopup]);

  return (
    <div className="flex justify-center">
      {showPopup && (
        <SuccessfullyAdded handleClick={handleClosePopup}></SuccessfullyAdded>
      )}
      <table className="min-w-full  divide-y divide-gray-200  sm:mx-3 mx-auto">
        <thead className="bg-blue-100">
          <tr>
            <th
              className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("sNo")}
            >
              <div className="flex justify-center">
                S.No
                {sortConfig && sortConfig.key === "sNo" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleDown size={15} />
                    ) : (
                      <FaArrowCircleUp size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("region")}
            >
              <div className="flex justify-center">
                Region
                {sortConfig && sortConfig.key === "region" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer flex items-center"
              onClick={() => requestSort("collegeCode")}
            >
              College Code
              {sortConfig && sortConfig.key === "collegeCode" && (
                <span className="ml-1">
                  {sortConfig.direction === "ascending" ? (
                    <FaArrowCircleUp size={15} />
                  ) : (
                    <FaArrowCircleDown size={15} />
                  )}
                </span>
              )}
            </th>
            <th
              className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">
                Name
                {sortConfig && sortConfig.key === "name" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className=" px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer "
              onClick={() => requestSort("branchCode")}
            >
              <div className="flex items-center">
                Branch Code
                {sortConfig && sortConfig.key === "branchCode" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleUp size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer flex items-center"
              onClick={() => requestSort("branchName")}
            >
              Branch Name
              {sortConfig && sortConfig.key === "branchName" && (
                <span className="ml-1">
                  {sortConfig.direction === "ascending" ? (
                    <FaArrowCircleUp size={15} />
                  ) : (
                    <FaArrowCircleDown size={15} />
                  )}
                </span>
              )}
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "oc" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("oc")}
            >
              <div className="flex items-center">
                OC
                {sortConfig && sortConfig.key === "oc" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "bc" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("bc")}
            >
              <div className="flex items-center">
                BC
                {sortConfig && sortConfig.key === "bc" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "bcm" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("bcm")}
            >
              <div className="flex items-center">
                BCM
                {sortConfig && sortConfig.key === "bcm" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "mbc" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("mbc")}
            >
              <div className="flex items-center">
                MBC
                {sortConfig && sortConfig.key === "mbc" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "sc" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("sc")}
            >
              <div className="flex items-center">
                SC
                {sortConfig && sortConfig.key === "sc" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "sca" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("sca")}
            >
              <div className="flex items-center">
                SCA
                {sortConfig && sortConfig.key === "sca" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer ${
                communityColor === "st" ? "bg-green-200" : " "
              }`}
              onClick={() => requestSort("st")}
            >
              <div className="flex items-center">
                ST
                {sortConfig && sortConfig.key === "st" && (
                  <span className="ml-1">
                    {sortConfig.direction === "ascending" ? (
                      <FaArrowCircleUp size={15} />
                    ) : (
                      <FaArrowCircleDown size={15} />
                    )}
                  </span>
                )}
              </div>
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
              Add
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="text-xs hover:bg-blue-200 focus:bg-red-500 active:bg-green-500 transition-colors duration-100 ease-in-out cursor-pointer"
            >
              {Object.entries(row).map(([key, value], cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-3 py-4 whitespace-nowrap ${
                    (communityColor === "oc" && cellIndex == 6) ||
                    (communityColor === "bc" && cellIndex == 7) ||
                    (communityColor === "bcm" && cellIndex == 8) ||
                    (communityColor === "mbc" && cellIndex == 9) ||
                    (communityColor === "sc" && cellIndex == 10) ||
                    (communityColor === "sca" && cellIndex == 11) ||
                    (communityColor === "st" && cellIndex == 12)
                      ? "bg-green-200"
                      : " "
                  }`}
                >
                  {value}
                </td>
              ))}
              <td>
                <ButtonComponent
                  styles="bg-blue-600 p-2 rounded-lg text-white hover:bg-green-400 active:bg-green-500 transition-colors duration-100 ease-in-out cursor-pointer"
                  handleClick={() => {
                    handleResult(row);
                    setShowPopup(true);
                  }}
                >
                  Add
                </ButtonComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWithSort;
