/* ==========================================================================
   main.js
   Core site behavior: loader, theme toggle, navigation, scroll progress,
   project rendering/filtering, case study modal, testimonial carousel,
   contact form validation, back-to-top.
   Vanilla JS only — no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---------------------------------------------------------------------
   * PROJECT DATA — edit this array to add / remove / update projects.
   * category: 'mobile' | 'web' | 'system'
   * ------------------------------------------------------------------- */
  /* Only work I can actually stand behind is listed here. Each project's
     `caseStudy` object holds ONLY the fields there is real material for —
     openCaseStudy() skips anything missing rather than padding it out. */
  const PROJECTS = [
    {
      id: 'customer-portal',
      title: 'my Arada — Customer Portal',
      category: 'web',
      featured: true,
      tags: ['Web', 'PropTech'],
      description: 'A self-service ownership portal for off-plan property buyers — milestone payments, documents, and service requests in one place.',
      role: 'UI/UX Designer — led end-to-end',
      tools: 'Figma, FigJam, Azure DevOps',
      duration: '8–12 Weeks',
      caseStudyUrl: 'case-study-customer-portal.html',
      thumbnail: 'assets/images/customer-portal/thumb-device.png',
      gallery: [
        { src: 'assets/images/customer-portal/dashboard.jpg', caption: 'Property dashboard — value, quick actions, and services at a glance' },
        { src: 'assets/images/customer-portal/payment-schedule.jpg', caption: 'Payment schedule with milestone-by-milestone progress' },
        { src: 'assets/images/customer-portal/quick-pay.jpg', caption: 'Quick Pay — overdue and upcoming dues combined into one payment' },
        { src: 'assets/images/customer-portal/quick-pay-empty.jpg', caption: 'Quick Pay empty state — nothing due, clearly communicated' },
        { src: 'assets/images/customer-portal/quick-pay-success.jpg', caption: 'Payment confirmation with next-step reassurance' },
        { src: 'assets/images/customer-portal/payment-validation.jpg', caption: 'Inline validation for transaction limits and minimum amounts' },
        { src: 'assets/images/customer-portal/payment-failed.jpg', caption: 'Failure state with a clear recovery path' },
        { src: 'assets/images/customer-portal/payment-history.jpg', caption: 'Payment history with receipts, ready to preview or download' },
        { src: 'assets/images/customer-portal/payment-history-filter.jpg', caption: 'Multi-category filtering for large transaction histories' },
        { src: 'assets/images/customer-portal/documents.jpg', caption: 'Document centre for contracts and confirmations' },
        { src: 'assets/images/customer-portal/documents-empty.jpg', caption: 'Empty state designed as guidance, not a dead end' },
        { src: 'assets/images/customer-portal/raise-request.jpg', caption: 'Raise a Request — free-text issue reporting with file upload' },
        { src: 'assets/images/customer-portal/noc-request.jpg', caption: 'NOC Request form with structured document-type selection' },
        { src: 'assets/images/customer-portal/noc-success.jpg', caption: 'Confirmation state closing the loop on submission' },
        { src: 'assets/images/customer-portal/charges.jpg', caption: 'Charges view separating settled fees from amounts still due' }
      ]
    },
    {
      id: 'broker-app',
      title: 'Arada Broker App',
      category: 'mobile',
      featured: true,
      tags: ['Mobile', 'PropTech'],
      description: 'Partner onboarding and services for the brokerages that sell Arada — identity capture, licence verification, a bilingual agency agreement and a rotating site access card.',
      role: 'UI/UX Designer — led end-to-end',
      tools: 'Figma, FigJam',
      duration: 'Arada, 2022–present',
      caseStudyUrl: 'case-study-broker-app.html',
      thumbnail: 'assets/images/broker-app/thumb-device.png',
      gallery: [
        { src: 'assets/images/broker-app/dashboard.jpg', caption: 'Dashboard — creative assets, lead protection, service requests and the access card' },
        { src: 'assets/images/broker-app/profile-50.jpg', caption: 'Profile at 50% — a coral ring and one specific next action' },
        { src: 'assets/images/broker-app/profile-approved.jpg', caption: 'Approved — the completion card is removed and rows become navigation' },
        { src: 'assets/images/broker-app/scan-id-confirm.jpg', caption: 'Emirates ID review — extracted values as editable fields, Rescan weighted equally' },
        { src: 'assets/images/broker-app/verify-mobile-channel.png', caption: 'Mobile verification — the one-time code by WhatsApp or SMS' },
        { src: 'assets/images/broker-app/docs-readback.png', caption: 'Legal documents on file, with expiry dates on the face of each card' },
        { src: 'assets/images/broker-app/agreement-sign.png', caption: 'Review and sign — optional review or share, then signature as its own step' },
        { src: 'assets/images/broker-app/bank-request-receipt.png', caption: 'Change request receipt — status Pending, and only the field in flight' },
        { src: 'assets/images/broker-app/access-card.jpg', caption: 'Access card — a QR that regenerates every 60 seconds, hours and units on the face' },
        { src: 'assets/images/broker-app/shoot-history.png', caption: 'Shoot history — Approved, Pending and Rejected, with per-row sharing' },
        { src: 'assets/images/broker-app/event-rejected.png', caption: 'Rejected request — a reason, and the original request echoed back' },
        { src: 'assets/images/broker-app/invite-roster.jpg', caption: 'Team roster — Owner, Admin and Broker, split by approval state' }
      ]
    },
    {
      id: 'rdd-portal',
      title: 'RDD Portal',
      category: 'web',
      featured: true,
      tags: ['Web', 'Enterprise'],
      description: 'One fit-out record shared by Lease, Retail Design & Delivery, Tenant and MEP teams — thirteen stages from lease handover to Permission to Trade.',
      role: 'UI/UX Designer — led end-to-end',
      tools: 'Figma, FigJam',
      duration: 'Arada, 2022–present',
      caseStudyUrl: 'case-study-rdd-portal.html',
      thumbnail: 'assets/images/rdd-portal/thumb-device.png',
      gallery: [
        { src: 'assets/images/rdd-portal/lease-dashboard.jpg', caption: 'Lease dashboard — and the create-new menu that starts every record' },
        { src: 'assets/images/rdd-portal/critical-path.jpg', caption: 'Critical path — lease dates turned into a milestone programme' },
        { src: 'assets/images/rdd-portal/rdd-reviewing-arch.jpg', caption: 'The drawing review — comment, reason, attachment and three graded outcomes' },
        { src: 'assets/images/rdd-portal/tenant-arch-submit.jpg', caption: 'Architectural submission — sixteen slots, asterisks marking the lease minimum' },
        { src: 'assets/images/rdd-portal/mep-reviewing.jpg', caption: 'MEP reviewing a services drawing in the same reviewer' },
        { src: 'assets/images/rdd-portal/noc-sewa.jpg', caption: 'SEWA NOC — structured fields above, the bilingual letter below' },
        { src: 'assets/images/rdd-portal/mep-inspection.jpg', caption: 'MEP’s inspection checklist — the longest form in the portal' },
        { src: 'assets/images/rdd-portal/snaglist.jpg', caption: 'Snag list — defects beside completion, projected and lease opening dates' },
        { src: 'assets/images/rdd-portal/lop-summary.jpg', caption: 'Late opening penalty summary — the formula in the column headers' },
        { src: 'assets/images/rdd-portal/permission-to-trade.jpg', caption: 'Permission to Trade — every stage green, four signatures, handover to operations' }
      ]
    },
    {
      id: 'lead-management',
      title: 'Lead Management App',
      category: 'mobile',
      featured: true,
      tags: ['Mobile', 'CRM'],
      description: 'A purpose-built replacement for Salesforce on Arada\u2019s sales floor \u2014 one app for VPs, Sales Managers and Sales Executives, with an SLA countdown on every lead.',
      role: 'UI/UX Designer \u2014 led end-to-end',
      tools: 'Figma, FigJam',
      duration: 'Arada, 2022\u2013present',
      caseStudyUrl: 'case-study-lead-management.html',
      thumbnail: 'assets/images/lead-management/thumb-device.png',
      gallery: [
        { src: 'assets/images/lead-management/exec-dashboard.jpg', caption: 'Sales Executive dashboard \u2014 new leads first, then the funnel' },
        { src: 'assets/images/lead-management/vp-dashboard.png', caption: 'Vice President dashboard \u2014 the funnel, then breaches and reassignment' },
        { src: 'assets/images/lead-management/leads-all.jpg', caption: 'Leads by SLA severity \u2014 Safe, Warning, Critical in one scan' },
        { src: 'assets/images/lead-management/sla-breached.jpg', caption: 'SLA Breached \u2014 its own destination for managers' },
        { src: 'assets/images/lead-management/reassign-sheet.png', caption: 'Reassigning a lead \u2014 select a manager, say why' },
        { src: 'assets/images/lead-management/reassign-success.png', caption: 'A receipt naming the new owner' },
        { src: 'assets/images/lead-management/queue-pending.jpg', caption: 'Removed from the assignment queue \u2014 no new leads until reinstated' },
        { src: 'assets/images/lead-management/lead-details.jpg', caption: 'Lead details \u2014 and a mobile number masked to four digits' },
        { src: 'assets/images/lead-management/activities-call.jpg', caption: 'Calls, tasks, meetings and emails logged on the lead' },
        { src: 'assets/images/lead-management/quotation-units.jpg', caption: 'Quotation as a basket of selectable units' },
        { src: 'assets/images/lead-management/reject-receipt.png', caption: 'Rejecting a lead \u2014 with a reason on the record' },
        { src: 'assets/images/lead-management/empty-leads.jpg', caption: 'No new leads \u2014 only the empty row goes quiet' }
      ]
    },
    {
      id: 'sales-commission',
      title: 'Sales Commission',
      category: 'mobile',
      featured: true,
      tags: ['Mobile', 'Fintech'],
      description: 'A commission module inside Arada\u2019s Connect App \u2014 the full derivation from sale price to your own share, the milestones that release each half, and who signed off on them.',
      role: 'UI/UX Designer \u2014 led end-to-end',
      tools: 'Figma, FigJam',
      duration: 'Arada, 2022\u2013present',
      caseStudyUrl: 'case-study-sales-commission.html',
      thumbnail: 'assets/images/sales-commission/thumb-device.png',
      gallery: [
        { src: 'assets/images/sales-commission/exec-overview.png', caption: 'Commission overview \u2014 total split into first and second half' },
        { src: 'assets/images/sales-commission/deal-shared.jpg', caption: 'A shared deal \u2014 net sale value, total commission and rate, then your own share' },
        { src: 'assets/images/sales-commission/deal-solo.jpg', caption: 'A solo deal \u2014 the comparison removed rather than greyed out' },
        { src: 'assets/images/sales-commission/mgr-deal.jpg', caption: 'Pending status \u2014 each milestone with its verifier, date and half' },
        { src: 'assets/images/sales-commission/combined-list.png', caption: 'Combined commission list \u2014 every participant, rate by rate' },
        { src: 'assets/images/sales-commission/mgr-profile.jpg', caption: 'Individual against shared earnings, in one stacked bar' },
        { src: 'assets/images/sales-commission/mgr-overview.jpg', caption: 'Manager overview \u2014 My Deals above My Team' },
        { src: 'assets/images/sales-commission/mgr-detail.jpg', caption: 'Manager detail \u2014 units closed against target' },
        { src: 'assets/images/sales-commission/connect-drawer.jpg', caption: 'Where it lives \u2014 one row in the Connect App drawer' },
        { src: 'assets/images/sales-commission/filter-applied.jpg', caption: 'Filter applied \u2014 a removable chip explains the shorter list' }
      ]
    },
    {
      id: 'super-app',
      title: 'Arada Super App',
      category: 'mobile',
      featured: true,
      tags: ['Mobile', 'Concept'],
      description: 'One app for the whole relationship \u2014 find a home, reserve it, pay for it, move in and run it. 83 screens across property, payments, services and ten request types. Designed, not released.',
      role: 'UI/UX Designer \u2014 designed the screens end to end',
      tools: 'Figma, FigJam',
      duration: 'Arada \u00b7 not released',
      caseStudyUrl: 'case-study-super-app.html',
      thumbnail: 'assets/images/superapp/thumb-device.png',
      gallery: [
        { src: 'assets/images/superapp/landing.jpg', caption: 'Home \u2014 quick actions, search, destinations and latest launches' },
        { src: 'assets/images/superapp/buy-list.jpg', caption: 'Buy Property \u2014 communities and listings' },
        { src: 'assets/images/superapp/buy-details.jpg', caption: 'Property details \u2014 the reservation fee stated above the button' },
        { src: 'assets/images/superapp/buy-docs-abroad.jpg', caption: 'Documents for a buyer abroad \u2014 national ID and passport instead of an Emirates ID' },
        { src: 'assets/images/superapp/care-home.jpg', caption: 'Arada Care \u2014 pick a property, then a service' },
        { src: 'assets/images/superapp/care-quote.jpg', caption: 'Quotation \u2014 line items, tax and service fee, with Reject beside Proceed to Pay' },
        { src: 'assets/images/superapp/care-status-pay.jpg', caption: 'View & Pay, inline in the tracker' },
        { src: 'assets/images/superapp/issue-common.jpg', caption: 'Raise an Issue \u2014 a common-area fault needs precinct, unit and floor' },
        { src: 'assets/images/superapp/issue-general.jpg', caption: 'The same form for a general area \u2014 three fields' },
        { src: 'assets/images/superapp/movein-1.jpg', caption: 'Move-In \u2014 the only request that earns a four-step wizard' }
      ]
    },
    {
      id: 'yalla-scooter',
      title: 'Yalla Scooter App',
      category: 'mobile',
      featured: true,
      tags: ['Mobile', 'Mobility'],
      description: 'Self-service scooter and e-bike rental \u2014 register by SMS, scan the QR printed on the handlebar, swipe to unlock and ride, with no staff and no paperwork in the middle.',
      role: 'UI/UX Designer \u2014 led end-to-end',
      tools: 'Figma, FigJam',
      duration: 'Yalla',
      caseStudyUrl: 'case-study-yalla-scooter.html',
      thumbnail: 'assets/images/yalla/thumb-device.png',
      gallery: [
        { src: 'assets/images/yalla/map.jpg', caption: 'The map \u2014 scooters and bikes, wallet chip, and the scan button' },
        { src: 'assets/images/yalla/register-mobile.jpg', caption: 'Continue with mobile number \u2014 no password to invent' },
        { src: 'assets/images/yalla/register-otp.jpg', caption: 'Four-digit SMS code, with resend and a countdown' },
        { src: 'assets/images/yalla/qr-help.jpg', caption: 'Where to find QR code \u2014 scooter box, bike lock and cross bar' },
        { src: 'assets/images/yalla/scanning.jpg', caption: 'The scanner, with manual number entry underneath' },
        { src: 'assets/images/yalla/vehicle-scanned.jpg', caption: 'Vehicle found \u2014 battery, range, price and ID, then swipe to unlock' },
        { src: 'assets/images/yalla/ride-live.jpg', caption: 'Ride in progress \u2014 zones, battery, elapsed time and distance' },
        { src: 'assets/images/yalla/card-empty.jpg', caption: 'The card form, opened inside the vehicle sheet' },
        { src: 'assets/images/yalla/rides-history.jpg', caption: 'My Rides \u2014 invoice number, route and amount per ride' },
        { src: 'assets/images/yalla/help-steps.jpg', caption: 'Help \u2014 an illustrated walkthrough of unlocking' }
      ]
    },
    {
      id: 'handover-app',
      title: 'Handover iPad App',
      /* iPad only, and deliberately so \u2014 filed under mobile because the grid
         has two buckets, but the case study is explicit that there is no phone
         or desktop layout. */
      category: 'mobile',
      featured: true,
      tags: ['iPad', 'Bilingual'],
      description: 'Unit handover, done standing in the apartment \u2014 a bilingual checklist, a key-collection authorisation and two declarations, signed on the iPad and filed before anyone leaves.',
      role: 'UI/UX Designer \u2014 led end-to-end',
      tools: 'Figma, FigJam',
      duration: 'Arada, 2022\u2013present',
      caseStudyUrl: 'case-study-handover.html',
      thumbnail: 'assets/images/handover/thumb-device.png',
      gallery: [
        { src: 'assets/images/handover/checklist.jpg', caption: 'Handover Checklist \u2014 quantity steppers on keys and cards, checkboxes on the rest' },
        { src: 'assets/images/handover/key-collection.jpg', caption: 'Key Collection Authorization \u2014 owner details filled, representative details required' },
        { src: 'assets/images/handover/key-signatures.jpg', caption: 'Two signature pads beneath the terms \u2014 owner and representative' },
        { src: 'assets/images/handover/signature-declaration.jpg', caption: 'Signature Declaration \u2014 for a signature that differs from the passport specimen' },
        { src: 'assets/images/handover/title-deed.jpg', caption: 'Title Deed Application \u2014 a statutory letter, signed in the pad below' },
        { src: 'assets/images/handover/title-deed-success.jpg', caption: 'Submitted successfully \u2014 the record uploads before anyone leaves' }
      ]
    }
  ];

  const projectGrid = document.getElementById('projectGrid');

  const mediaIcon = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><rect x="14" y="10" width="72" height="80" rx="8"/><circle cx="50" cy="38" r="12"/><path d="M22 78c6-16 20-24 28-24s22 8 28 24"/></svg>`;

  function renderProjects(filter) {
    projectGrid.innerHTML = '';
    const items = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

    items.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = project.featured ? 'project-card project-card--featured reveal-up' : 'project-card reveal-up';
      card.style.setProperty('--delay', `${Math.min(index, 5) * 0.06}s`);
      const mediaContent = project.thumbnail
        ? `<img src="${project.thumbnail}" alt="${project.title} interface preview" loading="lazy">`
        : mediaIcon;
      card.innerHTML = `
        <div class="project-card__media">
          <div class="project-card__tags">
            ${project.tags.map((t) => `<span class="project-card__tag">${t}</span>`).join('')}
          </div>
          ${project.featured ? '<span class="project-card__ribbon">Featured Case Study</span>' : ''}
          ${mediaContent}
        </div>
        <div class="project-card__body">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-card__meta">
            <div><strong>Role</strong>${project.role}</div>
            <div><strong>Tools</strong>${project.tools}</div>
            <div><strong>Duration</strong>${project.duration}</div>
          </div>
          <div class="project-card__actions">
            ${project.caseStudyUrl
              ? `<a href="${project.caseStudyUrl}" class="btn btn--primary btn--sm">View Case Study</a>`
              : `<button class="btn btn--outline btn--sm" data-case-study="${project.id}">View Details</button>`}
          </div>
        </div>
      `;
      projectGrid.appendChild(card);
    });

    // Re-observe newly created reveal elements
    window.PortfolioAnimations.initScrollReveal();
    initMagneticOnNewButtons();
  }

  function initMagneticOnNewButtons() {
    // Magnetic effect is only wired for .magnetic elements set at load;
    // dynamically added buttons intentionally stay static for performance on a data-dense grid.
  }

  renderProjects('all');

  /* Filtering */
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      renderProjects(chip.dataset.filter);
    });
  });

  /* ---------------------------------------------------------------------
   * CASE STUDY MODAL
   * ------------------------------------------------------------------- */
  const caseStudyEl = document.getElementById('caseStudy');
  const caseStudyBody = document.getElementById('caseStudyBody');

  function buildMetricRing(metric) {
    if (!metric) return '';
    const r = 54;
    const circumference = 2 * Math.PI * r;
    return `
      <div class="cs-metric">
        <svg class="metric-ring" viewBox="0 0 130 130" width="130" height="130">
          <circle class="metric-ring__track" cx="65" cy="65" r="${r}"></circle>
          <circle class="metric-ring__value" cx="65" cy="65" r="${r}"
            stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
            data-target-offset="${circumference * (1 - metric.value / 100)}"></circle>
          <text x="65" y="60" class="metric-ring__num" text-anchor="middle">0%</text>
          <text x="65" y="80" class="metric-ring__tag" text-anchor="middle">complete</text>
        </svg>
        <div class="cs-metric__copy">
          <h4>${metric.label}</h4>
          <p>${metric.context}</p>
        </div>
      </div>
    `;
  }

  function buildHighlights(highlights) {
    if (!highlights || !highlights.length) return '';
    return `
      <div class="cs-section">
        <h3>Inside the portal</h3>
        <div class="cs-highlights">
          ${highlights.map((h, i) => `
            <div class="cs-highlight reveal-up" style="--delay:${i * 0.06}s">
              <span class="cs-highlight__icon">${h.icon}</span>
              <h4>${h.title}</h4>
              <p>${h.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function buildGallery(gallery) {
    if (!gallery || !gallery.length) return '';
    return `
      <div class="cs-section">
        <h3>Selected screens</h3>
        <div class="cs-gallery">
          ${gallery.map((g, i) => `
            <figure class="cs-gallery__item reveal-up" style="--delay:${Math.min(i, 8) * 0.05}s" data-gallery-index="${i}" tabindex="0" role="button" aria-label="Open larger view: ${g.caption}">
              <img src="${g.src}" alt="${g.caption}" loading="lazy">
              <figcaption>${g.caption}</figcaption>
            </figure>
          `).join('')}
        </div>
      </div>
    `;
  }

  function openCaseStudy(id) {
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) return;
    const cs = project.caseStudy;
    const heroMedia = project.thumbnail
      ? `<img src="${project.thumbnail}" alt="${project.title} preview" class="cs-hero__img">`
      : mediaIcon;

    /* Render only what exists. A project with no research notes shows no
       Research heading — better an honest gap than invented filler. */
    const block = (heading, body) => (body ? `<div class="cs-section"><h3>${heading}</h3><p>${body}</p></div>` : '');

    caseStudyBody.innerHTML = `
      <div class="cs-hero ${project.thumbnail ? 'cs-hero--image' : ''}">${heroMedia}</div>
      <h2 class="cs-title" id="csTitle">${project.title}</h2>
      ${cs.subtitle ? `<p class="cs-sub">${cs.subtitle}</p>` : ''}

      <div class="cs-meta-grid">
        <div><strong>Role</strong>${project.role}</div>
        <div><strong>Tools</strong>${project.tools}</div>
        <div><strong>Duration</strong>${project.duration}</div>
        <div><strong>Category</strong>${project.tags.join(', ')}</div>
      </div>

      ${project.metric ? `<div class="cs-section">${buildMetricRing(project.metric)}</div>` : ''}
      ${buildHighlights(project.highlights)}

      ${block('Problem', cs.problem)}
      ${block('Research', cs.research)}
      ${block('User Personas', cs.personas)}
      ${block('Wireframes', cs.wireframes)}
      ${block('Journey Mapping', cs.journey)}

      ${cs.process && cs.process.length ? `
      <div class="cs-section">
        <h3>Design Process</h3>
        <ul class="cs-process">
          ${cs.process.map((step, i) => `<li><span>0${i + 1}</span>${step}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${block('High Fidelity UI', cs.highFidelity)}

      ${buildGallery(project.gallery)}

      ${block('Prototype', cs.prototype)}

      ${cs.results || (cs.impact && cs.impact.length) ? `
      <div class="cs-section"><h3>Results</h3>
        ${cs.results ? `<p>${cs.results}</p>` : ''}
        ${cs.impact && cs.impact.length ? `<div class="cs-impact">
          ${cs.impact.map((i) => `<div><strong>${i.value}</strong><span>${i.label}</span></div>`).join('')}
        </div>` : ''}
      </div>` : ''}

      ${block('Lessons Learned', cs.lessons)}
    `;

    caseStudyEl.classList.add('is-open');
    caseStudyEl.setAttribute('aria-hidden', 'false');
    caseStudyEl.setAttribute('tabindex', '-1');
    document.body.style.overflow = 'hidden';
    caseStudyEl.querySelector('.case-study__close').focus();

    // Animate the metric ring after paint
    const ring = caseStudyBody.querySelector('.metric-ring__value');
    if (ring) {
      const targetOffset = parseFloat(ring.dataset.targetOffset);
      const numEl = caseStudyBody.querySelector('.metric-ring__num');
      const targetVal = project.metric.value;
      requestAnimationFrame(() => {
        setTimeout(() => {
          ring.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)';
          ring.style.strokeDashoffset = targetOffset;
        }, 150);
      });
      if (!prefersReducedMotionCS()) {
        const start = performance.now();
        const duration = 1400;
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          numEl.textContent = `${Math.round(progress * targetVal)}%`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        setTimeout(() => requestAnimationFrame(tick), 150);
      } else {
        numEl.textContent = `${targetVal}%`;
      }
    }

    // Gallery lightbox
    if (project.gallery && project.gallery.length) {
      initGalleryLightbox(project.gallery);
    }

    // Reveal highlights & gallery items inside the modal (scroll-linked reveal within the panel)
    const modalRevealTargets = caseStudyBody.querySelectorAll('.reveal-up');
    if ('IntersectionObserver' in window && !prefersReducedMotionCS()) {
      const panel = caseStudyEl.querySelector('.case-study__panel');
      const modalObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              modalObserver.unobserve(entry.target);
            }
          });
        },
        { root: panel, threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      modalRevealTargets.forEach((el) => modalObserver.observe(el));
    } else {
      modalRevealTargets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  function prefersReducedMotionCS() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------------------------------------------------------------------
   * GALLERY LIGHTBOX (built once per case-study open)
   * ------------------------------------------------------------------- */
  function initGalleryLightbox(gallery) {
    let lightbox = document.getElementById('galleryLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'galleryLightbox';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = `
        <div class="lightbox__backdrop" data-lightbox-close></div>
        <button class="lightbox__close" data-lightbox-close aria-label="Close image viewer">&times;</button>
        <button class="lightbox__nav lightbox__nav--prev" id="lightboxPrev" aria-label="Previous image">‹</button>
        <figure class="lightbox__figure">
          <img id="lightboxImg" src="" alt="">
          <figcaption id="lightboxCaption"></figcaption>
        </figure>
        <button class="lightbox__nav lightbox__nav--next" id="lightboxNext" aria-label="Next image">›</button>
      `;
      document.body.appendChild(lightbox);
      lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) =>
        el.addEventListener('click', () => {
          lightbox.classList.remove('is-open');
          lightbox.setAttribute('aria-hidden', 'true');
        })
      );
    }

    let currentIndex = 0;
    const imgEl = lightbox.querySelector('#lightboxImg');
    const captionEl = lightbox.querySelector('#lightboxCaption');

    function show(index) {
      currentIndex = (index + gallery.length) % gallery.length;
      imgEl.src = gallery[currentIndex].src;
      imgEl.alt = gallery[currentIndex].caption;
      captionEl.textContent = `${gallery[currentIndex].caption} — ${currentIndex + 1}/${gallery.length}`;
    }

    lightbox.querySelector('#lightboxPrev').onclick = () => show(currentIndex - 1);
    lightbox.querySelector('#lightboxNext').onclick = () => show(currentIndex + 1);

    caseStudyBody.querySelectorAll('[data-gallery-index]').forEach((fig) => {
      const openFromFigure = () => {
        show(parseInt(fig.dataset.galleryIndex, 10));
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
      };
      fig.addEventListener('click', openFromFigure);
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFromFigure(); }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden', 'true'); }
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  function closeCaseStudy() {
    caseStudyEl.classList.remove('is-open');
    caseStudyEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectGrid.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-case-study]');
    if (trigger) openCaseStudy(trigger.dataset.caseStudy);
  });

  caseStudyEl.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeCaseStudy));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudyEl.classList.contains('is-open')) closeCaseStudy();
  });

  /* ---------------------------------------------------------------------
   * LOADER
   * ------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });

  /* ---------------------------------------------------------------------
   * THEME TOGGLE (persisted)
   * ------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  /* Dark is the default. The inline script in <head> has already applied
     it; this just keeps the toggle's state in sync. */
  const initialTheme = storedTheme === 'light' ? 'light' : 'dark';

  if (initialTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'light');
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });

  /* ---------------------------------------------------------------------
   * HEADER SCROLL STATE + SCROLL PROGRESS + BACK TO TOP + SCROLL SPY
   * ------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks).map((link) => document.querySelector(link.getAttribute('href')));

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('is-scrolled', scrollY > 20);
    backToTop.classList.toggle('is-visible', scrollY > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    // Scroll spy: find current section
    let currentIndex = 0;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= 140) currentIndex = i;
    });
    navLinks.forEach((link, i) => link.classList.toggle('is-active', i === currentIndex));
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------------------------------------------------------------
   * MOBILE NAV TOGGLE
   * ------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------------
   * TESTIMONIAL CAROUSEL (auto-sliding)
   * ------------------------------------------------------------------- */
  /* The testimonials carousel was removed from the page (the quotes were not
     real). This block is kept behind a guard so dropping the section back in
     revives it without a code change. */
  const track = document.getElementById('carouselTrack');
  if (track) {
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById('carouselDots');
    let current = 0;
    let autoplayTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    function goToSlide(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      track.style.transition = 'transform .6s var(--ease, ease)';
      slides.forEach((sl, i) => sl.setAttribute('aria-hidden', String(i !== current)));
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('is-active', i === current));
      resetAutoplay();
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
    }

    document.getElementById('carouselPrev').addEventListener('click', () => goToSlide(current - 1));
    document.getElementById('carouselNext').addEventListener('click', () => goToSlide(current + 1));
    resetAutoplay();
  }

  /* ---------------------------------------------------------------------
   * FOOTER YEAR
   * ------------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
   * INIT ANIMATION MODULE HOOKS
   * ------------------------------------------------------------------- */
  window.PortfolioAnimations.initScrollReveal();
  window.PortfolioAnimations.initCustomCursor();
  window.PortfolioAnimations.initParallax();
  window.PortfolioAnimations.initMagneticButtons();
  window.PortfolioAnimations.initCounters();
  window.PortfolioAnimations.initTyping();

  /* Activate skill bar fill once visible */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-bars__track').forEach((el) => skillObserver.observe(el));
});
