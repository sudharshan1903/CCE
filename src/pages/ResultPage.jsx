import  { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { resultArray as resultDataAtom, userValue as userDataAtom, userCommunity } from '../data/atoms'; // Update the paths as per your project structure
import { Link } from 'react-router-dom';
import { IoIosPrint } from 'react-icons/io';
import { FaDownload, FaHome } from 'react-icons/fa';
import { MdDelete, MdDownloading } from 'react-icons/md';
import AlertPopup from '../components/AlertPopup';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Importing from @hello-pangea/dnd

const ResultPage = () => {
  const community = useRecoilValue(userCommunity);
  const [resultData, setResultData] = useRecoilState(resultDataAtom); // State managed by Recoil
  const userData = useRecoilValue(userDataAtom);
  const [showPopup, setShowPopup] = useState(false);
  const [holdData, setHoldData] = useState(null); // State to hold data for deletion confirmation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resultData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(resultData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (row) => {
    // Show confirmation popup or directly delete
    setShowPopup(true);
    setHoldData(row);
  };

  const confirmDelete = () => {
    if (holdData) {
      setResultData(resultData.filter((item) => item.sNo !== holdData.sNo));
      setShowPopup(false);
      setHoldData(null);
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setHoldData(null);
  };

  const downloadPDF = () => {
    const capture = document.querySelector('.receipt-table');
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const doc = new jsPDF('l', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save('receipt.pdf');
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedResultData = Array.from(resultData);
    const [movedItem] = reorderedResultData.splice(result.source.index, 1);
    reorderedResultData.splice(result.destination.index, 0, movedItem);

    setResultData(reorderedResultData);
  };

  return (
    <div className="m-5 sm:m-10">
      {showPopup && (
        <AlertPopup
          onCancel={cancelDelete}
          onAccept={confirmDelete}
        />
      )}
      <div className="flex items-center gap-10">
        <Link to="/">
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-2">
            <FaHome />
          </div>
        </Link>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-2"
          onClick={() => window.print()}
        >
          <IoIosPrint />
        </button>
        <button
          className="receipt-modal-download-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-2"
          onClick={downloadPDF}
          disabled={loader}
        >
          {loader ? (
            <span>
              <MdDownloading />
            </span>
          ) : (
            <span>
              <FaDownload />
            </span>
          )}
        </button>
      </div>
      <div className="text-center font-bold text-2xl my-5">
        Welcome {userData.name || 'User'}
      </div>
      <div className="receipt-table">
        {resultData.length === 0 ? (
          <span className="text-red-500">No Colleges selected</span>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <table
                  className="min-w-full divide-y divide-gray-200 mx-2 sm:mx-5 m-10"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        S.No
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        Region
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        College Code
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        Name
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        Branch Code
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        Branch Name
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        {community.community}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer">
                        Drop
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((row, index) => (
                      <Draggable key={row.sNo} draggableId={`${row.sNo}`} index={index}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? 'bg-blue-200' : 'bg-white'
                            } hover:bg-blue-200 focus:bg-red-500 active:bg-blue-500 transition-colors duration-100 ease-in-out cursor-pointer`}
                          >
                            <td className="px-3 py-4 whitespace-nowrap">{row.sNo}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{row.region}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{row.collegeCode}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{row.name}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{row.branchCode}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{row.branchName}</td>
                            <td className="px-3 py-4 whitespace-nowrap">{row.community}</td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <MdDelete
                                onClick={() => handleDelete(row)}
                                className="text-red-500 cursor-pointer"
                              />
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
