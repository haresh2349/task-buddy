import {BeatLoader} from "react-spinners"
interface ConfirmationProps {
    closeMethod:() => void;
    confirmMethod:() => void;
    title:string;
    isLoading?:boolean;
    message:string;
}
export  const ConfirmAction = ({closeMethod,confirmMethod,title,message,isLoading}:ConfirmationProps) => {
    return  <div className="absolute inset-0 bg-gray-500/50 z-5 flex justify-center items-center">
        <div className='rounded bg-[#FFF] z-10 w-[20%] rounded-xl shadow-[rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset]'>
            <h3 className="text-lg font-medium text-gray-900 px-3 py-2 border-b border-[#cecece]">
              {title}
            </h3>
            <div className="p-4">
                <p className="text-sm text-gray-500">{message}</p>

                <div className="mt-4 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={closeMethod}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 cursor-pointer"
                >
                    {'Cancel'}
                </button>
                <button
                    type="button"
                    onClick={confirmMethod}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer ${
                    "danger" === 'danger' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : "neutral" === 'neutral' 
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? <BeatLoader color="#FFF" /> : 'Confirm'}
                </button>
                </div>
            </div>
        </div>
    </div>
}