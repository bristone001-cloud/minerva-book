import { useState } from 'react';
import type { Product } from '../data/products';
import type { CartItem } from '../App';
import { Minus, Plus, ChevronDown, ChevronUp, ShoppingCart, Check } from 'lucide-react';

interface Props {
  product: Product;
  cart: CartItem[];
  updateQuantity: (id: string, name: string, delta: number, price: number, imageUrl?: string) => void;
}

const ProductCard = ({ product, cart, updateQuantity }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localQty, setLocalQty] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if any version of this product is in cart
  const allSetInCart = cart.find(c => c.id === `${product.id}-all`);
  const standaloneInCart = cart.find(c => c.id === product.id);
  const volumeItemsInCart = cart.filter(item => item.id.startsWith(`${product.id}-vol-`));
  const isInCart = !!allSetInCart || !!standaloneInCart || volumeItemsInCart.length > 0;

  const handleAddToCart = () => {
    if (localQty <= 0) return;
    
    if (product.volumes) {
      // Add as Full Set
      updateQuantity(`${product.id}-all`, `${product.name} (전체 세트)`, localQty, (product.price || 15000) * (product.volumes || 1), product.imageUrl);
    } else {
      // Add as Standalone
      updateQuantity(product.id, product.name, localQty, product.price || 15000, product.imageUrl);
    }

    // Feedback
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
    setLocalQty(1); // Reset local qty
  };

  const handleVolumeAdd = (volId: string, volName: string, qty: number) => {
    updateQuantity(volId, volName, qty, product.price || 15000, product.imageUrl);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  return (
    <div style={{ ...styles.rowContainer, borderBottom: '1px solid var(--color-border)' }}>
      <article style={{ ...styles.row, backgroundColor: isInCart ? 'rgba(var(--color-primary-rgb), 0.02)' : '#fff' }}>
        {/* Image Column */}
        <div style={styles.imageColumn}>
          <div style={styles.imageWrapper}>
            <img src={product.imageUrl} alt={product.name} style={styles.image} />
          </div>
        </div>

        {/* Title Column */}
        <div style={styles.titleColumn}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={styles.title}>{product.name}</h3>
            {isInCart && <span style={styles.cartBadge}>담김</span>}
          </div>
          <span style={styles.target}>{product.target}</span>
          {product.volumes && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              style={{ ...styles.volumesToggle, color: isExpanded ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              낱권/호별 선택 {volumeItemsInCart.length > 0 && `(${volumeItemsInCart.length}종 담김)`}
            </button>
          )}
        </div>

        {/* Price Column */}
        <div style={styles.priceColumn}>
          <span style={styles.priceText}>{product.price?.toLocaleString()}원</span>
        </div>

        {/* Action Column */}
        <div style={styles.actionColumn}>
          <div style={styles.stepper}>
            <button style={styles.stepBtn} onClick={() => setLocalQty(Math.max(1, localQty - 1))}>
              <Minus size={16} />
            </button>
            <div style={styles.qtyDisplay}>
              <span style={styles.qtyNum}>{localQty}</span>
              <span style={styles.qtyLabel}>{product.volumes ? '세트' : '권'}</span>
            </div>
            <button style={styles.stepBtn} onClick={() => setLocalQty(localQty + 1)}>
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            style={{ 
              ...styles.addBtn, 
              backgroundColor: showFeedback ? '#22c55e' : 'var(--color-primary)',
              transform: showFeedback ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {showFeedback ? <Check size={18} /> : <ShoppingCart size={18} />}
            <span>{showFeedback ? '담기 완료' : '담기'}</span>
          </button>
        </div>
      </article>

      {/* Expanded Volumes Grid */}
      {product.volumes && (
        <div style={styles.volumesList(isExpanded)}>
          <div style={styles.volumesGrid}>
            {Array.from({ length: product.volumes }).map((_, i) => {
              const volNum = i + 1;
              const formattedVolName = `${product.volumePrefix || ''}${volNum}${product.volumeSuffix || '권'}`;
              const volId = `${product.id}-vol-${volNum}`;
              const volName = `${product.name} (${formattedVolName})`;
              const volQtyInCart = cart.find(c => c.id === volId)?.quantity || 0;

              return (
                <div key={volId} style={styles.volItem(volQtyInCart > 0)}>
                  <span style={styles.volName(volQtyInCart > 0)}>{formattedVolName}</span>
                  <div style={styles.volStepper}>
                    {volQtyInCart > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.volInCartLabel}>{volQtyInCart}권 담김</span>
                        <button style={styles.volAddMini} onClick={() => handleVolumeAdd(volId, volName, 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button style={styles.volAddBtn} onClick={() => handleVolumeAdd(volId, volName, 1)}>
                        담기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, any> = {
  rowContainer: {
    backgroundColor: '#fff',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 24px',
    transition: 'all 0.2s ease',
  },
  imageColumn: {
    width: '80px',
    display: 'flex',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  titleColumn: {
    flex: 1,
    paddingLeft: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '17px',
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: 0,
  },
  cartBadge: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#fff',
    backgroundColor: '#22c55e',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  target: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  volumesToggle: {
    marginTop: '6px',
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    padding: 0,
    cursor: 'pointer',
    width: 'fit-content',
    transition: 'color 0.2s ease',
    border: 'none',
  },
  priceColumn: {
    width: '120px',
    textAlign: 'right',
    paddingRight: '40px',
  },
  priceText: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
  },
  actionColumn: {
    width: '280px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: '10px',
    padding: '4px',
    gap: '4px',
  },
  stepBtn: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },
  qtyDisplay: {
    width: '44px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--color-text)',
    lineHeight: 1,
  },
  qtyLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  addBtn: {
    padding: '12px 20px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '110px',
    justifyContent: 'center',
  },
  volumesList: (expanded: boolean) => ({
    maxHeight: expanded ? '1000px' : '0',
    opacity: expanded ? 1 : 0,
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#fafafa',
    borderTop: expanded ? '1px solid var(--color-border)' : 'none',
  } as React.CSSProperties),
  volumesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    padding: '24px',
  },
  volItem: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: active ? 'rgba(var(--color-primary-rgb), 0.05)' : '#fff',
    borderRadius: '10px',
    border: '1px solid',
    borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
    transition: 'all 0.2s ease',
  } as React.CSSProperties),
  volName: (active: boolean) => ({
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--color-primary)' : 'var(--color-text)',
  } as React.CSSProperties),
  volStepper: {
    display: 'flex',
    alignItems: 'center',
  },
  volAddBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-bg-secondary)',
    borderRadius: '6px',
    cursor: 'pointer',
    border: 'none',
  },
  volInCartLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-primary)',
  },
  volAddMini: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
  }
};

export default ProductCard;


