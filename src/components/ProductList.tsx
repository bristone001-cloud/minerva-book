import { products } from '../data/products';
import ProductCard from './ProductCard';
import type { CartItem } from '../App';

interface Props {
  cart: CartItem[];
  updateQuantity: (id: string, name: string, delta: number, price: number) => void;
}

const ProductList = ({ cart, updateQuantity }: Props) => {
  // Group products by category
  const categories = products.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <section id="product-list" className="section" style={styles.section}>
      <div className="container">
        {Object.entries(categories).map(([category, categoryProducts]) => (
          <div key={category} style={styles.categorySection}>
            <div style={styles.categoryHeader}>
              <h2 style={styles.categoryTitle}>{category}</h2>
              <div style={styles.categoryDivider} />
            </div>

            {/* Table Header */}
            <div style={styles.tableHeader}>
              <span style={styles.headerLabelImg}>IMG</span>
              <span style={styles.headerLabelTitle}>교재명</span>
              <span style={styles.headerLabelPrice}>단가</span>
              <span style={styles.headerLabelQty}>수량</span>
            </div>

            <div style={styles.list}>
              {categoryProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  cart={cart}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--color-bg)',
    paddingTop: '20px',
    paddingBottom: '80px',
  },
  categorySection: {
    marginBottom: '60px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  categoryTitle: {
    fontSize: '24px',
    fontWeight: 800,
    color: 'var(--color-text)',
    whiteSpace: 'nowrap' as const,
    letterSpacing: '-0.02em',
  },
  categoryDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-border)',
    opacity: 0.5,
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '2px solid var(--color-text)',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.05em',
    backgroundColor: '#fff',
  },
  headerLabelImg: { width: '80px', textAlign: 'center' as const },
  headerLabelTitle: { flex: 1, paddingLeft: '20px' },
  headerLabelPrice: { width: '120px', textAlign: 'right' as const, paddingRight: '40px' },
  headerLabelQty: { width: '150px', textAlign: 'center' as const },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0',
    backgroundColor: '#fff',
    borderRadius: '0 0 12px 12px',
    overflow: 'hidden',
    boxShadow: 'var(--box-shadow)',
  }
};

export default ProductList;


