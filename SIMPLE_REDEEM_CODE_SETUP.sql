-- 简化版兑换码系统：直接在 Supabase 中管理
-- 执行步骤：
-- 1. 登录 Supabase Dashboard
-- 2. 进入你的项目
-- 3. 点击左侧菜单 "SQL Editor"
-- 4. 点击 "New Query"
-- 5. 复制下面的 SQL 代码并执行

-- ============================================
-- 第一步：创建兑换码表
-- ============================================

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

-- ============================================
-- 第二步：创建生成兑换码的函数
-- ============================================

CREATE OR REPLACE FUNCTION generate_redeem_codes(
  count INTEGER,
  expires_in_days INTEGER DEFAULT 90
)
RETURNS TABLE(
  code VARCHAR(20),
  expires_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 排除易混淆字符
  new_code VARCHAR(20);
  code_exists BOOLEAN;
  i INTEGER := 0;
  generated_count INTEGER := 0;
BEGIN
  -- 计算过期时间
  DECLARE
    expiry_date TIMESTAMP WITH TIME ZONE := NOW() + (expires_in_days || ' days')::INTERVAL;
  BEGIN
    -- 循环生成指定数量的兑换码
    WHILE generated_count < count LOOP
      i := i + 1;
      
      -- 防止无限循环
      IF i > count * 10 THEN
        RAISE EXCEPTION '无法生成足够的唯一兑换码。已生成 % 个', generated_count;
      END IF;
      
      -- 生成一个兑换码
      new_code := 
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) || '-' ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) || '-' ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1) ||
        SUBSTRING(chars FROM floor(random() * length(chars) + 1)::INTEGER FOR 1);
      
      -- 检查是否已存在（使用表别名避免变量名冲突）
      SELECT EXISTS(SELECT 1 FROM redeem_codes rc WHERE rc.code = new_code) INTO code_exists;
      
      -- 如果不存在，插入数据库并返回
      IF NOT code_exists THEN
        INSERT INTO redeem_codes (code, expires_at, is_used)
        VALUES (new_code, expiry_date, FALSE);
        
        generated_count := generated_count + 1;
        
        -- 返回生成的兑换码
        RETURN QUERY SELECT new_code, expiry_date;
      END IF;
    END LOOP;
  END;
END;
$$;

-- ============================================
-- 第三步：创建验证兑换码的函数
-- ============================================

CREATE OR REPLACE FUNCTION verify_redeem_code(
  input_code VARCHAR(20),
  validity_days INTEGER DEFAULT 90
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  code_record RECORD;
  result JSON;
  used_time TIMESTAMP WITH TIME ZONE;
  expiry_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 格式化兑换码（去除空格，转为大写）
  input_code := UPPER(TRIM(REPLACE(input_code, ' ', '')));
  
  -- 如果是12位无分隔符，转换为带分隔符格式
  IF LENGTH(input_code) = 12 THEN
    input_code := SUBSTRING(input_code, 1, 4) || '-' || 
                  SUBSTRING(input_code, 5, 4) || '-' || 
                  SUBSTRING(input_code, 9, 4);
  END IF;
  
  -- 查询兑换码
  SELECT * INTO code_record
  FROM redeem_codes
  WHERE code = input_code;
  
  -- 如果不存在
  IF NOT FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'error', '兑换码不存在'
    );
  END IF;
  
  -- 检查是否已使用
  IF code_record.is_used THEN
    -- 如果已使用，检查是否过期（从使用日期开始计算）
    IF code_record.expires_at IS NOT NULL AND code_record.expires_at < NOW() THEN
      RETURN json_build_object(
        'valid', false,
        'error', '兑换码已过期',
        'used_at', code_record.used_at,
        'expires_at', code_record.expires_at
      );
    ELSE
      RETURN json_build_object(
        'valid', false,
        'error', '兑换码已被使用',
        'used_at', code_record.used_at,
        'expires_at', code_record.expires_at
      );
    END IF;
  END IF;
  
  -- 标记为已使用，并设置过期时间（从兑换日期开始计算90天）
  used_time := NOW();
  expiry_time := used_time + (validity_days || ' days')::INTERVAL;
  
  UPDATE redeem_codes
  SET is_used = TRUE,
      used_at = used_time,
      expires_at = expiry_time
  WHERE id = code_record.id;
  
  -- 返回成功
  RETURN json_build_object(
    'valid', true,
    'message', '兑换码验证成功',
    'code', code_record.code,
    'used_at', used_time,
    'expires_at', expiry_time
  );
END;
$$;

-- ============================================
-- 第四步：设置 RLS 策略（简化版）
-- ============================================

-- 启用 Row Level Security
ALTER TABLE redeem_codes ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略
DROP POLICY IF EXISTS "Anyone can view redeem codes for verification" ON redeem_codes;
DROP POLICY IF EXISTS "Allow service role to insert redeem codes" ON redeem_codes;
DROP POLICY IF EXISTS "Allow service role to update redeem codes" ON redeem_codes;

-- 创建策略：允许所有人查询兑换码（用于验证）
CREATE POLICY "Anyone can view redeem codes for verification"
  ON redeem_codes
  FOR SELECT
  USING (true);

-- ============================================
-- 第五步：创建 updated_at 自动更新触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_redeem_codes_updated_at ON redeem_codes;
CREATE TRIGGER update_redeem_codes_updated_at
  BEFORE UPDATE ON redeem_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成！现在你可以：
-- ============================================
-- 1. 生成兑换码：SELECT * FROM generate_redeem_codes(10);
--    注意：生成时 expires_at 为 NULL，有效期从兑换日期开始计算
-- 2. 验证兑换码：SELECT verify_redeem_code('XXXX-XXXX-XXXX', 90);
--    验证时会自动设置 expires_at = used_at + 90天
-- 3. 查看所有兑换码：SELECT * FROM redeem_codes ORDER BY created_at DESC;
-- 4. 查看统计：SELECT 
--      COUNT(*) as total,
--      COUNT(*) FILTER (WHERE is_used = true) as used,
--      COUNT(*) FILTER (WHERE is_used = false) as unused
--    FROM redeem_codes;
