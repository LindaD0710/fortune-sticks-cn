-- 修复函数冲突：删除旧函数定义
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================
-- 第一步：查看所有 generate_redeem_codes 函数
-- ============================================

-- 查看函数签名
SELECT 
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'generate_redeem_codes'
  AND n.nspname = 'public';

-- ============================================
-- 第二步：删除所有旧版本的函数
-- ============================================

-- 删除所有版本的函数（PostgreSQL 不支持在 DROP 中使用 DEFAULT）
-- 先删除带两个参数的版本
DROP FUNCTION IF EXISTS generate_redeem_codes(INTEGER, INTEGER);

-- 删除带一个参数的版本
DROP FUNCTION IF EXISTS generate_redeem_codes(INTEGER);

-- 注意：如果函数有默认参数，PostgreSQL 会创建多个函数重载
-- 上面的语句应该能删除所有版本

-- ============================================
-- 第三步：重新创建正确的函数
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
-- 第四步：验证函数是否创建成功
-- ============================================

-- 应该只看到一个函数定义
SELECT 
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'generate_redeem_codes'
  AND n.nspname = 'public';

-- ============================================
-- 完成！现在可以测试：
-- ============================================
-- SELECT * FROM generate_redeem_codes(3);
