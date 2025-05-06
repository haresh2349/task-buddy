import { useState, useRef, useEffect } from 'react';
import { 
  MdOutlineMoreHoriz,
  MdOutlineEdit,
  MdOutlineDelete,
} from 'react-icons/md';
import { Todo } from '../../types/todos-types';
import { useAppDispatch } from '../../hooks/app.hooks';
import { setSelectedTodoId, toggleEditTodoModal } from '../../store/slices/todos-slice';
import { formatRelativeDate} from '../../common-managers/common-manager';
import { ConfirmAction } from '../../components/confirm-action/ConfirmAction';
import { handleDeleteTask } from './managers/todos-manager';
import { useDrag } from 'react-dnd';

export const BoardTaskCard = ({ todo,index }:{todo:Todo,index:number}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [showDeleteDailog,setShowDeleteDailog] = useState(false);
  const [deleteLoading,setDeleteLoading] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: todo._id, originalStatus: status, index},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (popoverRef?.current && !popoverRef?.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (id:string) => {
    dispatch(toggleEditTodoModal(true));
    dispatch(setSelectedTodoId(id));
    setIsOpen(false)
  };


  console.log(todo,"todo from card")
  return (
    <>
      <div className="w-full min-h-[80px] md:min-h-[120px] lg:min-h-[150px] relative p-4 bg-white rounded-lg shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          {
            todo?.status === 'done' ? 
            <s className="text-gray-800 font-medium text-sm line-clamp-3 break-words">
              {todo?.title}
            </s> : 
            <p className="text-gray-800 font-medium text-sm line-clamp-3 break-words">
              {todo?.title}
            </p>
          }
          
          <div className="relative" ref={popoverRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <MdOutlineMoreHoriz className="w-5 h-5" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button
                  onClick={() => handleEdit(todo?._id || '')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MdOutlineEdit className="mr-2 w-4 h-4" />
                  Edit
                </button>
                {/* <button
                  onClick={handleDuplicate}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MdOutlineContentCopy className="mr-2 w-4 h-4" />
                  Duplicate
                </button> */}
                <button
                  onClick={() => {
                    setShowDeleteDailog(true);
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <MdOutlineDelete className="mr-2 w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">{todo?.description}</p>
        </div>

        <div className="absolute right-3 bottom-3">
          <p className="text-xs text-gray-500">{todo?.updatedAt ? formatRelativeDate(todo?.updatedAt) : ""}</p>
        </div>
      </div>
      {showDeleteDailog && <ConfirmAction
        title='Delete Task'
        message='Are you sure ?'
        isLoading={deleteLoading}
        closeMethod={() => setShowDeleteDailog(false)}
        confirmMethod={() => handleDeleteTask({ids:todo?._id ? [todo?._id] : [],dispatch,setIsLoading:setDeleteLoading})}
      />}
    </>
  );
};