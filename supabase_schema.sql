-- 1. 'orders' 주문 테이블 생성
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    buyer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    address TEXT NOT NULL,
    address_detail TEXT NOT NULL,
    email TEXT,
    affiliation_type TEXT NOT NULL,
    affiliation_name TEXT,
    order_items JSONB NOT NULL,
    total_qty INTEGER NOT NULL DEFAULT 0,
    request_memo TEXT,
    status TEXT DEFAULT '접수완료'::TEXT NOT NULL
);

-- 2. RLS (Row Level Security) 설정
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. 익명 클라이언트의 주문 INSERT 허용 정책
CREATE POLICY "Enable insert for anonymous users" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

-- 4. 읽기 정책 (필요시 관리자만 읽을 수 있도록 세팅. 여기서는 누구나 못 읽고 쓰기만 되게 함)
-- (실제 어드민 페이지 구현 시 읽기 정책은 별도 설정합니다.)
