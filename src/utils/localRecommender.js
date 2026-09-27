
/**
 * ============================================================================
 * SMARTFYP - AI RECOMMENDATION ENGINE (TF-IDF + COSINE SIMILARITY)
 * ============================================================================
 * This module implements a content-based recommendation system natively in JavaScript.
 * It vectorizes project metadata and matches user queries using Term Frequency-Inverse 
 * Document Frequency (TF-IDF) and Cosine Similarity.
 */

// Stop words filter: Removes common auxiliary words (articles, prepositions) 
// to ensure only meaningful keywords impact the recommendation score.
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'this', 'that', 'these', 'those', 'it', 'its', 'as', 'using', 'use', 'used',
  'system', 'application', 'app', 'platform', 'tool', 'project', 'based',
  'via', 'into', 'which', 'their', 'can', 'will', 'data',
])
// Project dataset containing titles, descriptions, domains, and tech stacks.
const PROJECTS = [
  { title: "Medical Anomaly Screening from Chest Radiology X-Rays", description: "An advanced healthcare diagnostics platform that leverages deep convolutional neural networks (CNNs) to analyze chest X-ray images and screen for common pulmonary anomalies such as pneumonia, tuberculosis, and pleural effusion with high accuracy. Includes a localized web app for radiologists.", domain: "Machine Learning", techStack: ["Python", "PyTorch", "FastAPI", "React", "Docker", "OpenCV"] },
  { title: "Post-Quantum Cryptography for Secure IoT Wearables", description: "An implementation and comparative performance analysis of NIST-approved lattice-based cryptographic algorithms (such as Crystals-Kyber) optimized for low-power microcontrollers and wearable IoT health trackers to resist future quantum computing threats.", domain: "Cyber Security", techStack: ["C++", "RTOS", "ESP32", "Python", "PyCrypto", "Crystals-Kyber"] },
  { title: "Autonomous Mobile Robot Navigation using Deep Reinforcement Learning", description: "A system for autonomous robot pathfinding and obstacle avoidance in complex dynamic indoor environments. Integrates deep Q-learning and policy gradient methods with ROS2 and Gazebo physics simulation.", domain: "IoT & Robotics", techStack: ["Python", "ROS2", "Gazebo", "TensorFlow", "C++", "Lidar SDK"] },
  { title: "Decentralized E-Voting System with Multi-Factor Biometrics", description: "A secure, verifiable, and tamper-proof electronic voting application built on an Ethereum-compatible private blockchain network. Integrates facial recognition and zero-knowledge proofs for absolute voter identity protection and anonymous ballot casting.", domain: "Cyber Security", techStack: ["Solidity", "React", "Node.js", "Web3.js", "Python", "OpenCV"] },
  { title: "Real-Time Sign Language Translator using Computer Vision", description: "A lightweight, accessible computer vision system that captures hand gestures using a standard web camera, translates them into text/speech in real-time, and supports bidirectionality using MediaPipe and LSTM neural networks.", domain: "Artificial Intelligence", techStack: ["Python", "OpenCV", "MediaPipe", "TensorFlow", "React", "WebSockets"] },
  { title: "Smart Agriculture Leaf Disease and Soil Quality Monitor", description: "An integrated hardware and software solution that monitors soil NPK nutrient levels, moisture, temperature, and uses on-edge computer vision to identify diseases on plant leaves, offering automated water and fertilizer recommendations.", domain: "IoT & Robotics", techStack: ["MicroPython", "Raspberry Pi", "PyTorch", "Flask", "InfluxDB", "Flutter"] },
  { title: "Automated News Summarizer and Editorial Bias Analyzer", description: "An AI-driven portal that aggregates news articles from diverse global publications, performs extractive/abstractive summarization, and computes sentiment and political bias scores using fine-tuned transformer models.", domain: "Artificial Intelligence", techStack: ["Python", "HuggingFace Transformers", "FastAPI", "Next.js", "PostgreSQL"] },
  { title: "Predictive Maintenance Framework for Industrial IoT Devices", description: "An end-to-end telemetry pipeline that ingests high-frequency vibration, thermal, and electrical metrics from industrial machines, detecting pre-failure anomalies using isolation forests and LSTM autoencoders to prevent factory downtime.", domain: "Machine Learning", techStack: ["Python", "TensorFlow", "Apache Kafka", "TimescaleDB", "Grafana"] },
  { title: "Global Supply Chain Traceability and Audit Verification System", description: "A blockchain-backed supply chain dashboard allowing enterprise users to log, track, and verify ethical sourcing, temperatures of perishable items in transit, and custodial transfers with automated smart-contract compliance.", domain: "Full-Stack Web Systems", techStack: ["React", "Node.js", "Solidity", "Hardhat", "MongoDB", "Express"] },
  { title: "AI-Driven Smart Stock Portfolio Risk Profiler", description: "A portfolio optimization tool that performs sentiment analysis on financial news feeds, indexes SEC filings, and uses modern portfolio theory (Markowitz) with LSTM-based stock trend predictions to recommend personalized asset allocations.", domain: "Machine Learning", techStack: ["Python", "Pandas", "Scikit-Learn", "Next.js", "TailwindCSS", "Chart.js"] },
  { title: "IoT Water Quality Monitoring for Coastal Preservation", description: "A network of floating solar-powered buoy sensors monitoring marine salinity, pH, turbidity, and dissolved oxygen. Transmits real-time environmental metrics over LoRaWAN to a centralized visualization dashboard.", domain: "IoT & Robotics", techStack: ["C++", "Arduino", "LoRaWAN", "Node.js", "Express", "React", "Leaflet.js"] },
  { title: "Intelligent Conversational Agent for Mental Health Support", description: "A empathetic, non-diagnostic chatbot designed to provide cognitive behavioral therapy (CBT) exercises and daily mental wellness coaching. Features speech synthesis and emotion recognition using custom BERT-based text modeling.", domain: "Artificial Intelligence", techStack: ["Python", "FastAPI", "PyTorch", "React", "TailwindCSS", "Web Speech API"] },
  { title: "Cloud-Native Threat Detection and Intrusion Prevention System", description: "An enterprise network security solution that monitors system logs, API calls, and packet traffic across Kubernetes clusters to detect potential DDoS and privilege escalation attacks using real-time behavioral heuristic modeling.", domain: "Cyber Security", techStack: ["Go", "Python", "eBPF", "Kubernetes", "Prometheus", "ELK Stack"] },
  { title: "Dynamic Multi-Tenant Final Year Project Management Portal", description: "A rich collaborative web platform engineered for colleges to organize team registrations, supervisor assignments, milestone submittals, plagiarism vetting, and live presentation grading with interactive role-specific dashboards.", domain: "Full-Stack Web Systems", techStack: ["React", "Node.js", "Express", "Mongoose", "MongoDB", "TailwindCSS", "socket.io"] },
  { title: "Micro-expression Face Vetting and Interview Analytics Dashboard", description: "A recruiting helper application that analyzes face micro-expressions, posture, eye contact, and speech rhythm during mock video interviews to generate objective body language and confidence feedback reports.", domain: "Artificial Intelligence", techStack: ["Python", "OpenCV", "PyFeat", "Flask", "React", "Recharts"] },
  { title: "High-Performance Fiber Optic Dispersion Simulation", description: "A scientific simulation tool designed to model electromagnetic wave propagation through single-mode fiber optic cables. Computes chromatic dispersion, polarization mode dispersion, and non-linear phase shifts using finite-difference time-domain (FDTD) solvers.", domain: "Photonics & Simulation", techStack: ["Python", "NumPy", "SciPy", "Matplotlib", "C++", "WebAssembly"] },
  { title: "On-Chip Optical Interconnect Optical Router Design", description: "An interactive CAD/modeling tool for designing and verifying silicon photonics optical routers. Simulates micro-ring resonator routing capabilities, thermal tuning sensitivities, and crosstalk power losses.", domain: "Photonics & Simulation", techStack: ["Python", "Rust", "WebAssembly", "React", "D3.js", "Three.js"] },
  { title: "Decentralized Identity (DID) Wallet for Academic Credentials", description: "A secure mobile application enabling graduates to store cryptographically verified, self-sovereign college degrees, transcripts, and professional certifications that can be instantly validated by employers without college intervention.", domain: "Cyber Security", techStack: ["React Native", "Solidity", "Ether.js", "IPFS", "Node.js"] },
  { title: "Smart Home Assistant and Edge-AI Surveillance Hub", description: "A privacy-first domestic automation server running entirely on-premise. Connects local security cameras, executes real-time animal/human/package classification on edge TPU hardware, and manages smart appliances over Zigbee protocols.", domain: "IoT & Robotics", techStack: ["Python", "Home Assistant Core", "OpenCV", "Zigbee2MQTT", "Raspberry Pi 4"] },
  { title: "Automated Dental Pathology Screener from Panoramic X-Rays", description: "An artificial intelligence tool trained to identify dental caries, periodontal bone loss, impacted third molars, and root-canal status from panoramic dental radiographs, generating draft clinical reports for practitioners.", domain: "Machine Learning", techStack: ["Python", "PyTorch", "OpenCV", "Flask", "Vue.js", "SQLite"] },
  { title: "Collaborative Real-time Collaborative UI/UX Wireframing Suite", description: "A lightweight vector-based online canvas designed for distributed design teams. Enables instantaneous multiplayer component drawing, grouping, comments, and interactive prototype linking with server-authoritative state synchronization.", domain: "Full-Stack Web Systems", techStack: ["React", "Node.js", "Express", "Socket.io", "HTML5 Canvas", "TailwindCSS"] },
  { title: "Autonomous Drone Target Tracking and Following System", description: "An drone software package enabling companion computer-equipped quadcopters to detect, lock onto, and safely track moving ground targets using computer vision algorithms without relying on GPS.", domain: "IoT & Robotics", techStack: ["C++", "Python", "PX4 Autopilot", "ROS2", "OpenCV", "MAVSDK"] },
  { title: "Smart Electric Grid Consumption Profiler and Load Predictor", description: "A utility-focused forecasting application that processes smart-meter energy consumption records and predicts aggregate grid demand peaks using gradient boosting regressors to help schedule clean energy sources.", domain: "Machine Learning", techStack: ["Python", "XGBoost", "InfluxDB", "Next.js", "Recharts", "FastAPI"] },
  { title: "Zero-Trust Access Gateway with Biometric Continuous Authentication", description: "A secure proxy gate that enforces continuous verification of a user's identity based on keystroke dynamics, mouse movement behaviors, and background face recognition, revoking active sessions dynamically upon anomalies.", domain: "Cyber Security", techStack: ["Go", "React", "WebSockets", "Python", "TensorFlow Lite", "Redis"] },
  { title: "Laser-Induced Breakdown Spectroscopy (LIBS) Mineral Classifier", description: "An analytical tool for mineral sorting and mineralogy grading. Processes emission spectra profiles captured by LIBS optical sensors and classifies mineral samples using support vector machines (SVM).", domain: "Photonics & Simulation", techStack: ["Python", "Scikit-Learn", "NumPy", "Flask", "React", "TailwindCSS"] },
  { title: "Silicon Waveguide Bragg Grating Filter Optimizer", description: "An evolutionary optimization program utilizing genetic algorithms to automatically design high-selectivity wavelength filters on silicon photonics chips. Calculates spectral transmission responses.", domain: "Photonics & Simulation", techStack: ["Python", "SciPy", "Rust", "WebAssembly", "React", "Plotly"] },
]
/**
 * Text Preprocessing / Tokenization Function
 * Converts raw string text to lowercase, strips punctuation, splits into tokens, 
 * and filters out short words and stop words.
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
}

class LocalRecommender {
  constructor() {
    this.idf = new Map()
    this.vectors = []
    this._train() // Precompute IDF weights and document vectors upon initialization
  }
/**
   * Training Phase:
   * Computes Inverse Document Frequency (IDF) for all unique terms across the dataset
   * and vectorizes each project document.
   */
  _train() {
    const start = performance.now()
    const N = PROJECTS.length
    // Combine project fields into a single corpus string per document and tokenize
    const docTokens = PROJECTS.map((p) => tokenize([p.title, p.description, p.domain, p.techStack.join(' ')].join(' ')))
// Calculate Document Frequency (DF): Number of documents containing a specific word
    const df = new Map()
    docTokens.forEach((tokens) => {
      new Set(tokens).forEach((w) => df.set(w, (df.get(w) || 0) + 1))
    })
    // Calculate Inverse Document Frequency (IDF) using smoothing formula
    df.forEach((count, word) => this.idf.set(word, Math.log(1 + N / (1 + count))))
// Vectorize all project descriptions into normalized TF-IDF vectors
    this.vectors = docTokens.map((tokens) => this._vectorize(tokens))
    this.trainingTimeMs = Math.round(performance.now() - start)
    this.vocabularySize = df.size
  }
/**
   * Vectorization & L2 Normalization Function:
   * Converts tokens to TF-IDF weights and normalizes the vector magnitude to unit length (1).
   */
  _vectorize(tokens) {
    const tf = new Map()
    tokens.forEach((w) => tf.set(w, (tf.get(w) || 0) + 1))
    const vec = new Map()
    tf.forEach((count, w) => {
      if (this.idf.has(w)) vec.set(w, count * this.idf.get(w))
    })
  // Compute magnitude (Euclidean norm) for vector normalization
    let mag = 0
    vec.forEach((w) => (mag += w * w))
    mag = Math.sqrt(mag) || 1
    vec.forEach((w, word) => vec.set(word, w / mag))
    return vec
  }
/**
   * Cosine Similarity Calculation:
   * Computes the dot product of two L2-normalized sparse vectors to determine angular similarity.
   */
  _cosine(a, b) {
    let score = 0
    const [small, large] = a.size < b.size ? [a, b] : [b, a]
    small.forEach((w, word) => {
      if (large.has(word)) score += w * large.get(word)
    })
    return score
  }
/**
   * Recommendation Pipeline:
   * Takes user search queries, vectorizes them, calculates semantic cosine similarity scores,
   * applies domain/tech stack weight boosts, and returns top results.
   */
  recommend({ query = '', domain = '', techStack = '', limit = 6 } = {}) {
    const start = performance.now()
    const fullQuery = [query, domain, techStack].filter(Boolean).join(' ')
    const qVec = this._vectorize(tokenize(fullQuery))
    const qLower = fullQuery.toLowerCase()
// Score each project using Cosine Similarity + Heuristic Boosts
    const scored = PROJECTS.map((proj) => {
      let score = this._cosine(qVec, this.vectors[PROJECTS.indexOf(proj)])
      // Heuristic Boost: Reward exact domain matches
      if (proj.domain && qLower.includes(proj.domain.toLowerCase())) score += 0.35
      // Heuristic Boost: Reward matching technology tags
      const techMatches = proj.techStack.filter((t) => qLower.includes(t.toLowerCase())).length
      score += Math.min(techMatches * 0.15, 0.3)
      score = Math.min(score, 1)
      return { ...proj, techStack: proj.techStack.join(', '), matchScore: Math.round(score * 100) }
    })
// Filter, sort by highest match score, and slice to requested limit
    const results = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter((r) => r.matchScore > 0)
      .slice(0, limit)

    return {
      results,
      inferenceTimeMs: Math.max(1, Math.round(performance.now() - start)),
      metrics: {
        datasetSize: PROJECTS.length,
        vocabularySize: this.vocabularySize,
        trainingTimeMs: this.trainingTimeMs,
      },
    }
  }
}

// Trained once, reused for every call — same pattern as the real backend.
let instance = null
export function getLocalRecommender() {
  if (!instance) instance = new LocalRecommender()
  return instance
}