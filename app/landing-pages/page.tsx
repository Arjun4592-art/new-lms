'use client'

import { useEffect, useState, useRef } from 'react'

export default function MasumaPage() {
  const [countdown, setCountdown] = useState('Loading…')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const formRef = useRef<HTMLDivElement>(null)

  // Scroll to form function
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // WhatsApp submit handler
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

  // Countdown timer
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

  // Scroll reveal
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
        .week-icon{position:absolute;top:24px;right:24px;width:44px;height:44px;border-radius:12px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--primary-muted)}
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
        .pricing-card{background:#fff;border:1px solid var(--surface-b);border-radius:20px;padding:40px;box-shadow:0 20px 60px rgba(122,106,88,0.1)}
        .pr-row{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--surface-b);gap:20px}
        .pr-row:last-of-type{border-bottom:none}
        .pr-row-left{display:flex;align-items:center;gap:12px}
        .pr-row-left i{font-size:18px;color:var(--primary);width:28px}
        .pr-label{color:var(--primary-mid);font-size:14px}

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
          .week-icon{width:38px;height:38px;font-size:17px;top:20px;right:20px}
          .includes-wrap{padding:20px 18px;gap:16px}
          .pricing-card{padding:28px 22px}
          .pr-row{flex-wrap:wrap}
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
                    ['500+', 'Women Helped'],
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
              {[
                {
                  icon: 'ti-eye',
                  num: 'ti-circle-number-1',
                  week: '01',
                  title: 'Awareness',
                  desc: "Pinpoint exactly where your self-worth broke down — and why it's not your fault",
                  delay: 'd1',
                },
                {
                  icon: 'ti-feather',
                  num: 'ti-circle-number-2',
                  week: '02',
                  title: 'Release',
                  desc: 'Let go of the conditioning, old stories, and fears that have kept you stuck',
                  delay: 'd2',
                },
                {
                  icon: 'ti-brain',
                  num: 'ti-circle-number-3',
                  week: '03',
                  title: 'Rewire',
                  desc: 'Replace limiting beliefs with a new identity — one that actually fits you',
                  delay: 'd3',
                },
                {
                  icon: 'ti-rocket',
                  num: 'ti-circle-number-4',
                  week: '04',
                  title: 'Rise',
                  desc: "Step into your power, set boundaries, and show up as the version of you you've been hiding",
                  delay: 'd4',
                },
              ].map((w) => (
                <div key={w.week} className={`week-card reveal ${w.delay}`}>
                  <div className='week-icon'>
                    <i className={`ti ${w.icon}`} />
                  </div>
                  <div className='week-num'>
                    <i className={`ti ${w.num}`} /> Week {w.week}
                  </div>
                  <div className='week-title'>{w.title}</div>
                  <div className='week-desc'>{w.desc}</div>
                </div>
              ))}
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
              <h2 className='sec-title'>
                Everything you get <em>inside.</em>
              </h2>
            </div>
            <div className='pricing-wrap'>
              <div className='pricing-card reveal d1'>
                {[
                  { icon: 'ti-video', label: '1:1 Coaching Program' },
                  { icon: 'ti-search', label: 'Exploration Session' },
                  { icon: 'ti-chart-bar', label: 'Weekly Tracker' },
                  { icon: 'ti-headphones', label: 'Healing Audio + Workbook' },
                  {
                    icon: 'ti-brand-whatsapp',
                    label: 'WhatsApp Support (ongoing)',
                  },
                ].map((row) => (
                  <div key={row.label} className='pr-row'>
                    <div className='pr-row-left'>
                      <i className={`ti ${row.icon}`} />
                      <span className='pr-label'>{row.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='reveal d2' style={{ marginTop: 28 }}>
                <button
                  className='btn'
                  style={{ fontSize: 15, padding: '18px 52px' }}
                  onClick={scrollToForm}
                >
                  I want this for myself <i className='ti ti-arrow-right' />
                </button>
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
