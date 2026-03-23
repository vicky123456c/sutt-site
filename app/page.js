"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, Code2, Cpu, Shield, Users, ChevronDown, 
  Volume2, VolumeX, ArrowRight, ExternalLink, Sparkles, Loader2, Zap, Vote, BookOpen, GraduationCap, Lightbulb
} from 'lucide-react';

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

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadText, setLoadText] = useState("INITIALIZING KERNEL...");
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [curveData, setCurveData] = useState({ d: "", strokeWidth: 6 });
  
  // AI Feature State
  const [campusProblem, setCampusProblem] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  const containerRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  const typeTextRef = useRef(null);
  const joinUsRef = useRef(null);
  const roadmapWrapperRef = useRef(null);
  const qMarkRef = useRef(null);
  const timelineRef = useRef(null);
  const timelineCurveRef = useRef(null);
  const timelineLineRef = useRef(null);
  const audioCtxRef = useRef(null);

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

  // --- GEMINI API INTEGRATION ---
  const generateProjectSpec = async () => {
    if (!campusProblem.trim()) return;
    setIsGeneratingAi(true);
    setAiResponse('');
    setAiError('');
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
    if (!roadmapWrapperRef.current || !qMarkRef.current || !timelineLineRef.current) return;
    
    // Get absolute screen coordinates for our anchor points
    const wrapperRect = roadmapWrapperRef.current.getBoundingClientRect();
    const qRect = qMarkRef.current.getBoundingClientRect();
    const tRect = timelineLineRef.current.getBoundingClientRect();

    // Map screen coordinates relative to our SVG wrapper
    const startX = qRect.left + (qRect.width / 2) - wrapperRect.left;
    const startY = qRect.bottom - wrapperRect.top;
    const endX = tRect.left + (tRect.width / 2) - wrapperRect.left;
    const endY = tRect.top - wrapperRect.top;

    // Create a smooth S-curve connecting the tail of the "?" directly to the top of the timeline
    const cp1X = startX;
    const cp1Y = startY + (endY - startY) / 2;
    const cp2X = endX;
    const cp2Y = startY + (endY - startY) / 2;

    setCurveData({
      d: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
      strokeWidth: 6 // Match timeline line width
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    updateCurve();
    window.addEventListener('resize', updateCurve);
    setTimeout(updateCurve, 500); // Recalculate after fonts render
    return () => window.removeEventListener('resize', updateCurve);
  }, [updateCurve, loading]);


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
      
      if (canvas.style.opacity !== '0.4') {
        canvas.style.opacity = '0.4';
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

    // Original Restored "We Don't Just Write Code" Typing Effect - Dull Grey
    if (typeTextRef.current) {
      const chars = typeTextRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        { color: '#222222', opacity: 0.05 }, // Decreased initial opacity and brightness
        {
          color: '#aaaaaa', // Increased final brightness to be more visible
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: typeTextRef.current,
            start: "top 80%",
            end: "center 50%", // Now finishes exactly when reaching the middle of the screen
            scrub: 0.5,
          }
        }
      );
    }

    // "WHY SHOULD YOU JOIN US?" Typing Effect
    if (joinUsRef.current) {
      const chars = joinUsRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        { opacity: 0.05 }, // Decreased initial opacity
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: joinUsRef.current,
            start: "top 80%",
            end: "center 50%", // Now finishes exactly when reaching the middle of the screen
            scrub: 0.5,
          }
        }
      );
    }

    // Dynamic Timeline Curve Connection
    if (timelineCurveRef.current) {
      gsap.fromTo(timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 40%", 
            end: "bottom 60%",
            scrub: true
          }
        }
      );
    }

    // Dynamic Timeline Dots Lighting Up
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

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [libsLoaded, loading]);

  // Handle SVG Curve Animation safely after coordinates map
  useEffect(() => {
    if (loading || !libsLoaded || !window.gsap || !curveData.d || !timelineCurveRef.current) return;
    const gsap = window.gsap;
    
    const pathLength = timelineCurveRef.current.getTotalLength();
    gsap.set(timelineCurveRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    
    const curveAnim = gsap.to(timelineCurveRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: joinUsRef.current,
        start: "center center",
        end: "bottom 20%",
        scrub: true
      }
    });

    return () => {
      if (curveAnim.scrollTrigger) curveAnim.scrollTrigger.kill();
      curveAnim.kill();
    }
  }, [curveData.d, libsLoaded, loading]);

  // --- 3D TILT HANDLERS ---
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
        
        .btn-glitch { position: relative; transition: all 0.3s ease; cursor: pointer; }
        .glitch-target { position: relative; display: inline-block; }
        .btn-glitch:hover .glitch-target::before, .btn-glitch:hover .glitch-target::after {
          content: attr(data-text); position: absolute; top: 0; opacity: 1; pointer-events: none;
        }
        .btn-glitch:hover .glitch-target::before {
          left: -2px; color: #00ff88; text-shadow: 2px 0 #00ff88; z-index: 10;
          animation: glitch-anim-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate-reverse;
        }
        .btn-glitch:hover .glitch-target::after {
          left: 2px; color: #ff00ea; text-shadow: -2px 0 #ff00ea; z-index: -1;
          animation: glitch-anim-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate-reverse;
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
          20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 1px); }
          40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); }
          60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); }
          100% { clip-path: inset(5% 0 80% 0); transform: translate(-1px, 1px); }
        }

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

      {/* --- GLASS HEADER --- */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
        <div className="font-bold text-lg tracking-widest flex items-center gap-4">
          <SuttLogo className="w-8 h-8" hoverable={true} />
          <span style={{ fontFamily: "'Orbitron', sans-serif" }}>SUTT</span>
        </div>
        <div className="flex items-center gap-8 text-xs tracking-widest text-white/70">
          <button 
            onClick={() => { initAudio(); setSoundEnabled(!soundEnabled); }} 
            className="hover:text-[#00ff88] transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4"/> : <VolumeX className="w-4 h-4"/>}
          </button>
          <a href="#projects" className="hidden md:block hover:text-white transition-colors btn-glitch" onMouseEnter={() => playSound('glitch')}>
            <span className="glitch-target" data-text="PROJECTS">PROJECTS</span>
          </a>
          <a href="#team" className="hidden md:block hover:text-white transition-colors btn-glitch" onMouseEnter={() => playSound('glitch')}>
            <span className="glitch-target" data-text="TEAM">TEAM</span>
          </a>
          <button 
            className="btn-glitch border border-white/20 px-6 py-2 rounded-full hover:border-[#00ff88] hover:text-[#00ff88] transition-colors bg-white/5"
            onMouseEnter={() => playSound('glitch')}
          >
            <span className="glitch-target" data-text="CONTACT">CONTACT</span>
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 w-full flex flex-col gap-24 md:gap-32 pb-32">
        
        {/* SECTION 1: HERO */}
        <section className="h-screen flex flex-col items-center justify-center relative px-6 md:px-12 w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] text-center font-black text-[20vw] leading-[0.85] tracking-widest opacity-5 blur-sm select-none pointer-events-none flex flex-col">
            <span>BUILD</span>
            <span>INNOVATE</span>
          </div>
          
          <div className="z-10 flex flex-col items-center text-center">
            <div className="mb-10 p-2">
              <SuttLogo className="w-20 h-20" hoverable={true} />
            </div>
            
            <h1 
              className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50"
              style={{ 
                fontFamily: "'Orbitron', sans-serif",
                filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.8)) drop-shadow(0px 4px 4px rgba(0,0,0,0.5))' 
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
        {/* User request: Bring back the original version where it's just plain text wrapping naturally, and colored dull grey */}
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

        {/* SECTION 3: IMMERSIVE PROJECTS */}
        <section id="projects" className="pt-20 px-6 md:px-12 max-w-[1600px] w-full mx-auto">
          <div className="gsap-reveal mb-12 text-center md:text-left">
            <h2 className="text-xs text-[#00ff88] tracking-[0.3em] mb-4">01 // OPEN SOURCE DEPLOYS</h2>
            <h3 className="text-4xl font-light"><span className="font-bold">Our Projects</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                title: "Campus Nav API", tags: ["Go", "Mapbox", "Redis"], 
                desc: "Real-time routing engine handling 5k requests/min for the official university app.",
                img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              },
              { 
                title: "SU Voting Platform", tags: ["Next.js", "Web3 Auth"], 
                desc: "Cryptographically secure election portal replacing legacy paper systems.",
                img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
              },
              { 
                title: "Event Ticketing Node", tags: ["Node.js", "PostgreSQL"], 
                desc: "High-throughput microservice for instantaneous campus concert booking.",
                img: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80"
              },
              { 
                title: "Room Booking UI", tags: ["React", "Tailwind"], 
                desc: "Fluid, state-driven interface integrating with the legacy library database.",
                img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
              }
            ].map((proj, i) => {
              return (
                <div 
                  key={i} 
                  className="gsap-reveal tilt-card group relative h-[400px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer shadow-lg"
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                  onMouseEnter={() => playSound('tone')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-10"
                    style={{ backgroundImage: `url(${proj.img})` }}
                  ></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
                  
                  <div className="tilt-card-content absolute inset-0 p-8 flex flex-col justify-end transition-all duration-500">
                    <div className="transform group-hover:-translate-y-[140px] transition-transform duration-500 ease-out">
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
                    </div>

                    <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 bg-[#050505]/50 backdrop-blur-md">
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
          
          {/* Changed to lg:grid-cols-4 for a single row on desktop */}
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
                  // Added flex flex-col and h-[420px] to enforce a vertical rectangular shape
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
          
          {/* Dynamic SVG Curve connecting "?" to the Timeline Line */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
             <path 
                ref={timelineCurveRef} 
                d={curveData.d} 
                fill="none" 
                stroke="#00ff88" 
                strokeWidth={curveData.strokeWidth} 
                strokeLinecap="round"
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
            <div className="relative max-w-4xl mx-auto pt-20">
               {/* Background Timeline Line */}
               <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[6px] rounded-full bg-white/10 md:-translate-x-1/2"></div>
               
               {/* Dynamic Filling Timeline Line */}
               <div 
                 ref={timelineLineRef} 
                 className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[6px] rounded-full bg-[#00ff88] md:-translate-x-1/2 origin-top shadow-[0_0_10px_#00ff88] z-10"
               ></div>
               
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
                    {/* Dynamic Connector Dot (Sized perfectly over the 6px line) */}
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
        </div>

        {/* SECTION 6: THE TEAM */}
        <section id="team" className="pt-10 relative z-10 px-6 md:px-12 max-w-[1600px] w-full mx-auto">
          <div className="gsap-reveal mb-12 text-center md:text-left flex justify-between items-end">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Alex Chen', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
              { name: 'Samantha Lee', role: 'UI/UX Lead', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
              { name: 'Jordan Davis', role: 'Systems Architect', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
              { name: 'Priya Sharma', role: 'Security Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' }
            ].map((member, i) => (
              <div 
                key={i} 
                className="gsap-reveal group relative cursor-pointer"
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
        </section>

        {/* SECTION 7: REVIEWS */}
        <section className="pt-20 pb-10 relative z-10 px-6 md:px-12 max-w-[1600px] w-full mx-auto">
           <div className="gsap-reveal mb-12 text-center md:text-left">
            <h2 className="text-xs text-[#00ff88] tracking-[0.3em] mb-4">04 // COMMUNITY FEEDBACK</h2>
            <h3 className="text-4xl font-light">Campus <span className="font-bold">Testimonials</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "The new voting portal handled 10,000 concurrent users without a single dropped connection. Incredible engineering.", author: "Elections Commissioner", Icon: Vote },
              { quote: "Their UI/UX team completely transformed how students interact with the library booking system.", author: "Head Librarian", Icon: BookOpen },
              { quote: "A dedicated group of developers who operate like a professional agency right here on campus.", author: "Dean of Students", Icon: GraduationCap }
            ].map((review, i) => {
              const Icon = review.Icon;
              return (
                <div key={i} className="gsap-reveal bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl relative hover:border-[#00ff88]/30 transition-colors shadow-lg">
                  <div className="text-6xl text-[#00ff88]/20 absolute top-4 left-4 font-serif">"</div>
                  <p className="relative z-10 text-sm leading-relaxed mb-8 opacity-70 mt-4">"{review.quote}"</p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                       <Icon className="w-4 h-4 text-[#00ff88]" />
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-widest text-white/80">{review.author}</span>
                  </div>
                </div>
              )
            })}
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
                        <>SUBMIT MY IDEA ✨</>
                      )}
                    </button>
                    {aiError && <p className="text-red-400 text-center text-xs mt-2">{aiError}</p>}
                  </>
                ) : (
                  <div className="bg-[#050505] border border-[#00ff88]/20 rounded-2xl p-8 animate-[fadeIn_0.5s_ease-out]">
                    <h4 className="text-[#00ff88] font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" /> IDEA ACCEPTED. BLUEPRINT GENERATED.
                    </h4>
                    <div className="text-white/80 whitespace-pre-wrap leading-loose text-sm">
                      {aiResponse}
                    </div>
                    <button 
                      onClick={() => { setAiResponse(''); setCampusProblem(''); }}
                      className="mt-8 border border-white/20 px-6 py-3 rounded-full text-xs hover:bg-white/10 transition-colors tracking-widest"
                    >
                      SUBMIT ANOTHER
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: TOOLS WE USE & WHO WE WORK WITH (SCROLLING LOGOS) */}
        <section className="pt-10 overflow-hidden relative z-10 w-full">
          <div className="relative border-y border-white/10 py-10 bg-[#0a0a0a]/50 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            
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
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#030303] relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-white/30 text-[10px] tracking-widest gap-4">
          <SuttLogo className="w-8 h-8 opacity-40 grayscale" hoverable={true} />
          <p>SYSTEMS OPERATIONAL // © {new Date().getFullYear()} SUTT</p>
        </div>
      </footer>

    </div>
  );
}