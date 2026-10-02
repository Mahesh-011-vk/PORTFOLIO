/* ---------- ASSET PATHS (relative to index.html) ---------- */
var RESUME_DATA_URI = "assets/resume/Mahesh_S_Resume.pdf";
var CERT_IMAGES = {
  reliance: "assets/certs/reliance.jpg",
  aws: "assets/certs/aws.jpg",
  chaicode: "assets/certs/chaicode.jpg",
  anthropic: "assets/certs/anthropic.jpg"
};
var HERO_PORTRAIT_URI = "assets/images/hero-portrait.jpg";

(function () {
  "use strict";
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width:760px)').matches;
  document.documentElement.style.setProperty('--portrait-src', "url(" + HERO_PORTRAIT_URI + ")");

  /* ---------- LOADER ---------- */
  var loaderLines = ["INITIALIZING AI SYSTEM", "LOADING NEURAL NETWORK", "LOADING EXPERIENCE", "LOADING PROJECTS", "SYSTEM READY"];
  var li = 0;
  var loaderLabel = document.getElementById('loaderLabel');
  var loaderTimer = setInterval(function () {
    li++;
    if (li < loaderLines.length) { loaderLabel.textContent = loaderLines[li]; }
  }, 340);
  window.addEventListener('load', function () {
    setTimeout(function () {
      clearInterval(loaderTimer);
      document.getElementById('loader').classList.add('done');
      if (window.location.hash) {
        var targetEl = document.querySelector(window.location.hash);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 1500);
  });

  /* ---------- NAV & SLIDING PAGE TRANSITION ---------- */
  function triggerPageSlide(targetEl) {
    var curtain = document.getElementById('pageSlideCurtain');
    if (curtain && !reduced) {
      curtain.classList.remove('active');
      void curtain.offsetWidth; // force reflow
      curtain.classList.add('active');
      setTimeout(function () {
        if (targetEl) targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 120);
      setTimeout(function () {
        curtain.classList.remove('active');
      }, 340);
    } else {
      if (targetEl) targetEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  }

  var navButtons = document.querySelectorAll('nav button[data-target]');
  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.dataset.target);
      triggerPageSlide(el);
    });
  });
  document.getElementById('btnExplore').addEventListener('click', function () {
    triggerPageSlide(document.getElementById('projects'));
  });
  (function () {
    var openBtn = document.getElementById('btnResume');
    var modal = document.getElementById('resumeModal');
    var frame = document.getElementById('resumeFrame');
    var closeBtn = document.getElementById('resumeClose');
    var downloadLink = document.getElementById('resumeDownload');
    var lastFocused = null;
    downloadLink.setAttribute('href', RESUME_DATA_URI);

    function openModal() {
      lastFocused = document.activeElement;
      if (!frame.getAttribute('src')) frame.setAttribute('src', RESUME_DATA_URI);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  })();

  /* ---------- CERTIFICATE LIGHTBOX ---------- */
  var certModal = document.getElementById('certModal');
  var certImage = document.getElementById('certImage');
  var certTitle = document.getElementById('certModalTitle');
  var certDownload = document.getElementById('certDownload');
  var certClose = document.getElementById('certClose');
  var certLastFocused = null;

  window.openCert = function (key, name) {
    var src = CERT_IMAGES[key];
    if (!src) return;
    certLastFocused = document.activeElement;
    certImage.setAttribute('src', src);
    certImage.setAttribute('alt', name + ' certificate');
    certTitle.textContent = name.toUpperCase();
    certDownload.setAttribute('href', src);
    certDownload.setAttribute('download', name.replace(/[^a-z0-9]+/gi, '_') + '.jpg');
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    certClose.focus();
  };
  function closeCertModal() {
    certModal.classList.remove('open');
    document.body.style.overflow = '';
    if (certLastFocused) certLastFocused.focus();
  }
  certClose.addEventListener('click', closeCertModal);
  certModal.addEventListener('click', function (e) { if (e.target === certModal) closeCertModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && certModal.classList.contains('open')) closeCertModal(); });
  var sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
  var secEls = sections.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (ent) {
      if (ent.isIntersecting) {
        navButtons.forEach(function (b) { b.classList.toggle('active', b.dataset.target === ent.target.id); });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  secEls.forEach(function (s) { io.observe(s); });

  /* ---------- SCROLL PROGRESS & TRANSITION ON EVERY SCROLL ---------- */
  var spBar = document.getElementById('scrollProgress');
  function onScrollTransition() {
    var scrollY = window.scrollY || window.pageYOffset;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && spBar) {
      var progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      spBar.style.transform = 'scaleX(' + progress + ')';
    }
  }
  window.addEventListener('scroll', onScrollTransition, { passive: true });
  onScrollTransition();

  /* Enhanced Scroll Reveal for Every Slide / Scroll */
  function initScrollTransitions() {
    var targets = document.querySelectorAll(
      'section:not(.hero) .section-head, section:not(.hero) .eyebrow, .about-copy > h2, .about-copy > p, .about-modules .module, .identity-frame, #skillGroups > div, .tl-item, .pod, .arch-node, .cert-card, .contact-actions, .contact-direct'
    );
    if (!reduced && targets.length) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (ent) {
          if (ent.isIntersecting) {
            ent.target.classList.add('in-view');
          } else if (ent.boundingClientRect.top > 0) {
            // Re-arm when scrolled back up above the element so every scroll down triggers transition
            ent.target.classList.remove('in-view');
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      targets.forEach(function (el) {
        el.classList.add('scroll-reveal');
        ro.observe(el);
      });
    }
  }

  // Initialize once DOM & dynamic lists are ready
  setTimeout(initScrollTransitions, 80);

  /* ---------- DATA: SKILLS ---------- */
  var skillData = [
    ["PROGRAMMING", ["Python", "SQL", "Kotlin", "HTML", "CSS", "JavaScript"]],
    ["AI / ML", ["Machine Learning", "Deep Learning", "ANN", "CNN", "RNN", "Generative AI", "Prompt Engineering", "TensorFlow", "Keras", "Scikit-learn"]],
    ["GENAI", ["LLM", "RAG", "Agentic AI", "LangGraph", "LangChain", "Hugging Face"]],
    ["CLOUD / INFRASTRUCTURE", ["AWS", "Docker", "Kubernetes"]],
    ["DATA", ["Pandas", "NumPy", "Power BI", "Excel", "MySQL"]],
    ["DEVELOPMENT", ["Firebase", "Git", "GitHub", "Jupyter Notebook", "Android Studio"]],
    ["DATA ENGINEERING", ["Data Analysis", "EDA", "ETL", "Data Preprocessing", "Feature Engineering", "Data Visualization"]]
  ];
  var sg = document.getElementById('skillGroups');
  skillData.forEach(function (group) {
    var wrap = document.createElement('div');
    var label = document.createElement('div'); label.className = 'skill-group-label mono'; label.textContent = group[0];
    var row = document.createElement('div'); row.className = 'skill-row';
    group[1].forEach(function (s) { var c = document.createElement('span'); c.className = 'chip'; c.textContent = s; row.appendChild(c); });
    wrap.appendChild(label); wrap.appendChild(row);
    sg.appendChild(wrap);
  });

  /* ---------- DATA: PROJECTS ---------- */
  var projects = [
    {
      num: "01", name: "TruLens", tagline: "AI-powered reality checker", tech: ["Python", "Generative AI"],
      github: "https://github.com/Mahesh-011-vk/trulens-ai-powered-reality-checker",
      image: "assets/images/project_trulens_bg.jpg",
      grade: "linear-gradient(135deg,rgba(40,22,6,0.38) 0%,rgba(80,45,12,0.20) 45%,rgba(14,8,3,0.68) 100%)",
      problem: "Misinformation spreads faster than manual fact-checking can keep up with.",
      flow: ["Information", "Text analysis", "AI verification", "Multi-source check", "Result"],
      features: ["Fake news detection", "Text analysis pipeline", "Multi-source fact checking", "Real-time web verification", "Interactive dashboard"]
    },
    {
      num: "02", name: "EchoFit", tagline: "AI-powered fitness application", tech: ["Kotlin", "Firebase", "Generative AI"],
      github: "https://github.com/Mahesh-011-vk/EchoFitAI",
      image: "assets/images/project_echofit_bg.jpg",
      grade: "linear-gradient(135deg,rgba(12,16,14,0.38) 0%,rgba(35,45,40,0.20) 45%,rgba(8,10,9,0.68) 100%)",
      problem: "Generic fitness apps don't adapt plans to the individual in real time.",
      flow: ["Profile input", "AI plan generation", "Workout tracking", "Progress sync"],
      features: ["Personalized workout plans", "Diet recommendations", "Calorie tracking", "Progress monitoring", "Intelligent fitness guidance"]
    },
    {
      num: "03", name: "Prompt Forge", tagline: "AI prompt engineering platform", tech: ["Python", "GenAI", "RAG", "LLM"],
      github: "https://github.com/Mahesh-011-vk/PROMPT-FORGE",
      image: "assets/images/project_ultronva_bg.jpg",
      grade: "linear-gradient(135deg,rgba(60,10,8,0.38) 0%,rgba(35,8,6,0.22) 45%,rgba(10,2,2,0.68) 100%)",
      problem: "Crafting effective prompts for LLMs is complex — no single tool handles generation, evaluation, and optimization together.",
      flow: ["Prompt input", "GenAI generation", "RAG retrieval", "LLM orchestration", "Evaluation", "Optimized output"],
      features: ["Multi-modal prompt generation", "Prompt optimization engine", "RAG-powered context retrieval", "LLM orchestration layer", "Agent-based prompt evaluation", "Prompt history & management"]
    },
    {
      num: "04", name: "Ultron VA", tagline: "AI-powered voice assistant", tech: ["Python", "Llama 3.2", "Speech Recognition"],
      github: "https://github.com/Mahesh-011-vk/ULTRON-VA",
      image: "assets/images/project_promptforge_bg.jpg",
      grade: "linear-gradient(135deg,rgba(6,22,22,0.38) 0%,rgba(12,38,36,0.20) 45%,rgba(3,10,10,0.68) 100%)",
      problem: "Existing voice assistants rely on cloud APIs and lack a futuristic, offline-capable local AI experience.",
      flow: ["Voice input", "Speech recognition", "Local Llama 3.2", "Command routing", "Response output"],
      features: ["Local Llama 3.2 AI (offline)", "Speech recognition & synthesis", "Web search & commands", "Real-time weather queries", "Futuristic 3D interface", "No cloud dependency"]
    }
  ];
  var pl = document.getElementById('projectList');
  projects.forEach(function (p, idx) {
    var pod = document.createElement('div');
    pod.className = 'pod';
    // Full-bleed background with color grade
    if (p.image) {
      var bgVal = p.grade + ', url("' + p.image + '")';
      pod.style.backgroundImage = bgVal;
      pod.style.setProperty('background-image', bgVal, 'important');
      pod.style.setProperty('background-size', 'cover', 'important');
      pod.style.setProperty('background-position', 'center center', 'important');
      pod.style.setProperty('background-repeat', 'no-repeat', 'important');
    } else {
      pod.style.setProperty('background', '#2a2520', 'important');
    }

    pod.innerHTML =
      // Tech chips — top right (absolutely positioned via CSS)
      '<div class="pod-tech">' + p.tech.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +

      // Bottom overlay: title + chevron
      '<div class="pod-head">' +
      '<div class="pod-title-wrap">' +
      '<span class="pod-num mono">' + p.num + '</span>' +
      '<h3>' + p.name + '</h3>' +
      '</div>' +
      '<div class="pod-chevron"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,251,244,0.85)" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>' +
      '</div>' +

      // Tagline sits just above the expand body
      '<span class="pod-tagline-bar">' + p.tagline + '</span>' +

      // Expandable body — frosted glass panel
      '<div class="pod-body"><div class="pod-body-inner">' +
      '<div>' +
      '<div class="pod-problem"><b>Problem —</b> ' + p.problem + '</div>' +
      '<div class="pod-flow">' + p.flow.map(function (f) { return '<div class="flow-step">' + f + '</div>'; }).join('') + '</div>' +
      '</div>' +
      '<div>' +
      '<b class="pod-feat-label">Features</b>' +
      '<ul class="pod-features">' + p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
      (p.github
        ? '<a href="' + p.github + '" target="_blank" rel="noopener noreferrer" class="pod-github-btn" onclick="event.stopPropagation();">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>' +
        'View on GitHub</a>'
        : '') +
      '</div>' +
      '</div></div>';

    pod.querySelector('.pod-head').addEventListener('click', function () { pod.classList.toggle('open'); });
    pl.appendChild(pod);
  });


  /* ---------- DATA: ARCHITECTURE ---------- */
  var archNodes = [
    ["User", "Interacts with the application"],
    ["Application", "Front-end interface layer"],
    ["API / Backend", "Handles requests & orchestration"],
    ["AI / ML", "Model inference layer"],
    ["RAG / LLM", "Retrieval-augmented generation"],
    ["Database / Vector store", "Grounding data & embeddings"],
    ["Result", "Response returned to user"]
  ];
  var af = document.getElementById('archFlow');
  archNodes.forEach(function (n, i) {
    var node = document.createElement('div');
    node.className = 'tilt-card arch-node';
    node.innerHTML = '<h4>' + n[0] + '</h4><span class="arch-desc">' + n[1] + '</span>';
    af.appendChild(node);
    if (i < archNodes.length - 1) {
      var conn = document.createElement('div'); conn.className = 'arch-connector';
      af.appendChild(conn);
    }
  });

  /* ---------- DATA: CERTS ---------- */
  var certs = [
    {
      key: "aws",
      org: "Amazon Web Services",
      name: "Foundations of Prompt Engineering",
      date: "July 24, 2026",
      id: "Credential ID: AWS-PE-2026-FND",
      desc: "Official AWS Training & Certification completion validating proficiency in prompt engineering principles, generative AI context grounding, few-shot conditioning, and LLM steering.",
      tags: ["AWS", "Prompt Engineering", "Generative AI", "LLMs"],
      verify: ""
    },
    {
      key: "chaicode",
      org: "ChaiCode",
      name: "Certificate of Completion — GenAI with Python v2",
      date: "2025",
      id: "ID: 122158092324791710249857",
      desc: "Completed comprehensive 40+ hour intensive curriculum mastering Generative AI pipelines, LangChain, agentic patterns, API integration, and Python-driven LLM applications.",
      tags: ["GenAI", "Python v2", "LangChain", "AI Agents", "40+ Hours"],
      verify: "https://chaicode.com"
    },
    {
      key: "reliance",
      org: "Reliance Foundation Skilling Academy",
      name: "AI-Machine Learning Engineer Certificate Course",
      date: "July 30, 2026",
      id: "Credential ID: RFSA-AIML-783921",
      desc: "Extensive certification mastering machine learning algorithms, deep neural architectures, feature engineering, statistical modeling, and production AI pipelines.",
      tags: ["AI / ML", "Deep Learning", "Python", "Data Science"],
      verify: ""
    },
    {
      key: "anthropic",
      org: "Anthropic",
      name: "AI Fluency: Framework and Foundations",
      date: "2026",
      id: "Credential: Anthropic Fluency Core",
      desc: "Rigorous curriculum covering frontier LLM capabilities, constitutional AI alignment, safety methodologies, and enterprise generative AI integration patterns.",
      tags: ["Anthropic", "Claude AI", "AI Safety", "Prompt Systems"],
      verify: ""
    }
  ];
  var cg = document.getElementById('certGrid');
  certs.forEach(function (c) {
    var el = document.createElement('div');
    el.className = 'cert';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'View certificate: ' + c.name);

    var certImg = CERT_IMAGES[c.key] || '';

    el.innerHTML =
      '<div class="cert-thumb">' +
        (certImg ? '<img class="cert-thumb-img" src="' + certImg + '" alt="' + c.name + ' certificate" loading="lazy" />' : '') +
        '<div class="cert-thumb-overlay">' +
          '<button class="cert-preview-btn" type="button">Preview</button>' +
          '<button class="cert-preview-btn primary" type="button">Open Image ↗</button>' +
        '</div>' +
        '<div class="cert-thumb-badges">' +
          '<span class="cert-badge org">' + c.org + '</span>' +
          '<span class="cert-badge date">' + (c.date || '') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="cert-content">' +
        '<div class="cert-title-row">' +
          '<h3 class="cert-title">' + c.name + ' <span class="cert-arrow">↗</span></h3>' +
        '</div>' +
        (c.id ? '<div class="cert-id mono">' + c.id + '</div>' : '') +
        '<p class="cert-desc">' + c.desc + '</p>' +
        '<div class="cert-tags">' +
          c.tags.map(function(t){ return '<span class="cert-tag">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="cert-footer">' +
          '<button class="cert-view-link" type="button">View Certificate ↗</button>' +
          (c.verify ? '<a href="' + c.verify + '" target="_blank" rel="noopener noreferrer" class="cert-verify-link" onclick="event.stopPropagation();">Verify Online ↗</a>' : '') +
        '</div>' +
      '</div>';

    el.addEventListener('click', function () { openCert(c.key, c.name); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCert(c.key, c.name);
      }
    });
    cg.appendChild(el);
  });

  /* =====================================================
     THREE.JS — BACKGROUND NEURAL FIELD
  ===================================================== */
  if (window.THREE) {
    var bgCanvas = document.getElementById('bg-canvas');
    var bgScene = new THREE.Scene();
    var bgCamera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
    bgCamera.position.z = 26;
    var bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true });
    bgRenderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
    bgRenderer.setSize(innerWidth, innerHeight);

    var NODE_COUNT = isMobile ? 60 : 150;
    var spread = 30;
    var positions = new Float32Array(NODE_COUNT * 3);
    var velArr = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread * 1.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.7 - 4;
      velArr.push({ x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.004 });
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({ color: 0xFFB347, size: 0.12, transparent: true, opacity: 0.75 });
    var points = new THREE.Points(geo, mat);
    bgScene.add(points);

    // connecting lines (neural network look) — build once, static topology, animate positions
    var lineGeo = new THREE.BufferGeometry();
    var maxLines = isMobile ? 70 : 220;
    var linePositions = new Float32Array(maxLines * 2 * 3);
    var lineMat = new THREE.LineBasicMaterial({ color: 0x3D6352, transparent: true, opacity: 0.35 });
    var lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    bgScene.add(lineMesh);

    function rebuildLines() {
      var idx = 0;
      var pos = geo.attributes.position.array;
      for (var a = 0; a < NODE_COUNT && idx < maxLines; a++) {
        var ax = pos[a * 3], ay = pos[a * 3 + 1], az = pos[a * 3 + 2];
        var linked = 0;
        for (var b = a + 1; b < NODE_COUNT && idx < maxLines && linked < 2; b++) {
          var bx = pos[b * 3], by = pos[b * 3 + 1], bz = pos[b * 3 + 2];
          var d = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by) + (az - bz) * (az - bz));
          if (d < 5.2) {
            linePositions[idx * 6] = ax; linePositions[idx * 6 + 1] = ay; linePositions[idx * 6 + 2] = az;
            linePositions[idx * 6 + 3] = bx; linePositions[idx * 6 + 4] = by; linePositions[idx * 6 + 5] = bz;
            idx++; linked++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, idx * 2);
    }
    rebuildLines();

    var mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / innerWidth - 0.5);
      mouseY = (e.clientY / innerHeight - 0.5);
    });

    /* Interactive Background Image Parallax */
    var themeBgImg = document.getElementById('themeBgImg');
    if (themeBgImg) {
      var bgTicking = false;
      function updateBgParallax() {
        bgTicking = false;
        var sy = window.scrollY || window.pageYOffset;
        var px = mouseX * 22;
        var py = (mouseY * 20) - (sy * 0.04);
        themeBgImg.style.transform = 'translate(' + px.toFixed(1) + 'px, ' + py.toFixed(1) + 'px) scale(1.04)';
      }
      window.addEventListener('mousemove', function () {
        if (!bgTicking) { bgTicking = true; requestAnimationFrame(updateBgParallax); }
      }, { passive: true });
      window.addEventListener('scroll', function () {
        if (!bgTicking) { bgTicking = true; requestAnimationFrame(updateBgParallax); }
      }, { passive: true });
    }

    var frame = 0;
    function animateBg() {
      requestAnimationFrame(animateBg);
      frame++;
      if (!reduced) {
        var pos = geo.attributes.position.array;
        for (var i2 = 0; i2 < NODE_COUNT; i2++) {
          pos[i2 * 3] += velArr[i2].x;
          pos[i2 * 3 + 1] += velArr[i2].y;
          if (pos[i2 * 3] > spread * 0.8 || pos[i2 * 3] < -spread * 0.8) velArr[i2].x *= -1;
          if (pos[i2 * 3 + 1] > spread * 0.6 || pos[i2 * 3 + 1] < -spread * 0.6) velArr[i2].y *= -1;
        }
        geo.attributes.position.needsUpdate = true;
        if (frame % 40 === 0) rebuildLines();
        bgCamera.position.x += (mouseX * 3 - bgCamera.position.x) * 0.02;
        bgCamera.position.y += (-mouseY * 3 - bgCamera.position.y) * 0.02;
        bgCamera.lookAt(0, 0, 0);
        points.rotation.y += 0.0006;
        lineMesh.rotation.y += 0.0006;
      }
      bgRenderer.render(bgScene, bgCamera);
    }
    animateBg();

    /* =====================================================
       HERO AI CORE
    ===================================================== */
    var heroCanvas = document.getElementById('hero-canvas');
    var heroScene = new THREE.Scene();
    var heroCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    heroCamera.position.set(0, 0, 8);
    var heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
    heroRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    function sizeHero() {
      var r = heroCanvas.getBoundingClientRect();
      heroRenderer.setSize(r.width, r.height, false);
      heroCamera.aspect = r.width / r.height;
      heroCamera.updateProjectionMatrix();
    }
    sizeHero();

    var coreGroup = new THREE.Group();
    heroScene.add(coreGroup);

    var icoGeo = new THREE.IcosahedronGeometry(2.1, 1);
    var icoMat = new THREE.MeshBasicMaterial({ color: 0x800020, wireframe: true, transparent: true, opacity: 0.55 });
    var ico = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(ico);

    var innerGeo = new THREE.IcosahedronGeometry(1.35, 2);
    var innerMat = new THREE.MeshBasicMaterial({ color: 0x9a1030, wireframe: true, transparent: true, opacity: 0.45 });
    var innerIco = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerIco);

    var coreLight = new THREE.PointLight(0x800020, 2, 10);
    coreLight.position.set(0, 0, 2);
    heroScene.add(coreLight);

    // ring
    var ringGeo = new THREE.TorusGeometry(2.7, 0.012, 8, 90);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x800020, transparent: true, opacity: 0.4 });
    var ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.3;
    coreGroup.add(ring1);
    var ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.material.color = new THREE.Color(0x9a1030);
    ring2.rotation.x = Math.PI / 3.4; ring2.rotation.y = Math.PI / 5;
    coreGroup.add(ring2);

    // orbiting particles
    var opCount = isMobile ? 40 : 90;
    var opGeo = new THREE.BufferGeometry();
    var opPos = new Float32Array(opCount * 3);
    for (var o = 0; o < opCount; o++) {
      var rad = 2.8 + Math.random() * 1.2;
      var th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI;
      opPos[o * 3] = rad * Math.sin(ph) * Math.cos(th);
      opPos[o * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
      opPos[o * 3 + 2] = rad * Math.cos(ph);
    }
    opGeo.setAttribute('position', new THREE.BufferAttribute(opPos, 3));
    var opMat = new THREE.PointsMaterial({ color: 0x800020, size: 0.045, transparent: true, opacity: 0.7 });
    var opPoints = new THREE.Points(opGeo, opMat);
    coreGroup.add(opPoints);

    var hmx = 0, hmy = 0;
    heroCanvas.addEventListener('mousemove', function (e) {
      var r = heroCanvas.getBoundingClientRect();
      hmx = ((e.clientX - r.left) / r.width - 0.5);
      hmy = ((e.clientY - r.top) / r.height - 0.5);
    });

    function animateHero() {
      requestAnimationFrame(animateHero);
      if (!reduced) {
        coreGroup.rotation.y += 0.0035;
        coreGroup.rotation.x += (hmy * 0.6 - coreGroup.rotation.x) * 0.04;
        coreGroup.rotation.y += (hmx * 0.4) * 0.002;
        opPoints.rotation.y -= 0.0018;
        ring1.rotation.z += 0.002;
        ring2.rotation.z -= 0.0016;
      }
      heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    /* =====================================================
       ABOUT — IDENTITY SILHOUETTE (guarded — canvas may be replaced by img)
    ===================================================== */
    var idCanvas = document.getElementById('identity-canvas');
    function sizeId() { /* no-op when canvas removed */ }
    if (idCanvas) {
      var idScene = new THREE.Scene();
      var idCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
      idCamera.position.set(0, 0, 7);
      var idRenderer = new THREE.WebGLRenderer({ canvas: idCanvas, antialias: true, alpha: true });
      idRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      sizeId = function () {
        var r = idCanvas.getBoundingClientRect();
        if (r.width === 0) return;
        idRenderer.setSize(r.width, r.height, false);
        idCamera.aspect = r.width / r.height; idCamera.updateProjectionMatrix();
      };
      var silGroup = new THREE.Group(); idScene.add(silGroup);
      var silGeo = new THREE.SphereGeometry(1.7, 32, 32);
      var silMat = new THREE.MeshBasicMaterial({ color: 0xd9c8b0, wireframe: true, transparent: true, opacity: 0.55 });
      var silMesh = new THREE.Mesh(silGeo, silMat);
      silGroup.add(silMesh);
      var silDotsGeo = new THREE.BufferGeometry();
      var silCount = 200;
      var silPos = new Float32Array(silCount * 3);
      for (var s = 0; s < silCount; s++) {
        var v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(1.72);
        silPos[s * 3] = v.x; silPos[s * 3 + 1] = v.y; silPos[s * 3 + 2] = v.z;
      }
      silDotsGeo.setAttribute('position', new THREE.BufferAttribute(silPos, 3));
      var silDots = new THREE.Points(silDotsGeo, new THREE.PointsMaterial({ color: 0x800020, size: 0.035, transparent: true, opacity: 0.9 }));
      silGroup.add(silDots);
      (function animateId() {
        requestAnimationFrame(animateId);
        if (!reduced) { silGroup.rotation.y += 0.004; silGroup.rotation.x = Math.sin(Date.now() * 0.0003) * 0.15; }
        idRenderer.render(idScene, idCamera);
      })();
    }

    /* =====================================================
       CONTACT ORB
    ===================================================== */
    var orbCanvas = document.getElementById('orb-canvas');
    var orbScene = new THREE.Scene();
    var orbCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
    orbCamera.position.z = 5;
    var orbRenderer = new THREE.WebGLRenderer({ canvas: orbCanvas, antialias: true, alpha: true });
    orbRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    function sizeOrb() {
      var r = orbCanvas.getBoundingClientRect();
      if (r.width === 0) return;
      orbRenderer.setSize(r.width, r.height, false);
      orbCamera.aspect = r.width / r.height; orbCamera.updateProjectionMatrix();
    }
    var orbGroup = new THREE.Group(); orbScene.add(orbGroup);
    var orbCoreGeo = new THREE.IcosahedronGeometry(1.15, 2);
    var orbCoreMat = new THREE.MeshBasicMaterial({ color: 0x800020, wireframe: true, transparent: true, opacity: 0.65 });
    orbGroup.add(new THREE.Mesh(orbCoreGeo, orbCoreMat));
    var orbRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.01, 8, 80), new THREE.MeshBasicMaterial({ color: 0x9a1030, transparent: true, opacity: 0.5 }));
    orbRing.rotation.x = Math.PI / 2.4;
    orbGroup.add(orbRing);
    function animateOrb() {
      requestAnimationFrame(animateOrb);
      if (!reduced) { orbGroup.rotation.y += 0.006; orbRing.rotation.z += 0.003; }
      orbRenderer.render(orbScene, orbCamera);
    }
    animateOrb();

    function onResize() {
      bgCamera.aspect = innerWidth / innerHeight; bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(innerWidth, innerHeight);
      sizeHero(); sizeId(); sizeOrb();
    }
    window.addEventListener('resize', onResize);
    setTimeout(function () { sizeHero(); sizeId(); sizeOrb(); }, 300);
  }
})();

/* ===== PALETTE NAV-THEME SWITCHER ===== */
(function () {
  /* Map each section id → nav palette key */
  var sectionNav = {
    hero: 'dark',
    about: 'olive',
    skills: 'bone',
    experience: 'white',
    projects: 'dark',
    architecture: 'olive',
    certifications: 'dark',
    contact: 'white'
  };

  /* Set initial theme (page starts at hero = dark) */
  document.body.setAttribute('data-nav', 'dark');

  var ids = Object.keys(sectionNav);
  var els = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        var nav = sectionNav[id];
        if (nav) document.body.setAttribute('data-nav', nav);
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  els.forEach(function (el) { observer.observe(el); });
})();

