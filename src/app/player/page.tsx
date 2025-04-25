'use client';

import Videojs from '../../components/VideoJS';

export default function Page() {
    return (
        <div className='flex flex-col items-center justify-center w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8'> 
            <h1 className='text-2xl font-bold mb-6'>Player Route</h1>
            <div className='w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/5'>
                <Videojs />
            </div>
        </div>
    );
}