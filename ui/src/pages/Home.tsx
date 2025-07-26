import React, { useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Sparkles, BarChart3, ShieldCheck, Users, Activity, PlayCircle, Lock, Brain, FileBarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

// Animated Counter component
function AnimatedCounter({ value, duration = 2000, ...props }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    let current = start;
    let frame: number;
    function animate() {
      current += increment;
      if (ref.current) {
        ref.current.textContent = Math.floor(current).toLocaleString();
      }
      if (current < end) {
        frame = requestAnimationFrame(animate);
      } else if (ref.current) {
        ref.current.textContent = end.toLocaleString();
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span ref={ref} {...props}>0</span>;
}

const demoScreens = [
  {
    title: 'Dashboard',
    desc: 'Επισκόπηση καμπανιών, KPIs και trends σε πραγματικό χρόνο.',
    icon: <BarChart3 className="w-12 h-12 text-blue-600" />
  },
  {
    title: 'Analytics',
    desc: 'Προηγμένα γραφήματα, funnel analysis και AI insights.',
    icon: <Activity className="w-12 h-12 text-green-600" />
  },
  {
    title: 'Ρυθμίσεις',
    desc: 'Διαχείριση λογαριασμών, Facebook σύνδεση, ασφάλεια.',
    icon: <ShieldCheck className="w-12 h-12 text-purple-600" />
  },
  {
    title: 'AI Insights',
    desc: 'Αυτόματες προτάσεις βελτιστοποίησης και αυτοματισμοί.',
    icon: <Brain className="w-12 h-12 text-yellow-500" />
  }
];

// Testimonials data
const testimonials = [
  {
    name: 'Ελένη Παπαδοπούλου',
    title: 'CMO, BigBrand SA',
    avatar: 'ΕΠ',
    color: 'from-blue-400 to-purple-400',
    rating: 5,
    text: 'Το Ads Pro μας έδωσε πλήρη έλεγχο και διαφάνεια στις καμπάνιες μας. Η ανάλυση και τα insights είναι πραγματικά next-level!'
  },
  {
    name: 'Μιχάλης Κωνσταντίνου',
    title: 'Marketing Director, TechCorp',
    avatar: 'ΜΚ',
    color: 'from-green-400 to-blue-400',
    rating: 5,
    text: 'Αυτόματη βελτιστοποίηση που αυξάνει το ROI κατά 40%. Το καλύτερο εργαλείο που έχουμε χρησιμοποιήσει!'
  },
  {
    name: 'Άννα Γεωργίου',
    title: 'CEO, StartupHub',
    avatar: 'ΑΓ',
    color: 'from-purple-400 to-pink-400',
    rating: 5,
    text: 'Ασφάλεια επιπέδου enterprise με ευκολία χρήσης. Τα AI insights μας βοηθούν να παίρνουμε καλύτερες αποφάσεις.'
  }
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <ParallaxProvider>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 overflow-x-hidden">
        {/* Hero Section με live preview και neon CTA */}
        <section className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-between gap-12 px-4 pt-32 pb-16 bg-gradient-to-br from-blue-950 via-gray-950 to-purple-950/80 dark:from-blue-950 dark:via-gray-950 dark:to-purple-950/80 overflow-x-hidden shadow-2xl">
          <div className="flex-1 flex flex-col items-start justify-center gap-8 z-10">
            <div className="flex items-center gap-3 animate-fade-in-up">
              <Sparkles className="w-12 h-12 text-blue-400 animate-pulse drop-shadow-lg" />
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_30px_rgba(99,102,241,0.7)] animate-gradient-x">
                Ads Pro - Platforms Analysis
              </h1>
            </div>
            <p className="text-2xl text-muted-foreground max-w-2xl animate-fade-in-up delay-100">
              Η κορυφαία enterprise πλατφόρμα για ανάλυση, βελτιστοποίηση και διαχείριση Meta Ads καμπανιών με AI. Εμπιστεύονται κορυφαίες εταιρείες για την απόδοση και την ασφάλεια των δεδομένων τους.
            </p>
            <div className="flex gap-4 animate-fade-in-up delay-200">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 text-lg rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 transition-all ring-2 ring-purple-400/40 ring-offset-2 ring-offset-background animate-glow" onClick={() => navigate('/login')}>
                Ξεκίνα τώρα
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-2xl border-blue-400 text-blue-300 hover:bg-blue-900/20 flex items-center gap-2" onClick={() => navigate('/campaigns')}>
                <PlayCircle className="w-5 h-5" /> Δες το Demo
              </Button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center z-10 animate-fade-in-up delay-300">
            <div className="relative w-full max-w-xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-700/40 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-gray-900/80">
              {/* Placeholder dashboard preview - αντικατάστησέ το με πραγματικό screenshot αν έχεις */}
              <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <div className="text-center text-white/80">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Dashboard Preview</p>
                  <p className="text-sm opacity-70">Live analytics & insights</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-3xl ring-2 ring-purple-400/30 animate-pulse" />
            </div>
          </div>
          {/* Parallax/Glow background effects */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-radial from-purple-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl z-0" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-2xl z-0" />
        </section>

        {/* Gallery/Slider Section */}
        <section className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold mb-4">Δες το προϊόν σε δράση</h2>
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {demoScreens.map((screen, i) => (
              <Parallax key={screen.title} speed={i % 2 === 0 ? 10 : -10} className="w-full md:w-1/4 flex flex-col items-center">
                <div className="rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-900 bg-white/80 dark:bg-gray-900/80 mb-2 p-8 flex items-center justify-center h-48">
                  {screen.icon}
                </div>
                <div className="text-lg font-semibold mt-2">{screen.title}</div>
                <div className="text-muted-foreground text-sm text-center">{screen.desc}</div>
              </Parallax>
            ))}
          </div>
        </section>

        {/* Stats Section with Animated Counters and Progress Bar */}
        <section className="container mx-auto px-4 py-12 flex flex-wrap justify-center gap-12 animate-fade-in-up delay-400">
          <div className="flex flex-col items-center">
            <Activity className="w-10 h-10 text-green-600 mb-2" />
            <span className="text-3xl font-extrabold"><AnimatedCounter value={1200000} />+</span>
            <span className="text-muted-foreground text-base">Καμπάνιες αναλύθηκαν</span>
            <div className="w-32 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mt-2 overflow-hidden">
              <div className="h-2 bg-green-500 animate-pulse" style={{ width: '90%' }} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-10 h-10 text-blue-600 mb-2" />
            <span className="text-3xl font-extrabold"><AnimatedCounter value={500} />+</span>
            <span className="text-muted-foreground text-base">Επιχειρήσεις</span>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 overflow-hidden">
              <div className="h-2 bg-blue-500 animate-pulse" style={{ width: '75%' }} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-10 h-10 text-purple-600 mb-2" />
            <span className="text-3xl font-extrabold">99.99%</span>
            <span className="text-muted-foreground text-base">Uptime & Ασφάλεια</span>
            <div className="w-32 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 overflow-hidden">
              <div className="h-2 bg-purple-500 animate-pulse" style={{ width: '99%' }} />
            </div>
          </div>
        </section>

        {/* Features Section with Neon/Glow Cards */}
        <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-10 animate-fade-in-up delay-500">
          <Parallax speed={-10} className="flex flex-col items-center text-center gap-4 p-8 bg-white/80 dark:bg-gray-900/60 rounded-3xl shadow-2xl border-2 border-blue-400/60 dark:border-blue-600/80 hover:shadow-[0_0_40px_10px_rgba(99,102,241,0.3)] transition-all duration-300 group cursor-pointer">
            <FileBarChart2 className="w-10 h-10 text-purple-600 group-hover:scale-110 group-hover:text-blue-400 transition-transform duration-300" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]">Προηγμένη Ανάλυση</h3>
            <p className="text-muted-foreground">Dashboards, KPI, funnel analysis και AI insights για κάθε καμπάνια.</p>
          </Parallax>
          <Parallax speed={10} className="flex flex-col items-center text-center gap-4 p-8 bg-white/80 dark:bg-gray-900/60 rounded-3xl shadow-2xl border-2 border-blue-400/60 dark:border-blue-600/80 hover:shadow-[0_0_40px_10px_rgba(59,130,246,0.3)] transition-all duration-300 group cursor-pointer">
            <Lock className="w-10 h-10 text-blue-600 group-hover:scale-110 group-hover:text-purple-400 transition-transform duration-300" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">Ασφάλεια Επιπέδου Enterprise</h3>
            <p className="text-muted-foreground">Κρυπτογράφηση, έλεγχος πρόσβασης και συμμόρφωση GDPR για τα δεδομένα σας.</p>
          </Parallax>
          <Parallax speed={-10} className="flex flex-col items-center text-center gap-4 p-8 bg-white/80 dark:bg-gray-900/60 rounded-3xl shadow-2xl border-2 border-yellow-400/60 dark:border-yellow-600/80 hover:shadow-[0_0_40px_10px_rgba(253,224,71,0.3)] transition-all duration-300 group cursor-pointer">
            <Brain className="w-10 h-10 text-yellow-500 group-hover:scale-110 group-hover:text-pink-400 transition-transform duration-300" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(253,224,71,0.7)]">Αυτοματισμοί & AI</h3>
            <p className="text-muted-foreground">Αυτόματες προτάσεις βελτιστοποίησης και αυτοματοποιημένες ενέργειες με AI.</p>
          </Parallax>
        </section>

        {/* Testimonials Carousel Section */}
        <section className="container mx-auto px-4 py-12 flex flex-col items-center gap-8 animate-fade-in-up delay-600">
          <h2 className="text-3xl font-bold mb-8">Τι λένε οι πελάτες μας</h2>
          <TestimonialsCarousel />
        </section>

        {/* Step-by-step How It Works Section */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center gap-12">
          <h2 className="text-3xl font-bold mb-4">Πώς λειτουργεί</h2>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center">
            <Parallax speed={-10} className="flex flex-col items-center text-center gap-4 p-6 bg-white/80 dark:bg-gray-900/60 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 w-full md:w-1/3">
              <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mb-2 flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-blue-600" />
              </div>
              <div className="font-bold text-lg">1. Συνδέεις τον λογαριασμό σου</div>
              <div className="text-muted-foreground text-sm">Εύκολη σύνδεση με Facebook/Meta και εισαγωγή δεδομένων.</div>
            </Parallax>
            <Parallax speed={10} className="flex flex-col items-center text-center gap-4 p-6 bg-white/80 dark:bg-gray-900/60 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 w-full md:w-1/3">
              <div className="w-full h-32 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl mb-2 flex items-center justify-center">
                <Activity className="w-16 h-16 text-green-600" />
              </div>
              <div className="font-bold text-lg">2. Αναλύεις τα δεδομένα σου</div>
              <div className="text-muted-foreground text-sm">Προηγμένα analytics, AI insights και visualization.</div>
            </Parallax>
            <Parallax speed={-10} className="flex flex-col items-center text-center gap-4 p-6 bg-white/80 dark:bg-gray-900/60 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 w-full md:w-1/3">
              <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl mb-2 flex items-center justify-center">
                <Brain className="w-16 h-16 text-yellow-500" />
              </div>
              <div className="font-bold text-lg">3. Βελτιστοποιείς & Εξάγεις</div>
              <div className="text-muted-foreground text-sm">Αυτόματες προτάσεις, εξαγωγή δεδομένων και βελτιστοποίηση καμπανιών.</div>
            </Parallax>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center gap-12 animate-fade-in-up delay-700">
          <h2 className="text-3xl font-bold mb-8">Πλάνα & Τιμές</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {/* Basic Plan */}
            <div className="flex flex-col items-center bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-blue-900 p-8 gap-6 hover:scale-105 transition-transform">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Basic</div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">19,90€<span className="text-base font-normal text-muted-foreground">/μήνα</span></div>
              <ul className="text-sm text-muted-foreground space-y-2 text-center">
                <li>Έως 3 καμπάνιες</li>
                <li>Βασικά analytics</li>
                <li>Υποστήριξη email</li>
              </ul>
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg" onClick={() => navigate('/login')}>Ξεκίνα τώρα</Button>
            </div>
            {/* Pro Plan */}
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-600/90 to-purple-600/90 rounded-3xl shadow-2xl border-4 border-blue-400 dark:border-purple-700 p-8 gap-6 scale-105 z-10">
              <div className="text-4xl font-extrabold text-white drop-shadow">Pro</div>
              <div className="text-3xl font-bold text-white">29,90€<span className="text-base font-normal text-blue-100">/μήνα</span></div>
              <ul className="text-sm text-blue-100 space-y-2 text-center">
                <li>Έως 20 καμπάνιες</li>
                <li>Προηγμένα analytics & AI insights</li>
                <li>Υποστήριξη chat & email</li>
                <li>Αυτόματη βελτιστοποίηση</li>
              </ul>
              <Button size="lg" className="w-full bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50" onClick={() => navigate('/login')}>Δοκίμασέ το</Button>
            </div>
            {/* Enterprise Plan */}
            <div className="flex flex-col items-center bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-900 p-8 gap-6 hover:scale-105 transition-transform">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Enterprise</div>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">39,90€<span className="text-base font-normal text-muted-foreground">/μήνα</span></div>
              <ul className="text-sm text-muted-foreground space-y-2 text-center">
                <li>Απεριόριστες καμπάνιες</li>
                <li>Όλα τα features Pro</li>
                <li>Προτεραιότητα στην υποστήριξη</li>
                <li>Custom onboarding</li>
              </ul>
              <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl shadow-lg" onClick={() => navigate('/login')}>Επικοινώνησε μαζί μας</Button>
            </div>
          </div>
        </section>

        {/* Customer Logos Section */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center gap-8 animate-fade-in-up delay-600">
          <h2 className="text-2xl font-bold text-muted-foreground mb-8">Εμπιστεύονται κορυφαίες εταιρείες</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-red-500 rounded"></div>
              Netflix
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-green-500 rounded"></div>
              Spotify
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              Nike
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-purple-500 rounded"></div>
              Tesla
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-orange-500 rounded"></div>
              Airbnb
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl border border-green-200 dark:border-green-800">
              <ShieldCheck className="w-8 h-8 text-green-600" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">SOC2 Certified</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl border border-blue-200 dark:border-blue-800">
              <Lock className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">GDPR Compliant</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl border border-purple-200 dark:border-purple-800">
              <Activity className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">99.9% Uptime</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-900/60 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <Brain className="w-8 h-8 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">AI-Powered</span>
            </div>
          </div>
        </section>

        {/* Detailed Feature Comparison Table */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold mb-8">Σύγκριση Πλάνων</h2>
          <div className="w-full max-w-4xl overflow-x-auto">
            <table className="w-full bg-white/80 dark:bg-gray-900/60 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900">
              <thead>
                <tr className="border-b border-blue-100 dark:border-blue-900">
                  <th className="p-4 text-left font-bold">Features</th>
                  <th className="p-4 text-center font-bold text-blue-600">Basic</th>
                  <th className="p-4 text-center font-bold text-purple-600 bg-gradient-to-br from-blue-600/10 to-purple-600/10">Pro</th>
                  <th className="p-4 text-center font-bold text-purple-600">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-100/50 dark:border-blue-900/50">
                  <td className="p-4 font-medium">Καμπάνιες</td>
                  <td className="p-4 text-center">Έως 3</td>
                  <td className="p-4 text-center bg-gradient-to-br from-blue-600/5 to-purple-600/5">Έως 20</td>
                  <td className="p-4 text-center">Απεριόριστες</td>
                </tr>
                <tr className="border-b border-blue-100/50 dark:border-blue-900/50">
                  <td className="p-4 font-medium">Analytics</td>
                  <td className="p-4 text-center">Βασικά</td>
                  <td className="p-4 text-center bg-gradient-to-br from-blue-600/5 to-purple-600/5">Προηγμένα + AI</td>
                  <td className="p-4 text-center">Όλα τα features</td>
                </tr>
                <tr className="border-b border-blue-100/50 dark:border-blue-900/50">
                  <td className="p-4 font-medium">Αυτόματη Βελτιστοποίηση</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center bg-gradient-to-br from-blue-600/5 to-purple-600/5">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b border-blue-100/50 dark:border-blue-900/50">
                  <td className="p-4 font-medium">Υποστήριξη</td>
                  <td className="p-4 text-center">Email</td>
                  <td className="p-4 text-center bg-gradient-to-br from-blue-600/5 to-purple-600/5">Chat + Email</td>
                  <td className="p-4 text-center">Προτεραιότητα</td>
                </tr>
                <tr className="border-b border-blue-100/50 dark:border-blue-900/50">
                  <td className="p-4 font-medium">API Access</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center bg-gradient-to-br from-blue-600/5 to-purple-600/5">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Custom Onboarding</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center bg-gradient-to-br from-blue-600/5 to-purple-600/5">❌</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive Demo Preview */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold mb-4">Δες το προϊόν σε δράση</h2>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mb-8">
            Δοκίμασε το Ads Pro δωρεάν για 14 ημέρες. Χωρίς κάρτα, χωρίς δεσμεύσεις.
          </p>
          <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-900/60 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-900 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold">Ξεκίνα δωρεάν trial</h3>
                <p className="text-muted-foreground">
                  Πρόσβαση σε όλα τα features για 14 ημέρες. Δημιούργησε λογαριασμό σε λιγότερο από 2 λεπτά.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm">Χωρίς κάρτα πιστωτικής</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm">Ακύρωση οποιαδήποτε στιγμή</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm">Πρόσβαση σε όλα τα features</span>
                  </div>
                </div>
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all" onClick={() => navigate('/login')}>
                  Ξεκίνα δωρεάν trial
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold">Live Demo</h3>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">Δες live demo του dashboard</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/campaigns')}>
                      Δες το Demo
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Ή επικοινώνησε μαζί μας για personalized demo</p>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    Ζήτησε demo →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Mentions Section */}
        <section className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold text-muted-foreground mb-8">Αναφέρεται σε</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">TechCrunch</div>
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">Forbes</div>
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">The Verge</div>
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">Wired</div>
          </div>
        </section>

        {/* Floating Action Button (Mobile) */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <Button 
            size="lg" 
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all"
            onClick={() => navigate('/login')}
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 text-center text-muted-foreground text-sm flex flex-col gap-2">
          <div className="flex justify-center gap-4 mb-2">
            <a href="#" className="hover:text-blue-600 transition"><svg width="24" height="24" fill="currentColor" className="inline"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.1.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.28 0-.56-.02-.83-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg></a>
            <a href="#" className="hover:text-blue-600 transition"><svg width="24" height="24" fill="currentColor" className="inline"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.07 8.24 8.93.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.74-1.32-1.74-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.23-3.25-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.85 1.23 1.93 1.23 3.25 0 4.64-2.8 5.67-5.47 5.97.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A10 10 0 0 0 22 12c0-5.5-4.46-9.96-9.96-9.96z"/></svg></a>
            <a href="#" className="hover:text-blue-600 transition"><svg width="24" height="24" fill="currentColor" className="inline"><path d="M21.54 7.2c-.13-.47-.52-.8-.99-.8H3.45c-.47 0-.86.33-.99.8-.13.47-.02.97.29 1.3l8.55 8.55c.39.39 1.02.39 1.41 0l8.55-8.55c.31-.33.42-.83.29-1.3z"/></svg></a>
          </div>
          <div>
            © {new Date().getFullYear()} Ads Pro Platforms Analysis. Powered by Volo. All rights reserved.
          </div>
        </footer>
      </div>
    </ParallaxProvider>
  );
}

// TestimonialsCarousel component
function TestimonialsCarousel() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      '(min-width: 768px)': { slides: { perView: 2, spacing: 16 } },
      '(min-width: 1200px)': { slides: { perView: 3, spacing: 16 } },
    },
  });
  return (
    <div ref={sliderRef} className="keen-slider w-full max-w-6xl">
      {testimonials.map((t, i) => (
        <div key={i} className="keen-slider__slide flex flex-col gap-4 bg-white/80 dark:bg-gray-900/60 rounded-2xl p-6 shadow-xl border-2 border-blue-100 dark:border-blue-900 mx-2">
          <div className="flex items-center gap-2">
            {[...Array(t.rating)].map((_, idx) => (
              <span key={idx} className="text-yellow-400 text-lg">★</span>
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground min-h-[60px]">{t.text}</p>
          <div className="flex items-center gap-3 mt-4">
            <div className={`w-10 h-10 rounded-full border-2 bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>{t.avatar}</div>
            <div>
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-muted-foreground text-xs">{t.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 