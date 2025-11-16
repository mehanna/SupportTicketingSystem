import {getTickets} from '@/actions/ticket.actions';
import Link from 'next/link';
import { getPriorityClass } from '@/utils/ui';
import { getCurrentUser } from '@/lib/current-user';
import { redirect } from 'next/navigation';


const TicketsPage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return (redirect('/login'));
    }
    const tickets = await getTickets();

    return (
    <div className='min-h-screen bg-blue-50 p-8 '>
        <h1 className='text-4xl font-bold mb-8 text-center text-blue-600'>
            Support Tickets
        </h1>
        {tickets.length === 0 ? (
            <p className='text-center text-gray-600'>No tickets found.</p>
        ) : (
            <ul className='space-y-4 max-w-3xl mx-auto'>
            {tickets.map((ticket) => (
                <li key={ticket.id} className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
                <Link href={`/tickets/${ticket.id}`}>
                    <h2 className='text-2xl font-semibold mb-2 text-blue-700 hover:text-blue-900 cursor-pointer'>{ticket.subject}</h2>
                </Link>
                <p className='text-gray-700 mb-4'>{ticket.description}</p>
                <div className='flex justify-between items-center'>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority} Priority
                    </span>
                    <span className='text-gray-500 text-sm'>
                    Created at: {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                </div>
                </li>
            ))}
            </ul>
        )}
       
    </div>

);
}
export default TicketsPage;