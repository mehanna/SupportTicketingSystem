'use client';
import { useActionState,useEffect} from "react";
import { useRouter } from "next/navigation";
import {createTicket} from '@/actions/ticket.actions';
import {toast} from 'sonner';



const NewTicketForm = () => {

    // this is react 19's new way of handling server actions' state
    // useActionState is a React 19 hook that allows you to manage the state 
    // returned by a server action
    const [state, FormAction] = useActionState(createTicket, {
       success: false,
       message: ''
    });

    // useEffect when state.success changes to true, navigate to /tickets
    const router = useRouter();
    useEffect(() => {
      if (state.success) {
        toast.success('Ticket created successfully!');
        router.push('/tickets');
      }
    }, [state.success, router]);

    return (
        <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-gray-200'>
        <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>
            Submit a Support Ticket
        </h1>
        {state.message && !state.success && ( 
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {state.message}
          </div>
        )}


        <form action={FormAction} className='space-y-4 text-gray-700'>
            <input
            className='w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='text'
            name='subject'
            placeholder='Subject'
            />
            <textarea
            className='w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            name='description'
            placeholder='Describe your issue'
            rows={4}
            />
            <select
            className='w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700'
            name='priority'
            defaultValue='Low'
            >
            <option value='Low'>Low Priority</option>
            <option value='Medium'>Medium Priority</option>
            <option value='High'>High Priority</option>
            </select>
            <button
            className='w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-50'
            type='submit'
            >
            Submit
            </button>
        </form>
        </div>
  );
}

export default NewTicketForm;