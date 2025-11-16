import {getTicketById} from '@/actions/ticket.actions';
import { logEvent } from '@/utils/sentry';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPriorityClass } from '@/utils/ui';

const TicketDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    logEvent(
      `Ticket with ID: ${id} not found - rendering 404`,
      'ticket',
      { ticketId: id },
      'info'
    );
    return notFound();
  }
  logEvent(
    `Rendering details page for ticket ID: ${id}`,
    'ticket',
    { ticketId: id },
    'info'
  );

  return (
    <div className='min-h-screen bg-blue-50 p-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8 text-center text-blue-600'>
          Ticket Details
        </h1>
        
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold mb-2 text-blue-700'>{ticket.subject}</h2>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2 text-gray-700'>Description</h3>
            <p className='text-gray-700'>{ticket.description}</p>
          </div>

          <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(ticket.priority)}`}>
              {ticket.priority} Priority
            </span>
            <span className='text-gray-500 text-sm'>
              Created at: {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>

          <div className='pt-4'>
            <Link
              href='/tickets'
              className='inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition'
            >
              ← Back to Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;