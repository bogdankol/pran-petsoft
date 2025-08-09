'use client'

import { motion } from "motion/react"

export default function page() {
  return (
    <div className='h-[10000px] bg-bg2 flex justify-center '>
      
      <motion.div
        className='w-[100px] h-[100px] bg-red-500 rounded-full'
        animate={{ rotate: 360 }}
        transition={{ duration: 1 }}
      />


    </div>
  )
}
