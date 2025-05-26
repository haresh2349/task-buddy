import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";
import { useEffect, useState } from "react";
import { handleGetTodos } from "../../pages/dashboard/managers/todos-manager";

export const Pagination = () => {
  const dispatch = useAppDispatch();
  const {
    paginationDetails: { page, hasNextPage, limit },
  } = useAppSelector((store) => store.todos);
  const [currentRange, setCurrentRange] = useState({
    min: 1,
    max: 15,
    page: page,
  });

  const handleNext = () => {
    setCurrentRange((prev) => ({
      min: prev.min + limit,
      max: prev.max + limit,
      page: prev?.page + 1,
    }));
    handleGetTodos({
      dispatch,
      pagination: { page: page + 1, limit: 15 },
    });
  };

  const handlePrev = () => {
    setCurrentRange((prev) => ({
      min: prev.min - limit,
      max: prev.max - limit,
      page: prev.page - 1,
    }));
    handleGetTodos({
      dispatch,
      pagination: { page: page - 1, limit: 15 },
    });
  };

  console.log(page, "page");
  return (
    <div className="p-2 flex justify-between items-center gap-2 hover:bg-gray-100">
      <span>{`${currentRange.min} - ${currentRange.max}`}</span>
      <div className="flex gap-6 items-center">
        <button disabled={page === 1} onClick={handlePrev}>
          <GrCaretPrevious color={page === 1 ? "gray" : ""} />
        </button>
        <button disabled={!hasNextPage} onClick={handleNext}>
          <GrCaretNext color={!hasNextPage ? "gray" : ""} />
        </button>
      </div>
    </div>
  );
};
