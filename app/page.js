"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, Code2, Cpu, Shield, Users, ChevronDown, 
  Volume2, VolumeX, ArrowRight, ExternalLink, Sparkles, Loader2, Zap, Vote, BookOpen, GraduationCap, Lightbulb,
  Mail, MessageSquare, TerminalSquare, Clock, Save, ThumbsUp, Activity, Play, Gamepad2, Trophy, CheckCircle2, XCircle, Lock, ShieldAlert
} from 'lucide-react';

// --- CUSTOM SOCIAL ICONS ---
const Github = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7.1a5.8 5.8 0 0 0-1.6-3.9 5.7 5.7 0 0 0 .16-3.9s-1.3-.4-4 1.4a13.2 13.2 0 0 0-7 0c-2.7-1.8-4-1.4-4-1.4a5.7 5.7 0 0 0 .16 3.9 5.8 5.8 0 0 0-1.6 3.9c0 5.7 3.35 6.75 6.5 7.1a4.8 4.8 0 0 0-1 3.02v4"/><path d="M9 20c-5 1.5-5-2.5-7-3"/></svg>);
const Linkedin = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>);
const Twitter = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>);
const Instagram = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);

// --- CUSTOM LOGO COMPONENT ---
const SuttLogo = ({ className = "w-12 h-12", animated = false, hoverable = false }) => (
  <svg className={`${className} ${hoverable ? 'hover-animate-logo' : ''}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      {animated ? `
        .logo-path-anim {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawLogo 2s ease-in-out forwards;
        }
        @keyframes drawLogo { to { stroke-dashoffset: 0; } }
      ` : ''}
      {hoverable ? `
        .hover-animate-logo { cursor: pointer; }
        .hover-animate-logo:hover path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawLogoQuick 1s ease-out forwards;
        }
        @keyframes drawLogoQuick { to { stroke-dashoffset: 0; } }
      ` : ''}
    </style>
    {/* Yellow Top */}
    <path className={animated ? "logo-path-anim" : ""} d="M 15 35 L 35 15 L 60 15 L 40 35 Z" stroke="#FDB813" strokeWidth="6" strokeLinejoin="round" />
    {/* Cyan Middle Left */}
    <path className={animated ? "logo-path-anim" : ""} d="M 15 40 L 40 40 L 60 60 L 35 60 Z" stroke="#72C4D8" strokeWidth="6" strokeLinejoin="round" style={animated ? {animationDelay: "0.2s"} : {}} />
    {/* Cyan Middle Right */}
    <path className={animated ? "logo-path-anim" : ""} d="M 45 40 L 70 40 L 90 60 L 65 60 Z" stroke="#72C4D8" strokeWidth="6" strokeLinejoin="round" style={animated ? {animationDelay: "0.4s"} : {}} />
    {/* Red Bottom */}
    <path className={animated ? "logo-path-anim" : ""} d="M 45 85 L 65 65 L 90 65 L 70 85 Z" stroke="#E3242B" strokeWidth="6" strokeLinejoin="round" style={animated ? {animationDelay: "0.6s"} : {}} />
  </svg>
);

// --- UTILITY: Dynamic Script Loader ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};


// --- DX BALL COMPONENT ---
const DxBallGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [score, setScore] = useState(0);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuration
    const ballRadius = 8;
    let x = canvas.width / 2;
    let y = canvas.height - 40;
    let dx = 4 + Math.random() * 2;
    let dy = -5;

    const paddleHeight = 12;
    const paddleWidth = 120;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 80;
    const brickHeight = 24;
    const brickPadding = 12;
    const brickOffsetTop = 60;
    const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2;

    let currentScore = 0;
    let lives = 3;
    let isGameOver = false;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const keyDownHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };

    const keyUpHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };

    const mouseMoveHandler = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const relativeX = (e.clientX - rect.left) * scaleX;
      
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff88";
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ff88";
      ctx.closePath();
      ctx.shadowBlur = 0; 
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight - 15, paddleWidth, paddleHeight);
      ctx.fillStyle = "#00ff88";
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = r % 2 === 0 ? "#00ff88" : "#72C4D8";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawHUD = () => {
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("SCORE: " + currentScore, 20, 30);
      ctx.fillText("LIVES: " + lives, canvas.width - 100, 30);
    };

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              currentScore++;
              setScore(currentScore);
              if (currentScore === brickRowCount * brickColumnCount) {
                isGameOver = true;
                setGameState('won');
              }
            }
          }
        }
      }
    };

    const draw = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBricks();
      drawBall();
      drawPaddle();
      drawHUD();
      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius - paddleHeight - 5) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          dx = dx + (x - (paddleX + paddleWidth/2)) * 0.05;
        } else if (y + dy > canvas.height - ballRadius) {
          lives--;
          if (!lives) {
            isGameOver = true;
            setGameState('lost');
          } else {
            x = canvas.width / 2;
            y = canvas.height - 40;
            dx = 4;
            dy = -5;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      x += dx;
      y += dy;

      if (!isGameOver) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const cleanup = initGame();
      return cleanup;
    }
  }, [gameState, initGame]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0a0a0a] p-4 rounded-3xl border border-[#00ff88]/30 shadow-[0_0_50px_rgba(0,255,136,0.1)] relative">
      <div className="absolute top-4 left-6 flex items-center gap-2">
         <div className="w-3 h-3 rounded-full bg-[#E3242B]"></div>
         <div className="w-3 h-3 rounded-full bg-[#FDB813]"></div>
         <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={`w-full h-auto bg-[#050505] rounded-xl mt-8 cursor-none transition-opacity duration-300 ${gameState !== 'playing' ? 'opacity-30' : 'opacity-100'}`}
        style={{ display: 'block', touchAction: 'none' }}
      />
      
      {gameState !== 'playing' && (
         <div className="absolute inset-0 flex flex-col items-center justify-center z-10 font-mono">
            <h3 className={`text-5xl font-black mb-4 tracking-widest ${gameState === 'won' ? 'text-[#00ff88]' : 'text-[#E3242B]'}`}>
              {gameState === 'won' ? 'SYSTEM SECURED' : 'SYSTEM FAILURE'}
            </h3>
            <p className="text-white/70 mb-8 text-lg">FINAL SCORE: <span className="text-white font-bold">{score}</span></p>
            <button 
              onClick={() => { setScore(0); setGameState('playing'); }}
              className="flex items-center gap-2 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88] hover:text-black px-8 py-4 rounded-full font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
            >
              <Play className="w-5 h-5" /> REBOOT SIMULATION
            </button>
         </div>
      )}
    </div>
  );
};


export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadText, setLoadText] = useState("INITIALIZING KERNEL...");
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [curveData, setCurveData] = useState({ curve: "", combined: "", strokeWidth: 6 });
  const [currentPage, setCurrentPage] = useState('home'); // home, recruitment, game, admin
  
  // Custom Dropdown State
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Web Architecture (Frontend/Backend)');
  const availableRoles = [
    'Web Architecture (Frontend/Backend)', 
    'Native Mobile (iOS/Android)', 
    'UI / UX Design', 
    'Cybersecurity / DevOps'
  ];

  // Smart Recruitment State
  const [recruitmentStep, setRecruitmentStep] = useState(0);
  const [recruitmentName, setRecruitmentName] = useState('');
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);

  // AI Feature State
  const [campusProblem, setCampusProblem] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');
  
  // AI Additional Interactive States
  const [aiIdeaSaved, setAiIdeaSaved] = useState(false);
  const [aiIdeaVoted, setAiIdeaVoted] = useState(false);

  // Admin Dashboard State
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // Demo Pipeline Ideas State
  const [demoIdeas, setDemoIdeas] = useState([
    { id: 1, title: "Campus Thrift Exchange", desc: "A localized marketplace for students to buy/sell books and dorm essentials securely.", votes: 342, userVoted: false },
    { id: 2, title: "Lost & Found Bot", desc: "Automated Telegram bot that matches found items with lost reports using AI image recognition.", votes: 215, userVoted: true },
    { id: 3, title: "Library Seat Tracker", desc: "Real-time heat map of available seats in the main library using WiFi AP density analytics.", votes: 189, userVoted: false }
  ]);

  // Terminal Feature State
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'res', text: 'SUTT MAINFRAME TERMINAL [Version 1.0.4]' },
    { type: 'res', text: "Type 'help' to see available commands." }
  ]);
  const terminalInputRef = useRef(null);

  const containerRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  const typeTextRef = useRef(null);
  const joinUsRef = useRef(null);
  const roadmapWrapperRef = useRef(null);
  const qMarkRef = useRef(null);
  const timelineRef = useRef(null);
  const timelineBgRef = useRef(null);
  const combinedPathRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const audioCtxRef = useRef(null);

  // --- HANDLERS ---
  const handleVote = (id) => {
    setDemoIdeas(ideas => ideas.map(idea => {
      if (idea.id === id) {
        return { ...idea, votes: idea.userVoted ? idea.votes - 1 : idea.votes + 1, userVoted: !idea.userVoted };
      }
      return idea;
    }));
    playSound('tone');
  };

  // --- LOCALSTORAGE LEADERBOARD ENGINE ---
  useEffect(() => {
    if (currentPage === 'admin' || currentPage === 'recruitment') {
      const fetchLeaderboard = () => {
        const stored = localStorage.getItem('sutt_leaderboard');
        if (stored) {
          setLeaderboardData(JSON.parse(stored));
        } else {
          const initialData = [
            { name: "Trinity", score: 100, timestamp: Date.now() - 100000 },
            { name: "Morpheus", score: 100, timestamp: Date.now() - 500000 },
            { name: "Cypher", score: 0, timestamp: Date.now() - 800000 }
          ];
          localStorage.setItem('sutt_leaderboard', JSON.stringify(initialData));
          setLeaderboardData(initialData);
        }
      };
      fetchLeaderboard();
    }
  }, [recruitmentStep, currentPage]);

  // --- AUDIO SYSTEM ---
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setAudioUnlocked(true);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setSoundEnabled(true);
  };

  const playSound = useCallback((type) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    if (type === 'glitch') {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'square';
          osc.frequency.setValueAtTime(400 + Math.random() * 400, ctx.currentTime);
          gain.gain.setValueAtTime(0.01, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.05);
        }, i * 30);
      }
    } else if (type === 'tone') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      
      osc.frequency.setValueAtTime(1500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  }, [soundEnabled]);

  // --- TERMINAL HOTKEY ENGINE ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '`' || e.key === '~' || e.key === '/') && !isTerminalOpen && !loading) {
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsTerminalOpen(true);
          playSound('glitch');
        }
      } else if (e.key === 'Escape' && isTerminalOpen) {
        setIsTerminalOpen(false);
        playSound('tone');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen, loading, playSound]);

  useEffect(() => {
    if (isTerminalOpen && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [isTerminalOpen]);

  const handleTerminalSubmit = (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.trim().toLowerCase();
      let response = '';
      
      if (cmd === 'show projects') {
        response = 'INITIALIZING PROJECT OVERLAY... (Scroll down to view active nodes)';
        setTimeout(() => {
          setIsTerminalOpen(false);
          if (currentPage !== 'home') setCurrentPage('home');
          setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }, 800);
      } else if (cmd === 'join sutt' || cmd === 'open recruitment') {
        response = 'UPLINK ESTABLISHED. REDIRECTING TO RECRUITMENT PROTOCOL...';
        setTimeout(() => {
          setIsTerminalOpen(false);
          setCurrentPage('recruitment');
          window.scrollTo(0,0);
        }, 800);
      } else if (cmd === 'whoami') {
        response = isAdminAuth ? 'ROOT_ADMIN // FULL CLEARANCE' : 'GUEST_USER // INSUFFICIENT CLEARANCE // ANOMALY DETECTED';
      } else if (cmd.startsWith('login')) {
        if (cmd === 'login root sutt2024') {
          setIsAdminAuth(true);
          response = 'ACCESS GRANTED. ROOT PRIVILEGES ACTIVE. TYPE "dashboard" TO OPEN CONTROL PANEL.';
        } else {
          response = 'AUTHENTICATION FAILED. INCORRECT CREDENTIALS.';
        }
      } else if (cmd === 'dashboard') {
        if (isAdminAuth) {
          response = 'REDIRECTING TO ROOT DASHBOARD...';
          setTimeout(() => {
            setIsTerminalOpen(false);
            setCurrentPage('admin');
            window.scrollTo(0,0);
          }, 800);
        } else {
          response = 'PERMISSION DENIED. ROOT ACCESS REQUIRED.';
        }
      } else if (cmd === 'clear') {
        setTerminalHistory([]);
        setTerminalInput('');
        playSound('tone');
        return;
      } else if (cmd === 'help') {
        response = 'AVAILABLE COMMANDS: show projects, join sutt, open recruitment, whoami, login [user] [pass], dashboard, clear, exit';
      } else if (cmd === 'exit') {
        setIsTerminalOpen(false);
        setTerminalInput('');
        playSound('tone');
        return;
      } else if (cmd !== '') {
        response = `COMMAND NOT RECOGNIZED: ${cmd}. TYPE 'help' FOR A LIST OF COMMANDS.`;
      }

      if (cmd !== '') {
        setTerminalHistory(prev => [...prev, { type: 'cmd', text: `> ${cmd}` }, { type: 'res', text: response }]);
      }
      setTerminalInput('');
      playSound('tone');
    }
  };

  // --- GEMINI API INTEGRATION ---
  const generateProjectSpec = async () => {
    if (!campusProblem.trim()) return;
    setIsGeneratingAi(true);
    setAiResponse('');
    setAiError('');
    setAiIdeaSaved(false);
    setAiIdeaVoted(false);
    playSound('glitch');

    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const prompt = `You are an elite software architect for a university Student Union Tech Team. 
A student has suggested we build this next: "${campusProblem}"

Draft a high-tech, concise project pitch for it. Format your response exactly like a terminal readout:
PROJECT_NAME: [Creative technical name]
TECH_STACK: [List 3-4 relevant modern technologies]
ARCHITECTURE_OVERVIEW: [2-3 sentences explaining how it works]

Keep it edgy, professional, and strictly formatted.`;

    const fetchWithRetry = async (url, options, retries = 5) => {
      const delays = [1000, 2000, 4000, 8000, 16000];
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url, options);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return await res.json();
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise(r => setTimeout(r, delays[i]));
        }
      }
    };

    try {
      const data = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
         setAiResponse(text);
         playSound('tone');
      } else {
         throw new Error("Empty response");
      }
    } catch (err) {
      setAiError("SYS_ERROR: Connection to mainframe failed. Try again.");
      playSound('glitch');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --- DYNAMIC CURVE CALCULATION ---
  const updateCurve = useCallback(() => {
    if (currentPage !== 'home' || !roadmapWrapperRef.current || !qMarkRef.current || !timelineBgRef.current) return;
    
    const wrapperRect = roadmapWrapperRef.current.getBoundingClientRect();
    const qRect = qMarkRef.current.getBoundingClientRect();
    const tBgRect = timelineBgRef.current.getBoundingClientRect();
    const ctaRect = ctaButtonRef.current?.getBoundingClientRect();

    const startX = qRect.left + (qRect.width / 2) - wrapperRect.left;
    const startY = qRect.bottom - wrapperRect.top;
    const endX = tBgRect.left + (tBgRect.width / 2) - wrapperRect.left;
    const endY = tBgRect.top - wrapperRect.top;
    
    const bottomY = ctaRect ? ctaRect.top - wrapperRect.top - 10 : tBgRect.bottom - wrapperRect.top;

    const cp1X = startX;
    const cp1Y = startY + (endY - startY) / 2;
    const cp2X = endX;
    const cp2Y = startY + (endY - startY) / 2;

    const curve = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    const combined = `${curve} L ${endX} ${bottomY}`;

    setCurveData({
      curve,
      combined,
      strokeWidth: 6
    });
  }, [currentPage]);

  useEffect(() => {
    if (loading) return;
    updateCurve();
    window.addEventListener('resize', updateCurve);
    setTimeout(updateCurve, 500); 
    return () => window.removeEventListener('resize', updateCurve);
  }, [updateCurve, loading, currentPage]);


  // --- INITIALIZATION & LOADING SCREEN LOGIC ---
  useEffect(() => {
    const loadApp = async () => {
      try {
        await Promise.all([
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
        ]);
        setLibsLoaded(true);
      } catch (err) {
        console.error("Failed to load libraries", err);
        setLibsLoaded(true);
      }
    };
    loadApp();
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        const next = prev + Math.floor(Math.random() * 15) + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 600);
          return 100;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (loadProgress > 20) setLoadText("MOUNTING NEURAL NET...");
    if (loadProgress > 50) setLoadText("ESTABLISHING MAINFRAME UPLINK...");
    if (loadProgress > 80) setLoadText("BYPASSING SECURITY PROTOCOLS...");
    if (loadProgress === 100) setLoadText("ACCESS GRANTED.");
  }, [loadProgress]);


  // --- GLOBAL MATRIX (APPEARS ONLY ON MOUSE MOVE) ---
  useEffect(() => {
    if (!matrixCanvasRef.current || loading) return;
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    let width = window.innerWidth || 1;
    let height = window.innerHeight || 1;
    
    const resize = () => {
      width = window.innerWidth || 1; 
      height = window.innerHeight || 1;
      canvas.width = width;
      canvas.height = height;
      offCanvas.width = width;
      offCanvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const letters = "0101010101TECHTEAM<>{}[]".split("");
    const fontSize = 14;
    const columns = Math.ceil(width / fontSize);
    const drops = Array(columns).fill(1);
    
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 0.4s ease-out';
    
    let mouse = { x: width / 2, y: height / 2 };
    let trail = [];
    let isMoving = false;
    let moveTimeout;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMoving = true;
      
      // Increased from 0.4 to 0.8 for much more prominent trails
      if (canvas.style.opacity !== '0.8') {
        canvas.style.opacity = '0.8';
      }
      
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false; 
        canvas.style.opacity = '0';
      }, 150);
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const draw = () => {
      offCtx.fillStyle = "rgba(5, 5, 5, 0.08)";
      offCtx.fillRect(0, 0, width, height);
      
      offCtx.fillStyle = "#00ff88";
      offCtx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.05) {
          const text = letters[Math.floor(Math.random() * letters.length)];
          offCtx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > height && Math.random() > 0.95) drops[i] = 0;
          drops[i]++;
        }
      }

      if (isMoving) {
        trail.push({ x: mouse.x, y: mouse.y, age: 0 });
      }
      trail = trail.filter(p => p.age < 40);
      trail.forEach(p => p.age++);

      ctx.clearRect(0, 0, width, height);
      
      trail.forEach((p) => {
        const radius = Math.max(0, 150 - p.age * 3); 
        const opacity = Math.max(0, 1 - p.age / 40);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      if (offCanvas.width > 0 && offCanvas.height > 0) {
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(offCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(moveTimeout);
    };
  }, [loading]);

  // --- GSAP SCROLL ANIMATIONS ---
  useEffect(() => {
    if (loading || !libsLoaded || !window.gsap) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (currentPage === 'home') {
      gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
        gsap.fromTo(elem, 
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
            }
          }
        );
      });

      // Animated Metrics Counter Engine
      gsap.utils.toArray('.metric-number').forEach((el) => {
        const targetVal = parseInt(el.getAttribute('data-target'), 10);
        gsap.fromTo(el, 
          { innerText: 0 }, 
          {
            innerText: targetVal,
            duration: 1.2, 
            ease: "power3.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: '.metrics-container', 
              start: "top 85%"
            }
        });
      });

      if (typeTextRef.current) {
        const chars = typeTextRef.current.querySelectorAll('.char');
        gsap.fromTo(chars, 
          { color: '#222222', opacity: 0.05 }, 
          {
            color: '#aaaaaa', 
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: typeTextRef.current,
              start: "top 80%",
              end: "center 50%", 
              scrub: 0.5,
            }
          }
        );
      }

      if (joinUsRef.current) {
        const chars = joinUsRef.current.querySelectorAll('.char');
        gsap.fromTo(chars, 
          { opacity: 0.05 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: joinUsRef.current,
              start: "top 80%",
              end: "center 50%",
              scrub: 0.5,
            }
          }
        );
      }

      gsap.utils.toArray('.timeline-dot').forEach((dot) => {
        gsap.fromTo(dot, 
          { backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'none' },
          {
            backgroundColor: '#00ff88',
            borderColor: '#00ff88',
            boxShadow: '0 0 15px rgba(0,255,136,0.6)',
            duration: 0.3,
            scrollTrigger: {
              trigger: dot,
              start: "top 55%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
      
      gsap.utils.toArray('.roadmap-node').forEach((elem) => {
        gsap.fromTo(elem, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 80%",
            }
          }
        );
      });

    } else if (currentPage === 'recruitment') {
      gsap.utils.toArray('.gsap-recruitment-reveal').forEach((elem, i) => {
        gsap.fromTo(elem,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: i * 0.15, ease: "power3.out" }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [libsLoaded, loading, currentPage]);

  useEffect(() => {
    if (loading || !libsLoaded || !window.gsap || !curveData.combined || !combinedPathRef.current || currentPage !== 'home') return;
    const gsap = window.gsap;
    
    const totalLen = combinedPathRef.current.getTotalLength();

    gsap.set(combinedPathRef.current, { strokeDasharray: totalLen, strokeDashoffset: totalLen });
    
    const unifiedAnim = gsap.to(combinedPathRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: joinUsRef.current,
        start: "center center",          
        endTrigger: ctaButtonRef.current || timelineRef.current,
        end: ctaButtonRef.current ? "top 60%" : "bottom 80%", 
        scrub: true
      }
    });

    return () => {
      if (unifiedAnim.scrollTrigger) unifiedAnim.scrollTrigger.kill();
      unifiedAnim.kill();
    }
  }, [curveData.combined, libsLoaded, loading, currentPage]);

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // Team array extracted for the Marquee feature
  const teamMembers = [
    { name: 'Alex Chen', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
    { name: 'Samantha Lee', role: 'UI/UX Lead', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { name: 'Jordan Davis', role: 'Systems Architect', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Priya Sharma', role: 'Security Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' }
  ];

  // Testimonials array extracted for the Marquee feature
  const testimonialsData = [
    { quote: "The new voting portal handled 10,000 concurrent users without a single dropped connection. Incredible engineering.", author: "Elections Commissioner", Icon: Vote },
    { quote: "Their UI/UX team completely transformed how students interact with the library booking system.", author: "Head Librarian", Icon: BookOpen },
    { quote: "A dedicated group of developers who operate like a professional agency right here on campus.", author: "Dean of Students", Icon: GraduationCap }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center font-mono">
        <div className="relative flex flex-col items-center justify-center">
          <SuttLogo className="w-24 h-24 mb-8" animated={true} />
          
          <div className="w-64 h-5 border border-[#00ff88]/50 bg-[#050505] p-[2px] mb-4 relative shadow-[0_0_20px_rgba(0,255,136,0.15)] flex">
            <div 
              className="h-full bg-[#00ff88] transition-all duration-200 ease-out relative" 
              style={{ 
                width: `${loadProgress}%`,
                backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 8px, #050505 8px, #050505 10px)',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.8)'
              }}
            ></div>
          </div>
          
          <div className="text-[#00ff88] tracking-[0.2em] text-xs h-4 font-bold">
            <span className="opacity-50">[{loadProgress.toString().padStart(3, '0')}%]</span> {loadText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ff88] selection:text-black font-mono overflow-x-hidden" ref={containerRef}>
      
      {/* --- INJECTED CUSTOM STYLES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        
        .bg-noise {
          position: fixed; inset: 0; z-index: 50; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ff88; }
        
        .btn-glitch { position: relative; transition: all 0.3s ease; cursor: pointer; overflow: hidden; }
        .glitch-target { position: relative; display: inline-block; }
        .btn-glitch:hover .glitch-target::before, .btn-glitch:hover .glitch-target::after {
          content: attr(data-text); position: absolute; top: 0; opacity: 1; pointer-events: none;
          background: transparent;
        }
        .btn-glitch:hover .glitch-target::before {
          left: -4px; color: #00ff88; text-shadow: 2px 0 #00ff88; z-index: 10;
          animation: glitch-anim-1 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate-reverse;
        }
        .btn-glitch:hover .glitch-target::after {
          left: 4px; color: #ff00ea; text-shadow: -2px 0 #ff00ea; z-index: -1;
          animation: glitch-anim-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate-reverse;
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-4px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(4px, -2px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-4px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(4px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-4px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(4px, -1px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(4px, -1px); }
          20% { clip-path: inset(30% 0 20% 0); transform: translate(-4px, 2px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(4px, -2px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translate(-4px, 2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(4px, -1px); }
          100% { clip-path: inset(5% 0 80% 0); transform: translate(-4px, 1px); }
        }

        /* Custom Dropdown Animation */
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-10px) scaleY(0.95); }
          to { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        .animate-dropdown {
          animation: dropdownSlide 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00ff88; }

        .tilt-card { transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform-style: preserve-3d; }
        .tilt-card-content { transform: translateZ(40px); }
        .marquee-container { display: flex; overflow: hidden; width: 100vw; }
        .marquee-content { display: flex; flex-shrink: 0; animation: marquee 30s linear infinite; }
        .marquee-content-reverse { display: flex; flex-shrink: 0; animation: marquee-reverse 35s linear infinite reverse; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}} />

      <div className="bg-noise" />

      {/* --- AUDIO ENABLE TOAST --- */}
      {!audioUnlocked && (
        <div className="fixed bottom-8 right-8 z-50 animate-pulse flex items-center gap-3 bg-[#0a0a0a] border border-[#00ff88]/30 px-4 py-3 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.2)]">
          <VolumeX className="w-4 h-4 text-[#00ff88]" />
          <span className="text-[#00ff88] text-xs font-bold tracking-widest uppercase">Click anywhere to enable sound</span>
        </div>
      )}

      {/* --- MOUSE REVEAL CANVAS --- */}
      <canvas 
        ref={matrixCanvasRef} 
        className="fixed inset-0 z-0 pointer-events-none mix-blend-screen"
      />

      {/* --- TERMINAL OVERLAY UI --- */}
      {isTerminalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md p-6 md:p-12 font-mono flex flex-col">
           <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4 text-[#00ff88]">
                 <TerminalSquare className="w-6 h-6" />
                 <span className="font-bold tracking-widest">SUTT_SYS_TERMINAL</span>
              </div>
              <button 
                onClick={() => setIsTerminalOpen(false)}
                className="text-white/50 hover:text-white transition-colors text-xs tracking-widest"
              >
                [ESC] TO CLOSE
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 scrollbar-hide text-sm md:text-base">
              {terminalHistory.map((line, i) => (
                 <div key={i} className={line.type === 'cmd' ? 'text-white' : 'text-[#00ff88]'}>
                    {line.text}
                 </div>
              ))}
           </div>
           
           <div className="flex items-center gap-3 text-white text-sm md:text-base mt-auto pt-4 border-t border-white/10">
              <span className="text-[#00ff88] animate-pulse">{'>'}</span>
              <input 
                ref={terminalInputRef}
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalSubmit}
                className="w-full bg-transparent border-none outline-none text-white focus:ring-0"
                spellCheck={false}
                autoComplete="off"
              />
           </div>
        </div>
      )}

      {/* --- GLASS HEADER --- */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
        <div 
          className="font-bold text-lg tracking-widest flex items-center gap-4 cursor-pointer"
          onClick={() => { 
            setCurrentPage('home'); 
            setRecruitmentStep(0);
            window.scrollTo(0,0); 
            playSound('tone'); 
          }}
        >
          <SuttLogo className="w-8 h-8" hoverable={true} />
          <span style={{ fontFamily: "'Orbitron', sans-serif" }}>SUTT</span>
        </div>
        <div className="flex items-center gap-8 text-xs tracking-widest text-white/70">
          {/* Terminal Hint for Desktop */}
          <div className="hidden md:flex items-center gap-2 text-white/30 mr-4">
             <TerminalSquare className="w-4 h-4" />
             <span>Press <span className="bg-white/10 px-1.5 py-0.5 rounded">/</span> for terminal</span>
          </div>

          <button 
            onClick={() => { initAudio(); setSoundEnabled(!soundEnabled); }} 
            className="hover:text-[#00ff88] transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4"/> : <VolumeX className="w-4 h-4"/>}
          </button>
          
          {/* Terminal Button specifically for Mobile since they don't have hotkeys */}
          <button 
            className="md:hidden hover:text-[#00ff88] transition-colors"
            onClick={() => { setIsTerminalOpen(true); playSound('glitch'); }}
          >
            <Terminal className="w-4 h-4" />
          </button>

          {currentPage === 'home' && (
            <>
              <a href="#projects" className="hidden md:block hover:text-white transition-colors btn-glitch" onMouseEnter={() => playSound('glitch')}>
                <span className="glitch-target" data-text="PROJECTS">PROJECTS</span>
              </a>
              <a href="#team" className="hidden md:block hover:text-white transition-colors btn-glitch" onMouseEnter={() => playSound('glitch')}>
                <span className="glitch-target" data-text="TEAM">TEAM</span>
              </a>
              <button 
                onClick={() => {
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                  playSound('tone');
                }}
                className="btn-glitch border border-white/20 px-6 py-2 rounded-full hover:border-[#00ff88] hover:text-[#00ff88] transition-colors bg-white/5"
                onMouseEnter={() => playSound('glitch')}
              >
                <span className="glitch-target" data-text="CONTACT">CONTACT</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 w-full flex flex-col gap-24 md:gap-32 pb-0">
        {currentPage === 'admin' ? (
           <section className="pt-32 px-6 md:px-12 w-full max-w-[1200px] mx-auto min-h-screen flex flex-col pb-16 font-mono">
              <div className="mb-12 mt-10">
                  <button onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); playSound('tone'); }} className="text-white/50 hover:text-[#E3242B] text-sm tracking-widest flex items-center gap-2 transition-colors group">
                     <ArrowRight className="w-4 h-4 rotate-180 transform group-hover:-translate-x-1 transition-transform" /> CLOSE SECURE DASHBOARD
                  </button>
              </div>
              <div className="bg-[#0a0a0a] border border-[#E3242B]/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(227,36,43,0.15)] relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#E3242B]/50 to-transparent"></div>
                 
                 <div className="flex items-center gap-4 mb-2">
                    <ShieldAlert className="w-8 h-8 text-[#E3242B] animate-pulse" />
                    <h2 className="text-3xl md:text-5xl font-black text-[#E3242B] tracking-widest">ROOT_ACCESS</h2>
                 </div>
                 <p className="text-white/50 mb-10 text-sm tracking-widest pl-12 border-l border-[#E3242B]/30 ml-4">AUTHORIZED PERSONNEL ONLY // MONITORING ACTIVE SYSTEMS</p>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Community Pipeline Table */}
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-6 shadow-inner">
                       <h3 className="text-[#00ff88] font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-4"><Activity className="w-4 h-4"/> COMMUNITY SUGGESTIONS</h3>
                       <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                          {[...demoIdeas].sort((a,b) => b.votes - a.votes).map(idea => (
                             <div key={idea.id} className="bg-white/5 p-4 rounded-lg flex flex-col gap-2 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                   <span className="font-bold text-white text-sm">{idea.title}</span>
                                   <span className="text-[#00ff88] font-bold text-xs bg-[#00ff88]/10 px-2 py-1 rounded whitespace-nowrap">{idea.votes} PTS</span>
                                </div>
                                <p className="text-white/40 text-xs leading-relaxed">{idea.desc}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    {/* Recent Leaderboard Submissions */}
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-6 shadow-inner">
                       <h3 className="text-[#72C4D8] font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-4"><Users className="w-4 h-4"/> RECRUITMENT LOGS</h3>
                       <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                          {leaderboardData.length > 0 ? leaderboardData.map((entry, idx) => (
                             <div key={idx} className="bg-white/5 p-4 rounded-lg flex justify-between items-center hover:bg-white/10 transition-colors">
                                <div className="flex flex-col">
                                   <span className="font-bold text-white text-sm">{entry.name}</span>
                                   <span className="text-white/40 text-[10px]">{new Date(entry.timestamp).toLocaleString()}</span>
                                </div>
                                <span className={`font-mono font-bold text-xs ${entry.score > 0 ? 'text-[#00ff88]' : 'text-[#E3242B]'}`}>{entry.score} PTS</span>
                             </div>
                          )) : (
                             <div className="text-center text-white/30 py-8 text-sm tracking-widest">NO LOGS DETECTED</div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </section>

        ) : currentPage === 'game' ? (
           <section className="pt-32 px-6 md:px-12 w-full max-w-[1000px] mx-auto min-h-screen flex flex-col items-center pb-16">
              <div className="gsap-recruitment-reveal mb-8 w-full">
                <button onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); playSound('tone'); }} className="text-white/50 hover:text-[#00ff88] text-sm tracking-widest flex items-center gap-2 transition-colors group">
                   <ArrowRight className="w-4 h-4 rotate-180 transform group-hover:-translate-x-1 transition-transform" /> TERMINATE SIMULATION
                </button>
              </div>
              <div className="text-[#00ff88] font-bold text-2xl mb-4 tracking-widest uppercase flex items-center gap-4">
                 <TerminalSquare className="w-6 h-6 animate-pulse" /> SUTT // DX_BALL ENGINE
              </div>
              <DxBallGame />
           </section>

        ) : currentPage === 'recruitment' ? (
          <section className="pt-32 px-6 md:px-12 w-full max-w-[1000px] mx-auto min-h-screen flex flex-col pb-16">
             <div className="gsap-recruitment-reveal mb-12 mt-10">
                <button
                   onClick={() => { setCurrentPage('home'); setRecruitmentStep(0); window.scrollTo(0,0); playSound('tone'); }}
                   className="text-white/50 hover:text-[#00ff88] text-sm tracking-widest flex items-center gap-2 transition-colors group"
                >
                   <ArrowRight className="w-4 h-4 rotate-180 transform group-hover:-translate-x-1 transition-transform" /> TERMINATE UPLINK (BACK)
                </button>
             </div>
             
             <div className="gsap-recruitment-reveal bg-[#0a0a0a] border border-[#00ff88]/30 rounded-3xl p-8 md:p-16 shadow-[0_0_50px_rgba(0,255,136,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent"></div>
                
                {recruitmentStep === 0 && (
                  <>
                    <h2 className="text-3xl md:text-5xl font-black text-[#00ff88] mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>RECRUITMENT_PROTOCOL</h2>
                    <p className="text-white/60 mb-12 leading-relaxed">Enter your credentials to initiate the application process. Only the most ambitious architects need apply.</p>

                    <form className="flex flex-col gap-8" onSubmit={(e) => { e.preventDefault(); setRecruitmentStep(1); playSound('tone'); }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                           <label className="text-xs tracking-widest text-[#00ff88] mb-3 block">ID_STRING (FULL NAME)</label>
                           <input type="text" required value={recruitmentName} onChange={e => setRecruitmentName(e.target.value)} placeholder="e.g. Neo" className="w-full bg-[#050505] border border-white/10 p-5 rounded-2xl text-white focus:border-[#00ff88]/50 outline-none transition-colors" />
                         </div>
                         <div>
                           <label className="text-xs tracking-widest text-[#00ff88] mb-3 block">COMM_LINK (EMAIL)</label>
                           <input type="email" required placeholder="neo@matrix.edu" className="w-full bg-[#050505] border border-white/10 p-5 rounded-2xl text-white focus:border-[#00ff88]/50 outline-none transition-colors" />
                         </div>
                      </div>
                      
                      {/* --- FULLY CUSTOM DROPDOWN TO REPLACE NATIVE <SELECT> --- */}
                      <div className="relative z-50">
                         <label className="text-xs tracking-widest text-[#00ff88] mb-3 block">PRIMARY_DOMAIN (ROLE)</label>
                         
                         <div 
                           onClick={() => { setIsRoleDropdownOpen(!isRoleDropdownOpen); playSound('glitch'); }}
                           className={`w-full bg-[#050505] border ${isRoleDropdownOpen ? 'border-[#00ff88]/50' : 'border-white/10'} p-5 rounded-2xl text-white cursor-pointer flex justify-between items-center transition-colors`}
                         >
                            <span className={selectedRole ? 'text-white' : 'text-white/50'}>
                              {selectedRole}
                            </span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180 text-[#00ff88]' : 'text-white/50'}`} />
                         </div>

                         {isRoleDropdownOpen && (
                           <>
                             <div 
                               className="fixed inset-0 z-40" 
                               onClick={() => setIsRoleDropdownOpen(false)}
                             ></div>
                             <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-[#00ff88]/30 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 origin-top animate-dropdown">
                                {availableRoles.map((role, idx) => (
                                  <div 
                                    key={idx}
                                    onClick={() => { setSelectedRole(role); setIsRoleDropdownOpen(false); playSound('tone'); }}
                                    className={`p-5 cursor-pointer border-b border-white/5 last:border-none transition-colors duration-200 ${selectedRole === role ? 'bg-[#00ff88]/10 text-[#00ff88] font-bold' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                  >
                                    {role}
                                  </div>
                                ))}
                             </div>
                           </>
                         )}
                      </div>

                      <div>
                         <label className="text-xs tracking-widest text-[#00ff88] mb-3 block">MOTIVATION_MATRIX (WHY SUTT?)</label>
                         <textarea required placeholder="Tell us about your drive to build..." className="w-full h-40 bg-[#050505] border border-white/10 p-5 rounded-2xl text-white focus:border-[#00ff88]/50 outline-none transition-colors resize-none leading-relaxed"></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="w-full mt-4 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88] hover:text-black py-6 rounded-2xl font-bold tracking-[0.3em] text-sm uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.1)] hover:shadow-[0_0_40px_rgba(0,255,136,0.3)]"
                        onMouseEnter={() => playSound('glitch')}
                      >
                        TRANSMIT APPLICATION
                      </button>
                    </form>
                  </>
                )}

                {/* --- FUNNY RECRUITMENT FLOW --- */}
                {recruitmentStep === 1 && (
                   <div className="animate-[fadeIn_0.5s_ease-out] flex flex-col gap-6">
                      <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl p-6 text-center">
                         <h3 className="text-2xl font-bold text-[#00ff88] mb-2 tracking-widest">SHORTLISTED // ROUND 1</h3>
                         <p className="text-white/70 text-sm">System has accepted your preliminary data. Proceed to the technical assessment.</p>
                      </div>

                      <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 shadow-inner">
                         <h4 className="text-lg font-bold text-white mb-6">Q1: Who was Ash Ketchum's first Pokémon?</h4>
                         <div className="flex flex-col gap-4">
                            {['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu'].map(opt => (
                               <div 
                                 key={opt}
                                 onClick={() => { setQ1Answer(opt); playSound('tone'); }}
                                 className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${q1Answer === opt ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] font-bold shadow-[0_0_15px_rgba(0,255,136,0.2)]' : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white hover:bg-white/5'}`}
                               >
                                  <span className="font-mono">{opt}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      <button 
                        disabled={!q1Answer}
                        onClick={() => setRecruitmentStep(2)}
                        className="w-full mt-4 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88] hover:text-black py-6 rounded-2xl font-bold tracking-[0.3em] text-sm uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onMouseEnter={() => { if(q1Answer) playSound('glitch'); }}
                      >
                        NEXT QUESTION
                      </button>
                   </div>
                )}

                {recruitmentStep === 2 && (
                   <div className="animate-[fadeIn_0.5s_ease-out] flex flex-col gap-6">
                      <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 shadow-inner">
                         <h4 className="text-lg font-bold text-white mb-6 leading-relaxed">Q2: Given a quantum super-position of an unsorted array, what is the exact spacetime complexity of finding the optimal Hamiltonian path using BogoSort?</h4>
                         <div className="flex flex-col gap-4">
                            {['O(1) because multiverse', 'O(n!)', 'O(WTF)', 'O(n^n^n)'].map(opt => (
                               <div 
                                 key={opt}
                                 onClick={() => { setQ2Answer(opt); playSound('tone'); }}
                                 className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${q2Answer === opt ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] font-bold shadow-[0_0_15px_rgba(0,255,136,0.2)]' : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white hover:bg-white/5'}`}
                               >
                                  <span className="font-mono">{opt}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                      <button 
                        disabled={!q2Answer}
                        onClick={() => { playSound('glitch'); setRecruitmentStep(3); }}
                        className="w-full mt-4 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88] hover:text-black py-6 rounded-2xl font-bold tracking-[0.3em] text-sm uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        EVALUATE RESPONSE
                      </button>
                   </div>
                )}

                {recruitmentStep === 3 && (
                   <div className="animate-[fadeIn_0.5s_ease-out] flex flex-col gap-8 text-center py-10">
                      <Sparkles className="w-24 h-24 text-[#00ff88] mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)] animate-bounce" />
                      <h3 className="text-4xl md:text-5xl font-black tracking-widest mb-4 text-white">JUST KIDDING.</h3>
                      <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
                        We don't ask those kinds of questions here. 
                        <br/><br/>
                        Check your inbox for details regarding Round 1 recruitments. See you on the other side.
                      </p>
                      <button 
                         onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); playSound('tone'); }}
                         className="mx-auto mt-8 border border-[#00ff88]/50 text-[#00ff88] px-8 py-4 rounded-full text-xs hover:bg-[#00ff88] hover:text-black transition-all tracking-widest font-bold shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                         onMouseEnter={() => playSound('glitch')}
                      >
                         RETURN TO MAINFRAME
                      </button>
                   </div>
                )}

             </div>
          </section>
        ) : (
          <>
            {/* SECTION 1: HERO */}
            <section className="h-screen flex flex-col items-center justify-center relative px-6 md:px-12 w-full overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 blur-[3px] select-none pointer-events-none">
                <span className="text-[17vw] font-black leading-[1.4] tracking-[0.28em] whitespace-nowrap text-[#444] pl-[0.28em]">BUILD</span>
                <span className="text-[17vw] font-black leading-[1.4] tracking-[0.28em] whitespace-nowrap text-[#444] pl-[0.28em]">INNOVATE</span>
              </div>
              
              <div className="z-10 flex flex-col items-center text-center">
                {/* --- SUTT LOGO TO GAMEPAD GLITCH --- */}
                <div 
                  className="mb-10 p-2 cursor-pointer relative z-50 group flex flex-col items-center justify-center w-24 h-24"
                  onClick={() => { setCurrentPage('game'); window.scrollTo(0,0); playSound('glitch'); }}
                >
                  {/* Default SUTT Logo (Hides on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:opacity-0 group-hover:scale-75">
                    <SuttLogo className="w-20 h-20" />
                  </div>
                  {/* Gamepad Icon (Appears on hover) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110">
                    <Gamepad2 className="w-12 h-12 text-[#00ff88] animate-pulse drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
                    <span className="text-[#00ff88] text-[9px] tracking-[0.3em] font-bold whitespace-nowrap mt-2 drop-shadow-[0_0_10px_rgba(0,255,136,0.8)] btn-glitch">
                      <span className="glitch-target" data-text="ARCADE">ARCADE</span>
                    </span>
                  </div>
                </div>
                
                <h1 
                  className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50"
                  style={{ 
                    fontFamily: "'Orbitron', sans-serif",
                    filter: 'drop-shadow(0px 25px 35px rgba(0,0,0,1)) drop-shadow(0px 0px 30px rgba(0,255,136,0.15))' 
                  }}
                >
                  SUTT
                </h1>
                
                <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 font-medium">
                  We are the technical backbone of the Student Union. Designing, developing, and deploying platforms that empower thousands.
                </p>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
                <span className="text-[10px] tracking-widest">SCROLL</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </section>

            {/* SECTION 2: SCROLL TYPING (INTRO) */}
            <section className="min-h-screen flex items-center justify-center text-center px-6 md:px-12 w-full">
              <h2 
                ref={typeTextRef}
                className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl flex flex-wrap justify-center gap-x-[0.25em]"
              >
                {"WE DON'T JUST WRITE CODE. WE ARCHITECT THE CAMPUS EXPERIENCE.".split(' ').map((word, i) => (
                  <span key={i} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, j) => (
                      <span key={j} className="char inline-block text-[#333]">{char}</span>
                    ))}
                  </span>
                ))}
              </h2>
            </section>

            {/* SECTION 2.5: IMPACT METRICS ENGINE */}
            <section className="pt-10 pb-20 overflow-hidden relative z-10 w-full">
              <div className="metrics-container relative border-y border-white/10 py-12 bg-[#0a0a0a]/50 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-[1600px] mx-auto px-6 md:px-12">
                  {[
                    { label: "Students Served", target: 10000, prefix: "", suffix: "+" },
                    { label: "Projects Shipped", target: 25, prefix: "", suffix: "+" },
                    { label: "Uptime", target: 99, prefix: "", suffix: ".9%" },
                    { label: "Core Developers", target: 8, prefix: "", suffix: "" },
                  ].map((metric, i) => (
                     <div key={i} className="gsap-reveal flex flex-col items-center justify-center" onMouseEnter={() => playSound('tone')}>
                        <div className="text-4xl md:text-5xl font-black text-[#00ff88] mb-2 font-mono flex items-center shadow-black drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                           {metric.prefix}<span className="metric-number" data-target={metric.target}>0</span>{metric.suffix}
                        </div>
                        <div className="text-xs tracking-widest text-white/60 uppercase">{metric.label}</div>
                     </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: IMMERSIVE LIVE PROJECTS */}
            <section id="projects" className="pt-20 px-6 md:px-12 max-w-[1600px] w-full mx-auto">
              <div className="gsap-reveal mb-12 text-center md:text-left">
                <h2 className="text-xs text-[#00ff88] tracking-[0.3em] mb-4 flex justify-center md:justify-start items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" /> 01 // LIVE DASHBOARD
                </h2>
                <h3 className="text-4xl font-light"><span className="font-bold">Active Deployments</span></h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { 
                    title: "Campus Nav API", tags: ["Go", "Mapbox", "Redis"], 
                    desc: "Real-time routing engine handling 5k requests/min for the official university app.",
                    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
                    status: "LIVE", statusColor: "bg-[#00ff88]", users: "5,200+", updated: "2 days ago"
                  },
                  { 
                    title: "SU Voting Platform", tags: ["Next.js", "Web3 Auth"], 
                    desc: "Cryptographically secure election portal replacing legacy paper systems.",
                    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
                    status: "IN PROGRESS", statusColor: "bg-[#FDB813]", users: "Beta Phase", updated: "5 hrs ago"
                  },
                  { 
                    title: "Event Ticketing Node", tags: ["Node.js", "PostgreSQL"], 
                    desc: "High-throughput microservice for instantaneous campus concert booking.",
                    img: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80",
                    status: "LIVE", statusColor: "bg-[#00ff88]", users: "12,000+", updated: "1 week ago"
                  },
                  { 
                    title: "Room Booking UI", tags: ["React", "Tailwind"], 
                    desc: "Fluid, state-driven interface integrating with the legacy library database.",
                    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                    status: "DEPRECATED", statusColor: "bg-[#E3242B]", users: "Archived", updated: "1 year ago"
                  }
                ].map((proj, i) => {
                  return (
                    <div 
                      key={i} 
                      className="gsap-reveal tilt-card group relative h-[420px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                      onMouseMove={handleTilt}
                      onMouseLeave={resetTilt}
                      onMouseEnter={() => playSound('tone')}
                    >
                      {/* Live Status Badge */}
                      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#050505]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${proj.statusColor}`}></div>
                         <span className="text-[9px] font-bold tracking-widest text-white uppercase">{proj.status}</span>
                      </div>

                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-10"
                        style={{ backgroundImage: `url(${proj.img})` }}
                      ></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
                      
                      <div className="tilt-card-content absolute inset-0 p-8 flex flex-col justify-end transition-all duration-500">
                        <div className="transform group-hover:-translate-y-[150px] transition-transform duration-500 ease-out">
                          <h4 className="text-3xl font-bold text-white group-hover:text-[#00ff88] transition-colors">{proj.title}</h4>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out delay-100 flex flex-col gap-4">
                          <p className="text-sm text-white/80 leading-relaxed max-w-sm">{proj.desc}</p>
                          <div className="flex gap-2">
                            {proj.tags.map((tag, j) => (
                              <span key={j} className="text-[10px] tracking-wider px-2 py-1 bg-[#050505]/80 border border-white/10 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Added Metrics to the Dashboard view */}
                          <div className="flex items-center gap-6 text-[10px] tracking-widest text-white/50 uppercase mt-2 pt-4 border-t border-white/10">
                            <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-[#00ff88]" /> {proj.users}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#00ff88]" /> {proj.updated}</span>
                          </div>
                        </div>

                        <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 bg-[#050505]/50 backdrop-blur-md">
                          <ExternalLink className="w-4 h-4 text-[#00ff88]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 4: DOMAINS / VERTICALS - Single Row Vertical Rectangles */}
            <section className="pt-20 px-6 md:px-12 max-w-[1600px] w-full mx-auto">
              <div className="gsap-reveal mb-12 text-center md:text-left">
                <h2 className="text-xs text-[#00ff88] tracking-[0.3em] mb-4">02 // TECHNICAL DOMAINS</h2>
                <h3 className="text-4xl font-light">Where We <span className="font-bold">Operate</span></h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
                {[
                  { Icon: Code2, title: "Web Architecture", desc: "Building highly scalable, distributed microservices and robust user portals." },
                  { Icon: Cpu, title: "Native Mobile", desc: "Developing intuitive, high-performance iOS and Android applications." },
                  { Icon: Shield, title: "Cybersecurity", desc: "Ensuring strict data integrity, pentesting, and robust security protocols." },
                  { Icon: Users, title: "UI / UX Design", desc: "Crafting seamless, accessible, and highly engaging user experiences." }
                ].map((v, i) => {
                  const Icon = v.Icon;
                  return (
                    <div 
                      key={i} 
                      className="gsap-reveal bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[#00ff88]/50 shadow-[0_0_20px_rgba(5,5,5,1)] hover:shadow-[0_15px_30px_rgba(0,255,136,0.15)] transform-gpu cursor-pointer flex flex-col h-[420px]"
                      onMouseEnter={() => playSound('glitch')}
                    >
                      <div className="mb-auto">
                        <Icon className="w-12 h-12 text-[#00ff88] mb-8 opacity-70" strokeWidth={1.5} />
                        <h4 className="text-2xl font-bold mb-4 leading-tight">{v.title}</h4>
                      </div>
                      <p className="text-white/60 leading-relaxed mt-4">{v.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* UNIFIED ROADMAP WRAPPER FOR PERFECT CURVE MAPPING */}
            <div className="relative w-full" ref={roadmapWrapperRef}>
              
              {/* Dynamic Single SVG connecting "?" to the bottom of the Timeline */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                 <defs>
                   <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                     <feGaussianBlur stdDeviation="8" result="blur" />
                     <feMerge>
                       <feMergeNode in="blur" />
                       <feMergeNode in="SourceGraphic" />
                     </feMerge>
                   </filter>
                 </defs>

                 {/* Background Curve Track */}
                 <path 
                    d={curveData.combined} 
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth={curveData.strokeWidth} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                 />
                 
                 {/* Foreground Animated Curve - ONE single path meaning ZERO joints or overlaps! */}
                 <path 
                    ref={combinedPathRef} 
                    d={curveData.combined} 
                    fill="none" 
                    stroke="#00ff88" 
                    strokeWidth={curveData.strokeWidth} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#neonGlow)"
                 />
              </svg>

              {/* SECTION 5: WHY SHOULD YOU JOIN US - TYPING HEADER */}
              <section className="min-h-screen flex items-center justify-center text-center pb-0 px-6 md:px-12 w-full relative z-20">
                <h2 
                  ref={joinUsRef}
                  className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl flex flex-wrap justify-center gap-x-[0.25em]"
                >
                  {"WHY SHOULD YOU JOIN US".split(' ').map((word, i) => (
                    <span key={i} className="inline-block whitespace-nowrap">
                      {word.split('').map((char, j) => (
                        <span key={`char-${i}-${j}`} className="char inline-block text-white opacity-0">{char}</span>
                      ))}
                    </span>
                  ))}
                  <span className="inline-block whitespace-nowrap">
                    <span 
                      ref={qMarkRef}
                      className="char inline-block opacity-0 text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                    >
                      ?
                    </span>
                  </span>
                </h2>
              </section>

              {/* SECTION 5.1: WHY SHOULD YOU JOIN US - DYNAMIC ROADMAP TIMELINE */}
              <section className="pt-0 pb-10 relative z-10 px-6 md:px-12 max-w-[1200px] w-full mx-auto" ref={timelineRef}>
                <div className="relative max-w-4xl mx-auto pt-20 pb-10">
                   {/* Reference element replacing the old HTML background line. Used strictly for mapping coordinates safely. */}
                   <div ref={timelineBgRef} className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[6px] opacity-0 pointer-events-none md:-translate-x-1/2"></div>
                   
                   {/* Timeline Nodes */}
                   {[
                     { title: "Real-World Scale", text: "Move beyond sandbox projects. Build, deploy, and scale enterprise-grade applications that thousands of students rely on daily." },
                     { title: "Elite Mentorship", text: "Operate like a top-tier tech agency. Experience rigorous code reviews, agile workflows, and CI/CD pipelines guided by senior architects." },
                     { title: "Modern Tech Stack", text: "No legacy boilerplate. We engineer solutions using bleeding-edge tools like React, Next.js, Go, Docker, and AWS." },
                     { title: "Zero to One Ownership", text: "Don't just fix bugs. Pitch ideas, design architectures, and take complete ownership of products from ideation to deployment." },
                     { title: "Campus Impact", text: "Solve the exact problems you and your friends face. Your code will tangibly improve the daily university experience for everyone." },
                     { title: "The Alumni Network", text: "Join a tight-knit collective. Our alumni network spans top tech giants, providing unparalleled mentorship, mock interviews, and direct referrals." }
                   ].map((r, i) => (
                     <div key={i} className="relative flex items-center justify-end md:justify-between md:odd:flex-row-reverse group mb-12 roadmap-node">
                        {/* Dynamic Connector Dot */}
                        <div className="timeline-dot absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-20 transition-colors duration-300"></div>
                        
                        {/* Content Card */}
                        <div className="w-[calc(100%-3rem)] md:w-[45%]">
                           <div 
                              className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-2xl hover:border-[#00ff88]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,255,136,0.15)]"
                              onMouseEnter={() => playSound('glitch')}
                           >
                              <h4 className="text-xl md:text-2xl font-bold text-[#00ff88] mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>{r.title}</h4>
                              <p className="text-white/60 text-sm md:text-base leading-relaxed">{r.text}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </section>

              {/* SECTION 5.2: RECRUITMENT CTA BUTTON */}
              <section className="relative z-20 flex justify-center pb-20 px-6 w-full">
                 <button
                   ref={ctaButtonRef}
                   onClick={() => { setCurrentPage('recruitment'); window.scrollTo(0,0); playSound('glitch'); }}
                   className="btn-glitch group relative px-12 py-6 bg-[#0a0a0a] border border-[#00ff88]/50 rounded-full overflow-hidden hover:bg-[#00ff88]/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.15)] hover:shadow-[0_0_40px_rgba(0,255,136,0.4)]"
                   onMouseEnter={() => playSound('tone')}
                 >
                   <span className="glitch-target text-[#00ff88] font-bold tracking-[0.3em] text-sm md:text-base uppercase" data-text="SIGN UP FOR RECRUITMENT">SIGN UP FOR RECRUITMENT</span>
                 </button>
              </section>
            </div>

            {/* SECTION 6: THE TEAM (Now a seamlessly scrolling Marquee!) */}
            <section id="team" className="pt-10 pb-10 relative z-10 w-full overflow-hidden">
              <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12 flex justify-between items-end">
                 <div>
                   <h2 className="text-xs text-[#00ff88] tracking-[0.3em] mb-4">03 // THE ARCHITECTS</h2>
                   <h3 className="text-4xl font-light">Meet the <span className="font-bold">Core Team</span></h3>
                 </div>
                 <button 
                    className="btn-glitch hidden md:flex items-center gap-2 text-xs tracking-widest border-b border-white/20 pb-1 hover:text-[#00ff88] hover:border-[#00ff88] transition-colors"
                    onMouseEnter={() => playSound('glitch')}
                 >
                    <span className="glitch-target" data-text="VIEW FULL ROSTER">VIEW FULL ROSTER</span> <ArrowRight className="w-3 h-3" />
                 </button>
              </div>

              {/* The Team Marquee Wrapper */}
              <div className="marquee-container py-4">
                 {/* Duplicate the team array to create a seamless infinite scrolling loop */}
                 <div className="marquee-content items-center gap-6 px-3" style={{ animationDuration: '40s' }}>
                   {[...teamMembers, ...teamMembers].map((member, i) => (
                     <div 
                       key={i} 
                       className="w-[280px] md:w-[320px] flex-shrink-0 group relative cursor-pointer"
                       onMouseEnter={() => playSound('tone')}
                     >
                       <div className="aspect-[4/5] rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg">
                          <img 
                            src={member.img} 
                            alt="Team member" 
                            className="w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90"></div>
                          
                          <div className="absolute bottom-6 left-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                             <div className="font-bold text-lg mb-1">{member.name}</div>
                             <div className="text-[10px] tracking-widest text-[#00ff88]">{member.role}</div>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </section>

            {/* SECTION 7: REVIEWS (Now a seamlessly scrolling Marquee!) */}
            <section className="pt-32 pb-10 relative z-10 w-full overflow-hidden">
               <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12 text-center md:text-left">
                <h2 className="text-xs text-[#00ff88] tracking-[0.3em] mb-4">04 // COMMUNITY FEEDBACK</h2>
                <h3 className="text-4xl font-light">Campus <span className="font-bold">Testimonials</span></h3>
              </div>
              
              <div className="marquee-container py-4">
                 <div className="marquee-content items-center gap-6 px-3" style={{ animationDuration: '45s' }}>
                   {[...testimonialsData, ...testimonialsData].map((review, i) => {
                     const Icon = review.Icon;
                     return (
                       <div key={i} className="w-[300px] md:w-[400px] flex-shrink-0 bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl relative hover:border-[#00ff88]/30 transition-colors shadow-lg whitespace-normal" onMouseEnter={() => playSound('tone')}>
                         <div className="text-6xl text-[#00ff88]/20 absolute top-4 left-4 font-serif">"</div>
                         <p className="relative z-10 text-sm leading-relaxed mb-8 opacity-70 mt-4">"{review.quote}"</p>
                         <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                           <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-[#00ff88]" />
                           </div>
                           <span className="font-bold text-[10px] uppercase tracking-widest text-white/80">{review.author}</span>
                         </div>
                       </div>
                     )
                   })}
                 </div>
              </div>
            </section>

            {/* SECTION 8: WHAT SHOULD WE BUILD NEXT (GEMINI API) */}
            <section id="ai" className="pt-10 pb-10 relative z-10 px-6 md:px-12 max-w-[1000px] w-full mx-auto">
              <div className="w-full">
                <div className="gsap-reveal bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-16 shadow-[0_0_50px_rgba(0,255,136,0.03)] relative overflow-hidden">
                  
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent"></div>

                  <div className="text-center mb-10">
                    <h3 className="text-4xl font-light">What Should We <span className="font-bold">Build Next?</span></h3>
                    <p className="text-white/40 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
                      Got an idea that could revolutionize campus life? Pitch your concept below, and our system will generate a professional project blueprint.
                    </p>
                  </div>

                  <div className="flex flex-col gap-6">
                    {!aiResponse ? (
                      <>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88]/20 to-[#00b8ff]/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                          <textarea 
                            value={campusProblem}
                            onChange={(e) => setCampusProblem(e.target.value)}
                            placeholder="e.g., An automated class schedule optimizer that syncs directly with Google Calendar..."
                            className="relative w-full h-40 bg-[#050505] border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none text-sm leading-relaxed"
                          />
                        </div>
                        <button 
                          onClick={generateProjectSpec}
                          disabled={isGeneratingAi || !campusProblem.trim()}
                          className="w-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed py-5 rounded-2xl font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-3 transition-all duration-300"
                          onMouseEnter={() => playSound('glitch')}
                        >
                          {isGeneratingAi ? (
                            <>PROCESSING <Loader2 className="w-5 h-5 animate-spin" /></>
                          ) : (
                            <span className="font-bold tracking-widest text-sm uppercase">SUBMIT MY IDEA ✨</span>
                          )}
                        </button>
                        {aiError && <p className="text-red-400 text-center text-xs mt-2">{aiError}</p>}
                      </>
                    ) : (
                      <div className="bg-[#050505] border border-[#00ff88]/20 rounded-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
                        <h4 className="text-[#00ff88] font-bold mb-4 flex items-center gap-2 pb-4 border-b border-[#00ff88]/20">
                          <Lightbulb className="w-5 h-5" /> IDEA ACCEPTED. BLUEPRINT GENERATED.
                        </h4>
                        <div className="text-white/80 whitespace-pre-wrap leading-loose text-sm mt-6">
                          {aiResponse}
                        </div>
                        
                        {/* New Save/Vote Interaction Panel */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-6 border-t border-[#00ff88]/10">
                          <button 
                            onClick={() => { setAiIdeaSaved(true); playSound('tone'); }}
                            className={`flex-1 border ${aiIdeaSaved ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]' : 'border-white/20 hover:bg-white/10'} px-6 py-4 rounded-xl text-xs transition-colors tracking-widest uppercase flex items-center justify-center gap-2`}
                          >
                            <Save className="w-4 h-4" /> {aiIdeaSaved ? 'BLUEPRINT SAVED' : 'SAVE IDEA'}
                          </button>
                          <button 
                            onClick={() => { setAiIdeaVoted(true); playSound('tone'); }}
                            className={`flex-1 border ${aiIdeaVoted ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]' : 'border-white/20 hover:bg-white/10'} px-6 py-4 rounded-xl text-xs transition-colors tracking-widest uppercase flex items-center justify-center gap-2`}
                          >
                            <ThumbsUp className="w-4 h-4" /> {aiIdeaVoted ? 'VOTE RECORDED' : 'VOTE UP'}
                          </button>
                          <button 
                            onClick={() => { setAiResponse(''); setCampusProblem(''); setAiIdeaSaved(false); setAiIdeaVoted(false); playSound('glitch'); }}
                            className="flex-1 border border-white/20 px-6 py-4 rounded-xl text-xs hover:bg-white/10 transition-colors tracking-widest uppercase"
                          >
                            SUBMIT ANOTHER
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* --- NEW DEMO SUGGESTIONS (COMMUNITY PIPELINE) - Scrolling Marquee --- */}
                  <div className="mt-16 border-t border-white/10 pt-12 overflow-hidden w-[100vw] relative left-1/2 -translate-x-1/2">
                     <h4 className="text-center text-xs tracking-[0.3em] text-[#00ff88] mb-8 font-bold flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" /> COMMUNITY PIPELINE
                     </h4>
                     
                     <div className="marquee-container pb-8">
                        <div className="marquee-content items-center gap-6 px-3" style={{ animationDuration: '35s' }}>
                           {[...demoIdeas, ...demoIdeas].map((idea, idx) => (
                              <div key={`${idea.id}-${idx}`} className="w-[280px] md:w-[350px] flex-shrink-0 bg-[#050505] border border-white/5 rounded-2xl p-6 hover:border-[#00ff88]/30 transition-colors flex flex-col h-full group shadow-[0_0_20px_rgba(0,0,0,0.5)] whitespace-normal" onMouseEnter={() => playSound('tone')}>
                                 <h5 className="font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">{idea.title}</h5>
                                 <p className="text-white/50 text-xs leading-relaxed mb-6 flex-1">{idea.desc}</p>
                                 <button 
                                   onClick={() => handleVote(idea.id)}
                                   className={`flex items-center justify-center gap-2 text-xs font-bold tracking-widest px-4 py-2 rounded-lg transition-all w-max ${idea.userVoted ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                                 >
                                   <ThumbsUp className={`w-3 h-3 ${idea.userVoted ? 'fill-current' : ''}`} /> 
                                   {idea.votes}
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION 9: TOOLS WE USE & WHO WE WORK WITH (SCROLLING LOGOS) */}
            <section className="pt-10 overflow-hidden relative z-10 w-full pb-20">
              <div className="relative border-y border-white/10 pt-6 pb-6 bg-[#0a0a0a]/50 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                
                {/* --- NEW CORNER LABELS --- */}
                <div className="w-full px-6 md:px-12 text-sm md:text-base pb-4 tracking-[0.2em] text-[#00ff88]/60 font-bold z-20 mb-4">
                  Tools We Use
                </div>

                <div className="marquee-container opacity-50 mb-10">
                  <div className="marquee-content-reverse items-center gap-16 px-8 text-2xl font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-4"><Code2 className="w-6 h-6 text-[#00ff88]"/> REACT</span>
                    <span className="flex items-center gap-4"><Terminal className="w-6 h-6 text-[#00ff88]"/> NODE.JS</span>
                    <span className="flex items-center gap-4"><Cpu className="w-6 h-6 text-[#00ff88]"/> NEXT.JS</span>
                    <span className="flex items-center gap-4"><Shield className="w-6 h-6 text-[#00ff88]"/> TYPESCRIPT</span>
                    <span className="flex items-center gap-4"><Zap className="w-6 h-6 text-[#00ff88]"/> GO</span>
                    <span className="flex items-center gap-4"><Code2 className="w-6 h-6 text-[#00ff88]"/> DOCKER</span>
                    <span className="flex items-center gap-4"><Terminal className="w-6 h-6 text-[#00ff88]"/> AWS</span>
                    <span className="flex items-center gap-4"><Cpu className="w-6 h-6 text-[#00ff88]"/> POSTGRESQL</span>

                    <span className="flex items-center gap-4"><Code2 className="w-6 h-6 text-[#00ff88]"/> REACT</span>
                    <span className="flex items-center gap-4"><Terminal className="w-6 h-6 text-[#00ff88]"/> NODE.JS</span>
                    <span className="flex items-center gap-4"><Cpu className="w-6 h-6 text-[#00ff88]"/> NEXT.JS</span>
                    <span className="flex items-center gap-4"><Shield className="w-6 h-6 text-[#00ff88]"/> TYPESCRIPT</span>
                    <span className="flex items-center gap-4"><Zap className="w-6 h-6 text-[#00ff88]"/> GO</span>
                    <span className="flex items-center gap-4"><Code2 className="w-6 h-6 text-[#00ff88]"/> DOCKER</span>
                    <span className="flex items-center gap-4"><Terminal className="w-6 h-6 text-[#00ff88]"/> AWS</span>
                    <span className="flex items-center gap-4"><Cpu className="w-6 h-6 text-[#00ff88]"/> POSTGRESQL</span>
                  </div>
                </div>

                <div className="marquee-container opacity-30">
                  <div className="marquee-content items-center gap-16 px-8 text-xl font-bold tracking-widest uppercase">
                    <span>University Admin</span> <span className="text-[#00ff88]">•</span>
                    <span>Computer Science Dept</span> <span className="text-[#00ff88]">•</span>
                    <span>Alumni Association</span> <span className="text-[#00ff88]">•</span>
                    <span>Sports Council</span> <span className="text-[#00ff88]">•</span>
                    
                    <span>University Admin</span> <span className="text-[#00ff88]">•</span>
                    <span>Computer Science Dept</span> <span className="text-[#00ff88]">•</span>
                    <span>Alumni Association</span> <span className="text-[#00ff88]">•</span>
                    <span>Sports Council</span> <span className="text-[#00ff88]">•</span>
                  </div>
                </div>

                <div className="w-full px-6 md:px-12 text-sm md:text-base pt-4 tracking-[0.2em] text-[#00ff88]/60 font-bold z-20 mt-6 text-right">
                  Who We Work With
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* FOOTER (With Socials Integrated) */}
      <footer id="contact" className="border-t border-white/5 pt-20 pb-12 text-center bg-[#030303] relative z-10 w-full mt-auto">
        {/* Socials Block */}
        <div className="gsap-reveal max-w-[1000px] mx-auto px-6 md:px-12 mb-16 text-center">
           <h2 className="text-xs text-[#00ff88] tracking-[0.4em] mb-4 font-bold uppercase">Initiate Comms</h2>
           <h3 className="text-4xl md:text-5xl font-light mb-12">Connect With <span className="font-bold">The Network</span></h3>
           
           <div className="flex flex-wrap justify-center gap-6 md:gap-8">
             {[
               { icon: Github, name: "GitHub", href: "#" },
               { icon: Linkedin, name: "LinkedIn", href: "#" },
               { icon: Twitter, name: "Twitter / X", href: "#" },
               { icon: Instagram, name: "Instagram", href: "#" },
               { icon: MessageSquare, name: "Discord", href: "#" },
               { icon: Mail, name: "Email", href: "#" }
             ].map((social, i) => (
               <a key={i} href={social.href} className="group relative w-14 h-14 md:w-16 md:h-16 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center hover:border-[#00ff88]/50 hover:-translate-y-2 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(0,255,136,0.2)]" onMouseEnter={() => playSound('tone')}>
                 <social.icon className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-[#00ff88] transition-colors" />
                 <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] tracking-widest text-[#00ff88] transition-opacity whitespace-nowrap">{social.name}</div>
               </a>
             ))}
           </div>
        </div>

        {/* Copyright Block */}
        <div className="flex flex-col items-center justify-center text-white/30 text-[10px] tracking-widest gap-4 border-t border-white/5 pt-12">
          <SuttLogo className="w-8 h-8 opacity-40 grayscale" hoverable={true} />
          <p>SYSTEMS OPERATIONAL // © {new Date().getFullYear()} SUTT</p>
        </div>
      </footer>

    </div>
  );
}