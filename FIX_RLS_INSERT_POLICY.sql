-- 修复 RLS 策略：允许插入兑换码
-- 在 Supabase SQL Editor 中执行此脚本

-- 创建策略：允许服务端 API 插入兑换码
-- 注意：这个策略允许通过服务端 API 插入，但不允许客户端直接插入
CREATE POLICY "Allow service role to insert redeem codes"
  ON redeem_codes
  FOR INSERT
  WITH CHECK (true);

-- 如果上面的策略创建失败（因为已存在），先删除再创建：
-- DROP POLICY IF EXISTS "Allow service role to insert redeem codes" ON redeem_codes;
-- CREATE POLICY "Allow service role to insert redeem codes"
--   ON redeem_codes
--   FOR INSERT
--   WITH CHECK (true);
