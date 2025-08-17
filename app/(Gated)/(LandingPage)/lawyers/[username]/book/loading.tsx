export default function BookingLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-6"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div>
          <div className="h-6 w-64 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-8"></div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="h-6 w-36 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="h-24 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
