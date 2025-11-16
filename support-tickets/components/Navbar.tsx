import Link from 'next/link';

const Navbar = async () => {

  return (
    <nav className='bg-white border-b border-gray-200 shadow-md px-6 py-4 flex justify-between items-center'>
      <div>
        <Link href='/' className='text-2xl font-bold text-blue-600 hover:text-blue-700 transition'>
          QuickTicket
        </Link>
      </div>
      <div className='flex items-center space-x-4'>
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

      </div>
    </nav>
  );
};

export default Navbar;