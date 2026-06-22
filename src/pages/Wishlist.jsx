import { PageHeader, EmptyState } from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppProvider';
import { formatCurrency } from '../utils/helpers';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart } = useApp();

  if (wishlist.length === 0) {
    return (
      <div>
        <PageHeader title="Wishlist" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <EmptyState
          icon="fa-heart"
          title="Your Wishlist is Empty"
          description="Save your favorite programs and trainers to your wishlist for quick access later."
          action={
            <div className="flex gap-3 justify-center flex-wrap">
              <Button to="/programs">Browse Programs</Button>
              <Button to="/trainers" variant="secondary">Browse Trainers</Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Wishlist" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <section className="section-padding">
        <div className="container-titan max-w-4xl">
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div key={item.wishlistId} className="glass-card p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {item.image && (
                  <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold">{item.name}</h3>
                  <p className="text-titan-muted text-sm capitalize">{item.type}</p>
                  {item.price > 0 && (
                    <p className="text-titan-red font-semibold mt-1">{formatCurrency(item.price)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => moveToCart(item.wishlistId)}>
                    <i className="fa-solid fa-cart-plus" /> Move to Cart
                  </Button>
                  <button
                    onClick={() => removeFromWishlist(item.wishlistId)}
                    className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-lg hover:border-titan-red hover:text-titan-red transition-all"
                    aria-label="Remove from wishlist"
                  >
                    <i className="fa-solid fa-trash-can text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
