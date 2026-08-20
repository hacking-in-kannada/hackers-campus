import sqlite3
import os
from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)
FLAG = os.getenv("FLAG", "HC{sql_injection_union_select_admin_pwned}")
DB_FILE = "/tmp/challenge.db"


def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS secret_vault")
    cursor.execute(
        """
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            role TEXT
        )
    """
    )
    cursor.execute(
        """
        CREATE TABLE secret_vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flag_name TEXT,
            flag_value TEXT
        )
    """
    )
    cursor.execute(
        "INSERT INTO users (username, password, role) VALUES ('admin', 'super_secret_admin_hash_99', 'administrator')"
    )
    cursor.execute("INSERT INTO users (username, password, role) VALUES ('guest', 'guest', 'user')")
    cursor.execute("INSERT INTO users (username, password, role) VALUES ('developer', 'dev_pass_123', 'staff')")
    cursor.execute(
        "INSERT INTO secret_vault (flag_name, flag_value) VALUES ('master_flag', ?)", (FLAG,)
    )
    conn.commit()
    conn.close()


HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sentinel Corp — Internal Staff Directory</title>
  <style>
    body { background: #090E17; color: #E2E8F0; font-family: monospace; padding: 40px; }
    .box { background: #111A28; border: 1px solid #1E293B; border-radius: 8px; padding: 24px; max-width: 600px; margin: auto; }
    h1 { color: #22C55E; font-size: 20px; }
    input[type=text] { background: #070B0E; border: 1px solid #1E293B; color: #fff; padding: 8px 12px; width: 70%; border-radius: 4px; }
    button { background: #22C55E; color: #090E17; border: none; padding: 8px 16px; font-weight: bold; border-radius: 4px; cursor: pointer; }
    .result { margin-top: 20px; background: #0C1217; padding: 12px; border-radius: 4px; border: 1px solid #22C55E33; }
  </style>
</head>
<body>
  <div class="box">
    <h1>[Sentinel Corp] Staff Directory Search</h1>
    <p>Search for employee records by username:</p>
    <form method="GET" action="/search">
      <input type="text" name="query" placeholder="e.g. guest or developer" value="{{ query }}">
      <button type="submit">Search</button>
    </form>
    {% if results is not none %}
      <div class="result">
        <h3>Search Results:</h3>
        {% if results %}
          <ul>
          {% for row in results %}
            <li><strong>ID:</strong> {{ row[0] }} | <strong>Username:</strong> {{ row[1] }} | <strong>Role:</strong> {{ row[3] }}</li>
          {% endfor %}
          </ul>
        {% else %}
          <p>No records found.</p>
        {% endif %}
      </div>
    {% endif %}
  </div>
</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE, query="", results=None)


@app.route("/search")
def search():
    query = request.args.get("query", "")
    if not query:
        return render_template_string(HTML_TEMPLATE, query="", results=None)

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Intentionally vulnerable to SQL Injection for educational lab purposes
    sql = f"SELECT * FROM users WHERE username = '{query}'"
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
    except Exception as e:
        results = [[-1, f"SQL Error: {str(e)}", "", "error"]]
    finally:
        conn.close()

    return render_template_string(HTML_TEMPLATE, query=query, results=results)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "challenge": "sql-injection-01"})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=80)
