import subprocess
import os
from flask import Flask, request, render_template_string, jsonify

app = Flask(__name__)
FLAG = os.getenv("FLAG", "HC{blind_time_injection_confirmed_5s}")

HTML = """
<!DOCTYPE html>
<html>
<head>
  <title>Sentinel Network Diagnostic Tool</title>
  <style>
    body { background: #090E17; color: #E2E8F0; font-family: monospace; padding: 40px; }
    .card { background: #111A28; border: 1px solid #1E293B; padding: 24px; max-width: 600px; margin: auto; border-radius: 8px; }
    input { background: #070B0E; border: 1px solid #1E293B; color: #fff; padding: 8px; width: 70%; }
    button { background: #22C55E; color: #090E17; padding: 8px 16px; border: none; font-weight: bold; cursor: pointer; }
    pre { background: #070B0E; padding: 12px; border: 1px solid #1E293B; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color:#22C55E">[Sentinel Diagnostics] Host Ping Utility</h2>
    <form method="POST" action="/ping">
      <input type="text" name="target" placeholder="e.g. 127.0.0.1 or 8.8.8.8" required>
      <button type="submit">Ping Host</button>
    </form>
    {% if output %}
      <h3>Output:</h3>
      <pre>{{ output }}</pre>
    {% endif %}
  </div>
</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(HTML, output=None)


@app.route("/ping", methods=["POST"])
def ping():
    target = request.form.get("target", "")
    # Educational Command Injection vulnerability
    # Strips spaces but permits shell separators like ${IFS}
    sanitized_target = target.replace(" ", "")
    cmd = f"ping -c 2 {sanitized_target}"

    try:
        res = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT, timeout=10)
        output = res.decode("utf-8", errors="ignore")
    except subprocess.TimeoutExpired:
        output = f"Execution timed out. Target latency test complete. Flag: {FLAG}"
    except Exception as e:
        output = f"Command failed: {str(e)}"

    return render_template_string(HTML, output=output)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "service": "command-injection-01"})


if __name__ == "__main__":
    # Create hidden vault secret
    with open("/tmp/vault_secret.txt", "w") as f:
        f.write("HC{vault_master_key_exfiltrated_9024}\n")
    app.run(host="0.0.0.0", port=80)
