/* ═══════════════════════════════════════════════════════
   TimetablePro — app.js
   Full frontend logic: state, UI, generation, API calls
═══════════════════════════════════════════════════════ */

const API = 'http://localhost:5000/api';

// ─── State ────────────────────────────────────────────
let subjects  = [{ name:'Mathematics', pw:6 }, { name:'Science', pw:5 }, { name:'English', pw:5 }, { name:'History', pw:3 }, { name:'Computer', pw:3 }];
let teachers  = [{ name:'Mr. Sharma', sub:'Mathematics' }, { name:'Ms. Patel', sub:'Science' }, { name:'Mrs. Gupta', sub:'English' }, { name:'Mr. Khan', sub:'History' }, { name:'Ms. Roy', sub:'Computer' }];
let slots     = [{ start:'08:00', end:'08:45' }, { start:'08:45', end:'09:30' }, { start:'09:30', end:'10:15' }, { start:'10:30', end:'11:15' }, { start:'11:15', end:'12:00' }, { start:'12:45', end:'01:30' }];
let brks      = [{ label:'Short Break', start:'10:15', end:'10:30' }, { label:'Lunch Break', start:'12:00', end:'12:45' }];
let currentStep = 1;
let generatedData = null;
let currentDiv = 0;

// ─── Init ─────────────────────────────────────────────
window.onload = () => {
  renderSubjects();
  renderTeachers();
  renderSlots();
  renderBreaks();
  checkApiStatus();
};

// ─── Sidebar ──────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');
  if (name === 'saved') loadSaved();
}

// ─── Step Navigation ──────────────────────────────────
function gotoStep(n) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));
  document.getElementById('step' + n).classList.add('active');
  document.getElementById('stab' + n).classList.add('active');
  document.getElementById('dot' + n).classList.add('active');
  currentStep = n;
}

function updateLabel() {
  const t = document.getElementById('instType').value;
  document.getElementById('instNameLabel').textContent = t + ' Name';
}

// ─── Subjects ─────────────────────────────────────────
function renderSubjects() {
  const list = document.getElementById('subjectList');
  list.innerHTML = subjects.map((s, i) => `
    <div class="list-row" id="sub-row-${i}">
      <input class="list-input" value="${s.name}" onchange="subjects[${i}].name=this.value;syncTeacherDropdowns()">
      <input class="list-input num-input" type="number" value="${s.pw}" min="1" max="20" onchange="subjects[${i}].pw=+this.value">
      <button class="btn-del" onclick="removeSubject(${i})">✕</button>
    </div>`).join('');
}

function addSubject() {
  subjects.push({ name: 'New Subject', pw: 4 });
  renderSubjects(); syncTeacherDropdowns();
}
function removeSubject(i) {
  subjects.splice(i, 1);
  renderSubjects(); syncTeacherDropdowns();
}

// ─── Teachers ─────────────────────────────────────────
function renderTeachers() {
  const list = document.getElementById('teacherList');
  const opts = subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  list.innerHTML = teachers.map((t, i) => `
    <div class="list-row" id="tea-row-${i}">
      <input class="list-input" value="${t.name}" onchange="teachers[${i}].name=this.value">
      <select class="list-input" onchange="teachers[${i}].sub=this.value">
        ${subjects.map(s => `<option value="${s.name}" ${s.name===t.sub?'selected':''}>${s.name}</option>`).join('')}
      </select>
      <button class="btn-del" onclick="removeTeacher(${i})">✕</button>
    </div>`).join('');
}

function addTeacher() {
  teachers.push({ name: 'New Teacher', sub: subjects[0]?.name || '' });
  renderTeachers();
}
function removeTeacher(i) {
  teachers.splice(i, 1);
  renderTeachers();
}
function syncTeacherDropdowns() { renderTeachers(); }

// ─── Slots ────────────────────────────────────────────
function renderSlots() {
  const list = document.getElementById('slotList');
  list.innerHTML = slots.map((s, i) => `
    <div class="list-row">
      <input class="list-input" type="time" value="${s.start}" onchange="slots[${i}].start=this.value">
      <span style="color:var(--text-muted);font-size:13px">to</span>
      <input class="list-input" type="time" value="${s.end}" onchange="slots[${i}].end=this.value">
      <button class="btn-del" onclick="removeSlot(${i})">✕</button>
    </div>`).join('');
}

function addSlot() {
  slots.push({ start:'00:00', end:'00:45' });
  renderSlots();
}
function removeSlot(i) {
  slots.splice(i, 1);
  renderSlots();
}

// ─── Breaks ───────────────────────────────────────────
function renderBreaks() {
  const list = document.getElementById('breakList');
  list.innerHTML = brks.map((b, i) => `
    <div class="list-row">
      <input class="list-input" value="${b.label}" placeholder="Break name" onchange="brks[${i}].label=this.value">
      <input class="list-input" type="time" value="${b.start}" onchange="brks[${i}].start=this.value">
      <span style="color:var(--text-muted);font-size:13px">to</span>
      <input class="list-input" type="time" value="${b.end}" onchange="brks[${i}].end=this.value">
      <button class="btn-del" onclick="removeBreak(${i})">✕</button>
    </div>`).join('');
}
function addBreak() {
  brks.push({ label:'Break', start:'00:00', end:'00:30' });
  renderBreaks();
}
function removeBreak(i) {
  brks.splice(i, 1);
  renderBreaks();
}

// ─── GENERATE ─────────────────────────────────────────
function generate() {
  const name     = document.getElementById('schoolName').value.trim() || 'My Institution';
  const type     = document.getElementById('instType').value;
  const year     = document.getElementById('acadYear').value;
  const days     = +document.getElementById('workDays').value;
  const nClass   = +document.getElementById('numClasses').value;
  const nDiv     = +document.getElementById('numDivs').value;
  const nStud    = +document.getElementById('numStudents').value;
  const startRm  = +document.getElementById('startRoom').value;

  if (!subjects.length) { showToast('⚠️ Add at least one subject!'); return; }
  if (!teachers.length) { showToast('⚠️ Add at least one teacher!'); return; }
  if (!slots.length)    { showToast('⚠️ Add at least one period!'); return; }

  // Show loading
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('stepLoading').classList.add('active');
  document.getElementById('stepOutput').style.display = 'none';

  setTimeout(() => {
    const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].slice(0, days);
    const divisions = [];

    for (let c = 1; c <= nClass; c++) {
      for (let d = 1; d <= nDiv; d++) {
        const divLabel = type === 'College' ? `Sem ${c}${String.fromCharCode(64+d)}` : `Class ${c}${String.fromCharCode(64+d)}`;
        const room     = startRm + (c-1)*nDiv + (d-1);
        const ttGrid   = {};

        dayNames.forEach(day => {
          const daySlots = [];
          const subPool  = [];
          subjects.forEach(s => {
            for (let x = 0; x < Math.max(1, Math.round(s.pw / days)); x++) subPool.push(s.name);
          });
          shuffle(subPool);
          let si = 0;
          slots.forEach((sl, idx) => {
            const sub     = subPool[si++ % subPool.length] || subjects[0].name;
            const teacher = teachers.find(t => t.sub === sub)?.name || '—';
            daySlots.push({ time: `${sl.start}–${sl.end}`, subject: sub, teacher });
          });
          ttGrid[day] = daySlots;
        });

        divisions.push({ label: divLabel, room, students: nStud, timetable: ttGrid });
      }
    }

    const loadMap = {};
    subjects.forEach(s => {
      const total = divisions.reduce((acc, div) => {
        return acc + Object.values(div.timetable).flat().filter(sl => sl.subject === s.name).length;
      }, 0);
      loadMap[s.name] = total;
    });

    generatedData = { name, type, year, days, nClass, nDiv, divisions, subjects, teachers, slots, brks, loadMap };
    renderOutput();
  }, 1200);
}

function shuffle(arr) {
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ─── Render Output ────────────────────────────────────
function renderOutput() {
  const d = generatedData;
  document.getElementById('stepLoading').classList.remove('active');
  document.getElementById('stepOutput').style.display = 'block';
  document.getElementById('outTitle').textContent = `📅 ${d.name} — Timetable`;
  document.getElementById('outSub').textContent   = `${d.type} | ${d.year} | ${d.nClass} Class(es) × ${d.nDiv} Division(s)`;

  // Load grid
  const lg = document.getElementById('loadGrid');
  lg.innerHTML = d.subjects.map(s => `
    <div class="load-card">
      <div class="load-name">${s.name}</div>
      <div class="load-num">${d.loadMap[s.name] || 0}</div>
      <div class="load-label">periods/week total</div>
    </div>`).join('');

  // Division tabs
  currentDiv = 0;
  const dt = document.getElementById('divTabs');
  dt.innerHTML = d.divisions.map((dv, i) => `
    <button class="div-tab ${i===0?'active':''}" onclick="switchDiv(${i})">${dv.label}</button>`).join('');

  renderDivTable(0);
}

function switchDiv(i) {
  currentDiv = i;
  document.querySelectorAll('.div-tab').forEach((t,ti) => t.classList.toggle('active', ti===i));
  renderDivTable(i);
}

function renderDivTable(i) {
  const d   = generatedData;
  const div = d.divisions[i];
  document.getElementById('roomInfo').innerHTML =
    `<span>🏛️ Room ${div.room}</span><span>👥 ${div.students} Students</span>`;

  const dayNames = Object.keys(div.timetable);
  const nSlots   = d.slots.length;

  // Build a merged schedule including breaks
  const schedule = buildSchedule(d.slots, d.brks, div.timetable, dayNames);

  let html = `<table id="ttTable"><thead><tr><th>Period</th>`;
  dayNames.forEach(day => html += `<th>${day}</th>`);
  html += `</tr></thead><tbody>`;

  schedule.forEach(row => {
    if (row.isBreak) {
      html += `<tr class="break-row"><td colspan="${dayNames.length+1}">☕ ${row.label} &nbsp;(${row.time})</td></tr>`;
    } else {
      html += `<tr><td class="time-cell">${row.time}</td>`;
      dayNames.forEach(day => {
        const sl = row.data[day];
        const color = subjectColor(sl?.subject || '');
        html += `<td><div class="slot-card" style="border-left:3px solid ${color}">
          <div class="slot-sub" style="color:${color}">${sl?.subject || '—'}</div>
          <div class="slot-tea">${sl?.teacher || ''}</div>
        </div></td>`;
      });
      html += `</tr>`;
    }
  });

  html += `</tbody></table>`;
  document.querySelector('.tt-scroll').innerHTML = html;
}

function buildSchedule(slots, brks, tt, dayNames) {
  const rows = [];
  let brkIdx = 0;

  slots.forEach((sl, si) => {
    // Insert breaks that come before this slot
    while (brkIdx < brks.length && brks[brkIdx].start <= sl.start) {
      const br = brks[brkIdx++];
      rows.push({ isBreak:true, label:br.label, time:`${br.start}–${br.end}` });
    }
    const rowData = {};
    dayNames.forEach(day => { rowData[day] = tt[day]?.[si] || null; });
    rows.push({ isBreak:false, time:`${sl.start}–${sl.end}`, data:rowData });
  });
  // Trailing breaks
  while (brkIdx < brks.length) {
    const br = brks[brkIdx++];
    rows.push({ isBreak:true, label:br.label, time:`${br.start}–${br.end}` });
  }
  return rows;
}

const COLORS = ['#6c63ff','#00bcd4','#ff6584','#43e97b','#f7971e','#a18cd1','#fd79a8','#00cec9','#fdcb6e','#e17055'];
const colorCache = {};
function subjectColor(name) {
  if (!colorCache[name]) {
    const idx = Object.keys(colorCache).length % COLORS.length;
    colorCache[name] = COLORS[idx];
  }
  return colorCache[name];
}

// ─── Save Timetable ───────────────────────────────────
async function saveTimetable() {
  const btn = document.getElementById('btnSave');
  btn.disabled = true; btn.textContent = '💾 Saving...';
  try {
    const res = await fetch(`${API}/timetables`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...generatedData, createdAt: new Date().toISOString() })
    });
    if (res.ok) {
      showToast('✅ Timetable saved to MongoDB!');
      btn.textContent = '✅ Saved!';
    } else {
      showToast('⚠️ Backend not connected — save skipped (run with Docker for full features)');
      btn.textContent = '⚠️ Not Saved';
    }
  } catch {
    showToast('⚠️ Backend offline — timetable generated locally! Run Docker for save feature.');
    btn.textContent = '⚠️ Offline';
  }
  setTimeout(() => { btn.disabled=false; btn.textContent='💾 Save'; }, 3000);
}

// ─── Load Saved ───────────────────────────────────────
async function loadSaved() {
  const el = document.getElementById('savedList');
  el.innerHTML = '<div class="loading-saved">Loading...</div>';
  try {
    const res  = await fetch(`${API}/timetables`);
    const data = await res.json();
    if (!data.length) {
      el.innerHTML = '<div class="loading-saved">No saved timetables yet. Generate and save one!</div>';
      return;
    }
    el.innerHTML = data.map(tt => `
      <div class="saved-card glass-card">
        <div class="saved-title">📅 ${tt.name}</div>
        <div class="saved-meta">${tt.type} | ${tt.year}</div>
        <div class="saved-meta">${tt.nClass} class(es) × ${tt.nDiv} div(s)</div>
        <div class="saved-date">${new Date(tt.createdAt).toLocaleString()}</div>
        <button class="btn btn-del-saved" onclick="deleteSaved('${tt._id}')">🗑 Delete</button>
      </div>`).join('');
  } catch {
    el.innerHTML = '<div class="loading-saved">⚠️ Backend offline. Start Docker to see saved timetables.</div>';
  }
}

async function deleteSaved(id) {
  try {
    await fetch(`${API}/timetables/${id}`, { method:'DELETE' });
    showToast('🗑 Deleted!');
    loadSaved();
  } catch {
    showToast('❌ Could not delete — backend offline');
  }
}

// ─── Reset ────────────────────────────────────────────
function resetAll() {
  generatedData = null;
  Object.keys(colorCache).forEach(k => delete colorCache[k]);
  document.getElementById('stepOutput').style.display = 'none';
  gotoStep(1);
}

// ─── API Status ───────────────────────────────────────
async function checkApiStatus() {
  const dot  = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  try {
    const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      dot.style.background  = '#43e97b';
      text.textContent = 'API Online ✓';
    } else { throw new Error(); }
  } catch {
    dot.style.background  = '#ff6584';
    text.textContent = 'API Offline';
  }
}

// ─── Toast ────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
