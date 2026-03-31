import { Minus, Plus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import type { CartItem } from '../App';
import { publicAssetUrl } from '../lib/publicUrl';

interface Props {
  cart: CartItem[];
  subtotal: number;
  shippingFee: number;
  finalTotal: number;
  updateQuantity: (id: string, name: string, delta: number, price: number, imageUrl?: string) => void;
  removeProduct: (id: string) => void;
  onContinue: () => void;
  onCheckout: () => void;
}

const CartView = ({ cart, subtotal, shippingFee, finalTotal, updateQuantity, removeProduct, onContinue, onCheckout }: Props) => {
  return (
    <div style={styles.container}>
      <div className="container" style={styles.inner}>
        <div style={styles.header}>
          <button onClick={onContinue} style={styles.backBtn}>
            <ArrowLeft size={20} />
            <span>계속 쇼핑하기</span>
          </button>
          <h1 style={styles.title}>장바구니</h1>
          <div style={{ width: 100 }}></div> {/* spacer */}
        </div>

        <div style={styles.content}>
          {/* Cart List */}
          <div style={styles.listSection}>
            {cart.length === 0 ? (
              <div style={styles.empty}>
                <p>장바구니가 비어 있습니다.</p>
                <button onClick={onContinue} style={styles.shopBtn}>교재 보러 가기</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={styles.cartRow}>
                  <div style={styles.imgWrapper}>
                    <img src={item.imageUrl ? publicAssetUrl(item.imageUrl) : ''} alt={item.name} style={styles.img} />
                  </div>
                  <div style={styles.info}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <span style={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                  </div>
                  <div style={styles.qtySection}>
                    <div style={styles.stepper}>
                      <button 
                        style={styles.stepBtn} 
                        onClick={() => updateQuantity(item.id, item.name, -1, item.price, item.imageUrl)}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={styles.qtyText}>{item.quantity}</span>
                      <button 
                        style={styles.stepBtn} 
                        onClick={() => updateQuantity(item.id, item.name, 1, item.price, item.imageUrl)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={styles.subtotal}>
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                  <button onClick={() => removeProduct(item.id)} style={styles.removeBtn}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary Section */}
          <div style={styles.summarySection}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>주문 요약</h2>
              
              <div style={styles.summaryRow}>
                <span>상품 금액</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div style={styles.summaryRow}>
                <span>배송비</span>
                <span style={{ color: shippingFee === 0 ? 'var(--color-primary)' : 'inherit', fontWeight: shippingFee === 0 ? 700 : 400 }}>
                  {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>

              <div style={styles.divider} />
              <div style={styles.totalRow}>
                <span>최종 결제 예정 금액</span>
                <span style={styles.totalAmount}>{finalTotal.toLocaleString()}원</span>
              </div>
              <button 
                onClick={onCheckout} 
                disabled={cart.length === 0}
                style={{
                  ...styles.checkoutBtn,
                  opacity: cart.length === 0 ? 0.5 : 1,
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <CreditCard size={20} />
                주문서 작성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '40px 0',
    backgroundColor: '#fff',
    minHeight: '70vh',
  },
  inner: {
    maxWidth: '1000px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    transition: 'all 0.2s ease',
  },
  title: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--color-text)',
    margin: 0,
  },
  content: {
    display: 'flex',
    gap: '40px',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  listSection: {
    flex: 2,
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    borderTop: '2px solid var(--color-text)',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 0',
    color: 'var(--color-text-secondary)',
  },
  shopBtn: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid var(--color-border)',
  },
  imgWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    paddingLeft: '20px',
  },
  itemName: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: '0 0 4px 0',
  },
  itemPrice: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  qtySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '6px',
    borderRadius: '10px',
    gap: '4px',
  },
  stepBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    color: 'var(--color-primary)',
    cursor: 'pointer',
  },
  qtyText: {
    width: '30px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '15px',
  },
  subtotal: {
    minWidth: '100px',
    textAlign: 'right',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  removeBtn: {
    marginLeft: '20px',
    padding: '8px',
    color: '#ff4d4f',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    transition: 'background-color 0.2s ease',
  },
  summarySection: {
    flex: 1,
    minWidth: '320px',
    position: 'sticky',
    top: '100px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '32px',
    border: '2px solid var(--color-text)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: 800,
    marginBottom: '24px',
    color: 'var(--color-text)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  totalAmount: {
    fontSize: '28px',
    fontWeight: 900,
    color: 'var(--color-primary)',
  },
  checkoutBtn: {
    width: '100%',
    padding: '20px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '14px',
    fontSize: '18px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    border: 'none',
    transition: 'transform 0.2s ease',
  },
  notice: {
    marginTop: '20px',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    paddingLeft: '10px',
  }
};

export default CartView;
