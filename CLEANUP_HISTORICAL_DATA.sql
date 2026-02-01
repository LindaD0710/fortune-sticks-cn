-- 清理历史兑换码数据
-- 在 Supabase SQL Editor 中执行

-- ============================================
-- 方案一：查看当前数据情况
-- ============================================

-- 查看所有数据统计
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_used = true) as used,
  COUNT(*) FILTER (WHERE is_used = false) as unused,
  COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND is_used = false) as unused_with_expiry,
  COUNT(*) FILTER (WHERE expires_at IS NULL AND is_used = false) as unused_without_expiry
FROM redeem_codes;

-- 查看一些示例数据
SELECT code, is_used, used_at, expires_at, created_at
FROM redeem_codes
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 方案二：只删除未使用的旧数据（推荐）
-- ============================================

-- 删除所有未使用的兑换码（保留已使用的作为历史记录）
-- DELETE FROM redeem_codes WHERE is_used = false;

-- ============================================
-- 方案三：删除所有数据（全新开始）
-- ============================================

-- 清空整个表（谨慎使用！）
-- TRUNCATE TABLE redeem_codes;

-- ============================================
-- 方案四：只删除已过期的未使用兑换码
-- ============================================

-- 删除已过期且未使用的兑换码
-- DELETE FROM redeem_codes 
-- WHERE is_used = false 
--   AND expires_at IS NOT NULL 
--   AND expires_at < NOW();

-- ============================================
-- 方案五：删除使用旧逻辑的数据（expires_at 不为 NULL 且未使用）
-- ============================================

-- 删除使用旧逻辑生成的兑换码（expires_at 不为 NULL 且未使用）
-- 这些是生成时就设置了过期时间的旧数据
-- DELETE FROM redeem_codes 
-- WHERE is_used = false 
--   AND expires_at IS NOT NULL;

-- ============================================
-- 建议操作步骤：
-- ============================================
-- 1. 先执行"方案一"查看数据情况
-- 2. 根据需求选择合适的删除方案
-- 3. 取消对应方案的注释并执行
-- 4. 确认删除结果
