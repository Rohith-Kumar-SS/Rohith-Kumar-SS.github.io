/* All portfolio content lives here. Edit text in this file; the design picks it up.
   Sources: LinkedIn profile (14 Oct 2026), the 2025 résumé, and the projects themselves. */

const EMBLEMS = {
  smith: '<path d="M8 34h36c0 6-6 10-13 10v5h7v6H17v-6h7v-5c-9 0-16-4-16-10z"/><path d="M30 10l12 12M38 6l12 12M36 16l-8 8"/><path d="M52 30l4-2M50 37l5 1M47 43l3 3"/>',
  paper: '<path d="M16 6h24l10 10v42H16z"/><path d="M40 6v10h10"/><path d="M22 24h20M22 30h20M22 36h12"/><circle cx="43" cy="47" r="7"/><path d="M40 47l2.4 2.4L46.5 45"/>',
  model: '<circle cx="12" cy="20" r="3.5"/><circle cx="12" cy="44" r="3.5"/><circle cx="32" cy="12" r="3.5"/><circle cx="32" cy="32" r="3.5"/><circle cx="32" cy="52" r="3.5"/><circle cx="52" cy="32" r="4.5"/><path d="M15 21l14-8M15 21l14 10M15 21l14 29M15 43l14-30M15 43l14-10M15 43l14 8M35 13l13 17M35 32h12M35 51l13-17"/><path d="M58 22l2-4M60 30h4M58 42l2 4"/>',
  cloud: '<path d="M18 22l14-8 14 8v20l-14 8-14-8z"/><path d="M18 22l14 8 14-8M32 30v20"/><g class="fill"><circle cx="10" cy="14" r="1.2"/><circle cx="54" cy="12" r="1.2"/><circle cx="56" cy="40" r="1.2"/><circle cx="8" cy="46" r="1.2"/><circle cx="26" cy="56" r="1.2"/><circle cx="44" cy="56" r="1.2"/><circle cx="32" cy="6" r="1.2"/><circle cx="25" cy="34" r="1.2"/><circle cx="39" cy="36" r="1.2"/></g>',
  bulb: '<path d="M32 6a15 15 0 0 1 9 27v7H23v-7a15 15 0 0 1 9-27z"/><path d="M24 46h16M26 52h12M29 58h6"/><path d="M32 14v9l6 4"/>',
  directory: '<rect x="8" y="10" width="17" height="13" rx="2"/><rect x="29" y="10" width="17" height="13" rx="2"/><rect x="8" y="27" width="17" height="13" rx="2"/><rect x="8" y="44" width="17" height="10" rx="2"/><circle cx="42" cy="40" r="9"/><path d="M48.5 46.5l7 7"/>',
  fisheye: '<circle cx="32" cy="32" r="23"/><ellipse cx="32" cy="32" rx="11" ry="23"/><ellipse cx="32" cy="32" rx="23" ry="11"/><path d="M9 32h46M32 9v46"/><circle class="fill" cx="32" cy="32" r="2"/>',
  recruit: '<rect x="8" y="14" width="48" height="36" rx="4"/><path d="M24 26l-6 6 6 6M40 26l6 6-6 6M35 23l-6 18"/><path d="M8 20h48"/>',
  crypto: '<circle cx="14" cy="16" r="4"/><circle cx="48" cy="12" r="4"/><circle cx="30" cy="32" r="5"/><circle cx="12" cy="50" r="4"/><circle cx="50" cy="48" r="4"/><circle class="fill" cx="30" cy="32" r="2"/><path d="M17.5 18.5l8.5 9.5M44.5 14.5l-11 13M26 35.5l-11 11.5M34.5 34.5l12 11M48 16v28"/>',
  lora: '<path d="M32 28v26M24 56h16"/><circle cx="32" cy="24" r="4"/><path d="M23 15a13 13 0 0 0 0 18M41 15a13 13 0 0 1 0 18M16 9a21 21 0 0 0 0 30M48 9a21 21 0 0 1 0 30"/>',
  canteen: '<path d="M10 32h44a22 15 0 0 1-44 0z"/><path d="M22 54h20"/><path d="M24 24c-3-4 3-6 0-11M32 24c-3-4 3-6 0-11M40 24c-3-4 3-6 0-11"/>',
  github: '<path d="M32 8a24 24 0 0 0-7.6 46.8c1.2.2 1.6-.5 1.6-1.2v-4.2c-6.7 1.5-8.1-3.2-8.1-3.2-1.1-2.8-2.7-3.5-2.7-3.5-2.2-1.5.2-1.5.2-1.5 2.4.2 3.7 2.5 3.7 2.5 2.1 3.7 5.6 2.6 7 2 .2-1.6.8-2.6 1.5-3.2-5.3-.6-11-2.7-11-11.9 0-2.6.9-4.8 2.5-6.5-.3-.6-1.1-3.1.2-6.4 0 0 2-.6 6.6 2.5a23 23 0 0 1 12 0c4.6-3.1 6.6-2.5 6.6-2.5 1.3 3.3.5 5.8.2 6.4 1.6 1.7 2.5 3.9 2.5 6.5 0 9.2-5.6 11.3-11 11.9.9.8 1.7 2.3 1.7 4.6v6.8c0 .7.4 1.4 1.7 1.2A24 24 0 0 0 32 8z"/>'
};

const PORTFOLIO = {
  experience: [
    {
      role: 'School Coordinator — School of Physical Sciences',
      org: "Institution's Innovation Council (IIC), Amrita",
      place: 'Coimbatore',
      when: 'Sep 2026 – now',
      points: ['Coordinate IIC innovation activity for the School of Physical Sciences.']
    },
    {
      role: "Ideathon Coordinator · Overall Coordinator, Genesis'26",
      org: "Institution's Innovation Council (IIC), Amrita",
      place: 'Coimbatore',
      when: 'Sep 2026 – now',
      points: [
        "Coordinated Genesis'26: a 24-hour Ideathon and a 20-hour Hackathon running side by side.",
        '232 Ideathon teams registered, 170 reached the final; 64 teams in the Hackathon.',
        'Built the event portal and team directory, plus the posters, feedback forms and problem-statement booklet.'
      ]
    },
    {
      role: 'Data Science Intern',
      org: 'AI4SEES Private Ltd',
      place: 'Bengaluru · Hybrid',
      when: 'Apr – Aug 2026',
      points: [
        'Re-selected for a second term after being recognised as a top-performing intern in the first.',
        'Digital twinning and 3-D reconstruction (VGGT, OpenMVS, stereo body measurement).',
        'AI web platforms: computer-vision tools, an AI recruiting system and security-camera analytics.',
        'Data science and data engineering across the pipeline, from capture to deployment.'
      ]
    },
    {
      role: 'Technical Intern',
      org: 'SEEK',
      place: 'Bengaluru · Remote',
      when: 'Apr – Jul 2026',
      points: [
        'Led development of a social media app and a prompt-engineering app, from concept to build.',
        'Shipped the SEEK landing page with a pre-launch waitlist on Supabase.',
        'Worked across web, mobile, product ideas and marketing with Flutter, Firebase, Supabase and Figma.'
      ]
    },
    {
      role: 'Innovation Ambassador',
      org: "Institution's Innovation Council (IIC), Amrita",
      place: 'Coimbatore',
      when: 'Apr 2026 – now',
      points: ["Completed the Innovation Ambassador (Foundation Level) programme of the Ministry of Education's Innovation Cell and AICTE."]
    },
    {
      role: 'Cultural Secretary (Anandamayi)',
      org: 'Amrita Vishwa Vidyapeetham',
      place: 'Coimbatore',
      when: 'Jan 2026 – now',
      side: 'culture',
      points: ['Selected for the role on the strength of earlier cultural work on campus.']
    },
    {
      role: 'Research & Development Cell Member',
      org: "Institution's Innovation Council (IIC), Amrita",
      place: 'Coimbatore',
      when: 'Nov 2025 – now',
      points: ['Research projects and team building inside the IIC.']
    },
    {
      role: 'Students Council Member',
      org: "Institution's Innovation Council (IIC), Amrita",
      place: 'Coimbatore',
      when: 'Nov 2025 – now',
      points: ['Represent students in the council and help run its programmes.']
    },
    {
      role: 'Data Science Intern',
      org: 'AI4SEES Private Ltd',
      place: 'Bengaluru',
      when: 'May – Jun 2025',
      points: [
        'Camera calibration for fisheye and phone cameras.',
        'Measured real distances and areas straight from photos, with SAM for object outlines.'
      ]
    },
    {
      role: 'Core Member',
      org: 'Tamil Siragu',
      place: 'Amrita, Coimbatore',
      when: 'Oct 2023 – now',
      side: 'culture',
      points: ['Write and present Tamil literary work for the club, including a piece presented at a major university event.']
    },
    {
      role: 'Integrated MSc, Data Science',
      org: 'Amrita Vishwa Vidyapeetham',
      place: 'Coimbatore',
      when: '2023 – 2028',
      edu: true,
      points: ['Machine learning, deep learning, statistics, databases and cybersecurity.']
    }
  ],

  builds: [
    {
      id: 'smith-ai', emblem: 'smith', title: 'Smith AI', year: '2026', tag: 'Technova',
      line: 'The verifiable AI foundry',
      body: "Our team's company pitch for TSM Technova 2026, a national AI innovation challenge. One idea behind two products: AI output you can audit. PaperSmith writes research from the author's own material; ModelSmith turns a sentence into a security-scanned image model. We took it to the Grand Finale.",
      points: ['Grand Finale, TSM Technova 2026', 'Two products sharing one trust engine', 'Every sentence and every model decision can be traced'],
      stack: ['Python', 'FastAPI', 'React', 'PyTorch', 'CLIP', 'Groq']
    },
    {
      id: 'papersmith', emblem: 'paper', title: 'PaperSmith AI', year: '2026', tag: 'Live',
      line: 'Writes your paper from your own material, and never invents',
      body: 'A chat workspace with a live paper beside it. Drop in slides, PDFs, spreadsheets and notes; PaperSmith pulls out the claims, asks for what is missing, and writes the pages. Every sentence carries a receipt pointing at the file or answer it came from.',
      points: ['A verifier rejects any sentence it cannot trace to a source', 'Asks a question instead of making up a number', 'Exports LaTeX and Word', 'Research community: 71,000+ Indian institutions, mentors, co-authoring and peer review'],
      stack: ['FastAPI', 'React', 'Groq', 'DeBERTa NLI', 'Supabase', 'Neo4j'],
      links: [{ label: 'Open PaperSmith', href: 'https://rohith-kumar-ss.github.io/papersmith/' }]
    },
    {
      id: 'modelsmith', emblem: 'model', title: 'ModelSmith', year: '2026', tag: 'Agents',
      line: 'Six agents forge an image classifier from one sentence',
      body: 'Type what you want to recognise and six agents take it from there: a Planner, a Scout that gathers photos from 17 open libraries, a Curator, a Trainer, a Diagnostician and a Sentinel that scans the finished model before you get it.',
      points: ['Sentence to working model, no dataset needed', 'Optional example photos or your own dataset', 'Separate Inference Engine to test it on your pictures'],
      stack: ['Python', 'FastAPI', 'PyTorch', 'CLIP', 'React']
    },
    {
      id: 'gcrf', emblem: 'cloud', title: 'Accuracy or Appearance?', year: '2026', tag: 'Research',
      line: 'A Gaussian CRF for refining feed-forward 3-D reconstruction',
      body: 'Models like VGGT turn a handful of photos into depth and 3-D points in one pass. We asked when a Gaussian CRF actually helps, and found it depends on what you need: looks or measurements.',
      points: ['Depth-aware kernel: 52% smoother surfaces on all 13 ETH3D test scenes', 'Costs only 2.4% relative depth accuracy', 'Fusing overlapping views cut VGGT depth error by about 14%', 'G-CRF Studio: a web app to compare raw and refined point clouds'],
      stack: ['PyTorch', 'VGGT', 'DUSt3R', 'NumPy', 'FastAPI', 'WebGL']
    },
    {
      id: 'genesis-portal', emblem: 'bulb', title: "Genesis'26 Portal", year: '2026', tag: 'Live',
      line: 'The control room for a 20-hour Hackathon and a 24-hour Ideathon',
      body: 'Teams, judges and organisers all worked in one portal during the event. It ran the clock, the reviews and the ideas, live on GitHub Pages with Supabase behind it.',
      points: ['Judge scoring across four reviews, averaged, with organiser override', 'Design Thinking sheets for the 4-5-3 method', 'Timed assessments that lock themselves', 'A 3-2-1 inauguration stage to start the clock', '277-check end-to-end test run before going live'],
      stack: ['JavaScript', 'Node.js', 'Supabase', 'PostgreSQL', 'GitHub Pages'],
      links: [{ label: 'Open the portal', href: 'https://avv-iic.github.io/Genesis-2026/management_portal/' }]
    },
    {
      id: 'directory', emblem: 'directory', title: 'Ideathon Directory', year: '2026', tag: 'Live',
      line: 'Find any of 232 teams in a second',
      body: 'A public directory of every Genesis Ideathon team, with live Final and Rejected status, so 928 participants could check their result without asking anyone.',
      points: ['Search by team, member or roll number', 'Final / Rejected filters that follow the search', 'Read-only data straight from Supabase'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
      links: [{ label: 'Browse the teams', href: 'https://avv-iic.github.io/Genesis-2026/directory/' }]
    },
    {
      id: 'fisheye', emblem: 'fisheye', title: 'Measure from a Photo', year: '2025', tag: 'AI4SEES',
      line: 'Calibrated cameras that measure the real world',
      body: 'Internship work at AI4SEES: calibrating fisheye and phone cameras so that a photo becomes a measuring tape.',
      points: ['Fisheye and phone camera calibration', 'Real distance between any two points in a photo', 'Area measurement and SAM-assisted object distances', 'Stereo body measurement and 3-D reconstruction tests'],
      stack: ['Python', 'OpenCV', 'SAM', 'VGGT', 'OpenMVS']
    },
    {
      id: 'ai4recruit', emblem: 'recruit', title: 'AI4RECRUIT', year: '2025', tag: 'AI4SEES',
      line: 'Technical hiring assessments you can defend',
      body: 'Recruiters generate assessments for a role; candidates take them proctored in the browser; the report shows the reasoning behind every answer.',
      points: ['AI-generated questions and AI code review', 'Candidate code runs in a sandbox', 'Shared live editor with video', 'Billing, email and secure sessions'],
      stack: ['React', 'Node.js', 'Express', 'Redis', 'Groq', 'Judge0', 'WebRTC', 'Stripe']
    },
    {
      id: 'crypto', emblem: 'crypto', title: 'Crypto Forensics', year: '2026', tag: 'Anokha 2026',
      line: 'Following illicit money through the Bitcoin graph',
      body: 'An open-source framework that turns Bitcoin transactions into a graph and follows the money. We showed it at the Anokha 2026 tech fair, where it earned special recognition from industry leaders.',
      points: ['Sender-to-receiver graph of early Bitcoin transactions in Neo4j', 'Mark a wallet as illicit and watch the risk spread to linked addresses', 'Classifier and risk analyser on top'],
      stack: ['Python', 'Neo4j', 'Machine learning']
    },
    {
      id: 'lora', emblem: 'lora', title: 'LoRa Sensor Network', year: 'Networks', tag: 'University',
      line: 'Long-range, low-power sensors talking across campus',
      body: 'A wide-area sensor network built on LoRa radio, designed and completed as a networking project. It earned strong recognition at the university.',
      points: ['Long-range, low-power radio links', 'Sensor nodes reporting to a gateway'],
      stack: ['LoRa', 'LoRaWAN', 'Embedded']
    },
    {
      id: 'canteen', emblem: 'canteen', title: 'Canteen Tracker', year: 'Building', tag: 'Mobile',
      line: 'Order ahead, skip the queue',
      body: 'A cross-platform app for the university canteen that streamlines ordering and cuts the wait. In progress.',
      points: ['Live order tracking', 'Cross-platform from one codebase'],
      stack: ['Flutter', 'Supabase']
    },
    {
      id: 'more', emblem: 'github', title: 'More on GitHub', year: '↗', tag: '', more: true,
      href: 'https://github.com/Rohith-Kumar-SS'
    }
  ],

  stats: [
    { n: 232, label: 'Ideathon teams registered' },
    { n: 928, label: 'Ideathon participants' },
    { n: 170, label: 'Teams in the final' },
    { n: 64, label: 'Hackathon teams' },
    { n: 24, suffix: 'h', label: 'Ideathon, with a 20h Hackathon beside it' }
  ],

  podiums: [
    { title: 'Grand Finale', where: 'TSM Technova 2026', what: 'Smith AI, national AI innovation challenge' },
    { title: 'Special Recognition', where: 'Anokha 2026', what: 'Crypto forensics framework, tech fair' },
    { title: 'Innovation Ambassador', where: 'MoE Innovation Cell · AICTE', what: 'Foundation Level, 2026' },
    { title: 'NPTEL Elite + Silver', where: 'IIT Kharagpur', what: 'Ethical Hacking, Nov 2024' },
    { title: 'NPTEL', where: 'IIT Madras', what: 'Online certification, Nov 2024' },
    { title: 'Re-selected', where: 'AI4SEES', what: 'Top-performing intern, second term' }
  ],

  culture: [
    { title: 'Cultural Secretary', where: 'Anandamayi, Amrita', when: 'Jan 2026 – now', what: 'Selected for the role on the strength of earlier cultural work on campus.' },
    { title: 'Core Member', where: 'Tamil Siragu · தமிழ் சிறகு', when: 'Oct 2023 – now', what: 'Write and present Tamil literary work, including a piece presented at a major university event.' },
    { title: 'Sindhanai Semmal', where: 'Award', when: 'Literature', what: 'Recognition for research and literature work.' },
    { title: 'On stage', where: 'Cultural fests · Gokulashtami', when: 'Performer', what: 'In costume and in character, from the Amrita auditorium to Gokulashtami.' }
  ],

  team: ['Rohith Kumar S S', 'Nithish Raajan N K', 'Mohamed Navith'],

  stack: [
    { group: 'Languages', items: ['Python', 'SQL', 'R', 'C++', 'JavaScript'] },
    { group: 'Data & AI', items: ['Machine learning', 'Deep learning', 'PyTorch', 'Computer vision', '3-D reconstruction', 'Camera calibration', 'Data engineering', 'LLM agents', 'Statistics'] },
    { group: 'Build & ship', items: ['FastAPI', 'React', 'Node.js', 'Flutter', 'Firebase', 'Supabase', 'Neo4j', 'Figma'] },
    { group: 'Security', items: ['Ethical hacking', 'Penetration testing', 'Network security', 'Digital forensics'] }
  ]
};
