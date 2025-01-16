'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef(null)

  const testimonials = [
    {
      name: "Wafyank",
      title: "Stayin' Alive",
      comment: "Very nice simple and quick",
      source: "Youtube comment",
      avatar: "https://png.pngtree.com/png-clipart/20190630/original/pngtree-professional-image-of-white-collar-mens-shirts-with-beard-png-image_4154872.jpg"
    },
    {
      name: "Amir Benaouida",
      title: "Stayin' Alive",
      comment: "Great Mockups, I will use it to create creative video ad in my eBay store and merch by amazon ad video. Thankyou to all team. A+++",
      source: "Gumroad review",
      avatar: "https://png.pngtree.com/png-clipart/20190630/original/pngtree-professional-image-of-white-collar-mens-shirts-with-beard-png-image_4154872.jpg"
    },
    {
      name: "Aiden S",
      title: "Stayin' Alive",
      comment: "Excellent way to experiment with different colorways, looking forwards to more products",
      source: "Youtube Comment",
      avatar: "https://png.pngtree.com/png-clipart/20190630/original/pngtree-professional-image-of-white-collar-mens-shirts-with-beard-png-image_4154872.jpg"
    }
  ]

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection
      if (newIndex < 0) newIndex = testimonials.length - 1
      if (newIndex >= testimonials.length) newIndex = 0
      return newIndex
    })
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold mb-8 dark:text-white">
          Don't just take our word for it...
        </h2>
        
        <div className="relative h-[400px] overflow-hidden" ref={containerRef}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[currentIndex, (currentIndex + 1) % 3, (currentIndex + 2) % 3].map((index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-green-500 fill-current" />
                      ))}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {testimonials[index].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[100px]">
                      {testimonials[index].comment}
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonials[index].avatar}
                        alt={testimonials[index].name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {testimonials[index].name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonials[index].source}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => paginate(-1)}
            className="p-2 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="p-2 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </section>
  )
}

