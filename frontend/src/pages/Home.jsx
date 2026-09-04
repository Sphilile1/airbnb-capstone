import { Camera, CookingPot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BrandMark from '../components/BrandMark';

const destinations = [
  ['Cape Town', 'Sea, mountains and city life', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80'],
  ['Johannesburg', 'Urban stays and culture', 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=900&q=80'],
  ['Durban', 'Warm beaches and ocean views', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'],
  ['Pretoria', 'Relaxed city getaways', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80']
];

const getawayTabs = {
  'Arts & culture': ['Phoenix', 'Hot Springs', 'Los Angeles', 'San Diego', 'San Francisco', 'Barcelona', 'Prague', 'Washington'],
  'Outdoor adventure': ['Drakensberg', 'Knysna', 'Clarens', 'Hermanus', 'Sabie', 'Cederberg', 'Hazyview', 'Storms River'],
  'Mountain cabins': ['Dullstroom', 'Underberg', 'Magaliesburg', 'Graskop', 'Haenertsburg', 'Hogsback', 'Montagu', 'Citrusdal'],
  'Beach destinations': ['Durban', 'Umhlanga', 'Ballito', 'Cape Town', 'Plett', 'Jeffreys Bay', 'Port Alfred', 'Margate']
};

const stayServices = [
  [Sparkles, 'Cleaning', 'Make your stay even easier with trusted cleaning help.'],
  [CookingPot, 'Private chef', 'Turn a night in into a memorable local dining experience.'],
  [Camera, 'Photography', 'Capture your trip with a local photography experience.']
];

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Arts & culture');

  return (
    <>
      <section className="hero">
        <div className="hero-overlay">
          <p>Not sure where to go? Perfect.</p>
          <button onClick={() => navigate('/locations')}>I'm flexible</button>
        </div>
      </section>

      <section className="section">
        <h2>Inspiration for your next trip</h2>
        <div className="destination-grid">
          {destinations.map(([name, text, img]) => (
            <button className="destination-card" key={name} onClick={() => navigate(`/locations?location=${encodeURIComponent(name)}`)}>
              <img src={img} alt={`${name} destination`} onError={e => { e.currentTarget.src = '/listing-placeholder.svg'; }} />
              <div><h3>{name}</h3><p>{text}</p></div>
            </button>
          ))}
        </div>
      </section>

      <section className="section" id="experiences">
        <h2>Discover Airbnb Experiences</h2>
        <div className="experience-grid">
          <article className="experience-card experience-one">
            <div><h2>Things to do on your trip</h2><button onClick={() => navigate('/locations')}>Experiences</button></div>
          </article>
          <article className="experience-card experience-two">
            <div><h2>Things to do from home</h2><button onClick={() => navigate('/locations')}>Online Experiences</button></div>
          </article>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-heading-row">
          <div><p className="eyebrow">Make your stay easier</p><h2>Services for your stay</h2></div>
        </div>
        <div className="service-grid">
          {stayServices.map(([Icon, title, text]) => (
            <button className="service-card" key={title} onClick={() => navigate('/locations')}>
              <span className="service-icon"><Icon size={25} strokeWidth={1.8} /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </button>
          ))}
        </div>
      </section>

      <section className="shop-section section">
        <div className="shop-copy">
          <p className="eyebrow">Give the gift of travel</p>
          <h2>Shop Airbnb gift cards</h2>
          <p>Help someone discover their next unforgettable stay or experience.</p>
          <button onClick={() => navigate('/locations')}>Shop now</button>
        </div>
        <div className="gift-stage" aria-label="Airbnb gift card illustration">
          <div className="gift-card gift-card-back"></div>
          <div className="gift-card gift-card-front">
            <BrandMark size={58} />
            <div><strong>airbnb</strong><span>gift card</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Inspiration for future getaways</h2>
        <div className="tabs">
          {Object.keys(getawayTabs).map(tab => (
            <button className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>
          ))}
        </div>
        <div className="future-grid">
          {getawayTabs[activeTab].map(city => (
            <button key={city} onClick={() => navigate(`/locations?location=${encodeURIComponent(city)}`)}>
              <strong>{city}</strong><span>Vacation rentals</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
