'use client'

import { useState, useMemo, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

const PROPERTY_SIZES = [
  '0-800 sq ft',
  '801-1000 sq ft',
  '1001-1200 sq ft',
  '1201-1500 sq ft',
  '1501-1800 sq ft',
  '1801-2000 sq ft',
] as const

const PROPERTY_TYPES = ['Apartment', 'House', 'Townhouse'] as const

// const BASE_PRICE = 169
const BASE_PRICE = 185.94

const FREQUENCIES = {
  oneTime: {
    label: 'One-time Cleaning',
    discount: 0,
  },
  weekly: {
    label: 'Weekly',
    discount: 20,
  },
  biweekly: {
    label: 'Every 2 Weeks',
    discount: 15,
  },
  monthly: {
    label: 'Every 4 Weeks',
    discount: 10,
  },
  moveInOut: {
    label: 'Move-in/Move-out',
    discount: -20,
  },
} as const

export default function PriceCalculator() {
  const [selectedSize, setSelectedSize] = useState(0)
  const [selectedFrequency, setSelectedFrequency] = useState<keyof typeof FREQUENCIES>('oneTime')
  const [selectedType, setSelectedType] = useState<typeof PROPERTY_TYPES[number]>('Apartment')
  const [floor, setFloor] = useState(1)
  const [hasElevator, setHasElevator] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize dark mode from system preference
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Get the current theme from localStorage or system preference
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemPrefersDark))
    }
  }, [])

  // Update theme when isDarkMode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save the theme preference
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
      
      // Update the document class
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode])

  const calculateBasePrice = useMemo(() => {
    const basePrice = BASE_PRICE * Math.pow(1.2, selectedSize)
    
    // No charge for 1st floor or if there's an elevator
    const floorCharge = (!hasElevator && floor > 1) ? (floor - 1) * 30 : 0

    return basePrice + floorCharge
  }, [selectedSize, floor, hasElevator])

  const finalPrice = useMemo(() => {
    let price = calculateBasePrice
    
    // Apply frequency discount/surcharge
    const discount = FREQUENCIES[selectedFrequency].discount
    if (discount > 0) {
      price = price * (1 - discount / 100)
    } else if (discount < 0) {
      price = price * (1 + Math.abs(discount) / 100)
    }
    
    return price
  }, [calculateBasePrice, selectedFrequency])

  const savings = useMemo(() => {
    if (FREQUENCIES[selectedFrequency].discount <= 0) return 0
    return calculateBasePrice - finalPrice
  }, [calculateBasePrice, finalPrice, selectedFrequency])

  return (
    <div className="relative max-w-5xl mx-auto px-8 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-200">
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      <h2 className="text-3xl font-bold text-[#544463] dark:text-purple-300 mb-6 text-center">SOMOS Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Frequency Selection */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Service Frequency</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedFrequency('oneTime')}
                className={twMerge(
                  'btn whitespace-nowrap',
                  selectedFrequency === 'oneTime' ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700' : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                )}
              >
                {FREQUENCIES.oneTime.label}
              </button>
              <button
                onClick={() => setSelectedFrequency('weekly')}
                className={twMerge(
                  'btn whitespace-nowrap',
                  selectedFrequency === 'weekly' ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700' : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                )}
              >
                {FREQUENCIES.weekly.label}
              </button>
              <button
                onClick={() => setSelectedFrequency('biweekly')}
                className={twMerge(
                  'btn whitespace-nowrap',
                  selectedFrequency === 'biweekly' ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700' : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                )}
              >
                {FREQUENCIES.biweekly.label}
              </button>
              <button
                onClick={() => setSelectedFrequency('monthly')}
                className={twMerge(
                  'btn whitespace-nowrap',
                  selectedFrequency === 'monthly' ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700' : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                )}
              >
                {FREQUENCIES.monthly.label}
              </button>
              <button
                onClick={() => setSelectedFrequency('moveInOut')}
                className={twMerge(
                  'btn whitespace-nowrap col-span-2',
                  selectedFrequency === 'moveInOut' ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700' : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                )}
              >
                {FREQUENCIES.moveInOut.label}
              </button>
            </div>
          </div>

          {/* Floor Selection */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Floor Level</h3>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, '4+'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFloor(typeof level === 'string' ? 4 : level)}
                  className={twMerge(
                    'btn',
                    (typeof level === 'string' ? floor >= 4 : floor === level)
                      ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700'
                      : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  )}
                >
                  {level}{level === 1 ? 'st' : level === 2 ? 'nd' : level === 3 ? 'rd' : typeof level === 'string' ? '+' : 'th'}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id="elevator"
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
                className="h-4 w-4 text-[#544463] dark:text-purple-600 rounded border-gray-300 dark:border-gray-600 focus:ring-[#544463] dark:focus:ring-purple-600"
              />
              <label htmlFor="elevator" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Has elevator (no floor charges apply)
              </label>
            </div>
          </div>

          {/* Property Size Selection */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Property Size</h3>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_SIZES.map((size, index) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(index)}
                  className={twMerge(
                    'btn',
                    selectedSize === index
                      ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700'
                      : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type Selection */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Property Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={twMerge(
                    'btn',
                    selectedType === type
                      ? 'btn-primary dark:bg-purple-600 dark:hover:bg-purple-700'
                      : 'btn-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">
          {selectedFrequency === 'moveInOut' ? (
            // Move-in/Move-out price display
            <div>
              <div className="text-gray-600 dark:text-gray-400 mb-2">Move-in/Move-out Price</div>
              <div className="text-4xl font-bold text-[#544463] dark:text-purple-300">
                ${finalPrice.toFixed(2)}
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Includes 20% surcharge for specialized service
              </div>
              {!hasElevator && floor > 1 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Includes ${((floor - 1) * 30).toFixed(2)} floor charge
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Initial Price */}
              <div className="mb-6">
                <div className="text-gray-600 dark:text-gray-400 mb-2">Initial Cleaning Price</div>
                <div className="text-4xl font-bold text-[#544463] dark:text-purple-300">
                  ${calculateBasePrice.toFixed(2)}
                </div>
                {!hasElevator && floor > 1 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Includes ${((floor - 1) * 30).toFixed(2)} floor charge
                  </div>
                )}
              </div>

              {/* Discounted Price */}
              {selectedFrequency !== 'oneTime' && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 w-full">
                  <div className="text-gray-600 dark:text-gray-400 mb-2">
                    {FREQUENCIES[selectedFrequency].label} Price
                    {FREQUENCIES[selectedFrequency].discount > 0 && ' (Starting Week 2)'}
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                    ${finalPrice.toFixed(2)}
                  </div>
                  
                  {FREQUENCIES[selectedFrequency].discount > 0 && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-500">
                      You save ${savings.toFixed(2)} ({FREQUENCIES[selectedFrequency].discount}% off)
                      <br />
                      <span className="text-gray-500 dark:text-gray-400">Discount applies from the second service onwards</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
