from flask import Flask, request, render_template_string
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    c = conn.cursor()
    c.execute("CREATE TABLE flags (id INT, flag_name TEXT, flag_val TEXT);")
    c.execute("INSERT INTO flags VALUES (1, 'master_vault', 'HC{sql_injection_union_secret_flag_9941}');")
    c.execute("CREATE TABLE users (id INT, username TEXT, role TEXT);")
    c.execute("INSERT INTO users VALUES (1, 'alice', 'staff'), (2, 'bob', 'engineer'), (3, 'admin', 'superuser');")
    conn.commit()
    return conn

db_conn = get_db()

HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sentinel Corp — Vault Search</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090E17; color: #E2E8F0; padding: 40px; display: flex; justify-content: center; }
    .card { background: #111A28; border: 1px solid #1E293B; border-radius: 12px; padding: 32px; width: 100%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { color: #22C55E; margin-top: 0; }
    input[type=text] { width: calc(100% - 110px); padding: 10px 14px; background: #070B10; border: 1px solid #1E293B; border-radius: 6px; color: #fff; font-family: monospace; outline: none; }
    input[type=text]:focus { border-color: #22C55E; }
    button { padding: 10px 20px; background: #22C55E; color: #090E17; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; }
    button:hover { background: #16a34a; }
    .results { margin-top: 24px; background: #070B10; border: 1px solid #1E293B; border-radius: 8px; padding: 16px; font-family: monospace; }
    .item { padding: 8px; border-bottom: 1px solid #1E293B; color: #38BDF8; }
    .error { color: #F43F5E; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🔒 Vault Staff Directory Portal</h2>
    <p style="color: #94A3B8; font-size: 13px;">Search active employees by username to inspect security credentials.</p>
    <form method="GET" style="margin-top: 20px;">
      <input type="text" name="query" placeholder="e.g. alice" value="{{ query }}">
      <button type="submit">Search</button>
    </form>

    {% if query %}
      <div class="results">
        <p style="color: #94A3B8; font-size: 11px; margin-top: 0;">QUERY EXECUTED: SELECT username, role FROM users WHERE username = '{{ query }}'</p>
        {% if error %}
          <div class="error">⚠️ {{ error }}</div>
        {% elif results %}
          {% for r in results %}
            <div class="item">👤 User: <strong>{{ r[0] }}</strong> | Role: <strong>{{ r[1] }}</strong></div>
          {% endfor %}
        {% else %}
          <div style="color: #64748B;">No matching records found.</div>
        {% endif %}
      </div>
    {% endif %}
  </div>
</body>
</html>
"""

@app.route("/", methods=["GET"])
def index():
    query = request.args.get("query", "").strip()
    results = []
    error = None
    if query:
        try:
            # Vulnerable raw SQL concatenation
            sql = f"SELECT username, role FROM users WHERE username = '{query}'"
            cur = db_conn.cursor()
            cur.execute(sql)
            results = cur.fetchall()
        except Exception as e:
            error = str(e)
    return render_template_string(HTML, query=query, results=results, error=error)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
