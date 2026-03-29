import type { CartItem } from '../App';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface Props {
  cart: CartItem[];
  totalQty: number;
  onOpenCart: () => void;
}

const StickyCart = ({ cart, totalQty, onOpenCart }: Props) => {
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={styles.wrapper}>
      <div className="container" style={styles.container}>
        <div style={styles.info}>
          <div style={styles.iconWrapper}>
            <ShoppingBag size={20} />
            <span style={styles.countBadge}>{totalQty}</span>
          </div>
          <div style={styles.textGroup}>
            <span style={styles.label}>현재 담은 교재</span>
            <span style={styles.price}>{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
        
        <button onClick={onOpenCart} style={styles.applyBtn}>
          <span>장바구니 확인하기</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, any> = {
  wrapper: {
    position: 'fixed' as const,
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '600px',
    backgroundColor: 'var(--color-text)',
    borderRadius: '24px',
    padding: '16px 24px',
    color: '#fff',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    zIndex: 900,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconWrapper: {
    position: 'relative' as const,
    width: '44px',
    height: '44px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    position: 'absolute' as const,
    top: '-6px',
    right: '-6px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--color-text)',
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 600,
  },
  price: {
    fontSize: '18px',
    fontWeight: 800,
  },
  applyBtn: {
    backgroundColor: '#fff',
    color: 'var(--color-text)',
    padding: '12px 20px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    border: 'none',
    transition: 'transform 0.2s ease',
  }
};

export default StickyCart;
