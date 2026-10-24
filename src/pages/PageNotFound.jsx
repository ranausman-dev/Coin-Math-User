import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div>
            <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-10 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
                <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                    <div class="relative">
                        <div class="">
                            <div className='py-5'>
                                <img src="https://i.ibb.co/G9DC8S0/404-2.png" alt="404" className='h-20' />
                            </div>
                            <div>
                                <h1 class="my-2 text-white font-bold text-2xl">
                                    Looks like you've found the
                                    doorway to the great nothing
                                </h1>
                                <p class="my-2 text-white">Sorry about that! Please visit our hompage to get where you need to go.</p>
                                <Link to="/">
                                    <button class="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">Take me there!</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
                </div>
            </div>
        </div>
    )
}

export default PageNotFound
