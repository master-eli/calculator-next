import PriceCalculator from '@/components/PriceCalculator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <PriceCalculator />
    </main>
  )
}
