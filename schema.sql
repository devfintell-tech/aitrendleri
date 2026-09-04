-- Cloudflare D1 Veritabanı Şeması
-- Geçmiş raporların ve hype skorlarının kalıcı saklanması için

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_str TEXT NOT NULL,
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  active_model TEXT NOT NULL,
  executive_summary TEXT,
  raw_json TEXT,
  subreddits_count INTEGER DEFAULT 30,
  duration_seconds INTEGER
);

CREATE TABLE IF NOT EXISTS tool_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  category TEXT NOT NULL,
  hype_score REAL NOT NULL,
  score_delta REAL NOT NULL,
  trend_type TEXT,
  mentions INTEGER DEFAULT 0,
  primary_function TEXT,
  why_trending TEXT,
  sources_json TEXT,
  recorded_at DATE NOT NULL,
  FOREIGN KEY (report_id) REFERENCES reports (id)
);

CREATE INDEX IF NOT EXISTS idx_tool_recorded ON tool_scores(tool_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_reports_period ON reports(period_type, created_at);
