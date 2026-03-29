import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const handleScroll = () => {
    const list = document.getElementById('product-list');
    if (list) {
      list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h1 style={styles.title} className="fade-up">가장 완벽한 독서논술 정규 교재</h1>
        <p style={styles.subtitle} className="fade-up">
          미네르바 교재, 지금 바로 주문하세요.
          <br />
          복잡한 가입 없이, 단 1분 만에 접수가 완료됩니다.
        </p>
        <button 
          style={styles.button} 
          onClick={handleScroll}
          className="fade-up"
        >
          <ChevronDown size={20} style={{ marginRight: 8 }} />
          대표 교재 빠르게 담기
        </button>
      </div>
    </section>
  );
};

const styles = {
  section: {
    paddingTop: '120px',
    paddingBottom: '80px',
    textAlign: 'center' as 'center',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    gap: '24px',
  },
  title: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    color: 'var(--color-primary)',
  },
  subtitle: {
    fontSize: 'clamp(18px, 3vw, 24px)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4,
    marginBottom: '20px',
    animationDelay: '0.1s',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-primary)',
    padding: '16px 32px',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: 600,
    transition: 'var(--transition)',
    animationDelay: '0.2s',
  }
};

export default Hero;
