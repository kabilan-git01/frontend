import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, EmptyState } from '../components/ui/SectionHeader';
import Button, { WishlistButton } from '../components/ui/Button';
import { useApp } from '../context/AppProvider';
import { formatCurrency } from '../utils/helpers';

export default function TrainerDetail() {
  const { slug } = useParams();
  const { trainers, addToCart } = useApp();
  const trainer = trainers.find((t) => t.slug === slug || t.id === slug);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [booked, setBooked] = useState(false);

  if (!trainer) {
    return (
      <EmptyState
        icon="fa-user"
        title="Trainer Not Found"
        description="The trainer profile you're looking for doesn't exist."
        action={<Button to="/trainers">Browse Trainers</Button>}
      />
    );
  }

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedSlot || !bookingDate) return;
    addToCart({
      id: trainer.id,
      name: `Session with ${trainer.name}`,
      price: trainer.sessionPrice,
      type: 'trainer',
      image: trainer.image,
      meta: { slot: selectedSlot, date: bookingDate },
    });
    setBooked(true);
  };

  return (
    <div>
      <PageHeader title={trainer.name} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Trainers', to: '/trainers' }, { label: trainer.name }]} />

      <section className="section-padding">
        <div className="container-titan">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden shadow-card">
                <img src={trainer.image} alt={trainer.name} className="w-full aspect-[3/4] object-cover" />
                <div className="absolute top-4 right-4">
                  <WishlistButton item={trainer} type="trainer" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                {Object.entries(trainer?.socials || {}).map(([platform, url]) => (
                  <a key={platform} href={url} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-titan-red hover:text-titan-red transition-all">
                    <i className={`fa-brands fa-${platform}`} />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <span className="text-titan-red text-sm font-semibold uppercase tracking-wider">{trainer.specialty}</span>
              <h2 className="text-3xl font-heading font-bold mt-2 mb-4">{trainer.name}</h2>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="glass-card px-4 py-2 text-sm"><i className="fa-solid fa-star text-yellow-400 mr-2" />{trainer.rating} Rating</div>
                <div className="glass-card px-4 py-2 text-sm"><i className="fa-solid fa-briefcase text-titan-red mr-2" />{trainer.experience}</div>
                <div className="glass-card px-4 py-2 text-sm"><i className="fa-solid fa-users text-titan-red mr-2" />{trainer.sessionsCompleted}+ Sessions</div>
              </div>

              <p className="text-titan-secondary mb-6 leading-relaxed">{trainer.bio}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {(trainer?.certs || []).map((cert) => (
                  <span key={cert} className="px-3 py-1 text-xs font-semibold uppercase bg-titan-red/10 border border-titan-red/30 rounded-full text-titan-red">{cert}</span>
                ))}
              </div>

              {/* Booking UI */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-heading font-bold mb-4">Book a Session</h3>
                <p className="text-titan-secondary text-sm mb-4">Session rate: <span className="text-titan-red font-bold">{formatCurrency(trainer.sessionPrice)}</span></p>

                {booked ? (
                  <div className="text-center py-6">
                    <i className="fa-solid fa-circle-check text-4xl text-green-400 mb-3" />
                    <p className="font-semibold">Session added to cart!</p>
                    <div className="flex gap-3 justify-center mt-4">
                      <Button to="/cart">View Cart</Button>
                      <Button variant="secondary" onClick={() => setBooked(false)}>Book Another</Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBook} className="space-y-4">
                    <div>
                      <label className="block text-sm text-titan-secondary mb-2">Select Date</label>
                      <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="input-field" required min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm text-titan-secondary mb-2">Available Slots</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(trainer?.availability || []).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                              selectedSlot === slot ? 'bg-titan-red border-titan-red text-white' : 'border-white/20 hover:border-titan-red/50'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={!selectedSlot || !bookingDate}>
                      Book Session — {formatCurrency(trainer.sessionPrice)}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
