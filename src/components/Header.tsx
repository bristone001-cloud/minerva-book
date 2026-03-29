import { ShoppingCart } from 'lucide-react';

interface Props {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
}

export const Header = ({ cartCount, onCartClick, onLogoClick }: Props) => {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <div style={styles.logo} onClick={onLogoClick}>
          <div style={styles.logoIcon}>M</div>
          <h1 style={styles.logoText}>Minerva</h1>
        </div>
        
        <nav style={styles.nav}>
          <button onClick={onCartClick} style={styles.cartBtn}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
};

const styles: Record<string, any> = {
  header: {
    position: 'sticky' as const,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--color-border)',
    zIndex: 1000,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '72px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 900,
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 800,
    color: 'var(--color-text)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  cartBtn: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  badge: {
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
    padding: '0 6px',
    border: '2px solid #fff',
  },
};

export default Header;
