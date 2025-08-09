export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Welcome to Your Portfolio
        </h1>
        <p className="text-xl text-neutral-600">
          Modern portfolio website with 3D experiences
        </p>
        <div className="mt-8 space-x-4">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            View Projects
          </button>
          <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}