-- 修复 RLS 策略：允许服务端 API 更新兑换码
-- 在 Supabase SQL Editor 中执行此脚本

-- 删除已存在的策略（如果存在）
DROP POLICY IF EXISTS "Allow service role to update redeem codes" ON redeem_codes;

-- 创建策略：允许服务端 API 更新兑换码（用于标记为已使用）
CREATE POLICY "Allow service role to update redeem codes"
  ON redeem_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 验证策略是否创建成功
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'redeem_codes';
