-- 在 Supabase 中创建支付记录表
-- 执行步骤：
-- 1. 登录 Supabase Dashboard
-- 2. 进入你的项目
-- 3. 点击左侧菜单 "SQL Editor"
-- 4. 点击 "New Query"
-- 5. 复制下面的 SQL 代码并执行

-- 创建 payments 表
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, cancelled
  stick_number INTEGER,
  question TEXT,
  creem_payment_id VARCHAR(255), -- Creem 返回的支付 ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_creem_payment_id ON payments(creem_payment_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的支付记录
CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- 创建策略：用户只能创建自己的支付记录
CREATE POLICY "Users can insert their own payments"
  ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建策略：系统可以更新支付状态（通过服务端）
-- 注意：这个策略允许服务端更新，但需要确保 API 路由有正确的认证

-- 创建 updated_at 自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 验证表是否创建成功
-- SELECT * FROM payments LIMIT 1;
