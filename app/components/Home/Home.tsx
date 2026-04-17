import React from 'react';
import Hero from './Hero/Hero';
import Destinations from './Destinations/Destinations'
import WhyUs from './WhyUs/WhyUs';
import Review from './Review/Review';
import News from './News/News';
import SendUsEmailMain from '../SendUsEmail/SendUsEmailMain';
import FAQAccordion from './FAQAccordion/FAQAccordion';
import BestTimeToVisit from './BestTimeToVisit/BestTimeToVisit'
import AdsterraBanner from '../AdsterraBanner';






const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <WhyUs />
      
      <Destinations />
      <Review />
      <News />
      <FAQAccordion />
      <AdsterraBanner />
      <BestTimeToVisit />
      <SendUsEmailMain />
      
   
           
    </div>
  );
};

export default Home;
