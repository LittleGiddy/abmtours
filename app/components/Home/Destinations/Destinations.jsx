import React from 'react'
import SectionHeading from '../../Helper/SectionHeading'
import DestinationSlider from './DestinationSlider'


const Destinations = () => {
  return (
    <div className="pt-20 pb-20">
      
      <SectionHeading heading='A Visual Journey Through the Heart of Our Tours and Safaris' tagline='Explore the wild through our lens, moments from unforgettable tours and safaris.'/>

      {/* section content */}

      <div className="mt-14 w-[80%] mx-auto">
        
         {/* slider */}
      < DestinationSlider />
      </div>

     

      
      
    </div>
  )
}

export default Destinations
