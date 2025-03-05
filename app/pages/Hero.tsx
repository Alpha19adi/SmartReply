import Link from 'next/link'
import React from 'react'
import { FaArrowAltCircleRight } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className='w-screen h-screen text-white bg-[#2B1E30] flex flex-col items-center pt-52 md:gap-16 gap-6'>
      <div className='text-4xl  lg:text-5xl font-semibold text-center flex flex-col gap-2'>
          <h1 className=''>
          Hello and welcome to <span className='font-serif' >Smart Reply</span> 
          </h1>
          <h1>Now no worries for what to reply </h1>
      </div>
      <div className='text-2xl lg:text-4xl text-[#62576D] font-semibold text-center flex flex-col gap-2'>
        <h1>Sign up today for free </h1>
      </div>
      <Link href='/signup'>
      <button className='   md:text-xl uppercase p-3 bg-[#FBAD05] rounded-xl text-black font-semibold flex items-center justify-center gap-2' >Get Started Now For free <FaArrowAltCircleRight size={25} /></button>
      </Link >
    </div>
  )
}

export default Hero