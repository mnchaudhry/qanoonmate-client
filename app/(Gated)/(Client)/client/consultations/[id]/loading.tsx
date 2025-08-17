export default function ConsultationDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="bg-gray-200 h-24 rounded-lg"></div>
      </div>
      
      <div className="space-y-6">
        {/* Lawyer Information skeleton */}
        <div className="border rounded-lg animate-pulse">
          <div className="bg-gray-100 p-4 border-b">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Consultation Details skeleton */}
        <div className="border rounded-lg animate-pulse">
          <div className="bg-gray-100 p-4 border-b">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* More skeleton items */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="border rounded-lg animate-pulse">
            <div className="bg-gray-100 p-4 border-b">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="p-4">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
