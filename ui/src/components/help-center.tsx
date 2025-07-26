import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  Mail, 
  MessageCircle, 
  ExternalLink,
  ChevronDown,
  Search,
  Lightbulb,
  Bell,
  Keyboard,
  TrendingUp,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'facebook' | 'analytics' | 'export' | 'demo';
}

interface TipItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'beginner' | 'intermediate' | 'advanced';
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Πώς συνδέω το Facebook Ads account μου;",
    answer: "Μεταβείτε στις Ρυθμίσεις > Facebook Connection και ακολουθήστε τα βήματα για την ασφαλή OAuth σύνδεση. Το σύστημα θα διαχειριστεί αυτόματα την ανανέωση των tokens.",
    category: "facebook"
  },
  {
    question: "Τι είναι το Demo Mode;",
    answer: "Το Demo Mode εμφανίζει προσομοιωμένα δεδομένα για παρουσιάσεις και demonstrations. Όταν είναι απενεργοποιημένο, χρησιμοποιείται πραγματικά δεδομένα από το Facebook API.",
    category: "demo"
  },
  {
    question: "Πώς εξάγω τα δεδομένα μου;",
    answer: "Χρησιμοποιήστε το κουμπί Export σε κάθε σελίδα. Υποστηρίζονται οι μορφές CSV, JSON και PDF. Μπορείτε να επιλέξετε ημερομηνίες και φίλτρα.",
    category: "export"
  },
  {
    question: "Ποια είναι τα keyboard shortcuts;",
    answer: "Ctrl/Cmd + K για global search, Ctrl/Cmd + ? για shortcuts help, Ctrl/Cmd + R για refresh, Ctrl/Cmd + T για theme toggle. Δείτε όλα στις Ρυθμίσεις > Keyboard Shortcuts.",
    category: "general"
  },
  {
    question: "Πώς ερμηνεύω τα analytics;",
    answer: "Τα analytics δείχνουν την απόδοση των καμπανιών σας. Δείτε τα KPIs, γραφήματα και trends. Χρησιμοποιήστε τα φίλτρα για συγκεκριμένες περιόδους.",
    category: "analytics"
  },
  {
    question: "Γιατί δεν φορτώνουν τα δεδομένα;",
    answer: "Ελέγξτε τη σύνδεση Facebook, τα δικαιώματα του account και το rate limiting. Σε περίπτωση προβλήματος, επικοινωνήστε με το support.",
    category: "facebook"
  },
  {
    question: "Πώς αλλάζω τη γλώσσα;",
    answer: "Χρησιμοποιήστε το κουμπί γλώσσας στην navbar ή μεταβείτε στις Ρυθμίσεις > Language. Υποστηρίζονται τα Ελληνικά και τα Αγγλικά.",
    category: "general"
  },
  {
    question: "Πώς αποθηκεύω τις ρυθμίσεις μου;",
    answer: "Οι περισσότερες ρυθμίσεις αποθηκεύονται αυτόματα στο localStorage. Για ρυθμίσεις που απαιτούν επανεκκίνηση, θα εμφανιστεί ειδοποίηση.",
    category: "general"
  }
];

const TIPS_DATA: TipItem[] = [
  {
    title: "Χρησιμοποιήστε τα φίλτρα",
    description: "Τα φίλτρα βοηθούν να βρείτε γρήγορα τις πληροφορίες που χρειάζεστε. Δοκιμάστε διαφορετικούς συνδυασμούς για καλύτερα αποτελέσματα.",
    icon: <Search className="w-4 h-4" />,
    category: "beginner"
  },
  {
    title: "Εξάγετε τακτικά",
    description: "Εξάγετε τα δεδομένα σας τακτικά για backup και ανάλυση. Χρησιμοποιήστε διαφορετικές μορφές ανάλογα με τις ανάγκες σας.",
    icon: <ExternalLink className="w-4 h-4" />,
    category: "beginner"
  },
  {
    title: "Παρακολουθήστε τα trends",
    description: "Τα γραφήματα δείχνουν trends που μπορεί να σας βοηθήσουν να βελτιστοποιήσετε τις καμπάνιες σας.",
    icon: <TrendingUp className="w-4 h-4" />,
    category: "intermediate"
  },
  {
    title: "Χρησιμοποιήστε keyboard shortcuts",
    description: "Τα keyboard shortcuts κάνουν την πλοήγηση πολύ πιο γρήγορη. Μάθετε τα βασικά για καλύτερη παραγωγικότητα.",
    icon: <Keyboard className="w-4 h-4" />,
    category: "intermediate"
  },
  {
    title: "Ελέγξτε τα notifications",
    description: "Οι ειδοποιήσεις σας ενημερώνουν για σημαντικά γεγονότα και αλλαγές στις καμπάνιες σας.",
    icon: <Bell className="w-4 h-4" />,
    category: "intermediate"
  },
  {
    title: "Αναλύστε το funnel",
    description: "Η funnel analysis σας βοηθά να καταλάβετε πώς οι χρήστες προχωρούν από την ευαισθητοποίηση στην αγορά.",
    icon: <BarChart3 className="w-4 h-4" />,
    category: "advanced"
  }
];

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQ = FAQ_DATA.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTips = TIPS_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Όλα', count: FAQ_DATA.length + TIPS_DATA.length },
    { id: 'general', label: 'Γενικά', count: FAQ_DATA.filter(f => f.category === 'general').length },
    { id: 'facebook', label: 'Facebook', count: FAQ_DATA.filter(f => f.category === 'facebook').length },
    { id: 'analytics', label: 'Analytics', count: FAQ_DATA.filter(f => f.category === 'analytics').length },
    { id: 'export', label: 'Export', count: FAQ_DATA.filter(f => f.category === 'export').length },
    { id: 'demo', label: 'Demo', count: FAQ_DATA.filter(f => f.category === 'demo').length },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full border border-blue-200/50 dark:border-blue-800/30">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Βοήθεια & Υποστήριξη</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Πώς μπορούμε να βοηθήσουμε;
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Βρείτε απαντήσεις, μάθετε tips και επικοινωνήστε μαζί μας για οποιαδήποτε βοήθεια χρειάζεστε
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Αναζήτηση βοήθειας..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-3 text-lg border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white/70 dark:focus:bg-gray-900/70 transition-all duration-300"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full px-6 py-2 transition-all duration-300 ${
              selectedCategory === category.id 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-900/70'
            }`}
          >
            {category.label}
            <Badge 
              variant="secondary" 
              className={`ml-2 ${
                selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100/50 dark:bg-gray-800/50'
              }`}
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* FAQ Section */}
        <Card className="border-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Συχνές Ερωτήσεις
            </CardTitle>
            <CardDescription className="text-base">
              Απαντήσεις στις πιο συχνές ερωτήσεις
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((item, index) => (
                <div key={index} className="group">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{item.question}</span>
                    <div className={`transition-transform duration-300 ${expandedFAQ === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                      <Separator className="mb-4 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Δεν βρέθηκαν αποτελέσματα</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="border-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              Χρήσιμες Συμβουλές
            </CardTitle>
            <CardDescription className="text-base">
              Tips για καλύτερη χρήση της εφαρμογής
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTips.length > 0 ? (
              filteredTips.map((tip, index) => (
                <div key={index} className="group flex items-start gap-4 p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{tip.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">{tip.description}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-3 py-1 rounded-full ${
                        tip.category === 'beginner' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                        tip.category === 'intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                      }`}
                    >
                      {tip.category}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Δεν βρέθηκαν αποτελέσματα</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            Επικοινωνία & Υποστήριξη
          </CardTitle>
          <CardDescription className="text-lg">
            Επικοινωνήστε μαζί μας για βοήθεια
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group text-center p-6 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Email Support</h4>
              <p className="text-gray-600 dark:text-gray-300">support@adspro.com</p>
            </div>
            <div className="group text-center p-6 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Documentation</h4>
              <p className="text-gray-600 dark:text-gray-300">docs.adspro.com</p>
            </div>
            <div className="group text-center p-6 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Video Tutorials</h4>
              <p className="text-gray-600 dark:text-gray-300">youtube.com/adspro</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Floating Help Button + Dialog
export function HelpCenterDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 help-section">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 w-16 h-16 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25"
              aria-label="Βοήθεια & Υποστήριξη"
            >
              <HelpCircle className="w-8 h-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full p-0 border-0 bg-transparent">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/20 dark:border-gray-800/20">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Βοήθεια & Υποστήριξη
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-h-[85vh]">
                <HelpCenter />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
} 