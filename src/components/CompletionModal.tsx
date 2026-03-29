import { useState } from 'react';
import type { CartItem } from '../App';
import { CheckCircle2, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  order: {
    phone: string;
    orderId: string;
    totalAmount: number;
    items: CartItem[];
  };
  onReset: () => void;
  onReorder: () => void;
}

const BANK_INFO = {
  name: '국민은행',
  account: '123-45-67890-123',
  holder: '미네르바'
};

const CompletionModal = ({ order, onReset, onReorder }: Props) => {
  const [isPaidRequested, setIsPaidRequested] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} 복사되었습니다.`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handlePaidRequest = async () => {
    setIsPaidRequested(true);
    try {
      await supabase
        .from('orders')
        .update({ status: 'paid_requested' })
        .eq('id', order.orderId);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <div style={styles.successHeader}>
          <CheckCircle2 size={56} style={{ color: '#007AFF', marginBottom: 16 }} />
          <h1 style={styles.title}>주문이 접수되었습니다.</h1>
          <p style={styles.headerSubtitle}>주문 접수 후 아래 계좌로 입금해 주세요</p>
        </div>

        {/* Amount Highlight */}
        <div style={styles.amountHighlightCard}>
          <span style={styles.amountLabel}>총 결제 금액</span>
          <h2 style={styles.amountValue}>{order.totalAmount.toLocaleString()}원</h2>
        </div>

        {/* Bank Guidance Section */}
        <div style={styles.bankCard}>
          <div style={styles.bankTag}>입금 전용 계좌</div>
          <div style={styles.bankMain}>
            <div style={styles.bankName}>{BANK_INFO.name}</div>
            <div style={styles.accountNumber}>{BANK_INFO.account}</div>
            <div style={styles.accountHolder}>예금주: {BANK_INFO.holder}</div>
          </div>
          <button 
            onClick={() => handleCopy(BANK_INFO.account, '계좌번호가')} 
            style={styles.bankCopyBtn}
          >
            <Copy size={16} /> 계좌번호 복사
          </button>
        </div>

        {/* Step Guide Section */}
        <div style={styles.guideCard}>
          <h3 style={styles.guideTitle}>입금 절차 안내</h3>
          <div style={styles.steps}>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>1</span>
              <p style={styles.stepText}>위 계좌로 정확한 금액을 입금해 주세요.</p>
            </div>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>2</span>
              <p style={styles.stepText}>입금자명은 <strong>주문자명</strong> 또는 <strong>학원명</strong>으로 입력해 주세요.</p>
            </div>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>3</span>
              <p style={styles.stepText}>입금 확인 후 문자로 안내드립니다.</p>
            </div>
          </div>
        </div>

        {/* Final Actions */}
        <div style={styles.actionWrapper}>
          {!isPaidRequested ? (
            <button style={styles.paidBtn} onClick={handlePaidRequest}>
              입금 완료했어요
            </button>
          ) : (
            <div style={styles.paidSuccessMsg}>
              ✅ 입금 확인 요청이 접수되었습니다.<br/>
              순차적으로 확인 후 문자를 보내드립니다.
            </div>
          )}

          <div style={styles.secondaryActions}>
            <button style={styles.reorderBtn} onClick={onReorder}>
              추가 주문하기
            </button>
          </div>

          <div style={styles.noticeBlock}>
            <p style={styles.noticeText}>• 입금 확인 후 배송이 진행됩니다.</p>
            <p style={styles.noticeText}>• 금액이 다를 경우 확인이 지연될 수 있습니다.</p>
          </div>

          <button style={styles.homeBtn} onClick={onReset}>
            홈으로 이동
          </button>
        </div>

        {/* Toast Feedback */}
        {copyFeedback && (
          <div style={styles.toast}>
            {copyFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '24px 16px',
    fontFamily: 'var(--font-family)',
  },
  content: {
    maxWidth: '520px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  successHeader: {
    textAlign: 'center',
    padding: '20px 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: '12px',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: 'var(--color-primary)',
    fontWeight: 700,
  },
  amountHighlightCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '32px 24px',
    textAlign: 'center',
    border: '1px solid var(--color-border)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  amountLabel: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    display: 'block',
    marginBottom: '8px',
  },
  amountValue: {
    fontSize: '32px',
    fontWeight: 900,
    color: 'var(--color-text)',
    margin: 0,
  },
  bankCard: {
    width: '100%',
    backgroundColor: 'var(--color-text)',
    borderRadius: '24px',
    padding: '32px 24px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
  bankTag: {
    fontSize: '11px',
    fontWeight: 800,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '4px 10px',
    borderRadius: '20px',
    marginBottom: '16px',
    letterSpacing: '0.5px',
  },
  bankMain: {
    marginBottom: '24px',
  },
  bankName: { fontSize: '15px', opacity: 0.8, marginBottom: '6px' },
  accountNumber: { fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.5px' },
  accountHolder: { fontSize: '15px', fontWeight: 600, opacity: 0.9 },
  bankCopyBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#fff',
    color: 'var(--color-text)',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  guideCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid var(--color-border)',
  },
  guideTitle: {
    fontSize: '16px',
    fontWeight: 800,
    marginBottom: '20px',
    color: 'var(--color-text)',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '13px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  stepText: {
    fontSize: '15px',
    lineHeight: 1.5,
    margin: 0,
    color: 'var(--color-text)',
  },
  actionWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px',
  },
  paidBtn: {
    width: '100%',
    padding: '22px',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderRadius: '18px',
    fontSize: '20px',
    fontWeight: 800,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(var(--color-primary-rgb), 0.25)',
  },
  paidSuccessMsg: {
    width: '100%',
    padding: '24px',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    color: '#248a3d',
    borderRadius: '18px',
    fontSize: '16px',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  secondaryActions: {
    display: 'flex',
    gap: '12px',
  },
  reorderBtn: {
    flex: 1,
    padding: '18px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  noticeBlock: {
    padding: '12px 0',
    textAlign: 'center',
  },
  noticeText: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    margin: '4px 0',
    fontWeight: 500,
  },
  homeBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed' as const,
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '24px',
    fontSize: '14px',
    zIndex: 1000,
    animation: 'fadeInOut 2s forwards',
  }
};

export default CompletionModal;
