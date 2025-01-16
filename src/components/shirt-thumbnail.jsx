// export function ShirtThumbnail({ position = 'front', markerPosition = 'center', selected = false }) {
//     return (
//       <div className={`relative w-full aspect-[3/4] ${selected ? 'border-2 border-green-500' : 'border border-gray-200'} rounded-lg p-1`}>
//         <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
//           {/* T-shirt base */}
//           <path 
//             d="M2 8L7 2H17L22 8L20 14V30H4V14L2 8Z" 
//             fill="white" 
//             stroke="currentColor" 
//             strokeWidth="1"
//           />
//           {/* Collar */}
//           <path 
//             d="M7 2L12 4L17 2" 
//             stroke="currentColor" 
//             strokeWidth="1" 
//             fill="none"
//           />
//           {/* Sleeves */}
//           <path 
//             d="M2 8L0 12M22 8L24 12" 
//             stroke="currentColor" 
//             strokeWidth="1"
//           />
          
//           {/* Logo marker */}
//           {position === 'front' && markerPosition === 'full' && (
//             <rect x="6" y="6" width="12" height="16" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'front' && markerPosition === 'center' && (
//             <rect x="9" y="8" width="6" height="6" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'front' && markerPosition === 'across' && (
//             <rect x="6" y="8" width="12" height="4" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'back' && markerPosition === 'full' && (
//             <rect x="6" y="6" width="12" height="16" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'back' && markerPosition === 'center' && (
//             <rect x="9" y="8" width="6" height="6" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'back' && markerPosition === 'across' && (
//             <rect x="6" y="8" width="12" height="4" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'left' && (
//             <rect x="4" y="8" width="4" height="6" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'right' && (
//             <rect x="16" y="8" width="4" height="6" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'left-sleeve' && (
//             <rect x="2" y="8" width="3" height="4" className="fill-green-500 opacity-30" />
//           )}
//           {position === 'right-sleeve' && (
//             <rect x="19" y="8" width="3" height="4" className="fill-green-500 opacity-30" />
//           )}
//         </svg>
//       </div>
//     )
//   }
export function ShirtThumbnail({ position = 'front', markerPosition = 'center', selected = false }) {
    return (
      <div className={`relative w-full aspect-[3/4] ${selected ? 'border-2 border-green-500' : 'border border-gray-200'} rounded-lg p-1 overflow-hidden`}>
        <div className="relative w-full h-full">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TShirts-lIKWpvDzwATNtDb7IHlSziE6nT4kX4.png"
            alt="T-shirt template"
            className="w-full h-full object-contain"
          />
          {/* Logo position markers */}
          <div className={`absolute ${getMarkerPosition(position, markerPosition)}`}>
            <div className="bg-green-500 opacity-30 rounded-sm" style={getMarkerSize(markerPosition)}></div>
          </div>
        </div>
      </div>
    )
  }
  
  function getMarkerPosition(position, marker) {
    const positions = {
      'front': {
        'full': 'inset-6',
        'center': 'left-[40%] right-[40%] top-[35%] bottom-[45%]',
        'across': 'left-6 right-6 top-[35%] h-6',
        'left': 'left-6 w-8 top-[35%] bottom-[45%]',
        'right': 'right-6 w-8 top-[35%] bottom-[45%]',
        'left-sleeve': 'left-1 w-4 top-[25%] h-6',
        'right-sleeve': 'right-1 w-4 top-[25%] h-6'
      },
      'back': {
        'full': 'inset-6',
        'center': 'left-[40%] right-[40%] top-[35%] bottom-[45%]',
        'across': 'left-6 right-6 top-[35%] h-6',
        'left': 'left-6 w-8 top-[35%] bottom-[45%]',
        'right': 'right-6 w-8 top-[35%] bottom-[45%]'
      }
    }
  
    return positions[position]?.[marker] || 'hidden'
  }
  
  function getMarkerSize(marker) {
    const sizes = {
      'full': { width: '70%', height: '70%' },
      'center': { width: '20%', height: '20%' },
      'across': { width: '70%', height: '15%' },
      'left': { width: '15%', height: '20%' },
      'right': { width: '15%', height: '20%' },
      'left-sleeve': { width: '12%', height: '15%' },
      'right-sleeve': { width: '12%', height: '15%' }
    }
  
    return sizes[marker] || { width: '20%', height: '20%' }
  }
  
  
  
  