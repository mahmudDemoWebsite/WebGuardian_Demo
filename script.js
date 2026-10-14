(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const els = {
    dashboard: $('#dashboardSection'), editor: $('#editorSection'), history: $('#historySection'),
    breadcrumb: $('#breadcrumbCurrent'), urlForm: $('#urlForm'), siteUrl: $('#siteUrl'),
    progressWrap: $('#progressWrap'), progressText: $('#progressText'), progressPercent: $('#progressPercent'), progressBar: $('#progressBar'),
    issueList: $('#issueList'), emptyIssues: $('#emptyIssues'), categoryList: $('#categoryList'), stepsList: $('#stepsList'),
    editorResults: $('#editorResults'), htmlInput: $('#htmlInput'), charCount: $('#charCount'), historyList: $('#historyList'), emptyHistory: $('#emptyHistory')
  };
  const issueMeta = {
    'missing-alt': {title:'কিছু ছবিতে alt text নেই', category:'accessibility', fix:'প্রতিটি গুরুত্বপূর্ণ ছবির জন্য অর্থপূর্ণ alt attribute যোগ করুন। অলংকারমূলক ছবিতে alt="" ব্যবহার করা যায়।'},
    'meta-description': {title:'Meta description যোগ বা উন্নত করুন', category:'seo', fix:'পেজের বিষয়বস্তু সংক্ষেপে বোঝায় এমন স্বতন্ত্র meta description লিখুন।'},
    'heading-order': {title:'Heading structure যাচাই করুন', category:'seo', fix:'একটি স্পষ্ট H1 রাখুন এবং বিষয়গুলোর জন্য H2/H3 যৌক্তিক ক্রমে ব্যবহার করুন।'},
    'viewport': {title:'Viewport meta tag পাওয়া যায়নি', category:'responsive', fix:'head-এর মধ্যে <meta name="viewport" content="width=device-width, initial-scale=1"> যোগ করুন।'},
    'html-lang': {title:'HTML ভাষা নির্ধারণ করা হয়নি', category:'accessibility', fix:'যেমন বাংলার জন্য <html lang="bn"> বা ইংরেজির জন্য <html lang="en"> ব্যবহার করুন।'},
    'form-label': {title:'কিছু ফর্ম ফিল্ডে label নেই', category:'accessibility', fix:'প্রতিটি input-কে দৃশ্যমান label-এর সঙ্গে যুক্ত করুন অথবা উপযুক্ত accessible name দিন।'},
    'empty-link': {title:'কিছু লিংকের গন্তব্য যাচাই করা দরকার', category:'functionality', fix:'href খালি বা # হলে সঠিক গন্তব্য দিন। এটি প্রকৃত broken-link check নয়—শুধু HTML-এ সম্ভাব্য সমস্যা শনাক্ত করে।'},
    'title': {title:'Page title পাওয়া যায়নি', category:'seo', fix:'head-এর মধ্যে পেজের বিষয়বস্তুর সঙ্গে সামঞ্জস্যপূর্ণ <title> যোগ করুন।'},
    'h1': {title:'একটি স্পষ্ট প্রধান শিরোনাম রাখুন', category:'seo', fix:'পেজে একটি বর্ণনামূলক H1 রাখুন, যাতে পেজের মূল বিষয় বোঝা যায়।'},
    'charset': {title:'Character encoding ঘোষণা করা হয়নি', category:'seo', fix:'head-এর শুরুতে <meta charset="UTF-8"> যোগ করুন।'},
    'external-rel': {title:'কিছু নতুন ট্যাবের লিংকে নিরাপত্তা attribute নেই', category:'security', fix:'target="_blank" ব্যবহার করলে rel="noopener noreferrer" যোগ করুন।'},
    'no-doctype': {title:'DOCTYPE ঘোষণা পাওয়া যায়নি', category:'functionality', fix:'ডকুমেন্টের প্রথম লাইনে <!doctype html> যোগ করুন।'},
    'image-size': {title:'ছবির আকার অপ্টিমাইজ করা দরকার', category:'performance', fix:'প্রয়োজন অনুযায়ী image dimension নির্ধারণ ও আধুনিক compressed format ব্যবহার বিবেচনা করুন।'},
    'long-title': {title:'Page title অনেক দীর্ঘ', category:'seo', fix:'শিরোনামটি সংক্ষিপ্ত, স্বতন্ত্র ও পেজের সঙ্গে প্রাসঙ্গিক রাখুন।'}
  };
  const sampleIssues = [
    {id:'missing-alt', status:'critical', title:'কিছু ছবিতে alt text নেই', desc:'স্ক্রিন রিডার ব্যবহারকারীরা ছবির বিষয় বুঝতে নাও পারেন।', detail:'ডেমো উদাহরণ: কয়েকটি image element-এ বিকল্প লেখা অনুপস্থিত।', category:'অ্যাক্সেসিবিলিটি'},
    {id:'meta-description', status:'warning', title:'Meta description উন্নত করা দরকার', desc:'সার্চ ফলাফলে পেজের বর্ণনা আরও স্পষ্ট করা যায়।', detail:'ডেমো উদাহরণ: meta description অনুপস্থিত বা দুর্বল হতে পারে।', category:'SEO'},
    {id:'heading-order', status:'warning', title:'Heading structure পর্যালোচনা করুন', desc:'শিরোনামের ক্রম আরও অর্থপূর্ণ করা যেতে পারে।', detail:'ডেমো উদাহরণ: heading hierarchy-তে অসঙ্গতি থাকতে পারে।', category:'SEO'},
    {id:'viewport', status:'warning', title:'মোবাইল viewport যাচাই করুন', desc:'ছোট স্ক্রিনের অভিজ্ঞতা নিশ্চিত করা প্রয়োজন।', detail:'ডেমো উদাহরণ: viewport সেটিং অনুপস্থিত হতে পারে।', category:'রেসপনসিভ'},
    {id:'external-rel', status:'warning', title:'নতুন ট্যাবের লিংক পরীক্ষা করুন', desc:'target="_blank" লিংকে নিরাপত্তা attribute যাচাই করুন।', detail:'ডেমো উদাহরণ: বাহ্যিক লিংকে rel attribute দরকার হতে পারে।', category:'নিরাপত্তা'},
    {id:'title-ok', status:'passed', title:'Page title পাওয়া গেছে', desc:'পেজের একটি শিরোনাম রয়েছে।', detail:'নমুনা ফলাফল: পেজ টাইটেল পাওয়া গেছে।', category:'SEO'},
    {id:'lang-ok', status:'passed', title:'HTML language নির্ধারিত', desc:'ডকুমেন্টে ভাষার তথ্য রয়েছে।', detail:'নমুনা ফলাফল: lang attribute ঠিক আছে।', category:'অ্যাক্সেসিবিলিটি'},
    {id:'charset-ok', status:'passed', title:'Character encoding নির্ধারিত', desc:'টেক্সট এনকোডিং ঘোষণা করা আছে।', detail:'নমুনা ফলাফল: charset meta tag পাওয়া গেছে।', category:'HTML গঠন'},
    {id:'https-ok', status:'passed', title:'HTTPS ব্যবহারের ইঙ্গিত', desc:'নমুনা প্রতিবেদনে নিরাপদ URL দেখানো হচ্ছে।', detail:'এটি শুধু নমুনা ডেটা; TLS certificate যাচাই করা হয়নি।', category:'নিরাপত্তা'},
    {id:'form-ok', status:'passed', title:'ফর্মের গঠন পাওয়া গেছে', desc:'ফর্ম-সংক্রান্ত মার্কআপের উদাহরণ আছে।', detail:'নমুনা ফলাফল; বাস্তবে ফর্ম submit করে পরীক্ষা করা হয়নি।', category:'কার্যকারিতা'},
    {id:'mobile-ok', status:'passed', title:'মোবাইল লেআউট চেক তালিকায় আছে', desc:'রেসপনসিভ পরীক্ষা করার বিভাগ যোগ করা হয়েছে।', detail:'বাস্তব মোবাইল rendering পরীক্ষা করা হয়নি।', category:'রেসপনসিভ'},
    {id:'heading-ok', status:'passed', title:'Heading চেক অন্তর্ভুক্ত', desc:'শিরোনাম কাঠামো পরীক্ষার বিভাগ রয়েছে।', detail:'নমুনা প্রতিবেদন; লাইভ HTML পরীক্ষা নয়।', category:'SEO'},
    {id:'link-ok', status:'passed', title:'লিংক চেক অন্তর্ভুক্ত', desc:'লিংক যাচাইয়ের বিষয় প্রতিবেদনে আছে।', detail:'বাস্তব লিংক খোলা হয়নি; এটি নমুনা ফলাফল।', category:'কার্যকারিতা'},
    {id:'image-ok', status:'passed', title:'ইমেজ অপ্টিমাইজেশন চেক অন্তর্ভুক্ত', desc:'ছবির মান ও বিকল্প লেখার বিষয় আছে।', detail:'বাস্তব ছবির ফাইল বা সাইজ পরীক্ষা করা হয়নি।', category:'পারফরম্যান্স'},
    {id:'meta-ok', status:'passed', title:'মেটাডেটা চেক অন্তর্ভুক্ত', desc:'SEO metadata পরীক্ষা প্রতিবেদনে রয়েছে।', detail:'নমুনা প্রতিবেদনে metadata বিভাগ দেখানো হচ্ছে।', category:'SEO'},
    {id:'keyboard-ok', status:'passed', title:'অ্যাক্সেসিবিলিটি চেক অন্তর্ভুক্ত', desc:'কীবোর্ড ও লেবেলের বিষয়গুলো বিবেচনায় আছে।', detail:'বাস্তব keyboard navigation পরীক্ষা করা হয়নি।', category:'অ্যাক্সেসিবিলিটি'}
  ];
  const sampleCategories = [
    {id:'performance',name:'পারফরম্যান্স',score:86,color:'#7567e8'},
    {id:'accessibility',name:'অ্যাক্সেসিবিলিটি',score:68,color:'#e5a347'},
    {id:'seo',name:'SEO',score:82,color:'#20ae83'},
    {id:'responsive',name:'রেসপনসিভ',score:74,color:'#6994e8'},
    {id:'security',name:'নিরাপত্তা',score:91,color:'#39bba0'}
  ];
  const demoSteps = [
    {title:'ছবির জন্য alt text যোগ করুন',desc:'গুরুত্বপূর্ণ ছবির বিষয় সংক্ষেপে বর্ণনা করুন।'},
    {title:'Meta description পর্যালোচনা করুন',desc:'প্রতিটি গুরুত্বপূর্ণ পেজে আলাদা ও প্রাসঙ্গিক বর্ণনা দিন।'},
    {title:'মোবাইল লেআউট পরীক্ষা করুন',desc:'ছোট স্ক্রিনে নেভিগেশন, লেখা ও বাটন ব্যবহারযোগ্য কিনা দেখুন।'}
  ];
  let currentReport = null;
  let issueFilter = 'all';
  let showAllRows = false;
  let toastTimer;
  let scanSequence = 1;
  let lastHtmlAudit = null;

  function toast(message) {
    $('#toastMessage').textContent = message;
    const box = $('#toast'); box.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove('show'), 2800);
  }
  function today() {
    return new Intl.DateTimeFormat('bn-BD', {day:'numeric', month:'long', year:'numeric'}).format(new Date());
  }
  function normalizedUrl(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return 'https://example.com';
    try { const u = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`); return u.href; }
    catch { return `https://${trimmed.replace(/^\/+/, '')}`; }
  }
  function safeHost(value) {
    try { return new URL(normalizedUrl(value)).hostname; } catch { return String(value); }
  }
  function makeReportId() { return `WG-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`; }
  function setNav(name) {
    $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.nav === name));
    els.dashboard.hidden = name !== 'dashboard';
    els.editor.hidden = name !== 'html-check';
    els.history.hidden = name !== 'history';
    els.breadcrumb.textContent = name === 'html-check' ? 'HTML পরীক্ষা' : name === 'history' ? 'স্ক্যান ইতিহাস' : 'ড্যাশবোর্ড';
    if (name === 'history') renderHistory();
    $('#sidebar').classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function initSampleReport() {
    currentReport = {
      id:'WG-DEMO-001', url:'https://example.com', host:'example.com', type:'sample', date:new Date().toISOString(),
      score:78, issues:sampleIssues.map(x => ({...x})), categories:sampleCategories.map(x => ({...x})), passedCount:12,
      steps:demoSteps.map(x => ({...x})), tip:'মোবাইলে কেমন দেখায় তা পরীক্ষা করুন এবং ছবির alt text যোগ করুন।',
      disclaimer:'এটি নমুনা প্রতিবেদন। কোনো লাইভ URL পরীক্ষা করা হয়নি।'
    };
    renderReport(currentReport);
  }
  function renderReport(report) {
    currentReport = report;
    $('#overallScore').textContent = report.score;
    $('#scoreRing').style.setProperty('--score', report.score);
    $('#overallState').textContent = report.score >= 90 ? 'চমৎকার অবস্থা' : report.score >= 75 ? 'আরও উন্নতি প্রয়োজন' : report.score >= 50 ? 'উন্নতির প্রয়োজন' : 'গুরুত্বপূর্ণ কাজ দরকার';
    $('#scoreDescription').textContent = report.score >= 90 ? 'ভালো ফল—নিয়মিত পরীক্ষা চালিয়ে যান।' : 'কিছু গুরুত্বপূর্ণ বিষয় ঠিক করলে স্কোর বাড়বে।';
    $('#issueCount').textContent = report.issues.filter(x => x.status === 'critical' || x.status === 'warning').length;
    $('#criticalCount').textContent = report.issues.filter(x => x.status === 'critical').length;
    $('#warningCount').textContent = report.issues.filter(x => x.status === 'warning').length;
    $('#passedCount').textContent = report.passedCount ?? report.issues.filter(x => x.status === 'passed').length;
    const total = Math.max(1, report.issues.length + (report.passedCount || 0));
    $('#passPercent').textContent = `${Math.round((report.passedCount || 0)/total*100)}%`;
    $('#reportType').textContent = report.type === 'html' ? 'HTML বিশ্লেষণ' : 'নমুনা ডেটা';
    $('#reportMetaType').textContent = report.type === 'html' ? 'HTML কোড বিশ্লেষণ' : 'নমুনা';
    $('#reportId').textContent = report.id;
    $('#reportCaption').textContent = report.type === 'html' ? `${safeHost(report.url)} · আপনার দেওয়া HTML কোডের ভিত্তিতে` : 'নমুনা ওয়েবসাইটের জন্য একটি উদাহরণ প্রতিবেদন';
    $('#noticeUrl').textContent = report.host || safeHost(report.url);
    $('#demoNotice').hidden = report.type === 'html';
    $('#tipText').textContent = report.tip || 'লাল ও হলুদ চিহ্নিত বিষয়গুলো আগে সমাধান করুন।';
    const categories = report.categories || sampleCategories;
    els.categoryList.innerHTML = categories.map(cat => `<div class="category-item"><div class="category-item-head"><span class="category-name"><i class="category-marker" style="background:${cat.color}"></i>${escapeHTML(cat.name)}</span><strong>${cat.score}/100</strong></div><div class="category-track"><span style="width:${cat.score}%;background:${cat.color}"></span></div></div>`).join('');
    const steps = report.steps?.length ? report.steps : demoSteps;
    els.stepsList.innerHTML = steps.slice(0,4).map((step,i) => `<div class="step-item"><span class="step-number">${String(i+1).padStart(2,'0')}</span><div><strong>${escapeHTML(step.title)}</strong><p>${escapeHTML(step.desc)}</p></div></div>`).join('');
    const passDots = $('#passDots'); passDots.innerHTML = Array.from({length:12},(_,i)=>`<span style="opacity:${i < Math.min(report.passedCount || 0,12) ? 1 : .3}"></span>`).join('');
    renderIssueList();
  }
  function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function renderIssueList() {
    if (!currentReport) return;
    const issues = currentReport.issues || [];
    const filtered = issues.filter(issue => issueFilter === 'all' || issue.status === issueFilter);
    const critical = issues.filter(x => x.status === 'critical').length;
    const warning = issues.filter(x => x.status === 'warning').length;
    const passed = currentReport.passedCount ?? issues.filter(x => x.status === 'passed').length;
    $('#allFilterCount').textContent = issues.length;
    $('#criticalFilterCount').textContent = critical;
    $('#warningFilterCount').textContent = warning;
    $('#passedFilterCount').textContent = passed;
    els.issueList.innerHTML = filtered.slice(0, showAllRows ? 100 : (issueFilter === 'all' ? 6 : 15)).map(issue => {
      const statusText = issue.status === 'critical' ? 'গুরুত্বপূর্ণ' : issue.status === 'warning' ? 'সতর্কতা' : 'উত্তীর্ণ';
      const symbol = issue.status === 'critical' ? '!' : issue.status === 'warning' ? '△' : '✓';
      return `<div class="issue-item" tabindex="0" role="button" data-issue="${escapeHTML(issue.id)}" aria-label="${escapeHTML(issue.title)} বিস্তারিত"><span class="issue-symbol ${issue.status}">${symbol}</span><span class="issue-main"><span class="issue-title">${escapeHTML(issue.title)}</span><span class="issue-subtitle">${escapeHTML(issue.category || 'সাধারণ পরীক্ষা')} · ${escapeHTML(issue.desc || '')}</span></span><span class="severity-badge ${issue.status}">${statusText}</span><span class="issue-chevron">›</span></div>`;
    }).join('');
    els.emptyIssues.hidden = filtered.length > 0;
    els.issueList.hidden = filtered.length === 0;
    $('#showAllIssues').innerHTML = showAllRows ? 'কম ফলাফল দেখুন <span>↑</span>' : 'সব পরীক্ষার ফল দেখুন <span>→</span>';
    $('#showAllIssues').hidden = filtered.length <= 6 && issueFilter === 'all';
    $$('.issue-item', els.issueList).forEach(item => {
      const openDetails = () => showIssueDetails(item.dataset.issue);
      item.addEventListener('click', openDetails);
      item.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') {e.preventDefault();openDetails();} });
    });
  }
  function showIssueDetails(id) {
    const issue = currentReport?.issues.find(x => x.id === id);
    if (!issue) return;
    const status = issue.status === 'critical' ? 'গুরুত্বপূর্ণ বিষয়' : issue.status === 'warning' ? 'সতর্কতা' : 'পরীক্ষায় উত্তীর্ণ';
    alert(`${issue.title}\n\nঅবস্থা: ${status}\nবিভাগ: ${issue.category || 'সাধারণ'}\n\nকেন গুরুত্বপূর্ণ?\n${issue.detail || issue.desc || 'এই বিষয়টি পর্যালোচনা করুন।'}\n\nসম্ভাব্য সমাধান:\n${issue.fix || issueMeta[issue.id]?.fix || 'উপরে উল্লেখ করা বিষয়টি আপনার প্রকল্পে যাচাই করুন।'}\n\nনোট: ${currentReport.type === 'sample' ? 'এটি নমুনা ফলাফল, বাস্তব সাইট থেকে সংগ্রহ করা হয়নি।' : 'এই ফলাফল শুধু দেওয়া HTML কোডের ওপর ভিত্তি করে।'}`);
  }
  function buildSampleFromUrl(url) {
    const host = safeHost(url);
    const hash = [...host].reduce((acc,ch) => (acc*31 + ch.charCodeAt(0)) >>> 0, 7);
    const score = 64 + (hash % 31);
    const issues = sampleIssues.map((x,i) => ({...x}));
    // Keep a plausible demo report while varying only illustrative metrics, never claiming a live scan.
    return {id:makeReportId(),url:normalizedUrl(url),host,type:'sample',date:new Date().toISOString(),score,issues,categories:sampleCategories.map((x,i)=>({...x,score:Math.max(45,Math.min(98,x.score + ((hash >> (i*3)) % 13)-6))})),passedCount:10 + (hash % 6),steps:demoSteps.map(x=>({...x})),tip:'এটি নমুনা স্ক্যান। বাস্তব স্কোর পেতে লাইভ পরীক্ষা যুক্ত করতে হবে।',disclaimer:'নমুনা ফলাফল; লাইভ URL স্ক্যান করা হয়নি।'};
  }
  function saveHistory(report) {
    try {
      const records = JSON.parse(localStorage.getItem('wgHistory') || '[]');
      records.unshift({id:report.id,url:report.url,host:report.host,score:report.score,type:report.type,date:report.date,issueCount:report.issues.filter(x=>x.status==='critical'||x.status==='warning').length});
      localStorage.setItem('wgHistory', JSON.stringify(records.slice(0,30)));
    } catch { /* Local history is an optional convenience. */ }
  }
  function readHistory() { try { return JSON.parse(localStorage.getItem('wgHistory') || '[]'); } catch { return []; } }
  function renderHistory() {
    const records = readHistory();
    $('#historyCount').textContent = `${records.length}টি প্রতিবেদন`;
    els.historyList.innerHTML = records.map(record => `<div class="history-item"><div><div class="history-url">${escapeHTML(record.host || record.url)}</div><div class="history-detail">${record.type === 'html' ? 'HTML বিশ্লেষণ' : 'নমুনা রিপোর্ট'} · ${escapeHTML(new Date(record.date).toLocaleString('bn-BD'))} · ${record.issueCount}টি বিষয়</div></div><div class="history-actions"><span class="history-score">${record.score}</span><button data-history-open="${escapeHTML(record.id)}">ড্যাশবোর্ড</button></div></div>`).join('');
    els.emptyHistory.hidden = records.length > 0;
    els.historyList.hidden = records.length === 0;
    $$('[data-history-open]').forEach(btn => btn.addEventListener('click',()=>{const rec=records.find(x=>x.id===btn.dataset.historyOpen);if(rec){setNav('dashboard');toast('ইতিহাসের আইটেমটি নির্বাচন করা হয়েছে। বর্তমান নমুনা ফলাফল দেখানো হচ্ছে।');}}));
  }
  function reportPlainText(report) {
    const lines = [`WebGuardian প্রতিবেদন`,`আইডি: ${report.id}`,`ওয়েবসাইট: ${report.url}`,`ধরন: ${report.type === 'html' ? 'HTML কোড বিশ্লেষণ' : 'নমুনা প্রতিবেদন'}`,`তারিখ: ${new Date(report.date).toLocaleString('bn-BD')}`,`স্কোর: ${report.score}/100`,`নোট: ${report.disclaimer || (report.type === 'sample' ? 'নমুনা ফলাফল; লাইভ স্ক্যান নয়।' : 'ফলাফল দেওয়া HTML কোডের ভিত্তিতে।')}`,'','পরীক্ষার ফল:'];
    report.issues.forEach(issue=>lines.push(`- [${issue.status}] ${issue.title}: ${issue.desc || ''}${issue.fix ? ` সমাধান: ${issue.fix}` : ''}`));
    lines.push('','ক্যাটাগরি স্কোর:');(report.categories||[]).forEach(cat=>lines.push(`- ${cat.name}: ${cat.score}/100`));
    return lines.join('\n');
  }
  function downloadText(text, filename, mime='text/plain;charset=utf-8') {
    const blob = new Blob([text],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
  }
  function downloadReport(report) {
    if (!report) return toast('আগে একটি পরীক্ষা চালান।');
    downloadText(JSON.stringify({...report, generatedBy:'WebGuardian Demo'},null,2),`webguardian-${report.id.toLowerCase()}.json`,'application/json;charset=utf-8');
    toast('JSON প্রতিবেদন ডাউনলোড হয়েছে।');
  }
  function auditHtml(source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(source, 'text/html');
    const findings = [];
    const add = (id,status,detail,fix,category) => { const meta=issueMeta[id]||{};findings.push({id:`${id}-${findings.length}`,key:id,status,title:meta.title||id,detail,fix:fix||meta.fix||'',category:category||meta.category||'functionality'}); };
    const title = doc.querySelector('title')?.textContent.trim() || '';
    if (!/<!doctype\s+html/i.test(source)) add('no-doctype','warning','HTML5 DOCTYPE ঘোষণা নেই।','ফাইলের একদম শুরুতে <!doctype html> যোগ করুন.','HTML গঠন'); else add('no-doctype','passed','HTML5 DOCTYPE ঘোষণা পাওয়া গেছে।','','HTML গঠন');
    if (!title) add('title','critical','head অংশে title ট্যাগ পাওয়া যায়নি।',issueMeta.title.fix,'SEO');
    else if (title.length > 65) add('long-title','warning',`Title-এ ${title.length}টি অক্ষর আছে।`,'শিরোনাম সংক্ষিপ্ত ও নির্দিষ্ট করার কথা বিবেচনা করুন।','SEO');
    else add('title','passed',`Title পাওয়া গেছে: “${title.slice(0,90)}”`,'','SEO');
    if (!doc.querySelector('meta[charset]')) add('charset','warning','Character encoding ঘোষণা পাওয়া যায়নি।',issueMeta.charset.fix,'HTML গঠন'); else add('charset','passed','Character encoding নির্ধারিত আছে।','','HTML গঠন');
    if (!doc.querySelector('meta[name="viewport" i]')) add('viewport','warning','মোবাইল viewport meta tag নেই।',issueMeta.viewport.fix,'রেসপনসিভ'); else add('viewport','passed','Viewport meta tag পাওয়া গেছে।','','রেসপনসিভ');
    const lang=(doc.documentElement.getAttribute('lang')||'').trim();
    if (!lang) add('html-lang','warning','html element-এ lang attribute নেই।',issueMeta['html-lang'].fix,'অ্যাক্সেসিবিলিটি'); else add('html-lang','passed',`ডকুমেন্টের ভাষা “${lang}” নির্ধারিত আছে।`,'','অ্যাক্সেসিবিলিটি');
    const desc=doc.querySelector('meta[name="description" i]')?.getAttribute('content')?.trim()||'';
    if(!desc) add('meta-description','warning','Meta description পাওয়া যায়নি।',issueMeta['meta-description'].fix,'SEO'); else if(desc.length<50||desc.length>170) add('meta-description','warning',`Meta description-এ ${desc.length}টি অক্ষর আছে।`,'বর্ণনাটি প্রাসঙ্গিক ও সংক্ষিপ্ত রাখুন; দৈর্ঘ্য কোনো কঠোর র‌্যাঙ্কিং নিয়ম নয়।','SEO'); else add('meta-description','passed','Meta description পাওয়া গেছে।','','SEO');
    const h1=doc.querySelectorAll('h1');
    if(h1.length===0) add('h1','warning','কোনো H1 পাওয়া যায়নি।',issueMeta.h1.fix,'SEO'); else if(h1.length>1) add('heading-order','warning',`${h1.length}টি H1 পাওয়া গেছে। পেজের heading structure দেখুন।`,issueMeta['heading-order'].fix,'SEO'); else add('h1','passed',`একটি H1 পাওয়া গেছে: “${h1[0].textContent.trim().slice(0,65)}”`,'','SEO');
    const images=[...doc.querySelectorAll('img')];const noAlt=images.filter(img=>!img.hasAttribute('alt'));
    if(noAlt.length) add('missing-alt','critical',`${images.length}টি ছবির মধ্যে ${noAlt.length}টিতে alt attribute নেই।`,issueMeta['missing-alt'].fix,'অ্যাক্সেসিবিলিটি'); else add('missing-alt','passed',images.length?`${images.length}টি ছবিতে alt attribute আছে।`:'কোনো img element নেই; অন্য পদ্ধতিতে প্রদর্শিত ছবি এই পরীক্ষায় ধরা নাও পড়তে পারে।','','অ্যাক্সেসিবিলিটি');
    const formFields=[...doc.querySelectorAll('input:not([type="hidden"]),select,textarea')];
    const noLabel=formFields.filter(field=>{const id=field.id;const labelled=!!(id&&doc.querySelector(`label[for="${CSS.escape(id)}"]`));const wrap=!!field.closest('label');const aria=field.getAttribute('aria-label')||field.getAttribute('aria-labelledby')||field.title;return !(labelled||wrap||aria);});
    if(noLabel.length) add('form-label','warning',`${formFields.length}টি form field-এর মধ্যে ${noLabel.length}টিতে label বা accessible name ধরা যায়নি।`,issueMeta['form-label'].fix,'অ্যাক্সেসিবিলিটি'); else add('form-label','passed',formFields.length?'ফর্ম ফিল্ডগুলোর label/name পাওয়া গেছে।':'কোনো সাধারণ form field নেই।','','অ্যাক্সেসিবিলিটি');
    const links=[...doc.querySelectorAll('a')]; const emptyLinks=links.filter(a=>!a.getAttribute('href')||a.getAttribute('href').trim()==='#');
    if(emptyLinks.length) add('empty-link','warning',`${links.length}টি anchor-এর মধ্যে ${emptyLinks.length}টিতে href খালি বা #।`,issueMeta['empty-link'].fix,'কার্যকারিতা'); else add('empty-link','passed',links.length?`${links.length}টি anchor-এ একটি সম্ভাব্য গন্তব্য আছে।`:'কোনো anchor link পাওয়া যায়নি। এই পরীক্ষা গন্তব্যটি সত্যিই কাজ করে কিনা যাচাই করে না।','','কার্যকারিতা');
    const unsafeLinks=links.filter(a=>a.getAttribute('target')==='_blank'&&!/\bnoopener\b/.test(a.getAttribute('rel')||''));
    if(unsafeLinks.length) add('external-rel','warning',`${unsafeLinks.length}টি target="_blank" link-এ rel="noopener" পাওয়া যায়নি।`,issueMeta['external-rel'].fix,'নিরাপত্তা'); else add('external-rel','passed','target="_blank" লিংকে পরিচিত rel সমস্যা ধরা পড়েনি।','','নিরাপত্তা');
    const scripts=[...doc.querySelectorAll('script[src]')];
    if(scripts.length) add('script-loading','passed',`${scripts.length}টি external script reference পাওয়া গেছে। গতি বা script safety এতে যাচাই করা হয় না।`,'','পারফরম্যান্স');
    const failed=findings.filter(f=>f.status==='critical').length, warns=findings.filter(f=>f.status==='warning').length, passed=findings.filter(f=>f.status==='passed').length;
    const score=Math.max(0,Math.round(100-failed*15-warns*7));
    const categoryNames={'SEO':'SEO','অ্যাক্সেসিবিলিটি':'অ্যাক্সেসিবিলিটি','রেসপনসিভ':'রেসপনসিভ','HTML গঠন':'HTML গঠন','কার্যকারিতা':'কার্যকারিতা','নিরাপত্তা':'নিরাপত্তা','পারফরম্যান্স':'পারফরম্যান্স'};
    const groups={}; findings.forEach(f=>{const name=categoryNames[f.category]||f.category;groups[name]??={name,checks:0,bad:0,score:100,color:'#7567e8'};groups[name].checks++;if(f.status==='critical')groups[name].bad+=15;else if(f.status==='warning')groups[name].bad+=7;});
    const palette=['#7567e8','#20ae83','#e5a347','#6994e8','#df6878','#8c77d5','#39bba0'];
    const categories=Object.values(groups).map((g,i)=>({...g,score:Math.max(30,100-g.bad),color:palette[i%palette.length]}));
    const steps=findings.filter(f=>f.status==='critical'||f.status==='warning').slice(0,4).map(f=>({title:f.title,desc:f.fix}));
    return {id:makeReportId(),url:normalizedUrl($('#siteUrl').value),host:'আপনার HTML কোড',type:'html',date:new Date().toISOString(),score,issues:findings.map(f=>({id:f.key,status:f.status,title:f.title,desc:f.detail,detail:f.detail,fix:f.fix,category:f.category==='SEO'?'SEO':f.category})),categories,passedCount:passed,steps,tip:failed?'গুরুত্বপূর্ণ চিহ্নিত HTML বিষয়গুলো আগে ঠিক করুন।':warns?'সতর্কতার বিষয়গুলো পর্যালোচনা করুন।':'প্রাথমিক HTML চেকগুলো ভালো হয়েছে। আরও গভীর পরীক্ষা করাও উপকারী।',disclaimer:'শুধু পেস্ট করা HTML কোডের ভিত্তিতে স্থানীয় পরীক্ষা; লাইভ ওয়েবসাইট, গতি বা সার্ভার পরীক্ষা নয়।',auditMeta:{total:findings.length,failed,warns,passed}};
  }
  function renderHtmlResults(report) {
    lastHtmlAudit=report; renderReport(report); els.editorResults.hidden=false;
    $('#htmlResultsCaption').textContent=`${report.auditMeta.total}টি চেক · ব্রাউজারে স্থানীয় বিশ্লেষণ`;
    $('#htmlScoreValue').textContent=report.score;
    $('#htmlScoreHeading').textContent=report.score>=90?'ভালো গঠন—এভাবেই চালিয়ে যান':report.score>=70?'কয়েকটি বিষয় উন্নত করা দরকার':'কিছু গুরুত্বপূর্ণ বিষয় ঠিক করা দরকার';
    $('#htmlScoreDescription').textContent='এই স্কোরটি পেস্ট করা HTML-এর কিছু নিয়মভিত্তিক চেক থেকে হিসাব করা হয়েছে; এটি পূর্ণাঙ্গ ওয়েবসাইট স্কোর নয়।';
    $('#htmlResultPills').innerHTML=`<span class="result-pill bad">গুরুত্বপূর্ণ ${report.auditMeta.failed}</span><span class="result-pill warn">সতর্কতা ${report.auditMeta.warns}</span><span class="result-pill good">উত্তীর্ণ ${report.auditMeta.passed}</span>`;
    $('#htmlFindings').innerHTML=report.issues.map(issue=>{const symbol=issue.status==='critical'?'!':issue.status==='warning'?'△':'✓';const status=issue.status==='critical'?'গুরুত্বপূর্ণ':issue.status==='warning'?'সতর্কতা':'উত্তীর্ণ';return `<article class="finding-card"><div class="finding-top"><span class="issue-symbol ${issue.status}">${symbol}</span><div><h3>${escapeHTML(issue.title)}</h3><p>${escapeHTML(issue.desc)}</p></div></div><div class="finding-fix"><strong>${status}:</strong> ${escapeHTML(issue.fix||'এই চেকে উল্লেখযোগ্য সমস্যা ধরা পড়েনি।')}</div></article>`;}).join('');
    saveHistory(report); window.scrollTo({top:els.editorResults.getBoundingClientRect().top+window.scrollY-75,behavior:'smooth'}); toast('HTML পরীক্ষা সম্পন্ন হয়েছে।');
  }
  function loadSampleHTML() {
    els.htmlInput.value=`<!doctype html>\n<html>\n<head>\n  <title>আমার ছোট ওয়েবসাইট</title>\n  <meta charset="UTF-8">\n</head>\n<body>\n  <h1>আমাদের ওয়েবসাইটে স্বাগতম</h1>\n  <img src="banner.jpg">\n  <p>আমাদের নতুন সেবা সম্পর্কে জানুন।</p>\n  <a href="#">আরও জানুন</a>\n  <form>\n    <input type="email" placeholder="আপনার ইমেইল">\n    <button>সাবস্ক্রাইব</button>\n  </form>\n</body>\n</html>`;
    updateCharCount(); toast('নমুনা HTML কোড লোড হয়েছে।');
  }
  function updateCharCount(){els.charCount.textContent=`${els.htmlInput.value.length.toLocaleString('bn-BD')} অক্ষর`;}

  els.urlForm.addEventListener('submit', e => {
    e.preventDefault();
    const url=normalizedUrl(els.siteUrl.value);
    try { new URL(url); } catch { toast('একটি সঠিক URL লিখুন।'); return; }
    els.siteUrl.value=url;
    els.progressWrap.hidden=false; $('#demoScanBtn').disabled=true; $('#demoScanBtn').style.opacity='.7';
    let progress=0;
    const steps=[['ডেমো রিপোর্ট প্রস্তুত করা হচ্ছে...',26],['নমুনা ফলাফল সাজানো হচ্ছে...',61],['ড্যাশবোর্ড আপডেট হচ্ছে...',87],['সম্পন্ন...',100]];
    const run=()=>{
      const item=steps.find(s=>s[1]>progress)||steps[steps.length-1];progress=item[1];els.progressText.textContent=item[0];els.progressPercent.textContent=`${progress.toLocaleString('bn-BD')}%`;els.progressBar.style.width=`${progress}%`;
      if(progress<100) setTimeout(run,320); else setTimeout(()=>{
        const report=buildSampleFromUrl(url);renderReport(report);saveHistory(report);$('#reportId').textContent=report.id;$('#demoNotice').hidden=false;$('#noticeUrl').textContent=report.host;$('#reportCaption').textContent=`${report.host} · ডেমো ফলাফল; লাইভ স্ক্যান নয়`;
        els.progressWrap.hidden=true;els.progressBar.style.width='0%';$('#demoScanBtn').disabled=false;$('#demoScanBtn').style.opacity='1';toast('নমুনা রিপোর্ট তৈরি হয়েছে—এটি লাইভ স্ক্যান নয়।');
      },240);
    }; setTimeout(run,150);
  });
  $('#openHtmlEditor').addEventListener('click',()=>{setNav('html-check');if(!els.htmlInput.value)loadSampleHTML();});
  $('#backDashboard').addEventListener('click',()=>setNav('dashboard'));
  $$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>setNav(btn.dataset.nav)));
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  document.addEventListener('click',e=>{if(window.innerWidth<=900 && $('#sidebar').classList.contains('open') && !$('#sidebar').contains(e.target) && !$('#mobileMenu').contains(e.target)) $('#sidebar').classList.remove('open');});
  $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{issueFilter=btn.dataset.filter;showAllRows=false;$$('.filter-btn').forEach(b=>b.classList.toggle('selected',b===btn));renderIssueList();}));
  $('#showAllIssues').addEventListener('click',()=>{if(showAllRows){showAllRows=false;}else{issueFilter='all';showAllRows=true;$$('.filter-btn').forEach(b=>b.classList.toggle('selected',b.dataset.filter==='all'));}renderIssueList();toast(showAllRows?'সব পরীক্ষার ফল দেখানো হচ্ছে।':'সংক্ষিপ্ত ফলাফল দেখানো হচ্ছে।');});
  $('#refreshIssues').addEventListener('click',()=>{renderIssueList();toast('প্রতিবেদন রিফ্রেশ হয়েছে।');});
  $('#dismissNotice').addEventListener('click',()=>$('#demoNotice').hidden=true);
  $('#copyReportBtn').addEventListener('click',async()=>{if(!currentReport)return;const text=reportPlainText(currentReport);try{await navigator.clipboard.writeText(text);toast('প্রতিবেদনের সারাংশ কপি হয়েছে।');}catch{downloadText(text,'webguardian-summary.txt');toast('ক্লিপবোর্ড অনুমতি না থাকায় টেক্সট ফাইল ডাউনলোড করা হয়েছে।');}});
  $('#downloadReportBtn').addEventListener('click',()=>downloadReport(currentReport));
  $('#downloadHtmlReport').addEventListener('click',()=>downloadReport(lastHtmlAudit));
  $('#printReportBtn').addEventListener('click',()=>window.print());
  $('#htmlInput').addEventListener('input',updateCharCount);
  $('#loadSampleCode').addEventListener('click',loadSampleHTML);
  $('#clearCode').addEventListener('click',()=>{els.htmlInput.value='';updateCharCount();els.editorResults.hidden=true;toast('এডিটর খালি করা হয়েছে।');});
  $('#analyzeHtmlBtn').addEventListener('click',()=>{const source=els.htmlInput.value.trim();if(!source){toast('আগে HTML কোড পেস্ট করুন বা নমুনা কোড লোড করুন।');els.htmlInput.focus();return;}const report=auditHtml(source);renderHtmlResults(report);});
  $('#clearHistoryBtn').addEventListener('click',()=>{if(!readHistory().length){toast('মোছার মতো ইতিহাস নেই।');return;}if(confirm('এই ব্রাউজারে সংরক্ষিত সব WebGuardian ইতিহাস মুছে ফেলবেন?')){localStorage.removeItem('wgHistory');renderHistory();toast('স্ক্যান ইতিহাস মুছে ফেলা হয়েছে।');}});
  $('#historyStartBtn').addEventListener('click',()=>setNav('dashboard'));
  $('#todayLabel').textContent=today();
  initSampleReport();
})();
