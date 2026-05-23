const scenario = window.CTF_SCENARIO;
const root = document.querySelector("#lab-root");
const eventLog = document.querySelector("#event-log");
const statusEl = document.querySelector("#status");
const flagState = document.querySelector("#flag-state");
const flagEl = document.querySelector("#flag");

function log(message) {
  eventLog.textContent += "\n" + message;
  eventLog.scrollTop = eventLog.scrollHeight;
}

function unlock(reason) {
  statusEl.textContent = "Bug Found";
  flagState.textContent = "Unlocked";
  flagEl.textContent = scenario.flag;
  flagEl.classList.remove("hidden");
  log("FLAG UNLOCKED: " + reason);
}

function setOutput(id, value) {
  document.querySelector(id).textContent = value;
}

function renderEmailLifecycle() {
  const email = scenario.seed.email;
  const users = [];
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>Mock Account System</h3>
        <p class="muted">The backend has a hidden bug: deleted users stay in the uniqueness check.</p>
        <div class="form-row">
          <label>Email<input id="email" value="${email}"></label>
          <button id="create" class="primary">Create Account</button>
        </div>
        <div class="form-row">
          <label>Invite Email<input id="invite-email" value="${email}"></label>
          <button id="invite" class="secondary">Invite User</button>
        </div>
        <button id="delete" class="danger">Delete Current Account</button>
        <div id="out" class="output">Start by creating the account.</div>
      </section>
      <section class="panel"><h3>User Table</h3><div id="table"></div></section>
    </div>`;

  function renderTable() {
    document.querySelector("#table").innerHTML = `<table class="table"><tr><th>Email</th><th>Status</th></tr>${users.map((u) => `<tr><td>${u.email}</td><td>${u.status}</td></tr>`).join("")}</table>`;
  }

  document.querySelector("#create").onclick = () => {
    const value = document.querySelector("#email").value.trim();
    if (users.some((u) => u.email === value)) {
      setOutput("#out", "Blocked: The entered email address is already registered.");
      if (users.some((u) => u.email === value && u.status === "deleted")) unlock("Deleted email is still treated as registered.");
      return;
    }
    users.push({ email: value, status: "active" });
    setOutput("#out", "Account created.");
    log("Created account: " + value);
    renderTable();
  };
  document.querySelector("#delete").onclick = () => {
    const user = users.find((u) => u.status === "active");
    if (!user) return setOutput("#out", "No active account to delete.");
    user.status = "deleted";
    setOutput("#out", "Account deleted. Now try to create or invite the same email.");
    log("Deleted account: " + user.email);
    renderTable();
  };
  document.querySelector("#invite").onclick = () => {
    const value = document.querySelector("#invite-email").value.trim();
    if (users.some((u) => u.email === value)) {
      setOutput("#out", "Invite blocked: email already registered.");
      if (users.some((u) => u.email === value && u.status === "deleted")) unlock("Deleted account blocked reinvitation.");
      return;
    }
    setOutput("#out", "Invite sent.");
  };
  renderTable();
}

function renderPasswordWhitespace() {
  let storedPassword = "initial";
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>Password Reset</h3>
        <div class="form-row">
          <label>New Password<input id="new-password" value="${scenario.seed.password}"></label>
          <button id="reset" class="primary">Save Password</button>
        </div>
        <div id="reset-out" class="output">Set a password with a leading space.</div>
      </section>
      <section class="panel">
        <h3>Login</h3>
        <div class="form-row">
          <label>Password<input id="login-password" value="${scenario.seed.password}"></label>
          <button id="login" class="secondary">Log In</button>
        </div>
        <div id="login-out" class="output">After reset, try the same password.</div>
      </section>
    </div>`;
  document.querySelector("#reset").onclick = () => {
    storedPassword = document.querySelector("#new-password").value;
    setOutput("#reset-out", "Password changed successfully.");
    log("Stored password length: " + storedPassword.length);
  };
  document.querySelector("#login").onclick = () => {
    const submitted = document.querySelector("#login-password").value;
    const normalized = submitted.trimStart();
    if (normalized === storedPassword) {
      setOutput("#login-out", "Logged in.");
    } else {
      setOutput("#login-out", "Incorrect password. The login flow trimmed the leading space before validation.");
      if (storedPassword.startsWith(" ") && submitted.startsWith(" ")) unlock("Same password accepted at reset but rejected at login.");
    }
  };
}

function renderFileDelete() {
  const fileId = scenario.seed.fileId;
  const files = { [fileId]: { name: "empty-image.png", exists: true } };
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>Mock Request Console</h3>
        <div class="form-row">
          <label>Method<select id="method"><option>GET</option><option>DELETE</option></select></label>
          <label>Path<input id="path" value="/proxy/files/${fileId}"></label>
        </div>
        <button id="send" class="primary">Send Request as Anonymous User</button>
        <div id="response" class="output">Try GET first, then DELETE, then GET again.</div>
      </section>
      <section class="panel"><h3>Resource State</h3><div id="state" class="output"></div></section>
    </div>`;
  function state() {
    setOutput("#state", files[fileId].exists ? "File exists: " + fileId : "404 Not Found: " + fileId);
  }
  document.querySelector("#send").onclick = () => {
    const method = document.querySelector("#method").value;
    const id = document.querySelector("#path").value.split("/").pop();
    if (!files[id]) return setOutput("#response", "404 Not Found");
    if (method === "GET") {
      setOutput("#response", files[id].exists ? "200 OK: resource metadata returned" : "404 Not Found");
      if (!files[id].exists) unlock("Anonymous DELETE removed the resource.");
    } else {
      files[id].exists = false;
      setOutput("#response", "204 No Content: deleted without authentication");
      log("Anonymous DELETE accepted for " + id);
    }
    state();
  };
  state();
}

function renderTicketLock() {
  let locked = false;
  let minutes = 0;
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>${scenario.seed.event}</h3>
        <p class="muted">Simulate one buyer holding all 10 tickets without payment.</p>
        <div class="seat-grid" id="seats"></div>
        <div class="form-row">
          <button id="reserve" class="primary">Tab 1: Reserve 10 Tickets</button>
          <button id="abandon" class="danger">Abandon Payment</button>
        </div>
        <div class="form-row">
          <button id="advance" class="secondary">Advance 21 Minutes</button>
          <button id="check" class="ghost">Tab 2: Check Availability</button>
        </div>
        <div id="ticket-out" class="output">Reserve tickets, abandon payment, advance time, then check from Tab 2.</div>
      </section>
    </div>`;
  function seats() {
    document.querySelector("#seats").innerHTML = Array.from({ length: 10 }, (_, i) => `<div class="seat ${locked ? "locked" : ""}">T${i + 1}</div>`).join("");
  }
  document.querySelector("#reserve").onclick = () => {
    locked = true;
    minutes = 0;
    seats();
    setOutput("#ticket-out", "10 tickets reserved. Payment page opened.");
    log("Tickets held without payment.");
  };
  document.querySelector("#abandon").onclick = () => {
    setOutput("#ticket-out", "Payment abandoned. Tickets should release soon.");
  };
  document.querySelector("#advance").onclick = () => {
    minutes += 21;
    setOutput("#ticket-out", "Time advanced to " + minutes + " minutes. Tickets are still locked.");
    log("Unpaid hold age: " + minutes + " minutes.");
  };
  document.querySelector("#check").onclick = () => {
    if (locked && minutes >= 20) {
      setOutput("#ticket-out", "Tab 2 sees 0 tickets available after 20+ minutes.");
      unlock("Unpaid tickets remained locked too long.");
    } else {
      setOutput("#ticket-out", locked ? "Tickets are temporarily held." : "Tickets are available.");
    }
  };
  seats();
}

function renderUnsubscribeIdor() {
  const records = {
    [scenario.seed.attackerMail]: { email: "attacker@example.test", account: "acct-attacker", unsubscribed: false },
    [scenario.seed.victimMail]: { email: "victim@example.test", account: "acct-victim", unsubscribed: false }
  };
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>Mock Unsubscribe API</h3>
        <p class="muted">You are anonymous. Change the mail ID and send the request.</p>
        <div class="form-row">
          <label>MAIL_ID<input id="mail-id" value="${scenario.seed.attackerMail}"></label>
          <button id="unsubscribe" class="primary">POST /unsubscriptions</button>
        </div>
        <div id="api-out" class="output">Try your own mail ID, then try victim mail ID: ${scenario.seed.victimMail}</div>
      </section>
    </div>`;
  document.querySelector("#unsubscribe").onclick = () => {
    const id = document.querySelector("#mail-id").value.trim();
    const record = records[id];
    if (!record) return setOutput("#api-out", "404 Not Found");
    record.unsubscribed = true;
    const body = JSON.stringify({ ID: id, AccountID: record.account, EmailAddress: record.email, unsubscribed: true }, null, 2);
    setOutput("#api-out", body);
    log("Anonymous unsubscribe accepted for " + id);
    if (id === scenario.seed.victimMail) unlock("Victim data leaked and victim was unsubscribed without auth.");
  };
}

function renderReusableCode() {
  const issued = [];
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>Email Verification</h3>
        <div class="form-row">
          <button id="request" class="primary">Request Code</button>
          <button id="resend" class="secondary">Resend Code</button>
        </div>
        <div class="form-row">
          <label>Submit Code<input id="code" placeholder="Enter old or new code"></label>
          <button id="verify" class="ghost">Verify</button>
        </div>
        <div id="code-out" class="output">Request code 1, resend code 2, then submit code 1.</div>
      </section>
    </div>`;
  document.querySelector("#request").onclick = () => {
    issued.push(scenario.seed.code1);
    document.querySelector("#code").value = scenario.seed.code1;
    setOutput("#code-out", "Code sent: " + scenario.seed.code1);
    log("Issued first code.");
  };
  document.querySelector("#resend").onclick = () => {
    issued.push(scenario.seed.code2);
    setOutput("#code-out", "New code sent: " + scenario.seed.code2 + ". Old code should now be invalid.");
    log("Issued second code without invalidating first.");
  };
  document.querySelector("#verify").onclick = () => {
    const value = document.querySelector("#code").value.trim();
    if (issued.includes(value)) {
      setOutput("#code-out", "Verified with code: " + value);
      if (value === scenario.seed.code1 && issued.includes(scenario.seed.code2)) unlock("Old verification code remained valid after resend.");
    } else {
      setOutput("#code-out", "Invalid code.");
    }
  };
}

function renderTokenExposure() {
  root.innerHTML = `
    <div class="lab-grid">
      <section class="panel">
        <h3>Anonymous API Console</h3>
        <p class="muted">Current session: logged out</p>
        <div class="form-row">
          <label>Endpoint<input id="endpoint" value="${scenario.seed.endpoint}"></label>
          <button id="call" class="primary">GET as Anonymous</button>
        </div>
        <div id="token-out" class="output">Call the credentials endpoint while logged out.</div>
      </section>
    </div>`;
  document.querySelector("#call").onclick = () => {
    const endpoint = document.querySelector("#endpoint").value.trim();
    if (endpoint !== scenario.seed.endpoint) return setOutput("#token-out", "404 Not Found");
    const body = {
      beefreeCredentials: {
        access_token: "redacted.mock.access.token",
        refresh_token: "redacted.mock.refresh.token",
        expires_in: 300,
        token_type: "bearer"
      },
      user_email: "demo-user@example.test",
      client_id: "mock-client-id"
    };
    setOutput("#token-out", JSON.stringify(body, null, 2));
    unlock("Anonymous request returned token-like credentials.");
  };
}

const renderers = {
  emailLifecycle: renderEmailLifecycle,
  passwordWhitespace: renderPasswordWhitespace,
  fileDelete: renderFileDelete,
  ticketLock: renderTicketLock,
  unsubscribeIdor: renderUnsubscribeIdor,
  reusableCode: renderReusableCode,
  tokenExposure: renderTokenExposure
};

renderers[scenario.kind]();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
