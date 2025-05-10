import { useEffect, useState } from 'react';
import Accordion from './accordian/Accordian';
import { useAppSelector } from '../../../../hooks/app.hooks';
import { handlegetGroupedTodos } from '../../managers/todos-manager';
import { GroupedTodos } from '../../../../types/todos-types';

export const TodosList = () => {
    const [openTodos,setOpenTodos] = useState(true);
    const [openInProgress,setOpenInProgress] = useState(true);
    const [openDone,setOpenDone] = useState(true);
    const {todos,paginationDetails} = useAppSelector(store => store.todos);
    const [groupedTodos,setGroupedTodos] = useState<GroupedTodos>({todo:[],inprogress:[],done:[]})
    
    useEffect(() => { 
        setGroupedTodos(handlegetGroupedTodos(todos))
    },[todos])

    
    return <div className={`px-4 py-1 h-[80%] overflow-y-scroll`}>
            <div>
                <div className='w-full flex justify-between items-center p-2'>
                    <p className='w-[40%] hidden md:block font-medium'>Task Name</p>
                    <p className='w-[30%] hidden md:block font-medium'>Due On</p>
                    <p className='w-[20%] hidden md:block font-medium'>Task Status</p>
                    <p className='w-[1rem]'></p>
                    {/* <p></p> */}
                </div>
                <div className='flex flex-col gap-4'>
                    <Accordion status='todo' tasks={groupedTodos?.todo} isOpen={openTodos} toggleSection={setOpenTodos}/>
                    <Accordion status='inprogress' tasks={groupedTodos?.inprogress} isOpen={openInProgress} toggleSection={setOpenInProgress}/>
                    <Accordion status='done' tasks={groupedTodos?.done} isOpen={openDone} toggleSection={setOpenDone}/>
                </div>
            </div>
    </div>
}