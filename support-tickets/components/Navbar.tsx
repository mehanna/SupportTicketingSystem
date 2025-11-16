import Link from 'next/link';
import { getCurrentUser } from '@/lib/current-user';

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className='bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center'>
      <div>
        <Link href='/' className='text-xl font-bold text-blue-600'>
          QuickTicket
        </Link>
      </div>
      <div className='flex items-center space-x-4'>
        {user ? (
          <>
            <Link
              href='/tickets/new'
              className='text-blue-600 hover:text-blue-900 font-medium transition'
            >
              New Ticket
            </Link>
            <Link
              href='/tickets'
              className='text-blue-600 hover:text-blue-900 font-medium transition'
            >
              My Tickets
            </Link>
            <Link
              href='/logout'
              className='bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition'
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              href='/login'
              className='text-blue-600 hover:text-blue-900 font-medium transition'
            >
              Login
            </Link>
            <Link
              href='/register'
              className='bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition'
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;