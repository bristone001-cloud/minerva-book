import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Search, RotateCcw, LogOut } from 'lucide-react';

// Type definition based on our schema
interface Order {
  id: string;
  created_at: string;
  buyer_name: string;
  phone_number: string;
  address: string;
  address_detail: string;
  affiliation_type: string;
  affiliation_name: string | null;
  order_items: any[];
  total_qty: number;
  request_memo: string | null;
  status: string;
}

const STATUS_OPTIONS = ['접수완료', '확인중', '연락완료', '완료'];

export default function AdminApp() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    
    // DB 연결 전 UI 테스트용 가짜(Mock) 데이터 출력
    if (import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co' || !import.meta.env.VITE_SUPABASE_URL) {
      setTimeout(() => {
        setOrders([
          {
            id: 'mock-1',
            created_at: new Date().toISOString(),
            buyer_name: '김지은',
            phone_number: '010-1234-5678',
            address: '서울시 서초구 서초대로 397 (부띠크모나코)',
            address_detail: 'B동 2201호',
            affiliation_type: '개인',
            affiliation_name: null,
            order_items: [{ name: '리딩하이 (Reading High)', quantity: 1 }, { name: '쓰기왕 (Writing King)', quantity: 1 }],
            total_qty: 2,
            request_memo: '문 앞에 두시고 문자 부탁드립니다.',
            status: '접수완료'
          },
          {
            id: 'mock-2',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            buyer_name: '박수진',
            phone_number: '010-9876-5432',
            address: '경기도 성남시 분당구 판교역로 146',
            address_detail: '어학원 건물 3층',
            affiliation_type: '학원',
            affiliation_name: '애플수잔어학원',
            order_items: [{ name: '안상헌 글답', quantity: 15 }, { name: '스토리/메타 한국사', quantity: 10 }],
            total_qty: 25,
            request_memo: '학원 운영시간 내 배송 바랍니다.',
            status: '연락완료'
          }
        ]);
        setLoading(false);
      }, 500);
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update for zero-latency feel
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert('상태 변경에 실패했습니다.');
      fetchOrders(); // Revert back
    }
  };

  const handleLogout = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch = searchTerm === '' 
      || o.buyer_name.includes(searchTerm) 
      || o.phone_number.includes(searchTerm)
      || JSON.stringify(o.order_items).includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수완료': return '🔴';
      case '확인중': return '🟡';
      case '연락완료': return '🟢';
      case '완료': return '⚪';
      default: return '⚫';
    }
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!isAuthenticated) {
    return (
      <div style={styles.authWrapper}>
        <div style={styles.authBox}>
          <h2>관리자 로그인</h2>
          <p style={{color: '#86868b', marginBottom: 24, fontSize: '14px', marginTop: 8}}>
            주문 내역 확인을 위해 비밀번호를 입력하세요.<br/>
            (개발용 기본 비밀번호: <strong>minerva123</strong>)
          </p>
          <input 
            type="password" 
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="비밀번호"
            style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (password === 'minerva123') setIsAuthenticated(true);
                else alert('비밀번호가 일치하지 않습니다.');
              }
            }}
          />
          <button style={styles.loginBtn} onClick={() => {
            if (password === 'minerva123') setIsAuthenticated(true);
            else alert('비밀번호가 일치하지 않습니다.');
          }}>들어가기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>⚙️ 미네르바 독서논술 관리자</div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 4 }} /> 일반 화면으로
        </button>
      </header>

      {/* Control Panel */}
      <div style={styles.controlPanel}>
        <div style={styles.searchRow}>
          <div style={styles.searchBox}>
            <Search size={20} color="var(--color-text-secondary)" />
            <input 
              style={styles.searchInput}
              placeholder="주문자명 / 연락처 / 상품명 통합 검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button style={styles.btn} onClick={() => setSearchTerm('')}>
            <RotateCcw size={16} /> 초기화
          </button>
          <button style={styles.btnOutline} onClick={fetchOrders}>
            새로고침
          </button>
        </div>

        <div style={styles.filterRow}>
          <button 
            style={statusFilter === 'ALL' ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => setStatusFilter('ALL')}
          >
            ⬛ 전체보기 ({orders.length})
          </button>
          {STATUS_OPTIONS.map(status => (
            <button 
              key={status}
              style={statusFilter === status ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setStatusFilter(status)}
            >
              {getStatusColor(status)} {status} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>주문일시 ⬇️</th>
              <th style={styles.th}>이름 (분류)</th>
              <th style={styles.th}>연락처</th>
              <th style={styles.th}>주문 상품 (수량)</th>
              <th style={styles.th}>배송지 / 기타 요청사항</th>
              <th style={styles.th}>⚙️ 상태 변경</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>데이터를 불러오는 중입니다...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>조건에 맞는 주문 내역이 없습니다. (Supabase 연결이 필요할 수 있습니다)</td></tr>
            ) : (
              filteredOrders.map(order => {
                const dateStr = new Date(order.created_at).toLocaleString('ko-KR', {
                  month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                });
                const affiliation = order.affiliation_name 
                  ? `${order.affiliation_type}-${order.affiliation_name}` 
                  : order.affiliation_type;

                return (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>{dateStr}</td>
                    <td style={styles.td}>
                      <strong>{order.buyer_name}</strong><br/>
                      <span style={styles.subtext}>({affiliation})</span>
                    </td>
                    <td style={styles.td}>{order.phone_number}</td>
                    <td style={styles.td}>
                      {order.order_items.map((item, idx) => (
                        <div key={idx}>{item.name} ({item.quantity}권)</div>
                      ))}
                      <div style={styles.boldtext}>총 {order.total_qty}권</div>
                    </td>
                    <td style={styles.td}>
                      {order.address} {order.address_detail}<br/>
                      <span style={{ color: 'var(--color-accent)' }}>{order.request_memo || '(요청사항 없음)'}</span>
                    </td>
                    <td style={styles.td}>
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={styles.select(order.status)}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{getStatusColor(opt)} {opt}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '24px',
    fontFamily: 'var(--font-family)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    backgroundColor: '#fff',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    fontWeight: 600,
  },
  controlPanel: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '0 12px',
    flex: 1,
    height: '44px',
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    flex: 1,
    padding: '0 12px',
    outline: 'none',
    fontSize: '15px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 16px',
    height: '44px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontWeight: 600,
  },
  btnOutline: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    height: '44px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-primary)',
    color: 'var(--color-primary)',
    borderRadius: '8px',
    fontWeight: 600,
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  filterBtn: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  },
  filterBtnActive: {
    padding: '8px 16px',
    backgroundColor: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '900px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '16px 24px',
    borderBottom: '2px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    fontSize: '14px',
  },
  tr: {
    borderBottom: '1px solid var(--color-border)',
  },
  td: {
    padding: '16px 24px',
    verticalAlign: 'top' as const,
    fontSize: '14px',
    lineHeight: 1.5,
  },
  subtext: {
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
  },
  boldtext: {
    fontWeight: 700,
    marginTop: '4px',
  },
  select: (status: string): React.CSSProperties => ({
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: status === '접수완료' ? '#ffebe9' : 
                     status === '확인중' ? '#fff8c5' : 
                     status === '연락완료' ? '#dafbe1' : '#f6f8fa',
    cursor: 'pointer',
    outline: 'none',
  }),
  authWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '24px',
  },
  authBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center' as const,
  },
  loginBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '16px',
    marginTop: '16px',
  }
};
