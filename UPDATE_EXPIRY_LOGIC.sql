-- 更新兑换码有效期逻辑：从兑换日期开始计算90天
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================
-- 第一步：修改表结构（允许 expires_at 为 NULL）
-- ============================================

-- 如果表已存在，修改 expires_at 列允许 NULL
ALTER TABLE redeem_codes 
ALTER COLUMN expires_at DROP NOT NULL;

-- ============================================
-- 第二步：更新生成函数（不再设置 expires_at）
-- ============================================

CREATE OR REPLACE FUNCTION generate_redeem_codes(
  count INTEGER
)
RETURNS TABLE(
  code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_code VARCHAR(20);
  code_exists BOOLEAN;
  i INTEGER := 0;
  generated_count INTEGER := 0;
  created_time TIMESTAMP WITH TIME ZONE;
BEGIN
  WHILE generated_count < count LOOP
    i := i + 1;
    
    IF i > count * 10 THEN
      RAISE EXCEPTION '无法生成足够的唯一兑换码。已生成 % 个', generated_count;
    END IF;
    
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
    
    SELECT EXISTS(SELECT 1 FROM redeem_codes rc WHERE rc.code = new_code) INTO code_exists;
    
    IF NOT code_exists THEN
      created_time := NOW();
      -- 生成时不设置 expires_at（NULL），有效期从兑换日期开始计算
      INSERT INTO redeem_codes (code, expires_at, is_used)
      VALUES (new_code, NULL, FALSE);
      
      generated_count := generated_count + 1;
      
      RETURN QUERY SELECT new_code, created_time;
    END IF;
  END LOOP;
END;
$$;

-- ============================================
-- 第三步：更新验证函数（从兑换日期开始计算有效期）
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
  used_time TIMESTAMP WITH TIME ZONE;
  expiry_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 格式化兑换码
  input_code := UPPER(TRIM(REPLACE(input_code, ' ', '')));
  
  IF LENGTH(input_code) = 12 THEN
    input_code := SUBSTRING(input_code, 1, 4) || '-' || 
                  SUBSTRING(input_code, 5, 4) || '-' || 
                  SUBSTRING(input_code, 9, 4);
  END IF;
  
  -- 查询兑换码
  SELECT * INTO code_record
  FROM redeem_codes
  WHERE code = input_code;
  
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
-- 完成！
-- ============================================
-- 现在：
-- 1. 生成兑换码时，expires_at 为 NULL
-- 2. 用户兑换时，expires_at 设置为 used_at + 90天
-- 3. 有效期从兑换日期开始计算，而不是生成日期
