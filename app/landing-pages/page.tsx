'use client'

import { useEffect, useState, useRef } from 'react'

export default function MasumaPage() {
  const [countdown, setCountdown] = useState('Loading…')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleSubmit = () => {
    const { name, phone, email } = formData
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and WhatsApp number.')
      return
    }
    const message = `🌸 *New Enquiry – Pain to Power Coaching*\n\n👤 *Name:* ${name}\n📱 *WhatsApp:* ${phone}\n📧 *Email:* ${email || 'Not provided'}\n\n_Sent from the website form_`
    const encodedMsg = encodeURIComponent(message)
    window.open(`https://wa.me/918700297752?text=${encodedMsg}`, '_blank')
  }

  useEffect(() => {
    const target = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setCountdown('Starting now!')
        return
      }
      const dy = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(
        `${dy}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`,
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add('show')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.08 },
    )
    document
      .querySelectorAll('.reveal,.reveal-left,.reveal-right')
      .forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i)

  const faqs = [
    {
      icon: 'ti-heart-rate-monitor',
      q: "I've tried therapy. How is this different?",
      a: 'This is coaching, not therapy. We focus on your future, not just your past. We take action — not just awareness.',
    },
    {
      icon: 'ti-lock',
      q: "I'm very private. Will this be safe?",
      a: '100%. Everything shared in sessions stays between us. No recordings shared without your permission.',
    },
    {
      icon: 'ti-sparkles',
      q: 'Will this actually work for me?',
      a: 'If you show up and do the work — yes. Every person who has committed to these 4 weeks has walked away transformed.',
    },
    {
      icon: 'ti-clock',
      q: 'How much time do I need each week?',
      a: '1 live session per week (60 min) + optional journaling. Designed for busy people.',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Space+Grotesk:wght@300..700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --serif:'Space Grotesk',serif;
          --sans:'Inter',sans-serif;
          --bg:#f5f0e8;
          --surface:#e8dfd0;
          --surface-b:#d8cebc;
          --primary:#7a6a58;
          --primary-hover:#5c4a38;
          --primary-dark:#2c2218;
          --primary-mid:#5c4a38;
          --primary-muted:#b8a898;
          --primary-accent:#d8cebc;
          --primary-light:#e8dfd0;
          --cream:#faf8f4;
          --text:#2c2218;
          --gold:#c8a87a;
        }
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--bg);color:var(--text);overflow-x:hidden;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blobFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(24px,-24px) scale(1.06)}}
        @keyframes blobFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,18px) scale(1.04)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(200,168,122,0.5)}50%{box-shadow:0 0 0 12px rgba(200,168,122,0)}}
        @keyframes tagPulse{0%,100%{background:var(--gold);box-shadow:0 0 6px 2px rgba(200,168,122,0.5)}50%{background:#d4b88a;box-shadow:0 0 14px 5px rgba(200,168,122,0.3)}}
        @keyframes borderGlow{0%,100%{border-color:rgba(200,168,122,0.3)}50%{border-color:rgba(200,168,122,0.8)}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes offerPulse{0%,100%{box-shadow:0 0 0 0 rgba(200,168,122,0.5),0 20px 60px rgba(122,106,88,0.1)}60%{box-shadow:0 0 0 18px rgba(200,168,122,0),0 20px 60px rgba(122,106,88,0.1)}}
        @keyframes offerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes offerGlow{0%,100%{border-color:rgba(200,168,122,0.25)}50%{border-color:rgba(200,168,122,0.75)}}
        @keyframes svgFloat1{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
        @keyframes svgFloat2{0%,100%{transform:translateY(0px)}50%{transform:translateY(5px)}}
        @keyframes svgRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes svgPulse{0%,100%{opacity:0.6;r:4}50%{opacity:1;r:6}}
        @keyframes tagSlide{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
        @keyframes hlWord{0%,100%{opacity:1;transform:translateY(0) scale(1)}50%{opacity:0.85;transform:translateY(-4px) scale(1.02)}}
        @keyframes hlShimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes hlPop{0%,100%{letter-spacing:0.01em}50%{letter-spacing:0.04em}}
        @keyframes hlUnderline{0%,100%{width:0%}50%{width:100%}}
        @keyframes hlBlink{0%,100%{opacity:1}45%,55%{opacity:0.6}}

        /* OFFER HEADLINE */
        .offer-headline{display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:16px;line-height:1}
        .offer-hl-line1{font-family:var(--serif);font-size:clamp(22px,3.5vw,38px);font-weight:600;color:var(--primary-mid);animation:hlWord 4s ease-in-out infinite;animation-delay:0s}
        .offer-hl-line2{font-family:var(--serif);font-size:clamp(30px,5vw,58px);font-weight:700;color:var(--primary-dark);animation:hlPop 3s ease-in-out infinite;animation-delay:0.4s;position:relative;display:inline-block}
        .offer-hl-line2::after{content:'';position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);height:3px;background:var(--gold);border-radius:2px;animation:hlUnderline 3s ease-in-out infinite;animation-delay:0.4s}
        .offer-hl-line3{font-family:var(--serif);font-size:clamp(28px,4.5vw,52px);font-weight:700;background:linear-gradient(90deg,var(--primary-dark) 0%,var(--gold) 40%,#e8c88a 60%,var(--primary-dark) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:hlShimmer 2.8s linear infinite,hlBlink 4s ease-in-out infinite;animation-delay:0s,0.8s;font-style:italic}

        .a1{animation:fadeDown 0.7s ease both}
        .a2{animation:fadeUp 0.7s 0.15s ease both}
        .a3{animation:fadeUp 0.7s 0.25s ease both}
        .a4{animation:fadeUp 0.7s 0.35s ease both}
        .a5{animation:slideInRight 0.8s 0.2s ease both}
        .a6{animation:fadeUp 0.7s 0.5s ease both}

        .reveal{opacity:0;transform:translateY(36px);transition:opacity 0.8s cubic-bezier(0.4,0,0.2,1),transform 0.8s cubic-bezier(0.4,0,0.2,1)}
        .reveal.show{opacity:1;transform:translateY(0)}
        .reveal-left{opacity:0;transform:translateX(-36px);transition:opacity 0.8s ease,transform 0.8s ease}
        .reveal-left.show{opacity:1;transform:translateX(0)}
        .reveal-right{opacity:0;transform:translateX(36px);transition:opacity 0.8s ease,transform 0.8s ease}
        .reveal-right.show{opacity:1;transform:translateX(0)}
        .d1{transition-delay:0.1s}.d2{transition-delay:0.2s}.d3{transition-delay:0.3s}.d4{transition-delay:0.4s}.d5{transition-delay:0.5s}

        /* HERO */
        .hero{background:linear-gradient(135deg,#1e1208 0%,#2c1a0a 40%,#1a0e06 100%);padding:100px 40px 90px;position:relative;overflow:hidden;min-height:100vh;display:flex;align-items:center}
        .blob1{position:absolute;top:-80px;right:-80px;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(200,168,122,0.3) 0%,transparent 70%);animation:blobFloat 8s ease-in-out infinite;pointer-events:none}
        .blob2{position:absolute;bottom:-100px;left:-80px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(122,106,88,0.22) 0%,transparent 70%);animation:blobFloat2 10s ease-in-out infinite;pointer-events:none}
        .blob3{position:absolute;top:50%;left:30%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(180,140,80,0.1) 0%,transparent 70%);pointer-events:none}
        .hero-inner{position:relative;z-index:1;max-width:1100px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .hero-tag{display:inline-flex;align-items:center;gap:10px;background:rgba(232,223,208,0.1);border:1px solid rgba(232,223,208,0.2);color:var(--primary-light);border-radius:100px;padding:9px 20px 9px 12px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:28px;backdrop-filter:blur(10px)}
        .hero-tag-dot{width:10px;height:10px;border-radius:50%;animation:tagPulse 3s infinite;flex-shrink:0}
        .hero h1{font-family:var(--serif);font-size:clamp(36px,4.5vw,58px);font-weight:700;line-height:1.08;color:#faf8f4;margin-bottom:22px}
        .hero h1 em{color:var(--gold);font-style:italic;font-weight:600;display:block;margin-top:6px}
        .hero-sub{color:rgba(250,248,244,0.75);font-size:16px;font-weight:300;line-height:1.9;margin-bottom:12px}
        .hero-tagline{color:rgba(250,248,244,0.45);font-size:14px;font-style:italic;font-family:var(--serif);margin-bottom:40px;line-height:1.7}
        .hero-proof{display:flex;align-items:center;gap:20px;margin-bottom:36px;flex-wrap:wrap}
        .proof-item{display:flex;align-items:center;gap:8px;color:rgba(250,248,244,0.65);font-size:13px}
        .proof-icon{color:var(--gold);font-size:16px}
        .proof-divider{width:1px;height:20px;background:rgba(255,255,255,0.15)}
        .btn-hero{display:inline-flex;align-items:center;gap:10px;background:var(--gold);color:#1e1208;border:none;border-radius:4px;padding:18px 44px;font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;animation:pulse 3s infinite,floatY 6s ease-in-out infinite}
        .btn-hero:hover{background:#d4b88a;transform:translateY(-3px);box-shadow:0 12px 36px rgba(200,168,122,0.4)}
        .btn-hero i{font-size:18px}
        .coach-card{background:rgba(255,255,255,0.07);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.12);animation:borderGlow 4s infinite,floatY 6s ease-in-out infinite;position:relative}
        .coach-img{width:100%;aspect-ratio:3/4;border-radius:14px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
        .coach-img img{width:100%;height:100%;object-fit:cover;object-position:top}
        .coach-img::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(30,18,8,0.7));border-radius:14px}
        .coach-info{position:absolute;bottom:36px;left:36px;right:36px;z-index:2;background:rgba(30,18,8,0.6);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center}
        .coach-info-name{font-size:15px;color:#faf8f4;font-weight:600}
        .coach-info-role{font-size:11px;color:rgba(250,248,244,0.5);margin-top:2px;letter-spacing:0.05em}
        .coach-badge-live{background:rgba(200,168,122,0.2);border:1px solid rgba(200,168,122,0.4);border-radius:100px;padding:4px 12px;font-size:11px;color:var(--gold);font-weight:600;display:flex;align-items:center;gap:6px}
        .live-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:tagPulse 2s infinite}
        .cd-pill{display:inline-flex;align-items:center;gap:14px;background:rgba(255,255,255,0.07);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);border-radius:100px;padding:12px 24px;margin-top:18px;width:100%;justify-content:center}
        .cd-label{font-size:12px;color:rgba(250,248,244,0.55);font-weight:500;letter-spacing:0.05em}
        .cd-time{font-size:17px;font-weight:700;color:#faf8f4;letter-spacing:0.06em;font-family:var(--serif)}

        /* SECTIONS */
        .sec{padding:70px 40px}
        .sec-cream{background:var(--cream)}
        .sec-surface{background:var(--surface)}
        .sec-dark{background:var(--primary-dark)}
        .inner{max-width:1100px;margin:0 auto}
        .text-center{text-align:center}
        .divider{height:1px;background:var(--surface-b)}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--primary);border-radius:100px;padding:6px 18px;font-size:clamp(20px,5vw,40px);font-weight:700;text-transform:uppercase;margin-bottom:18px;font-family:var(--serif)}
        .eyebrow span{color:var(--primary-dark)}
        .sec-title{font-family:var(--serif);font-size:clamp(20px,4vw,30px);font-weight:600;color:var(--text);line-height:1.1;margin-bottom:16px}
        .sec-title em{color:var(--primary);font-style:italic}
        .sec-subtitle{font-size:16px;color:var(--primary-muted);line-height:1.7;max-width:600px;margin:0 auto 48px}
        .btn{display:inline-flex;align-items:center;gap:10px;background:var(--primary-dark);color:var(--cream);border:none;border-radius:4px;padding:16px 40px;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;animation:pulse 3s infinite,floatY 6s ease-in-out infinite}
        .btn:hover{background:var(--primary-hover);transform:translateY(-3px);box-shadow:0 10px 30px rgba(44,34,24,0.25)}
        .btn i{font-size:18px}

        /* PAIN */
        .pain-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:0 auto 44px;max-width:900px;list-style:none}
        .pain-card{display:flex;align-items:flex-start;gap:16px;background:#fff;border:1px solid var(--surface-b);border-radius:12px;padding:20px 22px;text-align:left;transition:all 0.3s;position:relative;overflow:hidden}
        .pain-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);opacity:0;transition:opacity 0.3s}
        .pain-card:hover{box-shadow:0 8px 32px rgba(122,106,88,0.12);transform:translateY(-2px)}
        .pain-card:hover::before{opacity:1}
        .pain-icon-wrap{width:40px;height:40px;border-radius:10px;background:var(--surface);border:1px solid var(--surface-b);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;color:var(--primary)}
        .pain-card h4{font-family:var(--sans);font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px}
        .pain-card p{font-size:13px;color:var(--primary-muted);line-height:1.65}

        /* STORY */
        .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1000px;margin:0 auto}
        .story-img-wrap{position:relative}
        .story-img{width:100%;aspect-ratio:4/5;border-radius:20px;background:linear-gradient(135deg,var(--surface) 0%,var(--primary-light) 100%);overflow:hidden;box-shadow:0 20px 60px rgba(44,34,24,0.12)}
        .story-img img{width:100%;height:100%;object-fit:cover;object-position:top}
        .story-badge{position:absolute;bottom:-20px;left:24px;right:24px;background:var(--primary-dark);border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 8px 32px rgba(0,0,0,0.2)}
        .story-badge-name{font-size:14px;color:#faf8f4;font-weight:600}
        .story-badge-role{font-size:11px;color:var(--primary-muted);margin-top:2px}
        .story-badge-cert{background:rgba(200,168,122,0.2);border:1px solid rgba(200,168,122,0.3);border-radius:100px;padding:5px 14px;font-size:11px;color:var(--gold);font-weight:600}
        .story-content{text-align:left}
        .story-quote{font-family:var(--serif);font-size:clamp(15px,1.8vw,18px);font-style:italic;color:var(--primary-mid);line-height:2;border-left:3px solid var(--gold);padding-left:24px;margin:24px 0}
        .story-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px}
        .stat-card{background:var(--cream);border:1px solid var(--surface-b);border-radius:12px;padding:16px;text-align:center}
        .stat-num{font-family:var(--serif);font-size:28px;font-weight:700;color:var(--primary-dark);margin-bottom:4px}
        .stat-label{font-size:11px;color:var(--primary-muted);letter-spacing:0.08em;text-transform:uppercase}

        /* WEEK CARD ILLUSTRATION */
        .week-illus{width:100%;height:140px;border-radius:12px;overflow:hidden;margin-bottom:20px;background:linear-gradient(135deg,var(--surface) 0%,var(--primary-light) 100%)}
        .week-illus svg{width:100%;height:100%}

        /* PROGRAM */
        .weeks-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:0 auto 24px;max-width:900px}
        .week-card{background:#fff;border:1px solid var(--surface-b);border-radius:16px;padding:28px 26px;text-align:left;position:relative;overflow:hidden;transition:all 0.3s;cursor:default}
        .week-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(122,106,88,0.12)}
        .week-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--primary));opacity:0;transition:opacity 0.3s}
        .week-card:hover::after{opacity:1}
        .week-num{font-size:11px;color:var(--primary-muted);font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:8px}
        .week-num i{font-size:14px;color:var(--gold)}
        .week-title{font-family:var(--serif);font-size:22px;font-weight:600;color:var(--text);margin-bottom:10px}
        .week-desc{font-size:14px;color:var(--primary);line-height:1.75}
        .includes-wrap{background:var(--surface);border:1px solid var(--surface-b);border-radius:16px;padding:24px 32px;display:flex;flex-wrap:wrap;justify-content:center;gap:24px;max-width:900px;margin:0 auto 36px}
        .inc-pill{display:flex;align-items:center;gap:8px;color:var(--primary-mid);font-size:14px;font-weight:500}
        .inc-pill i{font-size:16px;color:var(--primary)}

        /* SESSION DETAILS */
        .det-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:800px;margin:0 auto 40px}
        .det-card{background:#fff;border:1px solid var(--surface-b);border-radius:16px;padding:24px 22px;display:flex;align-items:center;gap:18px;transition:all 0.3s}
        .det-card:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(122,106,88,0.1)}
        .det-icon{width:52px;height:52px;border-radius:14px;background:var(--surface);border:1px solid var(--surface-b);display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--primary);flex-shrink:0}
        .det-label{font-size:11px;color:var(--primary-muted);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:5px}
        .det-val{font-size:16px;font-weight:600;color:var(--text)}

        /* TESTIMONIALS */
        .testi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:1000px;margin:0 auto 40px}
        .testi-card{background:#fff;border:1px solid var(--surface-b);border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:16px;transition:all 0.3s}
        .testi-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(122,106,88,0.1)}
        .testi-top{display:flex;align-items:center;gap:14px}
        .testi-av{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--surface),var(--primary-light));border:2px solid var(--surface-b);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:18px;font-weight:600;color:var(--primary);flex-shrink:0}
        .testi-name{font-size:15px;font-weight:700;color:var(--text)}
        .testi-city{font-size:12px;color:var(--primary-muted);display:flex;align-items:center;gap:4px;margin-top:2px}
        .testi-stars{display:flex;gap:2px;margin-left:auto}
        .testi-stars i{font-size:13px;color:var(--gold)}
        .testi-quote{font-family:var(--serif);font-size:14px;font-style:italic;color:var(--primary-mid);line-height:1.85;flex:1}
        .testi-result{background:var(--surface);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--primary-mid);font-weight:600;display:flex;align-items:center;gap:8px}
        .testi-result i{font-size:14px;color:var(--primary)}

        /* PRICING */
        .pricing-wrap{max-width:640px;margin:0 auto}
        .pricing-card{background:#fff;border:2px solid rgba(200,168,122,0.25);border-radius:20px;padding:40px;box-shadow:0 20px 60px rgba(122,106,88,0.1);animation:offerPulse 3s ease-in-out infinite,offerFloat 6s ease-in-out infinite,offerGlow 3s ease-in-out infinite}
        .pr-row{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--surface-b);gap:20px}
        .pr-row:last-of-type{border-bottom:none}
        .pr-row-left{display:flex;align-items:center;gap:14px}
        .pr-row-left i{font-size:22px;color:var(--primary);width:30px}
        .pr-label{color:var(--primary-mid);font-size:16px;font-weight:500}
        .pr-tag{background:var(--surface);border:1px solid var(--surface-b);border-radius:100px;padding:4px 14px;font-size:12px;font-weight:700;color:var(--primary);letter-spacing:0.08em;white-space:nowrap;flex-shrink:0;animation:tagSlide 3s ease-in-out infinite}
        .offer-urgency{margin-top:28px;background:linear-gradient(135deg,#1e1208,#2c1a0a);border-radius:12px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .offer-spots-label{font-size:12px;color:rgba(250,248,244,0.45);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px}
        .offer-spots-num{font-family:var(--serif);font-size:32px;font-weight:700;color:#faf8f4;line-height:1}
        .offer-spots-num span{color:var(--gold);background:linear-gradient(90deg,var(--gold),#e8c88a,var(--gold));background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 2s linear infinite}
        .offer-bullet{display:flex;align-items:center;gap:8px;font-size:14px;color:rgba(250,248,244,0.65)}
        .offer-bullet i{color:var(--gold);font-size:15px}

        /* FAQ */
        .faq-wrap{max-width:700px;margin:0 auto}
        .faq-item{border-bottom:1px solid var(--surface-b);overflow:hidden}
        .faq-item:last-child{border-bottom:none}
        .faq-q{width:100%;background:none;border:none;text-align:left;padding:22px 8px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:var(--sans);font-size:15px;font-weight:600;color:var(--text);cursor:pointer;transition:color 0.2s}
        .faq-q:hover{color:var(--primary)}
        .faq-q-left{display:flex;align-items:center;gap:14px}
        .faq-q-icon{width:36px;height:36px;border-radius:10px;background:var(--surface);border:1px solid var(--surface-b);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--primary);flex-shrink:0}
        .faq-toggle{width:28px;height:28px;border-radius:50%;background:var(--surface);border:1px solid var(--surface-b);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--primary-mid);transition:all 0.3s;flex-shrink:0;line-height:1}
        .faq-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1)}
        .faq-body.open{grid-template-rows:1fr}
        .faq-inner{overflow:hidden}
        .faq-ans{padding:0 8px 22px 58px;font-size:14px;color:var(--primary);line-height:1.85}

        /* FORM */
        .form-card{background:rgba(255,255,255,0.06);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:48px 44px;max-width:520px;margin:0 auto}
        .form-input{width:100%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:15px 18px;font-family:var(--sans);font-size:14px;color:#faf8f4;outline:none;margin-bottom:14px;transition:all 0.2s;display:block}
        .form-input:focus{border-color:rgba(200,168,122,0.6);background:rgba(255,255,255,0.12)}
        .form-input::placeholder{color:rgba(250,248,244,0.35)}
        .form-btn{width:100%;background:var(--gold);color:#1e1208;border:none;border-radius:8px;padding:18px;font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:10px}
        .form-btn:hover{background:#d4b88a;transform:translateY(-2px);box-shadow:0 8px 28px rgba(200,168,122,0.3)}
        .form-btn i{font-size:18px}
        .form-trust{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:20px;flex-wrap:wrap}
        .trust-item{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(250,248,244,0.45)}
        .trust-item i{font-size:13px;color:rgba(200,168,122,0.6)}

        /* FOOTER */
        .footer{background:#1a0e06;padding:52px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.07)}
        .footer-name{font-family:var(--serif);color:var(--gold);font-size:22px;font-weight:600;margin-bottom:8px}
        .footer-sub{font-size:13px;color:var(--primary-muted)}
        .footer-links{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:20px}
        .footer-links a{font-size:12px;color:var(--primary);text-decoration:none;transition:color 0.2s}
        .footer-links a:hover{color:var(--gold)}
        .footer-links span{color:rgba(255,255,255,0.15)}

        /* ── RESPONSIVE (tablets) ── */
        @media (max-width: 1024px) {
          .hero{padding:90px 28px 80px}
          .hero-inner{gap:40px}
          .pain-grid,.weeks-grid,.testi-grid,.det-grid{gap:14px}
        }

        /* ── RESPONSIVE (mobile) ── */
        @media(max-width:768px){
          .hero{padding:70px 20px 60px;min-height:auto}
          .hero-inner{grid-template-columns:1fr;gap:36px}
          /* ↓ HERO TEXT CENTER ON MOBILE */
          .hero-inner > div:first-child{text-align:center}
          .hero-proof{justify-content:center}
          .hero-tagline{text-align:center}
          /* ↑ end hero center */
          .hero h1{font-size:clamp(28px,8vw,40px)}
          .hero-sub{font-size:15px;line-height:1.75}
          .hero-tagline{font-size:13px}
          .hero-proof{gap:14px}
          .proof-item{font-size:12px}
          .btn-hero{width:100%;justify-content:center;padding:14px 22px;font-size:12.5px;letter-spacing:0.04em}
          .coach-card{max-width:380px;margin:0 auto}
          .story-grid,.pain-grid,.weeks-grid,.testi-grid,.det-grid{grid-template-columns:1fr}
          .story-grid .reveal-left{order:2}
          .story-grid .reveal-right{order:1}
          .story-stats{grid-template-columns:repeat(3,1fr);gap:10px}
          .stat-num{font-size:22px}
          .stat-label{font-size:10px}
          .form-card{padding:32px 22px}
          .sec{padding:56px 20px}
          .faq-ans{padding-left:22px}
          .eyebrow{font-size:clamp(15px,4.5vw,20px);letter-spacing:0.04em}
          .sec-title{font-size:clamp(19px,6vw,26px)}
          .sec-subtitle{font-size:14px;margin-bottom:32px}
          .story-content{text-align:center}
          .story-quote{text-align:left}
          .week-card{padding:24px 20px}
          .week-illus{height:120px}
          .includes-wrap{padding:20px 18px;gap:16px}
          .pricing-card{padding:28px 22px}
          .pr-row{flex-wrap:wrap}
          .offer-urgency{flex-direction:column;align-items:flex-start;gap:14px}
          .footer{padding:40px 20px}
          .footer-links{flex-wrap:wrap;gap:14px}
          .btn{width:100%;justify-content:center;padding:14px 20px;font-size:12.5px;letter-spacing:0.04em}
          .form-btn{font-size:12.5px;letter-spacing:0.04em;padding:16px}
        }

        /* ── RESPONSIVE (small phones) ── */
        @media (max-width: 480px) {
          .hero{padding:60px 16px 50px}
          .hero-tag{font-size:10px;padding:8px 16px 8px 10px}
          .hero h1{font-size:clamp(26px,9vw,34px)}
          .cd-pill{flex-direction:column;gap:6px;padding:14px 18px}
          .coach-info{left:20px;right:20px;bottom:20px;padding:12px 14px}
          .pain-card,.week-card,.det-card,.testi-card{padding:18px 16px}
          .det-card{flex-direction:row}
          .det-icon{width:44px;height:44px;font-size:20px}
          .pricing-card{padding:22px 16px}
          .form-card{padding:26px 16px}
          .testi-stars{margin-left:0;width:100%;justify-content:flex-start;margin-top:6px}
          .testi-top{flex-wrap:wrap}
          .sec{padding:48px 16px}
        }
      `}</style>

      <div>
        {/* HERO */}
        <section className='hero'>
          <div className='blob1' />
          <div className='blob2' />
          <div className='blob3' />
          <div className='hero-inner'>
            <div>
              <div className='a1'>
                <span className='hero-tag'>
                  <span className='hero-tag-dot' />
                  Pain to Power
                </span>
              </div>
              <h1 className='a2'>
                You forgot who
                <br />
                you were.
                <em>While taking care of everyone else.</em>
              </h1>
              <p className='hero-sub a3'>
                You smile. You help. You say yes. And at night — when everyone
                is okay — you lie awake wondering why you don't feel okay.
              </p>
              <p className='hero-tagline a4'>
                This is for the woman who has given everything to everyone.
                <br />
                It's finally your turn.
              </p>
              <div className='hero-proof a5'>
                <div className='proof-item'>
                  <i className='ti ti-users proof-icon' />
                  <span>100+ people transformed</span>
                </div>
                <div className='proof-divider' />
                <div className='proof-item'>
                  <i className='ti ti-star proof-icon' />
                  <span>5.0 rating</span>
                </div>
                <div className='proof-divider' />
                <div className='proof-item'>
                  <i className='ti ti-shield-check proof-icon' />
                  <span>Safe space</span>
                </div>
              </div>
              <div className='a6'>
                <button className='btn-hero' onClick={scrollToForm}>
                  I want this for myself <i className='ti ti-arrow-right' />
                </button>
                <p
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: 'rgba(250,248,244,0.35)',
                    letterSpacing: '0.05em',
                  }}
                >
                  1:1 with Masuma · 5 spots open
                </p>
              </div>
            </div>
            <div className='a5'>
              <div className='coach-card'>
                <div className='coach-img'>
                  <img src='/masuma.jpeg' alt='Masuma' />
                  <div className='coach-info'>
                    <div>
                      <div className='coach-info-name'>Masuma</div>
                      <div className='coach-info-role'>
                        Transformational Life Coach
                      </div>
                    </div>
                    <div className='coach-badge-live'>
                      <span className='live-dot' />
                      Live
                    </div>
                  </div>
                </div>
                <div className='cd-pill'>
                  <span className='cd-label'>Next session in</span>
                  <span className='cd-time'>{countdown}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* PAIN */}
        <section className='sec sec-cream'>
          <div className='inner text-center'>
            <div className='reveal'>
              <h1 className='eyebrow'>
                <i className='ti ti-info-circle' /> Does this sound{' '}
                <span>familiar?</span>
              </h1>
            </div>
            <ul className='pain-grid'>
              {[
                {
                  icon: 'ti-moon',
                  title: 'Sleepless replays',
                  desc: "You wake up tired of replaying what you said or didn't say",
                  delay: 'd1',
                },
                {
                  icon: 'ti-hand-stop',
                  title: "The yes you didn't mean",
                  desc: 'You say yes when every part of you wants to say no',
                  delay: 'd2',
                },
                {
                  icon: 'ti-arrows-minimize',
                  title: 'Shrinking yourself',
                  desc: 'You shrink yourself to keep the peace',
                  delay: 'd2',
                },
                {
                  icon: 'ti-trophy',
                  title: 'Achieved but empty',
                  desc: "You've achieved things but still feel like you're not enough",
                  delay: 'd3',
                },
              ].map((item, i) => (
                <li key={i} className={`pain-card reveal ${item.delay}`}>
                  <div className='pain-icon-wrap'>
                    <i className={`ti ${item.icon}`} />
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
              <li
                className='pain-card reveal d3'
                style={{
                  gridColumn: '1/-1',
                  maxWidth: 440,
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <div className='pain-icon-wrap'>
                  <i className='ti ti-key' />
                </div>
                <div>
                  <h4>Waiting for permission</h4>
                  <p>
                    You're waiting for permission to finally choose yourself
                  </p>
                </div>
              </li>
            </ul>
            <h2 className='sec-title'>
              If even one of these hits —<em>this was made for you.</em>
            </h2>
            <div className='reveal d4'>
              <button className='btn' onClick={scrollToForm}>
                <i className='ti ti-arrow-right' /> Reserve My Spot
              </button>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* STORY */}
        <section className='sec sec-surface'>
          <div className='inner'>
            <div className='story-grid'>
              <div className='reveal-left'>
                <div className='story-img-wrap'>
                  <div className='story-img'>
                    <img src='/masuma1.jpeg' alt='Masuma' />
                  </div>
                  <div className='story-badge'>
                    <div>
                      <div className='story-badge-name'>Masuma</div>
                      <div className='story-badge-role'>
                        Transformational Life Coach
                      </div>
                    </div>
                    <div className='story-badge-cert'>Certified ✦</div>
                  </div>
                </div>
              </div>
              <div className='reveal-right story-content'>
                <h2 className='eyebrow'>
                  <i className='ti ti-user-heart' /> Her<span>Story</span>
                </h2>
                <h2 className='sec-title'>
                  From people-pleaser
                  <br />
                  <em>to purpose.</em>
                </h2>
                <blockquote className='story-quote'>
                  "I spent years pleasing everyone around me while quietly
                  losing myself. I looked 'fine' on the outside — but inside I
                  was exhausted, anxious, and completely disconnected from who I
                  was. The day I decided to stop waiting for someone else to
                  validate my worth — everything changed."
                </blockquote>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--primary)',
                    lineHeight: 1.85,
                    marginBottom: 10,
                  }}
                >
                  I went through the exact process I'm about to share with you.
                  And now I help women do the same — in just 4 weeks.
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--primary-muted)',
                    letterSpacing: '0.06em',
                    marginBottom: 28,
                  }}
                >
                  — Masuma, Transformational Coach
                </p>
                <div className='story-stats'>
                  {[
                    ['100+', 'Individuals Helped'],
                    ['4 Wk', 'Transform'],
                    ['5.0★', 'Rating'],
                  ].map(([num, label]) => (
                    <div key={label} className='stat-card'>
                      <div className='stat-num'>{num}</div>
                      <div className='stat-label'>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* PROGRAM */}
        <section className='sec sec-cream'>
          <div className='inner text-center'>
            <div className='reveal'>
              <h1 className='eyebrow'>
                <i className='ti ti-sparkles' /> What's <span>Inside</span>
              </h1>
              <h2 className='sec-title'>Your 4-Week Transformation</h2>
              <p className='sec-subtitle'>
                Awareness · Release · Rewire · Rise
              </p>
            </div>
            <div className='weeks-grid'>
              {/* WEEK 01 — AWARENESS */}
              <div className='week-card reveal d1'>
                <div className='week-illus'>
                  <svg
                    viewBox='0 0 320 140'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='xMidYMid meet'
                  >
                    <rect width='320' height='140' fill='#e8dfd0' />
                    {/* Soft concentric rings — inner eye / awareness */}
                    <circle
                      cx='160'
                      cy='70'
                      r='55'
                      fill='none'
                      stroke='#c8a87a'
                      strokeWidth='0.8'
                      opacity='0.4'
                    />
                    <circle
                      cx='160'
                      cy='70'
                      r='40'
                      fill='none'
                      stroke='#c8a87a'
                      strokeWidth='0.8'
                      opacity='0.5'
                    />
                    <circle
                      cx='160'
                      cy='70'
                      r='26'
                      fill='none'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.6'
                    />
                    {/* Eye shape */}
                    <path
                      d='M120 70 Q160 38 200 70 Q160 102 120 70Z'
                      fill='#d8cebc'
                      stroke='#b8a898'
                      strokeWidth='1'
                    />
                    {/* Iris */}
                    <circle
                      cx='160'
                      cy='70'
                      r='14'
                      fill='#7a6a58'
                      opacity='0.85'
                    />
                    {/* Pupil */}
                    <circle cx='160' cy='70' r='7' fill='#2c2218' />
                    {/* Highlight */}
                    <circle
                      cx='164'
                      cy='66'
                      r='2.5'
                      fill='#faf8f4'
                      opacity='0.8'
                    />
                    {/* Floating dots — awareness sparks */}
                    <circle
                      cx='100'
                      cy='40'
                      r='3'
                      fill='#c8a87a'
                      opacity='0.5'
                      style={{
                        animation: 'svgFloat1 3.2s ease-in-out infinite',
                      }}
                    />
                    <circle
                      cx='230'
                      cy='50'
                      r='2'
                      fill='#c8a87a'
                      opacity='0.4'
                      style={{
                        animation: 'svgFloat2 2.8s ease-in-out infinite',
                      }}
                    />
                    <circle
                      cx='80'
                      cy='90'
                      r='2'
                      fill='#c8a87a'
                      opacity='0.3'
                      style={{ animation: 'svgFloat1 4s ease-in-out infinite' }}
                    />
                    <circle
                      cx='245'
                      cy='95'
                      r='3.5'
                      fill='#c8a87a'
                      opacity='0.4'
                      style={{
                        animation: 'svgFloat2 3.5s ease-in-out infinite',
                      }}
                    />
                    {/* Lashes */}
                    <line
                      x1='160'
                      y1='44'
                      x2='160'
                      y2='36'
                      stroke='#b8a898'
                      strokeWidth='1'
                      opacity='0.5'
                    />
                    <line
                      x1='148'
                      y1='46'
                      x2='144'
                      y2='39'
                      stroke='#b8a898'
                      strokeWidth='1'
                      opacity='0.5'
                    />
                    <line
                      x1='172'
                      y1='46'
                      x2='176'
                      y2='39'
                      stroke='#b8a898'
                      strokeWidth='1'
                      opacity='0.5'
                    />
                  </svg>
                </div>
                <div className='week-num'>
                  <i className='ti ti-circle-number-1' /> Week 01
                </div>
                <div className='week-title'>Awareness</div>
                <div className='week-desc'>
                  Pinpoint exactly where your self-worth broke down — and why
                  it's not your fault
                </div>
              </div>

              {/* WEEK 02 — RELEASE */}
              <div className='week-card reveal d2'>
                <div className='week-illus'>
                  <svg
                    viewBox='0 0 320 140'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='xMidYMid meet'
                  >
                    <rect width='320' height='140' fill='#e8dfd0' />
                    {/* Woman silhouette releasing */}
                    <ellipse
                      cx='160'
                      cy='95'
                      rx='22'
                      ry='28'
                      fill='#b8a898'
                      opacity='0.6'
                    />
                    <circle
                      cx='160'
                      cy='57'
                      r='13'
                      fill='#b8a898'
                      opacity='0.6'
                    />
                    {/* Arms outstretched */}
                    <path
                      d='M138 78 Q110 68 90 75'
                      fill='none'
                      stroke='#b8a898'
                      strokeWidth='5'
                      strokeLinecap='round'
                      opacity='0.6'
                    />
                    <path
                      d='M182 78 Q210 68 230 75'
                      fill='none'
                      stroke='#b8a898'
                      strokeWidth='5'
                      strokeLinecap='round'
                      opacity='0.6'
                    />
                    {/* Floating leaves / petals being released */}
                    <path
                      d='M85 60 Q90 50 100 58 Q90 65 85 60Z'
                      fill='#c8a87a'
                      opacity='0.7'
                      style={{ animation: 'svgFloat1 3s ease-in-out infinite' }}
                    />
                    <path
                      d='M220 45 Q228 36 236 46 Q228 54 220 45Z'
                      fill='#c8a87a'
                      opacity='0.55'
                      style={{
                        animation: 'svgFloat2 2.5s ease-in-out infinite',
                      }}
                    />
                    <path
                      d='M60 80 Q66 70 74 78 Q66 86 60 80Z'
                      fill='#c8a87a'
                      opacity='0.4'
                      style={{ animation: 'svgFloat1 4s ease-in-out infinite' }}
                    />
                    <path
                      d='M248 70 Q255 61 262 70 Q255 78 248 70Z'
                      fill='#c8a87a'
                      opacity='0.45'
                      style={{
                        animation: 'svgFloat2 3.6s ease-in-out infinite',
                      }}
                    />
                    <path
                      d='M105 30 Q111 20 118 30 Q111 38 105 30Z'
                      fill='#c8a87a'
                      opacity='0.5'
                      style={{
                        animation: 'svgFloat2 2.8s ease-in-out infinite',
                      }}
                    />
                    <path
                      d='M200 25 Q207 15 214 25 Q207 33 200 25Z'
                      fill='#c8a87a'
                      opacity='0.4'
                      style={{
                        animation: 'svgFloat1 3.4s ease-in-out infinite',
                      }}
                    />
                    {/* Ground line */}
                    <line
                      x1='100'
                      y1='123'
                      x2='220'
                      y2='123'
                      stroke='#d8cebc'
                      strokeWidth='1.5'
                    />
                  </svg>
                </div>

                <div className='week-num'>
                  <i className='ti ti-circle-number-2' /> Week 02
                </div>
                <div className='week-title'>Release</div>
                <div className='week-desc'>
                  Let go of the conditioning, old stories, and fears that have
                  kept you stuck
                </div>
              </div>

              {/* WEEK 03 — REWIRE */}
              <div className='week-card reveal d3'>
                <div className='week-illus'>
                  <svg
                    viewBox='0 0 320 140'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='xMidYMid meet'
                  >
                    <rect width='320' height='140' fill='#e8dfd0' />
                    {/* Brain outline simplified */}
                    <path
                      d='M140 95 Q118 95 112 80 Q106 65 118 56 Q116 42 130 40 Q136 30 150 34 Q158 26 170 34 Q184 30 188 42 Q200 44 202 58 Q212 68 206 80 Q200 95 180 95 Z'
                      fill='none'
                      stroke='#b8a898'
                      strokeWidth='1.5'
                      opacity='0.7'
                    />
                    {/* Neural connections — animated */}
                    <line
                      x1='140'
                      y1='60'
                      x2='165'
                      y2='50'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.5'
                      style={{ animation: 'svgFloat1 3s ease-in-out infinite' }}
                    />
                    <line
                      x1='165'
                      y1='50'
                      x2='185'
                      y2='62'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.5'
                      style={{
                        animation: 'svgFloat2 2.8s ease-in-out infinite',
                      }}
                    />
                    <line
                      x1='150'
                      y1='75'
                      x2='170'
                      y2='68'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.5'
                      style={{
                        animation: 'svgFloat1 3.5s ease-in-out infinite',
                      }}
                    />
                    <line
                      x1='130'
                      y1='72'
                      x2='150'
                      y2='75'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.5'
                      style={{ animation: 'svgFloat2 4s ease-in-out infinite' }}
                    />
                    <line
                      x1='170'
                      y1='68'
                      x2='190'
                      y2='76'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.5'
                      style={{
                        animation: 'svgFloat1 2.6s ease-in-out infinite',
                      }}
                    />
                    <line
                      x1='155'
                      y1='85'
                      x2='170'
                      y2='68'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.4'
                      style={{
                        animation: 'svgFloat2 3.2s ease-in-out infinite',
                      }}
                    />
                    {/* Nodes */}
                    {[
                      [140, 60],
                      [165, 50],
                      [185, 62],
                      [150, 75],
                      [170, 68],
                      [130, 72],
                      [190, 76],
                      [155, 85],
                    ].map(([x, y], i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r='4'
                        fill='#7a6a58'
                        opacity='0.8'
                        style={{
                          animation: `svgFloat${i % 2 === 0 ? 1 : 2} ${2.5 + i * 0.3}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                    {/* Spark / new connection forming */}
                    <circle
                      cx='160'
                      cy='68'
                      r='8'
                      fill='none'
                      stroke='#c8a87a'
                      strokeWidth='1'
                      opacity='0.4'
                      style={{ animation: 'svgRotate 6s linear infinite' }}
                    />
                    <circle
                      cx='160'
                      cy='68'
                      r='3'
                      fill='#c8a87a'
                      opacity='0.9'
                    />
                    {/* Side sparkles */}
                    <circle
                      cx='90'
                      cy='50'
                      r='2.5'
                      fill='#c8a87a'
                      opacity='0.3'
                      style={{ animation: 'svgFloat2 3s ease-in-out infinite' }}
                    />
                    <circle
                      cx='240'
                      cy='65'
                      r='2'
                      fill='#c8a87a'
                      opacity='0.35'
                      style={{
                        animation: 'svgFloat1 3.8s ease-in-out infinite',
                      }}
                    />
                    <circle
                      cx='80'
                      cy='90'
                      r='3'
                      fill='#c8a87a'
                      opacity='0.25'
                      style={{
                        animation: 'svgFloat2 2.9s ease-in-out infinite',
                      }}
                    />
                  </svg>
                </div>
                <div className='week-num'>
                  <i className='ti ti-circle-number-3' /> Week 03
                </div>
                <div className='week-title'>Rewire</div>
                <div className='week-desc'>
                  Replace limiting beliefs with a new identity — one that
                  actually fits you
                </div>
              </div>

              {/* WEEK 04 — RISE */}
              <div className='week-card reveal d4'>
                <div className='week-illus'>
                  <svg
                    viewBox='0 0 320 140'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='xMidYMid meet'
                  >
                    <rect width='320' height='140' fill='#e8dfd0' />
                    {/* Sun / radiance rays */}
                    {[
                      0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
                    ].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180
                      const x1 = 160 + Math.cos(rad) * 28
                      const y1 = 72 + Math.sin(rad) * 28
                      const x2 = 160 + Math.cos(rad) * 46
                      const y2 = 72 + Math.sin(rad) * 46
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke='#c8a87a'
                          strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
                          opacity={i % 2 === 0 ? 0.6 : 0.35}
                          style={{
                            animation: `svgFloat${i % 2 === 0 ? 1 : 2} ${2.5 + i * 0.2}s ease-in-out infinite`,
                          }}
                        />
                      )
                    })}
                    {/* Sun core */}
                    <circle
                      cx='160'
                      cy='72'
                      r='20'
                      fill='#c8a87a'
                      opacity='0.18'
                    />
                    <circle
                      cx='160'
                      cy='72'
                      r='14'
                      fill='#c8a87a'
                      opacity='0.35'
                    />
                    <circle
                      cx='160'
                      cy='72'
                      r='8'
                      fill='#c8a87a'
                      opacity='0.75'
                    />
                    {/* Woman silhouette — arms raised in triumph */}
                    <ellipse
                      cx='160'
                      cy='115'
                      rx='14'
                      ry='18'
                      fill='#7a6a58'
                      opacity='0.55'
                    />
                    <circle
                      cx='160'
                      cy='91'
                      r='9'
                      fill='#7a6a58'
                      opacity='0.55'
                    />
                    <path
                      d='M146 103 Q128 88 118 78'
                      fill='none'
                      stroke='#7a6a58'
                      strokeWidth='4'
                      strokeLinecap='round'
                      opacity='0.55'
                      style={{ animation: 'svgFloat1 3s ease-in-out infinite' }}
                    />
                    <path
                      d='M174 103 Q192 88 202 78'
                      fill='none'
                      stroke='#7a6a58'
                      strokeWidth='4'
                      strokeLinecap='round'
                      opacity='0.55'
                      style={{ animation: 'svgFloat2 3s ease-in-out infinite' }}
                    />
                    {/* Sparkles around her */}
                    <circle
                      cx='110'
                      cy='72'
                      r='3'
                      fill='#c8a87a'
                      opacity='0.5'
                      style={{
                        animation: 'svgFloat2 2.5s ease-in-out infinite',
                      }}
                    />
                    <circle
                      cx='210'
                      cy='68'
                      r='2.5'
                      fill='#c8a87a'
                      opacity='0.5'
                      style={{ animation: 'svgFloat1 3s ease-in-out infinite' }}
                    />
                    <circle
                      cx='95'
                      cy='95'
                      r='2'
                      fill='#c8a87a'
                      opacity='0.35'
                      style={{
                        animation: 'svgFloat2 3.5s ease-in-out infinite',
                      }}
                    />
                    <circle
                      cx='225'
                      cy='95'
                      r='2.5'
                      fill='#c8a87a'
                      opacity='0.4'
                      style={{
                        animation: 'svgFloat1 2.8s ease-in-out infinite',
                      }}
                    />
                  </svg>
                </div>

                <div className='week-num'>
                  <i className='ti ti-circle-number-4' /> Week 04
                </div>
                <div className='week-title'>Rise</div>
                <div className='week-desc'>
                  Step into your power, set boundaries, and show up as the
                  version of you you've been hiding
                </div>
              </div>
            </div>
            <div className='includes-wrap reveal d4'>
              {[
                ['ti-video', 'Live 1:1 Sessions'],
                ['ti-file-text', 'Worksheets'],
                ['ti-brand-whatsapp', 'WhatsApp Support'],
                ['ti-headphones', 'Guided Healing Audios'],
              ].map(([icon, label]) => (
                <div key={label} className='inc-pill'>
                  <i className={`ti ${icon}`} /> {label}
                </div>
              ))}
            </div>
            <div className='reveal d5'>
              <button className='btn' onClick={scrollToForm}>
                I want this for myself <i className='ti ti-arrow-right' />
              </button>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* SESSION DETAILS */}
        <section className='sec sec-surface'>
          <div className='inner text-center'>
            <div className='reveal'>
              <h1 className='eyebrow'>
                <i className='ti ti-calendar-event' /> Session{' '}
                <span>Details</span>
              </h1>
              <h2 className='sec-title'>How it works</h2>
              <p className='sec-subtitle'>
                Everything you need to know before you join
              </p>
            </div>
            <div className='det-grid'>
              {[
                {
                  icon: 'ti-calendar',
                  label: 'Schedule',
                  val: 'Every Weekends',
                  delay: 'd1',
                },
                {
                  icon: 'ti-clock',
                  label: 'Duration',
                  val: '60 minutes per session',
                  delay: 'd2',
                },
                {
                  icon: 'ti-world',
                  label: 'Language',
                  val: 'Hindi / English',
                  delay: 'd3',
                },
                {
                  icon: 'ti-video',
                  label: 'Venue',
                  val: 'Zoom (Private 1:1)',
                  delay: 'd4',
                },
              ].map((d) => (
                <div key={d.label} className={`det-card reveal ${d.delay}`}>
                  <div className='det-icon'>
                    <i className={`ti ${d.icon}`} />
                  </div>
                  <div>
                    <div className='det-label'>{d.label}</div>
                    <div className='det-val'>{d.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className='reveal d5'>
              <button className='btn' onClick={scrollToForm}>
                <i className='ti ti-arrow-right' /> Reserve My Free Spot
              </button>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* TESTIMONIALS */}
        <section className='sec sec-cream'>
          <div className='inner text-center'>
            <div className='reveal'>
              <span className='eyebrow'>
                <i className='ti ti-quote' /> Real <span>People.</span> Real{' '}
                <span>Results.</span>
              </span>
              <h2 className='sec-title'>
                They had a story. Now they have
                <br />
                <em>their life back.</em>
              </h2>
            </div>
            <div className='testi-grid'>
              {[
                {
                  av: 'D',
                  name: 'Dimple',
                  city: 'Mumbai',
                  result: 'Found her voice in 4 weeks',
                  delay: 'd1',
                  quote:
                    '"Masuma is a wonderful relationship coach. Her guidance helped me handle a difficult phase of anger triggered by a personal incident. She was patient, understanding, and practical in her approach. I had an outburst when I first met her but she was very supportive. I am now much better able to manage my reactions. She saved my marriage — will always be indebted to her."',
                },
                {
                  av: 'K',
                  name: 'Ketki',
                  city: 'Delhi',
                  result: 'Set boundaries for the first time',
                  delay: 'd2',
                  quote:
                    '"Some friendships arrive when you least expect them. That\'s exactly what happened with Masuma and me. Through countless conversations and shared learnings, I got to witness the incredible woman she truly is. She has this beautiful ability to make people feel seen, heard, and valued."',
                },
                {
                  av: 'S',
                  name: 'Sapna',
                  city: 'Mumbai',
                  result: 'Found her voice in 4 weeks',
                  delay: 'd1',
                  quote:
                    '"It was wonderful connecting with you and experiencing your coaching style. Your genuine care for people, empathetic listening, and ability to bring clarity to challenging situations make you an exceptional life coach. I wholeheartedly recommend you to anyone seeking guidance and positive change."',
                },
              ].map((t) => (
                <div key={t.name} className={`testi-card reveal ${t.delay}`}>
                  <div className='testi-top'>
                    <div className='testi-av'>{t.av}</div>
                    <div>
                      <div className='testi-name'>{t.name}</div>
                      <div className='testi-city'>
                        <i className='ti ti-map-pin' style={{ fontSize: 11 }} />{' '}
                        {t.city}
                      </div>
                    </div>
                    <div className='testi-stars'>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className='ti ti-star-filled' />
                      ))}
                    </div>
                  </div>
                  <p className='testi-quote'>{t.quote}</p>
                  <div className='testi-result'>
                    <i className='ti ti-check' /> {t.result}
                  </div>
                </div>
              ))}
            </div>
            <div className='reveal d5'>
              <button className='btn' onClick={scrollToForm}>
                <i className='ti ti-arrow-right' /> Reserve My Spot
              </button>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* PRICING / OFFER */}
        <section className='sec sec-surface'>
          <div className='inner text-center'>
            <div className='reveal'>
              <span className='eyebrow new'>
                <i className='ti ti-gift' /> The <span>Offer</span>
              </span>
              <h2 className='offer-headline'>
                <span className='offer-hl-line1'>One decision.</span>
                <span className='offer-hl-line2'>Four weeks.</span>
                <span className='offer-hl-line3'>Everything changes.</span>
              </h2>
              <p className='sec-subtitle'>
                This isn't a course you buy and forget. This is a 1:1 container
                — built for you, around you.
              </p>
            </div>
            <div className='pricing-wrap'>
              <div className='pricing-card reveal d1'>
                {[
                  {
                    icon: 'ti-video',
                    label: '4 × Live 1:1 Coaching Sessions',
                    tag: 'Core',
                  },
                  {
                    icon: 'ti-search',
                    label: 'Deep-Dive Exploration Session',
                    tag: 'Kickoff',
                  },
                  {
                    icon: 'ti-chart-bar',
                    label: 'Weekly Progress Tracker',
                    tag: 'Clarity',
                  },
                  {
                    icon: 'ti-headphones',
                    label: 'Healing Audio + Guided Workbook',
                    tag: 'Daily',
                  },
                  {
                    icon: 'ti-brand-whatsapp',
                    label: 'WhatsApp Support (between sessions)',
                    tag: 'Always On',
                  },
                ].map((row) => (
                  <div key={row.label} className='pr-row'>
                    <div className='pr-row-left'>
                      <i className={`ti ${row.icon}`} />
                      <span className='pr-label'>{row.label}</span>
                    </div>
                    <span className='pr-tag'>{row.tag}</span>
                  </div>
                ))}

                {/* Urgency strip */}
                <div className='offer-urgency'>
                  <div>
                    <div className='offer-spots-label'>
                      Spots remaining this month
                    </div>
                    <div className='offer-spots-num'>
                      Only <span>5</span> left
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {[
                      'No group calls',
                      'No pre-recorded fluff',
                      '100% tailored to you',
                    ].map((pt) => (
                      <div key={pt} className='offer-bullet'>
                        <i className='ti ti-check' />
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='reveal d2' style={{ marginTop: 28 }}>
                <button
                  className='btn'
                  style={{ fontSize: 15, padding: '18px 52px' }}
                  onClick={scrollToForm}
                >
                  Claim My Spot <i className='ti ti-arrow-right' />
                </button>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: 'var(--primary-muted)',
                    letterSpacing: '0.05em',
                  }}
                >
                  No payment now · Just a conversation
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className='divider' />

        {/* FAQ */}
        <section className='sec sec-cream'>
          <div className='inner text-center'>
            <div className='reveal'>
              <span className='eyebrow'>
                <i className='ti ti-message-question' /> Before you{' '}
                <span>decide</span>
              </span>
              <h2 className='sec-title'>Frequently Asked Questions</h2>
              <p className='sec-subtitle'>Real questions, honest answers</p>
            </div>
            <div className='faq-wrap reveal d1'>
              {faqs.map((faq, i) => (
                <div key={i} className='faq-item'>
                  <button className='faq-q' onClick={() => toggleFaq(i)}>
                    <div className='faq-q-left'>
                      <div className='faq-q-icon'>
                        <i className={`ti ${faq.icon}`} />
                      </div>
                      <span>{faq.q}</span>
                    </div>
                    <div
                      className='faq-toggle'
                      style={
                        openFaq === i
                          ? {
                              transform: 'rotate(45deg)',
                              background: 'var(--primary-dark)',
                              color: '#faf8f4',
                            }
                          : {}
                      }
                    >
                      +
                    </div>
                  </button>
                  <div className={`faq-body${openFaq === i ? ' open' : ''}`}>
                    <div className='faq-inner'>
                      <p className='faq-ans'>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className='sec sec-dark' ref={formRef}>
          <div className='inner text-center'>
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(30px,4vw,52px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#faf8f4',
                  marginBottom: 14,
                }}
              >
                Stop giving yourself away
                <br />
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
                  for free.
                </em>
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: 'rgba(250,248,244,0.6)',
                  fontWeight: 300,
                  marginBottom: 6,
                }}
              >
                Start getting the life you deserve.
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(250,248,244,0.3)',
                  letterSpacing: '0.06em',
                  marginBottom: 44,
                }}
              >
                1:1 with Masuma
              </p>
            </div>
            <div className='form-card reveal d1'>
              <input
                className='form-input'
                type='text'
                placeholder='Your full name'
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
              <input
                className='form-input'
                type='tel'
                placeholder='WhatsApp number'
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
              />
              <input
                className='form-input'
                type='email'
                placeholder='Email address'
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
              />
              <button className='form-btn' onClick={handleSubmit}>
                Reserve My Spot — Only 5 Left
              </button>
              <div className='form-trust'>
                <div className='trust-item'>
                  <i className='ti ti-lock' /> Private &amp; Safe
                </div>
                <div className='trust-item'>
                  <i className='ti ti-shield-check' /> No spam
                </div>
                <div className='trust-item'>
                  <i className='ti ti-star' /> 5.0 rated
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className='footer'>
          <div className='footer-name'>Pain to Power Coaching · Masuma</div>
          <div className='footer-sub'>© 2026 All Rights Reserved</div>
          <div className='footer-links'>
            <a href='#'>Privacy Policy</a>
            <span>·</span>
            <a href='#'>Terms of Service</a>
            <span>·</span>
            <a href='#'>Contact</a>
          </div>
        </footer>
      </div>
    </>
  )
}
