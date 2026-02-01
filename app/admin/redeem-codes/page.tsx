'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Plus, RefreshCw, CheckCircle, XCircle, Clock, Search, Copy } from 'lucide-react'

interface RedeemCode {
  id: string
  code: string
  is_used: boolean
  used_at: string | null
  expires_at: string
  created_at: string
}

interface Stats {
  total: number
  used: number
  unused: number
  expiredUnused: number
  recentUsed: number
  usageRate: string
}

export default function RedeemCodesAdminPage() {
  const [codes, setCodes] = useState<RedeemCode[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateCount, setGenerateCount] = useState(10)
  const [filter, setFilter] = useState<'all' | 'used' | 'unused' | 'expired'>('all')
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const limit = 50

  useEffect(() => {
    loadStats()
    loadCodes()
  }, [filter, page])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/redeem/stats', {
        headers: apiKey ? { 'x-api-key': apiKey } : {}
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadCodes = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/redeem/list?page=${page}&limit=${limit}&filter=${filter}`,
        {
          headers: apiKey ? { 'x-api-key': apiKey } : {}
        }
      )
      const data = await response.json()
      if (data.success) {
        setCodes(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (generateCount < 1 || generateCount > 100) {
      alert('生成数量必须在 1-100 之间')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/redeem/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {})
        },
        body: JSON.stringify({ count: generateCount })
      })

      const data = await response.json()
      if (data.success) {
        alert(`成功生成 ${data.count} 个兑换码！\n\n${data.codes.slice(0, 5).join('\n')}${data.codes.length > 5 ? '\n...' : ''}`)
        loadCodes()
        loadStats()
      } else {
        alert(`生成失败: ${data.error}`)
      }
    } catch (error) {
      alert('生成兑换码时发生错误')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleExport = () => {
    const csv = [
      ['兑换码', '状态', '使用时间', '过期时间', '创建时间'],
      ...codes.map(code => [
        code.code,
        code.is_used ? '已使用' : '未使用',
        code.used_at || '',
        code.expires_at,
        code.created_at
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `redeem-codes-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filteredCodes = codes.filter(code =>
    searchTerm === '' || code.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <main className="min-h-screen bg-[#1A1A2E] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">兑换码管理后台</h1>
          
          {/* API Key Input */}
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">API Key（可选，用于保护管理功能）</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入 API Key（如果已配置）"
              className="w-full sm:w-96 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-mystic-purple-glow"
            />
            <p className="text-xs text-white/50 mt-1">
              在环境变量中设置 REDEEM_CODE_API_KEY 来保护管理 API
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-mystic-purple/30">
              <div className="text-2xl font-bold text-mystic-purple-glow">{stats.total}</div>
              <div className="text-sm text-white/70">总数</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-mystic-purple/30">
              <div className="text-2xl font-bold text-green-400">{stats.used}</div>
              <div className="text-sm text-white/70">已使用</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-mystic-purple/30">
              <div className="text-2xl font-bold text-blue-400">{stats.unused}</div>
              <div className="text-sm text-white/70">未使用</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-mystic-purple/30">
              <div className="text-2xl font-bold text-yellow-400">{stats.expiredUnused}</div>
              <div className="text-sm text-white/70">已过期</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-mystic-purple/30">
              <div className="text-2xl font-bold text-purple-400">{stats.recentUsed}</div>
              <div className="text-sm text-white/70">近7天</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-mystic-purple/30">
              <div className="text-2xl font-bold text-amber-400">{stats.usageRate}%</div>
              <div className="text-sm text-white/70">使用率</div>
            </div>
          </div>
        )}

        {/* Generate Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8 border border-mystic-purple/30">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            生成兑换码
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-white/70 mb-2">生成数量（1-100）</label>
              <input
                type="number"
                value={generateCount}
                onChange={(e) => setGenerateCount(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 100))}
                min={1}
                max={100}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-mystic-purple-glow"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-2 bg-gradient-to-r from-mystic-purple to-mystic-indigo text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  生成
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索兑换码..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-mystic-purple-glow"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'used', 'unused', 'expired'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-mystic-purple text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {f === 'all' ? '全部' : f === 'used' ? '已使用' : f === 'unused' ? '未使用' : '已过期'}
              </button>
            ))}
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-mystic-purple/30 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-semibold">兑换码列表</h2>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              导出 CSV
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-white/60">加载中...</div>
          ) : filteredCodes.length === 0 ? (
            <div className="p-8 text-center text-white/60">暂无兑换码</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-semibold text-white/70">兑换码</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/70">状态</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/70">使用时间</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/70">过期时间</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/70">创建时间</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/70">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCodes.map((code) => (
                    <tr key={code.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-mono text-mystic-purple-glow">{code.code}</td>
                      <td className="p-4">
                        {code.is_used ? (
                          <span className="inline-flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            已使用
                          </span>
                        ) : isExpired(code.expires_at) ? (
                          <span className="inline-flex items-center gap-1 text-yellow-400">
                            <Clock className="w-4 h-4" />
                            已过期
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-400">
                            <XCircle className="w-4 h-4" />
                            未使用
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {code.used_at ? new Date(code.used_at).toLocaleString('zh-CN') : '-'}
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {new Date(code.expires_at).toLocaleString('zh-CN')}
                      </td>
                      <td className="p-4 text-sm text-white/70">
                        {new Date(code.created_at).toLocaleString('zh-CN')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleCopyCode(code.code)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="复制兑换码"
                        >
                          {copiedCode === code.code ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-white/60" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && codes.length > 0 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="text-white/70">第 {page} 页</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={codes.length < limit}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
