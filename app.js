// AlgoArena – all game logic
(function() {
  // ---------- STATE ----------
  const STORAGE_KEY = "algoarena";
  let state = {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    hearts: 5,
    maxHearts: 5,
    nextHeartTime: Date.now() + 5*60*1000, // initial full, no wait
    completedLessons: [],      // challenge IDs
    theme: "light"             // or "dark"
  };

  // ---------- SKILL TREE DEFINITION ----------
  const skills = [
    { id: "basics",   name: "Basics",   icon: "🟢", reqSkill: null, reqCount: 0 },
    { id: "strings",  name: "Strings",  icon: "🔤", reqSkill: "basics", reqCount: 2 },
    { id: "arrays",   name: "Arrays",   icon: "📚", reqSkill: "strings", reqCount: 2 },
    { id: "objects",  name: "Objects",  icon: "🧩", reqSkill: "arrays", reqCount: 2 },
    { id: "recursion",name: "Recursion",icon: "🔄", reqSkill: "objects", reqCount: 1 }
  ];

  // ---------- LOAD / SAVE ----------
  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = { ...state, ...JSON.parse(saved) };
      // ensure nextHeartTime is a number
      if (typeof state.nextHeartTime !== 'number') state.nextHeartTime = Date.now() + 5*60*1000;
    }
    updateStreak();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updateStreak() {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.lastActiveDate === yesterday) {
        state.streak++;
      } else {
        state.streak = 1;
      }
      state.lastActiveDate = today;
      saveState();
    }
  }

  // ---------- LEVEL CALC ----------
  function xpForLevel(level) { return level * 50; }
  function getLevel() {
    let xp = state.xp;
    let lvl = 1;
    while (xp >= xpForLevel(lvl)) {
      xp -= xpForLevel(lvl);
      lvl++;
    }
    return lvl;
  }
  function getXpIntoLevel() {
    let xp = state.xp;
    let lvl = 1;
    while (xp >= xpForLevel(lvl)) {
      xp -= xpForLevel(lvl);
      lvl++;
    }
    return xp;
  }

  // ---------- HEARTS ----------
  function refillHearts() {
    const now = Date.now();
    if (state.hearts < state.maxHearts && now >= state.nextHeartTime) {
      state.hearts++;
      state.nextHeartTime = now + 5*60*1000;
      saveState();
    }
  }
  setInterval(refillHearts, 1000); // check every second

  // ---------- SOUND ----------
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playTone(freq, duration, type = 'sine') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }
  function sfxSuccess() {
    playTone(523.25, 0.15); // C5
    setTimeout(() => playTone(659.25, 0.15), 100); // E5
  }
  function sfxFail() {
    playTone(200, 0.3, 'sawtooth');
  }

  // ---------- CONFETTI ----------
  function launchConfetti() {
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-piece';
      conf.style.left = Math.random() * 100 + '%';
      conf.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
      conf.style.animationDuration = (Math.random() * 1.5 + 0.8) + 's';
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 2000);
    }
  }

  // Add confetti CSS dynamically
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .confetti-piece {
      position: fixed;
      top: -20px;
      width: 10px;
      height: 20px;
      z-index: 999;
      pointer-events: none;
      animation: confettiFall linear forwards;
    }
    @keyframes confettiFall {
      to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  // ---------- UI ELEMENTS ----------
  const $skillsContainer = document.getElementById('skills-container');
  const $lessonsContainer = document.getElementById('lessons-container');
  const $skillTreeView = document.getElementById('skill-tree');
  const $lessonListView = document.getElementById('lesson-list');
  const $problemView = document.getElementById('problem-view');
  const $backToTree = document.getElementById('back-to-tree');
  const $backToLessons = document.getElementById('back-to-lessons');
  const $lessonSkillTitle = document.getElementById('lesson-skill-title');
  const $problemTitle = document.getElementById('problem-title');
  const $problemDesc = document.getElementById('problem-description');
  const $testResults = document.getElementById('test-results');
  const $runCodeBtn = document.getElementById('run-code');
  const $streakCount = document.getElementById('streak-count');
  const $xpValue = document.getElementById('xp-value');
  const $heartsContainer = document.getElementById('hearts-container');
  const $userLevel = document.getElementById('user-level');
  const $xpBar = document.getElementById('xp-bar');
  const $xpNextLevel = document.getElementById('xp-next-level');
  const $themeToggle = document.getElementById('theme-toggle');
  const $levelUpPopup = document.getElementById('level-up-popup');

  let codeMirrorEditor = null;
  let currentSkillId = null;
  let currentChallenge = null;

  // ---------- RENDER FUNCTIONS ----------
  function renderHearts() {
    const full = state.hearts;
    const empty = state.maxHearts - full;
    $heartsContainer.innerHTML = '❤️'.repeat(full) + '🖤'.repeat(empty);
  }

  function renderXP() {
    $streakCount.textContent = state.streak;
    $xpValue.textContent = state.xp;
    const level = getLevel();
    $userLevel.textContent = level;
    const xpInto = getXpIntoLevel();
    const needed = xpForLevel(level);
    const percent = (xpInto / needed) * 100;
    $xpBar.style.width = percent + '%';
    $xpNextLevel.textContent = `${xpInto} / ${needed} XP`;
  }

  function isSkillUnlocked(skill) {
    if (!skill.reqSkill) return true;
    // count completed lessons in required skill
    const reqChallenges = challenges.filter(c => c.skill === skill.reqSkill);
    const completedInReq = reqChallenges.filter(c => state.completedLessons.includes(c.id)).length;
    return completedInReq >= skill.reqCount;
  }

  function renderSkillTree() {
    $skillsContainer.innerHTML = '';
    skills.forEach(skill => {
      const unlocked = isSkillUnlocked(skill);
      const total = challenges.filter(c => c.skill === skill.id).length;
      const done = challenges.filter(c => c.skill === skill.id && state.completedLessons.includes(c.id)).length;
      const div = document.createElement('div');
      div.className = 'skill-node' + (unlocked ? '' : ' locked');
      div.innerHTML = `
        <div style="display:flex; align-items:center;">
          <span class="skill-icon">${skill.icon}</span>
          <span class="skill-title">${skill.name}</span>
        </div>
        <span class="skill-progress">${done}/${total}</span>
      `;
      if (unlocked) {
        div.addEventListener('click', () => openSkill(skill));
      }
      $skillsContainer.appendChild(div);
    });
  }

  function openSkill(skill) {
    currentSkillId = skill.id;
    $skillTreeView.classList.remove('active');
    $lessonListView.classList.add('active');
    $lessonSkillTitle.textContent = skill.icon + ' ' + skill.name;
    renderLessons(skill.id);
  }

  function renderLessons(skillId) {
    const list = challenges.filter(c => c.skill === skillId);
    $lessonsContainer.innerHTML = '';
    list.forEach(ch => {
      const done = state.completedLessons.includes(ch.id);
      const div = document.createElement('div');
      div.className = 'lesson-item' + (done ? ' completed' : '');
      div.innerHTML = `
        <span>${ch.title}</span>
        <span class="lesson-status">${done ? '✅' : '🔒'}</span>
      `;
      div.addEventListener('click', () => openChallenge(ch));
      $lessonsContainer.appendChild(div);
    });
  }

  function openChallenge(challenge) {
    currentChallenge = challenge;
    $lessonListView.classList.remove('active');
    $problemView.classList.add('active');
    $problemTitle.textContent = challenge.title;
    $problemDesc.textContent = challenge.desc;
    $testResults.textContent = '';
    if (!codeMirrorEditor) {
      codeMirrorEditor = CodeMirror(document.getElementById('code-editor'), {
        value: challenge.starter,
        mode: 'javascript',
        theme: state.theme === 'dark' ? 'monokai' : 'default',
        lineNumbers: true,
        tabSize: 2
      });
    } else {
      codeMirrorEditor.setValue(challenge.starter);
      codeMirrorEditor.setOption('theme', state.theme === 'dark' ? 'monokai' : 'default');
    }
    codeMirrorEditor.refresh();
  }

  // ---------- RUN CODE (using Web Worker) ----------
  function runCode() {
    if (!currentChallenge) return;
    if (state.hearts <= 0) {
      $testResults.textContent = '💔 No hearts left! Wait for hearts to refill.';
      return;
    }
    const code = codeMirrorEditor.getValue();
    const workerCode = `
      self.onmessage = function(e) {
        const { code, tests } = e.data;
        const results = [];
        try {
          const match = code.match(/function\\s+(\\w+)/);
          if (!match) throw new Error('No function found – define a function with the right name.');
          const funcName = match[1];
          const func = new Function('"use strict"; ' + code + '; return ' + funcName + ';')();
          for (let i = 0; i < tests.length; i++) {
            const tc = tests[i];
            let actual;
            try {
              actual = func(...tc.input);
            } catch (err) {
              results.push({ passed: false, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), actual: err.toString(), error: true });
              continue;
            }
            const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
            results.push({ passed, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), actual: JSON.stringify(actual) });
          }
        } catch (err) {
          results.push({ passed: false, error: err.toString() });
        }
        self.postMessage(results);
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    worker.postMessage({ code, tests: currentChallenge.tests });
    worker.onmessage = function(e) {
      const results = e.data;
      URL.revokeObjectURL(workerUrl);
      displayResults(results);
    };
    worker.onerror = function(err) {
      $testResults.textContent = 'Worker error: ' + err.message;
      URL.revokeObjectURL(workerUrl);
    };
  }

  function displayResults(results) {
    let output = '';
    let allPassed = true;
    for (let r of results) {
      if (r.error) {
        output += '❌ Error: ' + r.error + '\n';
        allPassed = false;
      } else if (r.passed) {
        output += `✅ Test passed: ${r.input} → ${r.actual}\n`;
      } else {
        output += `❌ Test failed: input ${r.input} → expected ${r.expected}, got ${r.actual}\n`;
        allPassed = false;
      }
    }
    $testResults.textContent = output;

    // If all passed, mark as completed and give XP
    if (allPassed) {
      if (!state.completedLessons.includes(currentChallenge.id)) {
        state.completedLessons.push(currentChallenge.id);
        state.xp += 15;
        const oldLevel = getLevel();
        saveState();
        const newLevel = getLevel();
        if (newLevel > oldLevel) {
          showLevelUpPopup();
        }
        sfxSuccess();
        launchConfetti();
        // hearts remain
        renderAll();
      } else {
        // already completed, still celebrate but no XP
        sfxSuccess();
        launchConfetti();
      }
    } else {
      // fail: lose a heart if any test fails
      if (state.hearts > 0) {
        state.hearts--;
        state.nextHeartTime = Date.now() + 5*60*1000; // reset recharge timer
        saveState();
        sfxFail();
        renderAll();
      }
    }
  }

  function showLevelUpPopup() {
    $levelUpPopup.classList.add('popup-visible');
    setTimeout(() => $levelUpPopup.classList.remove('popup-visible'), 2000);
  }

  function renderAll() {
    renderHearts();
    renderXP();
    renderSkillTree();
  }

  // ---------- NAVIGATION ----------
  $backToTree.addEventListener('click', () => {
    $lessonListView.classList.remove('active');
    $problemView.classList.remove('active');
    $skillTreeView.classList.add('active');
    renderAll();
  });
  $backToLessons.addEventListener('click', () => {
    $problemView.classList.remove('active');
    $lessonListView.classList.add('active');
    if (currentSkillId) renderLessons(currentSkillId);
  });
  $runCodeBtn.addEventListener('click', runCode);

  // ---------- THEME TOGGLE ----------
  function applyTheme() {
    if (state.theme === 'dark') {
      document.body.classList.add('dark');
      $themeToggle.textContent = '☀️';
      if (codeMirrorEditor) codeMirrorEditor.setOption('theme', 'monokai');
    } else {
      document.body.classList.remove('dark');
      $themeToggle.textContent = '🌙';
      if (codeMirrorEditor) codeMirrorEditor.setOption('theme', 'default');
    }
  }
  $themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
  });

  // ---------- INIT ----------
  loadState();
  applyTheme();
  renderAll();
})();
