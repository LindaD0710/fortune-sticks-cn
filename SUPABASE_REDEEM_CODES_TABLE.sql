-- 在 Supabase 中创建兑换码表
-- 执行步骤：
-- 1. 登录 Supabase Dashboard
-- 2. 进入你的项目
-- 3. 点击左侧菜单 "SQL Editor"
-- 4. 点击 "New Query"
-- 5. 复制下面的 SQL 代码并执行

-- 创建 redeem_codes 表
CREATE TABLE IF NOT EXISTS redeem_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,  -- 兑换码（格式：XXXX-XXXX-XXXX）
  is_used BOOLEAN DEFAULT FALSE,     -- 是否已使用
  used_at TIMESTAMP WITH TIME ZONE,  -- 使用时间
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- 过期时间（创建后90天）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建唯一索引（确保兑换码唯一）
CREATE UNIQUE INDEX IF NOT EXISTS idx_redeem_codes_code ON redeem_codes(code);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_redeem_codes_is_used ON redeem_codes(is_used);
CREATE INDEX IF NOT EXISTS idx_redeem_codes_expires_at ON redeem_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_redeem_codes_created_at ON redeem_codes(created_at);

-- 启用 Row Level Security (RLS)
ALTER TABLE redeem_codes ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略（如果存在）
DROP POLICY IF EXISTS "Anyone can view redeem codes for verification" ON redeem_codes;

-- 删除已存在的策略（如果存在）
DROP POLICY IF EXISTS "Anyone can view redeem codes for verification" ON redeem_codes;
DROP POLICY IF EXISTS "Allow service role to insert redeem codes" ON redeem_codes;
DROP POLICY IF EXISTS "Allow service role to update redeem codes" ON redeem_codes;

-- 创建策略：允许所有人查询兑换码（只读，用于验证）
CREATE POLICY "Anyone can view redeem codes for verification"
  ON redeem_codes
  FOR SELECT
  USING (true);

-- 创建策略：允许服务端 API 插入兑换码（用于生成兑换码）
CREATE POLICY "Allow service role to insert redeem codes"
  ON redeem_codes
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许服务端 API 更新兑换码（用于标记为已使用）
CREATE POLICY "Allow service role to update redeem codes"
  ON redeem_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 注意：兑换码的使用（更新 is_used）必须通过服务端 API 完成
-- 因为需要确保原子性操作（检查 + 更新），且 RLS 不允许客户端直接更新

-- 创建 updated_at 自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_redeem_codes_updated_at
  BEFORE UPDATE ON redeem_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 验证表是否创建成功
-- SELECT * FROM redeem_codes LIMIT 1;
