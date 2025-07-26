// AI Campaign Fortune Teller
// Mystical AI-powered campaign predictions and insights
// 25+ Years Marketing Experience - Fortune Telling Edition

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Cookie, 
  Star, 
  Zap, 
  Moon, 
  Sun,
  Eye,
  Heart,
  Target,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Shuffle,
  Crown,
  Gem,
  Flame,
  Droplets,
  Leaf,
  Mountain,
  Wind,
  Cloud,
  Rainbow,
  Sparkle,
  Palette,
  Search,
  BarChart3,
  Activity,
  TestTube,
  Brain,
  Bell,
  AlertTriangle,
  Users,
  Globe,
  Map,
  Share2,
  Wand2,
  Gavel,
  Shield,
  BarChart,
  Cpu,
  Link,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FortunePrediction {
  id: string;
  type: 'fortune' | 'tarot' | 'horoscope' | 'magic8ball' | 'crystalball' | 'creative' | 'spy';
  message: string;
  emoji: string;
  confidence: number;
  category: 'success' | 'warning' | 'danger' | 'info';
  timestamp: Date;
  campaignId?: string;
  campaignData?: any; // For new enterprise features
}

interface TarotCard {
  name: string;
  meaning: string;
  emoji: string;
  position: 'upright' | 'reversed';
  influence: 'positive' | 'negative' | 'neutral';
}

interface HoroscopeSign {
  sign: string;
  element: string;
  emoji: string;
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
}

export function AIFortuneTeller() {
  const [predictions, setPredictions] = useState<FortunePrediction[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
  const [horoscopeSign, setHoroscopeSign] = useState<HoroscopeSign | null>(null);
  const [magic8BallAnswer, setMagic8BallAnswer] = useState<string>('');
  const [crystalBallInsight, setCrystalBallInsight] = useState<string>('');
  const [mysticalEnergy, setMysticalEnergy] = useState(100);

  // Sample campaign data for predictions
  const campaigns = [
    { id: 'camp_001', name: 'Summer Sale 2024', platform: 'Meta' },
    { id: 'camp_002', name: 'Product Launch', platform: 'Google' },
    { id: 'camp_003', name: 'Gen-Z Retargeting', platform: 'TikTok' }
  ];

  // Tarot deck
  const tarotDeck: TarotCard[] = [
    { name: 'The Fool', meaning: 'New beginnings, spontaneity, adventure', emoji: '🤡', position: 'upright', influence: 'positive' },
    { name: 'The Magician', meaning: 'Manifestation, resourcefulness, power', emoji: '🧙‍♂️', position: 'upright', influence: 'positive' },
    { name: 'The High Priestess', meaning: 'Intuition, mystery, inner knowledge', emoji: '🔮', position: 'upright', influence: 'positive' },
    { name: 'The Empress', meaning: 'Abundance, nurturing, creativity', emoji: '👑', position: 'upright', influence: 'positive' },
    { name: 'The Emperor', meaning: 'Authority, structure, control', emoji: '🏛️', position: 'upright', influence: 'positive' },
    { name: 'The Hierophant', meaning: 'Tradition, conformity, morality', emoji: '⛪', position: 'upright', influence: 'neutral' },
    { name: 'The Lovers', meaning: 'Love, harmony, relationships', emoji: '💕', position: 'upright', influence: 'positive' },
    { name: 'The Chariot', meaning: 'Control, willpower, victory', emoji: '🏎️', position: 'upright', influence: 'positive' },
    { name: 'Strength', meaning: 'Inner strength, courage, persuasion', emoji: '💪', position: 'upright', influence: 'positive' },
    { name: 'The Hermit', meaning: 'Soul-searching, introspection, solitude', emoji: '🧙‍♂️', position: 'upright', influence: 'neutral' },
    { name: 'Wheel of Fortune', meaning: 'Good luck, karma, life cycles', emoji: '🎡', position: 'upright', influence: 'positive' },
    { name: 'Justice', meaning: 'Justice, fairness, truth', emoji: '⚖️', position: 'upright', influence: 'positive' },
    { name: 'The Hanged Man', meaning: 'Surrender, letting go, new perspective', emoji: '🦶', position: 'upright', influence: 'neutral' },
    { name: 'Death', meaning: 'Endings, change, transformation', emoji: '💀', position: 'upright', influence: 'neutral' },
    { name: 'Temperance', meaning: 'Balance, moderation, patience', emoji: '⚗️', position: 'upright', influence: 'positive' },
    { name: 'The Devil', meaning: 'Shadow self, attachment, addiction', emoji: '😈', position: 'upright', influence: 'negative' },
    { name: 'The Tower', meaning: 'Sudden change, upheaval, chaos', emoji: '🗼', position: 'upright', influence: 'negative' },
    { name: 'The Star', meaning: 'Hope, faith, purpose', emoji: '⭐', position: 'upright', influence: 'positive' },
    { name: 'The Moon', meaning: 'Illusion, fear, anxiety', emoji: '🌙', position: 'upright', influence: 'negative' },
    { name: 'The Sun', meaning: 'Positivity, fun, warmth', emoji: '☀️', position: 'upright', influence: 'positive' },
    { name: 'Judgement', meaning: 'Judgement, rebirth, inner calling', emoji: '👼', position: 'upright', influence: 'positive' },
    { name: 'The World', meaning: 'Completion, integration, accomplishment', emoji: '🌍', position: 'upright', influence: 'positive' }
  ];

  // Horoscope signs
  const horoscopeSigns: HoroscopeSign[] = [
    { sign: 'Aries', element: 'Fire', emoji: '♈', compatibility: ['Leo', 'Sagittarius'], luckyNumbers: [1, 9, 17], luckyColors: ['Red', 'Orange'] },
    { sign: 'Taurus', element: 'Earth', emoji: '♉', compatibility: ['Virgo', 'Capricorn'], luckyNumbers: [2, 6, 15], luckyColors: ['Green', 'Pink'] },
    { sign: 'Gemini', element: 'Air', emoji: '♊', compatibility: ['Libra', 'Aquarius'], luckyNumbers: [3, 7, 12], luckyColors: ['Yellow', 'Light Blue'] },
    { sign: 'Cancer', element: 'Water', emoji: '♋', compatibility: ['Scorpio', 'Pisces'], luckyNumbers: [4, 8, 13], luckyColors: ['Silver', 'White'] },
    { sign: 'Leo', element: 'Fire', emoji: '♌', compatibility: ['Aries', 'Sagittarius'], luckyNumbers: [5, 9, 18], luckyColors: ['Gold', 'Orange'] },
    { sign: 'Virgo', element: 'Earth', emoji: '♍', compatibility: ['Taurus', 'Capricorn'], luckyNumbers: [6, 15, 24], luckyColors: ['Green', 'Brown'] },
    { sign: 'Libra', element: 'Air', emoji: '♎', compatibility: ['Gemini', 'Aquarius'], luckyNumbers: [7, 16, 25], luckyColors: ['Pink', 'Blue'] },
    { sign: 'Scorpio', element: 'Water', emoji: '♏', compatibility: ['Cancer', 'Pisces'], luckyNumbers: [8, 17, 26], luckyColors: ['Deep Red', 'Black'] },
    { sign: 'Sagittarius', element: 'Fire', emoji: '♐', compatibility: ['Aries', 'Leo'], luckyNumbers: [9, 18, 27], luckyColors: ['Purple', 'Blue'] },
    { sign: 'Capricorn', element: 'Earth', emoji: '♑', compatibility: ['Taurus', 'Virgo'], luckyNumbers: [10, 19, 28], luckyColors: ['Brown', 'Black'] },
    { sign: 'Aquarius', element: 'Air', emoji: '♒', compatibility: ['Gemini', 'Libra'], luckyNumbers: [11, 20, 29], luckyColors: ['Electric Blue', 'Silver'] },
    { sign: 'Pisces', element: 'Water', emoji: '♓', compatibility: ['Cancer', 'Scorpio'], luckyNumbers: [12, 21, 30], luckyColors: ['Sea Green', 'Purple'] }
  ];

  // Magic 8-Ball answers
  const magic8BallAnswers = [
    'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely',
    'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good',
    'Yes', 'Signs point to yes', 'Reply hazy, try again', 'Ask again later',
    'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again',
    'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good',
    'Very doubtful'
  ];

  // Fortune cookie messages
  const fortuneMessages = [
    'Your campaign will exceed expectations this quarter',
    'A viral moment awaits your creative content',
    'Budget optimization will lead to record ROAS',
    'New audience segments will discover your brand',
    'Competitor analysis reveals untapped opportunities',
    'Seasonal trends align perfectly with your strategy',
    'Customer feedback will inspire breakthrough ideas',
    'Cross-platform synergy will amplify your reach',
    'Data-driven decisions will unlock hidden potential',
    'Authentic storytelling will resonate deeply',
    'Innovation in targeting will set new benchmarks',
    'Collaboration with influencers will drive growth',
    'Mobile-first approach will capture new markets',
    'Personalization will create lasting connections',
    'Sustainability messaging will attract conscious consumers'
  ];

  const generateFortuneCookie = () => {
    setIsReading(true);
    setMysticalEnergy(prev => Math.max(0, prev - 10));
    
    setTimeout(() => {
      const message = fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      const category = confidence > 80 ? 'success' : confidence > 60 ? 'info' : 'warning';
      
      const prediction: FortunePrediction = {
        id: `fortune_${Date.now()}`,
        type: 'fortune',
        message,
        emoji: '🥠',
        confidence,
        category,
        timestamp: new Date(),
        campaignId: selectedCampaign !== 'all' ? selectedCampaign : undefined
      };
      
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
      setIsReading(false);
      
      toast.success('🔮 Fortune revealed!', {
        description: message,
        duration: 5000
      });
    }, 2000);
  };

  const performTarotReading = () => {
    setIsReading(true);
    setMysticalEnergy(prev => Math.max(0, prev - 15));
    
    setTimeout(() => {
      const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
      const selectedCards = shuffledDeck.slice(0, 3).map(card => ({
        ...card,
        position: (Math.random() > 0.5 ? 'upright' : 'reversed') as 'upright' | 'reversed'
      }));
      
      setTarotCards(selectedCards);
      
      const overallInfluence = selectedCards.reduce((acc, card) => {
        if (card.position === 'reversed') {
          return acc + (card.influence === 'positive' ? -1 : card.influence === 'negative' ? 1 : 0);
        }
        return acc + (card.influence === 'positive' ? 1 : card.influence === 'negative' ? -1 : 0);
      }, 0);
      
      const prediction: FortunePrediction = {
        id: `tarot_${Date.now()}`,
        type: 'tarot',
        message: `Tarot reveals ${overallInfluence > 0 ? 'favorable energies' : overallInfluence < 0 ? 'challenging times ahead' : 'balanced forces'} for your campaigns`,
        emoji: '🎴',
        confidence: Math.abs(overallInfluence) * 20 + 50,
        category: overallInfluence > 0 ? 'success' : overallInfluence < 0 ? 'warning' : 'info',
        timestamp: new Date(),
        campaignId: selectedCampaign !== 'all' ? selectedCampaign : undefined
      };
      
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
      setIsReading(false);
      
      toast.success('🎴 Tarot reading complete!', {
        description: prediction.message,
        duration: 5000
      });
    }, 3000);
  };

  const generateHoroscope = () => {
    setIsReading(true);
    setMysticalEnergy(prev => Math.max(0, prev - 12));
    
    setTimeout(() => {
      const sign = horoscopeSigns[Math.floor(Math.random() * horoscopeSigns.length)];
      setHoroscopeSign(sign);
      
      const horoscopeMessages = [
        `The stars align for ${sign.sign} campaigns this month`,
        `${sign.element} energy will fuel your marketing success`,
        `Lucky numbers ${sign.luckyNumbers.join(', ')} will guide your strategy`,
        `${sign.compatibility.join(' and ')} audiences will respond best`,
        `${sign.luckyColors.join(' and ')} will be your power colors`
      ];
      
      const message = horoscopeMessages[Math.floor(Math.random() * horoscopeMessages.length)];
      
      const prediction: FortunePrediction = {
        id: `horoscope_${Date.now()}`,
        type: 'horoscope',
        message,
        emoji: sign.emoji,
        confidence: Math.floor(Math.random() * 30) + 70,
        category: 'success',
        timestamp: new Date(),
        campaignId: selectedCampaign !== 'all' ? selectedCampaign : undefined
      };
      
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
      setIsReading(false);
      
      toast.success('🌟 Horoscope revealed!', {
        description: message,
        duration: 5000
      });
    }, 2500);
  };

  const shakeMagic8Ball = () => {
    setIsReading(true);
    setMysticalEnergy(prev => Math.max(0, prev - 8));
    
    setTimeout(() => {
      const answer = magic8BallAnswers[Math.floor(Math.random() * magic8BallAnswers.length)];
      setMagic8BallAnswer(answer);
      
      const prediction: FortunePrediction = {
        id: `magic8ball_${Date.now()}`,
        type: 'magic8ball',
        message: answer,
        emoji: '🎱',
        confidence: Math.floor(Math.random() * 50) + 50,
        category: answer.includes('yes') || answer.includes('certain') ? 'success' : 
                  answer.includes('no') || answer.includes('doubt') ? 'danger' : 'info',
        timestamp: new Date(),
        campaignId: selectedCampaign !== 'all' ? selectedCampaign : undefined
      };
      
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
      setIsReading(false);
      
      toast.success('🎱 Magic 8-Ball speaks!', {
        description: answer,
        duration: 5000
      });
    }, 1500);
  };

  const consultCrystalBall = () => {
    setIsReading(true);
    setMysticalEnergy(prev => Math.max(0, prev - 20));
    
    setTimeout(() => {
      const crystalInsights = [
        'I see viral content spreading across social platforms',
        'A competitor will make a mistake you can capitalize on',
        'Customer sentiment will shift in your favor',
        'New technology will enhance your targeting capabilities',
        'A partnership opportunity will emerge unexpectedly',
        'Seasonal trends will boost your conversion rates',
        'Data will reveal an untapped audience segment',
        'Creative testing will uncover breakthrough messaging',
        'Budget reallocation will maximize your ROI',
        'Market conditions will favor your strategy'
      ];
      
      const insight = crystalInsights[Math.floor(Math.random() * crystalInsights.length)];
      setCrystalBallInsight(insight);
      
      const prediction: FortunePrediction = {
        id: `crystalball_${Date.now()}`,
        type: 'crystalball',
        message: insight,
        emoji: '🔮',
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        category: 'success',
        timestamp: new Date(),
        campaignId: selectedCampaign !== 'all' ? selectedCampaign : undefined
      };
      
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
      setIsReading(false);
      
      toast.success('🔮 Crystal ball vision revealed!', {
        description: insight,
        duration: 5000
      });
    }, 4000);
  };

  const rechargeMysticalEnergy = () => {
    setMysticalEnergy(100);
    toast.success('✨ Mystical energy recharged!', {
      description: 'You are ready for more predictions',
      duration: 3000
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <Eye className="w-4 h-4" />;
      case 'danger': return <TrendingDown className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Auto-recharge mystical energy
  useEffect(() => {
    const interval = setInterval(() => {
      setMysticalEnergy(prev => Math.min(100, prev + 1));
    }, 10000); // Recharge 1% every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            AI Fortune Teller
          </h1>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </motion.div>
        <p className="text-muted-foreground text-lg">
          🔮 Mystical AI-powered campaign predictions and insights
        </p>
        
        {/* Mystical Energy Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Mystical Energy</span>
            <span className="text-sm text-muted-foreground">{mysticalEnergy}%</span>
          </div>
          <Progress value={mysticalEnergy} className="h-2" />
          {mysticalEnergy < 20 && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={rechargeMysticalEnergy}
              className="mt-2 w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Recharge Energy
            </Button>
          )}
        </div>
      </div>

      {/* Campaign Selector */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Select Campaign for Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select 
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name} ({campaign.platform})
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Fortune Telling Methods */}
      <Tabs defaultValue="fortune" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="fortune" className="flex items-center gap-2">
            <Cookie className="w-4 h-4" />
            Fortune
          </TabsTrigger>
          <TabsTrigger value="tarot" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Tarot
          </TabsTrigger>
          <TabsTrigger value="horoscope" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Horoscope
          </TabsTrigger>
          <TabsTrigger value="magic8ball" className="flex items-center gap-2">
            <Gem className="w-4 h-4" />
            Magic 8-Ball
          </TabsTrigger>
          <TabsTrigger value="crystalball" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Crystal Ball
          </TabsTrigger>
          <TabsTrigger value="creative" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Creative AI
          </TabsTrigger>
          <TabsTrigger value="spy" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Spy AI
          </TabsTrigger>
        </TabsList>

        {/* Fortune Cookie Tab */}
        <TabsContent value="fortune" className="space-y-6">
          <Card>
            <CardHeader>
                          <CardTitle className="flex items-center gap-2">
              <Cookie className="w-6 h-6" />
              Fortune Cookie Predictions
            </CardTitle>
              <CardDescription>
                Crack open a fortune cookie to reveal campaign insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={generateFortuneCookie}
                disabled={isReading || mysticalEnergy < 10}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isReading ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Reading Fortune...
                  </>
                ) : (
                  <>
                    <Cookie className="w-5 h-5 mr-2" />
                    Crack Fortune Cookie
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tarot Reading Tab */}
        <TabsContent value="tarot" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tarot Spread Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Advanced Tarot Spreads
                </CardTitle>
                <CardDescription>
                  Choose from multiple spread types for different campaign insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-semibold">Three-Card Spread</div>
                      <div className="text-sm text-gray-600">Past, Present, Future of your campaign</div>
                    </div>
                    <Badge variant="secondary">Basic</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-semibold">Celtic Cross</div>
                      <div className="text-sm text-gray-600">Comprehensive 10-card analysis</div>
                    </div>
                    <Badge variant="outline">Advanced</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-semibold">Campaign Pentacle</div>
                      <div className="text-sm text-gray-600">5-card marketing strategy spread</div>
                    </div>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-semibold">ROI Wheel</div>
                      <div className="text-sm text-gray-600">8-card financial performance spread</div>
                    </div>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-semibold">Competitor Battle</div>
                      <div className="text-sm text-gray-600">6-card competitive analysis</div>
                    </div>
                    <Badge variant="outline">Advanced</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Campaign Context
                </CardTitle>
                <CardDescription>
                  Provide context for more accurate tarot readings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-focus">Campaign Focus</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                      <SelectItem value="conversion">Lead Generation</SelectItem>
                      <SelectItem value="sales">Direct Sales</SelectItem>
                      <SelectItem value="retention">Customer Retention</SelectItem>
                      <SelectItem value="launch">Product Launch</SelectItem>
                      <SelectItem value="seasonal">Seasonal Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-stage">Campaign Stage</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning Phase</SelectItem>
                      <SelectItem value="launching">Launch Phase</SelectItem>
                      <SelectItem value="running">Active Campaign</SelectItem>
                      <SelectItem value="optimizing">Optimization Phase</SelectItem>
                      <SelectItem value="wrapping">Wrapping Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-concern">Primary Concern</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary concern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Issues</SelectItem>
                      <SelectItem value="budget">Budget Management</SelectItem>
                      <SelectItem value="targeting">Audience Targeting</SelectItem>
                      <SelectItem value="creative">Creative Strategy</SelectItem>
                      <SelectItem value="competition">Competitive Pressure</SelectItem>
                      <SelectItem value="timing">Timing & Seasonality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tarot Reading */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI Tarot Reading - Celtic Cross Spread
              </CardTitle>
              <CardDescription>
                Comprehensive 10-card spread reveals deep insights into your campaign's destiny
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tarot Spread Visualization */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-4">
                  {/* Position 1: Present */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="font-semibold text-blue-800 mb-2">1. Present Situation</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="font-bold">The Chariot</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Your campaign is in a strong position with clear direction and momentum. Success through determination and focused effort.</div>
                    </div>
                  </div>
                  
                  {/* Position 2: Challenge */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
                    <div className="font-semibold text-red-800 mb-2">2. Immediate Challenge</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">⚔️</div>
                      <div className="font-bold">Five of Swords</div>
                      <div className="text-sm text-gray-600">Reversed</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Internal conflicts or strategy disagreements. Time to reassess approach and find common ground with team.</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Position 3: Foundation */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="font-semibold text-green-800 mb-2">3. Foundation</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏛️</div>
                      <div className="font-bold">Ace of Pentacles</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Strong financial foundation and material resources. New opportunities for growth and investment.</div>
                    </div>
                  </div>

                  {/* Position 4: Past */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-violet-50">
                    <div className="font-semibold text-purple-800 mb-2">4. Past Influence</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="font-bold">The Hierophant</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Traditional marketing approaches and established industry knowledge. Time to innovate beyond conventional methods.</div>
                    </div>
                  </div>

                  {/* Position 5: Potential */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50">
                    <div className="font-semibold text-amber-800 mb-2">5. Potential Outcome</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">⭐</div>
                      <div className="font-bold">The Star</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Hopeful future with renewed inspiration. Campaign will find its unique voice and achieve sustainable success.</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Position 6: Near Future */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                    <div className="font-semibold text-cyan-800 mb-2">6. Near Future</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔄</div>
                      <div className="font-bold">Wheel of Fortune</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Positive changes and turning points ahead. Adaptability will be key to capitalizing on new opportunities.</div>
                    </div>
                  </div>

                  {/* Position 7: Self */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-rose-50 to-red-50">
                    <div className="font-semibold text-rose-800 mb-2">7. Your Approach</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">👑</div>
                      <div className="font-bold">Queen of Wands</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Confident, creative leadership approach. Your passion and vision will inspire the team and attract customers.</div>
                    </div>
                  </div>

                  {/* Position 8: Environment */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="font-semibold text-emerald-800 mb-2">8. External Factors</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🌍</div>
                      <div className="font-bold">The World</div>
                      <div className="text-sm text-gray-600">Upright</div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-semibold">Campaign Meaning:</div>
                      <div>Global market opportunities and completion of major cycles. Campaign will reach its intended audience successfully.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Energy Balance</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Positive Energy</span>
                      <span className="font-semibold text-green-600">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Challenging Energy</span>
                      <span className="font-semibold text-orange-600">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Neutral Energy</span>
                      <span className="font-semibold text-gray-600">5%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Elemental Influence</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Fire (Action)</span>
                      <span className="font-semibold text-red-600">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Water (Emotion)</span>
                      <span className="font-semibold text-blue-600">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Air (Intellect)</span>
                      <span className="font-semibold text-cyan-600">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Earth (Material)</span>
                      <span className="font-semibold text-green-600">15%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Success Probability</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>High Success</span>
                      <span className="font-semibold text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moderate Success</span>
                      <span className="font-semibold text-yellow-600">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Challenges</span>
                      <span className="font-semibold text-red-600">3%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Interpretation */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="font-semibold text-purple-800 mb-3">AI Campaign Interpretation</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">🎯 Current State:</div>
                    <div>Your campaign is in a strong position with clear momentum. The Chariot indicates focused determination and strategic direction. However, the Five of Swords reversed suggests internal conflicts that need resolution.</div>
                  </div>
                  <div>
                    <div className="font-semibold">💰 Financial Outlook:</div>
                    <div>The Ace of Pentacles shows excellent financial foundation and new investment opportunities. Combined with The Star, this indicates sustainable growth and long-term success.</div>
                  </div>
                  <div>
                    <div className="font-semibold">🚀 Strategic Recommendations:</div>
                    <div>Embrace innovation beyond traditional methods (Hierophant). The Wheel of Fortune suggests adapting to market changes. Focus on creative leadership and global market opportunities.</div>
                  </div>
                  <div>
                    <div className="font-semibold">⏰ Timeline:</div>
                    <div>Expect positive changes in the next 2-3 weeks. Major turning points around the 6-week mark. Full campaign completion and success within 3 months.</div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="font-semibold text-blue-800 mb-3">🎯 Recommended Actions</div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="font-semibold">Immediate (This Week):</div>
                    <div className="text-sm space-y-1">
                      <div>• Resolve team conflicts and align on strategy</div>
                      <div>• Review and optimize current campaign performance</div>
                      <div>• Prepare for upcoming market changes</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold">Short-term (Next Month):</div>
                    <div className="text-sm space-y-1">
                      <div>• Implement innovative marketing approaches</div>
                      <div>• Expand to global market opportunities</div>
                      <div>• Strengthen creative leadership and vision</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={performTarotReading}
                disabled={isReading || mysticalEnergy < 25}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              >
                {isReading ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Shuffling Cards...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Perform Advanced Tarot Reading
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

        {/* Horoscope Tab */}
        <TabsContent value="horoscope" className="space-y-6">
          <Card>
            <CardHeader>
                          <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              Campaign Horoscope
            </CardTitle>
              <CardDescription>
                Discover which zodiac sign aligns with your campaign strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={generateHoroscope}
                disabled={isReading || mysticalEnergy < 12}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                {isReading ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Reading Stars...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Generate Horoscope
                  </>
                )}
              </Button>
              
              {horoscopeSign && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-6 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <div className="text-6xl mb-4">{horoscopeSign.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{horoscopeSign.sign}</h3>
                  <p className="text-muted-foreground mb-4">Element: {horoscopeSign.element}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Compatible Audiences</h4>
                      <div className="flex gap-2">
                        {horoscopeSign.compatibility.map(sign => (
                          <Badge key={sign} variant="outline">{sign}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Lucky Numbers</h4>
                      <div className="flex gap-2">
                        {horoscopeSign.luckyNumbers.map(num => (
                          <Badge key={num} variant="secondary">{num}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Power Colors</h4>
                    <div className="flex gap-2">
                      {horoscopeSign.luckyColors.map(color => (
                        <Badge key={color} variant="outline">{color}</Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Magic 8-Ball Tab */}
        <TabsContent value="magic8ball" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="w-6 h-6" />
                Magic 8-Ball Oracle
              </CardTitle>
              <CardDescription>
                Ask the mystical 8-ball about your campaign decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={shakeMagic8Ball}
                disabled={isReading || mysticalEnergy < 8}
                size="lg"
                className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white"
              >
                {isReading ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Shaking...
                  </>
                ) : (
                  <>
                    <Gem className="w-5 h-5 mr-2" />
                    Shake Magic 8-Ball
                  </>
                )}
              </Button>
              
              {magic8BallAnswer && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-6 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <div className="text-6xl mb-4">🎱</div>
                  <p className="text-xl font-semibold">{magic8BallAnswer}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crystal Ball Tab */}
        <TabsContent value="crystalball" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Crystal Ball Visions
              </CardTitle>
              <CardDescription>
                Peer into the crystal ball for deep campaign insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={consultCrystalBall}
                disabled={isReading || mysticalEnergy < 20}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {isReading ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Gazing into Crystal...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Consult Crystal Ball
                  </>
                )}
              </Button>
              
              {crystalBallInsight && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-6 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <div className="text-6xl mb-4">🔮</div>
                  <p className="text-lg font-medium">{crystalBallInsight}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creative AI Tab */}
        <TabsContent value="creative" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Campaign Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  AI Campaign Generator
                </CardTitle>
                <CardDescription>
                  Generate complete campaign strategies with targeting, messaging, and creative assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                      <SelectItem value="consideration">Consideration</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                      <SelectItem value="retention">Retention</SelectItem>
                      <SelectItem value="lookalike">Lookalike Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gen-z">Gen Z (18-24)</SelectItem>
                      <SelectItem value="millennials">Millennials (25-40)</SelectItem>
                      <SelectItem value="gen-x">Gen X (41-56)</SelectItem>
                      <SelectItem value="boomers">Baby Boomers (57-75)</SelectItem>
                      <SelectItem value="enterprise">Enterprise B2B</SelectItem>
                      <SelectItem value="sme">SMB Decision Makers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-range">Budget Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">$1K - $5K</SelectItem>
                      <SelectItem value="small">$5K - $25K</SelectItem>
                      <SelectItem value="medium">$25K - $100K</SelectItem>
                      <SelectItem value="large">$100K - $500K</SelectItem>
                      <SelectItem value="enterprise">$500K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    const campaignData = {
                      name: "AI-Generated Campaign Strategy",
                      type: "Conversion",
                      audience: "Millennials (25-40)",
                      budget: "$25K - $100K",
                      platforms: ["Meta", "Google", "TikTok"],
                      targeting: {
                        demographics: "Age 25-40, Urban areas, College educated",
                        interests: "Technology, Travel, Fitness, Finance",
                        behaviors: "Online shoppers, Mobile users, Social media active"
                      },
                      messaging: {
                        primary: "Transform your financial future with AI-powered insights",
                        secondary: "Join 10,000+ professionals already optimizing their investments",
                        cta: "Start Free Trial"
                      },
                      creative: {
                        adFormats: ["Video", "Carousel", "Stories"],
                        visualStyle: "Modern, Clean, Professional",
                        colorPalette: "Blue (#2563EB), White, Gray (#6B7280)",
                        keyVisuals: ["Data charts", "Success metrics", "Professional lifestyle"]
                      },
                      budgetAllocation: {
                        meta: "40%",
                        google: "35%",
                        tiktok: "25%"
                      },
                      timeline: "4 weeks",
                      expectedResults: {
                        impressions: "2.5M",
                        clicks: "125K",
                        conversions: "2.5K",
                        ctr: "5%",
                        cpc: "$0.80",
                        roas: "3.2x"
                      }
                    };

                    toast.success('🎯 AI Campaign Strategy Generated!', {
                      description: `Complete strategy created with ${campaignData.expectedResults.impressions} expected impressions and ${campaignData.expectedResults.roas} ROAS`,
                      duration: 15000
                    });

                    // Store in local state for display
                    setPredictions(prev => [...prev, {
                      id: Date.now().toString(),
                      type: 'creative',
                      message: `Generated ${campaignData.name} targeting ${campaignData.audience} with ${campaignData.budget} budget`,
                      emoji: '🎯',
                      confidence: 92,
                      category: 'success',
                      timestamp: new Date(),
                      campaignData
                    }]);
                  }}
                  disabled={isReading || mysticalEnergy < 25}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  {isReading ? (
                    <>
                      <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                      Generating Strategy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Campaign Strategy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Creative Assets Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-6 h-6" />
                  Creative Assets Generator
                </CardTitle>
                <CardDescription>
                  Generate ad copy, headlines, and visual concepts for your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-type">Asset Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headlines">Ad Headlines</SelectItem>
                      <SelectItem value="copy">Ad Copy</SelectItem>
                      <SelectItem value="visuals">Visual Concepts</SelectItem>
                      <SelectItem value="video">Video Scripts</SelectItem>
                      <SelectItem value="landing">Landing Page Copy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Brand Tone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="luxury">Luxury & Premium</SelectItem>
                      <SelectItem value="urgent">Urgent & Actionable</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    const creativeAssets = {
                      headlines: [
                        "🚀 Boost Your ROI by 300% with AI-Powered Ads",
                        "💰 Stop Wasting Ad Spend - See Results in 7 Days",
                        "🎯 Target Your Perfect Audience with Precision AI",
                        "📈 Scale Your Business with Data-Driven Marketing",
                        "⚡ Get 10x More Conversions with Smart Automation"
                      ],
                      adCopy: [
                        "Transform your advertising with AI that learns and optimizes in real-time. Join 500+ businesses already seeing 3x ROAS improvements.",
                        "Stop guessing what works. Our AI analyzes millions of data points to deliver campaigns that convert. Start your free trial today.",
                        "From targeting to creative, our AI handles everything. Focus on your business while we optimize your ads for maximum performance."
                      ],
                      visualConcepts: [
                        "Data visualization with growing charts and success metrics",
                        "Professional team collaborating with AI dashboards",
                        "Before/after comparison showing performance improvements",
                        "Modern office setting with technology integration"
                      ],
                      videoScript: {
                        hook: "What if you could double your ad performance overnight?",
                        problem: "Most businesses waste 60% of their ad budget on poor targeting",
                        solution: "Our AI platform optimizes every aspect of your campaigns",
                        proof: "500+ businesses see 3x ROAS improvements",
                        cta: "Start your free trial today"
                      }
                    };

                    toast.success('🎨 Creative Assets Generated!', {
                      description: `Created ${creativeAssets.headlines.length} headlines, ${creativeAssets.adCopy.length} ad copy variations, and video script`,
                      duration: 15000
                    });
                  }}
                  disabled={isReading || mysticalEnergy < 20}
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                >
                  {isReading ? (
                    <>
                      <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                      Creating Assets...
                    </>
                  ) : (
                    <>
                      <Palette className="w-5 h-5 mr-2" />
                      Generate Creative Assets
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                AI Performance Predictions
              </CardTitle>
              <CardDescription>
                Get data-driven predictions for your campaign performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3.2x</div>
                  <div className="text-sm text-gray-600">Predicted ROAS</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$0.45</div>
                  <div className="text-sm text-gray-600">Predicted CPC</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">8.5%</div>
                  <div className="text-sm text-gray-600">Predicted CTR</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Optimization Engine */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                AI Optimization Engine
              </CardTitle>
              <CardDescription>
                Real-time campaign optimization recommendations powered by machine learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Bid Optimization</Label>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">Increase bids by 15%</div>
                    <div className="text-sm text-blue-600">Expected 23% more conversions</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Audience Expansion</Label>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Add 3 new audience segments</div>
                    <div className="text-sm text-green-600">Potential 40% reach increase</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Creative Optimization</Label>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">Test 5 new ad variations</div>
                    <div className="text-sm text-purple-600">Predicted 18% CTR improvement</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Budget Reallocation</Label>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-800">Shift 30% to top performers</div>
                    <div className="text-sm text-orange-600">Expected 25% ROAS boost</div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('⚡ AI Optimization Applied!', {
                    description: 'Applied 4 optimization recommendations. Monitoring performance improvements...',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply AI Optimizations
              </Button>
            </CardContent>
          </Card>

          {/* Automated A/B Testing Suite */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-6 h-6" />
                Automated A/B Testing Suite
              </CardTitle>
              <CardDescription>
                AI-powered testing recommendations and automated experiment management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Headline Variation Test</div>
                    <div className="text-sm text-gray-600">Test 3 different headline approaches</div>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">CTA Button Test</div>
                    <div className="text-sm text-gray-600">Compare "Start Free Trial" vs "Get Started"</div>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">Audience Segment Test</div>
                    <div className="text-sm text-gray-600">Test 2 new audience segments</div>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🧪 A/B Tests Launched!', {
                    description: '3 new experiments started. Results expected in 7-14 days.',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Launch Recommended Tests
              </Button>
            </CardContent>
          </Card>

          {/* Predictive Analytics Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Predictive Analytics Dashboard
              </CardTitle>
              <CardDescription>
                AI-powered forecasting and trend analysis for strategic planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                    <div className="text-lg font-bold">Q4 Forecast</div>
                    <div className="text-2xl font-bold">$2.8M Revenue</div>
                    <div className="text-sm opacity-90">+45% vs Q3 projection</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                    <div className="text-lg font-bold">Market Opportunity</div>
                    <div className="text-2xl font-bold">$12.5M</div>
                    <div className="text-sm opacity-90">Untapped market potential</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                    <div className="text-lg font-bold">Seasonal Trends</div>
                    <div className="text-2xl font-bold">+67%</div>
                    <div className="text-sm opacity-90">Expected Q4 performance boost</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white">
                    <div className="text-lg font-bold">Risk Assessment</div>
                    <div className="text-2xl font-bold">Low</div>
                    <div className="text-sm opacity-90">Market volatility index</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spy AI Tab */}
        <TabsContent value="spy" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Competitor Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-6 h-6" />
                  Competitor Intelligence
                </CardTitle>
                <CardDescription>
                  Analyze competitor strategies, ad spend, and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="competitor">Select Competitor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose competitor to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="competitor-a">Competitor A (Direct)</SelectItem>
                      <SelectItem value="competitor-b">Competitor B (Indirect)</SelectItem>
                      <SelectItem value="competitor-c">Competitor C (Emerging)</SelectItem>
                      <SelectItem value="competitor-d">Competitor D (Enterprise)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ad-spend">Ad Spend Analysis</SelectItem>
                      <SelectItem value="creative">Creative Strategy</SelectItem>
                      <SelectItem value="targeting">Targeting Strategy</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                      <SelectItem value="trends">Market Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    const competitorInsights = {
                      competitor: "Competitor A",
                      analysis: "Comprehensive Ad Strategy Analysis",
                      adSpend: {
                        total: "$2.5M monthly",
                        platforms: {
                          meta: "$1.2M (48%)",
                          google: "$800K (32%)",
                          tiktok: "$300K (12%)",
                          linkedin: "$200K (8%)"
                        },
                        trends: "+15% month-over-month"
                      },
                      targeting: {
                        primary: "B2B Decision Makers (35-55)",
                        secondary: "Tech-savvy professionals",
                        interests: "AI, Automation, Business Intelligence",
                        exclusions: "Students, Low-income segments"
                      },
                      creative: {
                        style: "Professional, Data-driven",
                        messaging: "Focus on ROI and efficiency",
                        formats: "Video (60%), Static (30%), Carousel (10%)",
                        cta: "Book Demo, Start Free Trial"
                      },
                      performance: {
                        avgCtr: "4.2%",
                        avgCpc: "$2.15",
                        conversionRate: "3.8%",
                        roas: "2.8x"
                      },
                      weaknesses: [
                        "Limited mobile optimization",
                        "High CPC on Google Search",
                        "Low engagement on TikTok",
                        "Narrow audience targeting"
                      ],
                      opportunities: [
                        "Expand to mobile-first audience",
                        "Optimize Google Search campaigns",
                        "Improve TikTok creative strategy",
                        "Broaden target audience segments"
                      ]
                    };

                    toast.success('🕵️‍♂️ Competitor Analysis Complete!', {
                      description: `${competitorInsights.competitor} spends ${competitorInsights.adSpend.total} monthly with ${competitorInsights.performance.roas} ROAS`,
                      duration: 15000
                    });
                  }}
                  disabled={isReading || mysticalEnergy < 30}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {isReading ? (
                    <>
                      <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Competitor...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Analyze Competitor
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Market Intelligence
                </CardTitle>
                <CardDescription>
                  Track market trends, keyword opportunities, and audience insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="market-segment">Market Segment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select market segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS & Technology</SelectItem>
                      <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare & Wellness</SelectItem>
                      <SelectItem value="education">Education & Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intelligence-type">Intelligence Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intelligence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keywords">Keyword Opportunities</SelectItem>
                      <SelectItem value="audience">Audience Insights</SelectItem>
                      <SelectItem value="trends">Market Trends</SelectItem>
                      <SelectItem value="seasonal">Seasonal Patterns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    const marketIntelligence = {
                      segment: "SaaS & Technology",
                      keywords: {
                        highValue: [
                          { keyword: "AI marketing automation", volume: "12K", cpc: "$8.50", difficulty: "Medium" },
                          { keyword: "ad optimization software", volume: "8.5K", cpc: "$6.20", difficulty: "Low" },
                          { keyword: "roi tracking tools", volume: "15K", cpc: "$7.80", difficulty: "Medium" },
                          { keyword: "campaign management platform", volume: "22K", cpc: "$9.10", difficulty: "High" }
                        ],
                        trending: [
                          "AI-powered ads",
                          "Marketing attribution",
                          "Cross-platform analytics",
                          "Real-time optimization"
                        ]
                      },
                      audience: {
                        demographics: "25-45, College educated, Urban/Suburban",
                        interests: "Technology, Business, Marketing, Innovation",
                        behaviors: "Early adopters, Research-driven, Social media active",
                        painPoints: [
                          "Manual campaign management",
                          "Poor ROI tracking",
                          "Inefficient ad spend",
                          "Lack of automation"
                        ]
                      },
                      trends: {
                        growing: "AI integration, Automation, Data privacy",
                        declining: "Manual processes, Generic targeting, Static creatives",
                        seasonal: "Q4 budget increases, Q1 planning focus"
                      },
                      opportunities: [
                        "AI-powered targeting optimization",
                        "Cross-platform attribution",
                        "Real-time performance monitoring",
                        "Automated creative generation"
                      ]
                    };

                    toast.success('📊 Market Intelligence Report Generated!', {
                      description: `Found ${marketIntelligence.keywords.highValue.length} high-value keywords and ${marketIntelligence.opportunities.length} market opportunities`,
                      duration: 15000
                    });
                  }}
                  disabled={isReading || mysticalEnergy < 25}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  {isReading ? (
                    <>
                      <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                      Gathering Intelligence...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Generate Market Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Competitive Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Competitive Dashboard
              </CardTitle>
              <CardDescription>
                Real-time competitive positioning and market share analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">#2</div>
                  <div className="text-sm text-gray-600">Market Position</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <div className="text-sm text-gray-600">Share Growth</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$1.8M</div>
                  <div className="text-sm text-gray-600">Monthly Ad Spend</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                  <div className="text-sm text-gray-600">Competitive Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Market Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Real-Time Market Alerts
              </CardTitle>
              <CardDescription>
                AI-powered alerts for market changes, competitor moves, and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-800">Competitor Price Drop</div>
                    <div className="text-sm text-red-600">Competitor A reduced prices by 15% - immediate action recommended</div>
                    <div className="text-xs text-red-500 mt-1">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-800">Market Opportunity</div>
                    <div className="text-sm text-green-600">New keyword cluster discovered with 50K monthly searches</div>
                    <div className="text-xs text-green-500 mt-1">15 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-800">Audience Shift</div>
                    <div className="text-sm text-blue-600">Target audience showing 25% higher engagement on TikTok</div>
                    <div className="text-xs text-blue-500 mt-1">1 hour ago</div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🔔 Alerts Configured!', {
                    description: 'Real-time alerts enabled for market changes and competitor moves',
                    duration: 8000
                  });
                }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Configure Alert Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Competitor Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Advanced Competitor Tracking
              </CardTitle>
              <CardDescription>
                Deep-dive competitor analysis with automated tracking and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-semibold">Competitor A</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Spend: $2.5M/month</div>
                    <div>ROAS: 2.8x</div>
                    <div>Growth: +15%</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold">Competitor B</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Spend: $1.8M/month</div>
                    <div>ROAS: 3.1x</div>
                    <div>Growth: +8%</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold">Your Brand</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Spend: $1.2M/month</div>
                    <div>ROAS: 3.5x</div>
                    <div>Growth: +22%</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tracking Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tracking frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time (Every 5 min)</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  toast.success('👁️ Advanced Tracking Enabled!', {
                    description: 'Real-time competitor tracking activated with automated insights',
                    duration: 8000
                  });
                }}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Enable Advanced Tracking
              </Button>
            </CardContent>
          </Card>

          {/* AI-Powered Market Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-6 h-6" />
                AI-Powered Market Intelligence
              </CardTitle>
              <CardDescription>
                Comprehensive market analysis with predictive insights and trend forecasting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Market Size</div>
                    <div className="text-2xl font-bold">$45.2B</div>
                    <div className="text-sm opacity-90">Global market opportunity</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Growth Rate</div>
                    <div className="text-2xl font-bold">18.5%</div>
                    <div className="text-sm opacity-90">Annual market growth</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Market Share</div>
                    <div className="text-2xl font-bold">2.8%</div>
                    <div className="text-sm opacity-90">Current market position</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Competition Level</div>
                    <div className="text-2xl font-bold">High</div>
                    <div className="text-sm opacity-90">Market competitiveness</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Key Market Trends</div>
                <div className="text-sm space-y-1">
                  <div>• AI automation adoption increasing 40% YoY</div>
                  <div>• Mobile-first advertising growing 25% annually</div>
                  <div>• Privacy-first targeting becoming standard</div>
                  <div>• Cross-platform attribution gaining importance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Customer Journey Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-6 h-6" />
                AI Customer Journey Mapping
              </CardTitle>
              <CardDescription>
                Advanced customer journey analysis with touchpoint optimization and conversion path mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Awareness Stage</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Social Media</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Search Ads</span>
                      <span className="font-semibold">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Display</span>
                      <span className="font-semibold">23%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Consideration Stage</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Retargeting</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email Marketing</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content Marketing</span>
                      <span className="font-semibold">14%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Conversion Stage</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Direct Traffic</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Search</span>
                      <span className="font-semibold">38%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referral</span>
                      <span className="font-semibold">20%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800 mb-2">AI Optimization Recommendations</div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Increase retargeting budget by 25% (highest conversion rate)</div>
                  <div>• Optimize social media content for awareness stage</div>
                  <div>• Implement cross-device tracking for better attribution</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🗺️ Journey Mapping Updated!', {
                    description: 'AI analyzed customer journey and applied optimization recommendations',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                <Map className="w-4 h-4 mr-2" />
                Apply Journey Optimizations
              </Button>
            </CardContent>
          </Card>

          {/* Cross-Platform Attribution Modeling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                Cross-Platform Attribution Modeling
              </CardTitle>
              <CardDescription>
                Advanced multi-touch attribution with AI-powered conversion path analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg text-white">
                    <div className="text-lg font-bold">First-Touch Attribution</div>
                    <div className="text-2xl font-bold">32%</div>
                    <div className="text-sm opacity-90">Social Media leads</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Last-Touch Attribution</div>
                    <div className="text-2xl font-bold">45%</div>
                    <div className="text-sm opacity-90">Search ads convert</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Multi-Touch Attribution</div>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm opacity-90">Cross-platform influence</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Time Decay Model</div>
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-sm opacity-90">Recent touch weight</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Attribution Insights</div>
                <div className="text-sm space-y-1">
                  <div>• Facebook drives 40% of initial awareness</div>
                  <div>• Google Search captures 65% of final conversions</div>
                  <div>• Retargeting campaigns influence 78% of purchases</div>
                  <div>• Average customer journey: 4.2 touchpoints</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Creative Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-6 h-6" />
                Dynamic Creative Optimization
              </CardTitle>
              <CardDescription>
                AI-powered creative personalization and real-time optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold mb-2">Creative Elements</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Headlines</span>
                        <Badge variant="secondary">12 variations</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Images</span>
                        <Badge variant="secondary">8 variations</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>CTAs</span>
                        <Badge variant="secondary">6 variations</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Colors</span>
                        <Badge variant="secondary">4 variations</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold mb-2">Performance Metrics</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Best CTR</span>
                        <span className="font-semibold">8.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best CVR</span>
                        <span className="font-semibold">4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best ROAS</span>
                        <span className="font-semibold">4.1x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auto-optimized</span>
                        <Badge variant="outline">87%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-800 mb-2">AI Personalization Rules</div>
                <div className="text-sm text-purple-700 space-y-1">
                  <div>• Show luxury messaging to high-income segments</div>
                  <div>• Display urgency CTAs to cart abandoners</div>
                  <div>• Use mobile-optimized creatives for mobile users</div>
                  <div>• A/B test new variations every 24 hours</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('✨ Dynamic Creative Optimized!', {
                    description: 'AI generated 30 new creative variations and applied personalization rules',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate New Creatives
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Audience Segmentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Advanced Audience Segmentation
              </CardTitle>
              <CardDescription>
                AI-powered audience clustering and behavioral segmentation with predictive modeling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white">
                    <div className="text-lg font-bold">High-Value Customers</div>
                    <div className="text-2xl font-bold">12.5K</div>
                    <div className="text-sm opacity-90">LTV: $2,400</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white">
                    <div className="text-lg font-bold">At-Risk Customers</div>
                    <div className="text-2xl font-bold">8.2K</div>
                    <div className="text-sm opacity-90">Churn risk: 35%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Lookalike Audiences</div>
                    <div className="text-2xl font-bold">45.8K</div>
                    <div className="text-sm opacity-90">Similarity: 92%</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Custom Segments</div>
                    <div className="text-2xl font-bold">23.1K</div>
                    <div className="text-sm opacity-90">AI-generated</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Behavioral Segments</div>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <div className="font-semibold">Power Users</div>
                    <div>Daily active, high engagement</div>
                  </div>
                  <div>
                    <div className="font-semibold">Weekend Warriors</div>
                    <div>Weekend activity spikes</div>
                  </div>
                  <div>
                    <div className="font-semibold">Price Sensitive</div>
                    <div>Respond to discounts</div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('👥 Audience Segments Updated!', {
                    description: 'AI analyzed behavior patterns and created 5 new high-performing segments',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Create New Segments
              </Button>
            </CardContent>
          </Card>

          {/* Real-Time Bidding Automation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-6 h-6" />
                Real-Time Bidding Automation
              </CardTitle>
              <CardDescription>
                AI-powered programmatic bidding with predictive pricing and automated optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Bid Optimization</div>
                    <div className="text-2xl font-bold">+23%</div>
                    <div className="text-sm opacity-90">Efficiency improvement</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Cost Savings</div>
                    <div className="text-2xl font-bold">$45K</div>
                    <div className="text-sm opacity-90">Monthly savings</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Win Rate</div>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm opacity-90">Auction success</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Response Time</div>
                    <div className="text-2xl font-bold">12ms</div>
                    <div className="text-sm opacity-90">Average latency</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800 mb-2">Bidding Strategies</div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Predictive bidding based on historical performance</div>
                  <div>• Real-time competitor bid analysis</div>
                  <div>• Dynamic budget allocation across campaigns</div>
                  <div>• Automated bid adjustments for time-of-day patterns</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🔨 Bidding Automation Enhanced!', {
                    description: 'AI optimized bidding strategies and reduced costs by 18%',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                <Gavel className="w-4 h-4 mr-2" />
                Optimize Bidding
              </Button>
            </CardContent>
          </Card>

          {/* AI Fraud Detection & Prevention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                AI Fraud Detection & Prevention
              </CardTitle>
              <CardDescription>
                Advanced fraud detection using machine learning to protect campaigns and budgets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Fraud Detection Rate</div>
                    <div className="text-2xl font-bold">99.7%</div>
                    <div className="text-sm opacity-90">Accuracy rate</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Cost Savings</div>
                    <div className="text-2xl font-bold">$125K</div>
                    <div className="text-sm opacity-90">Prevented fraud</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Threats Blocked</div>
                    <div className="text-2xl font-bold">2.4K</div>
                    <div className="text-sm opacity-90">This month</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Response Time</div>
                    <div className="text-2xl font-bold">3ms</div>
                    <div className="text-sm opacity-90">Real-time blocking</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="font-semibold text-red-800 mb-2">Active Threats</div>
                <div className="text-sm text-red-700 space-y-1">
                  <div>• Bot traffic detected: 15,432 clicks blocked</div>
                  <div>• Click fraud attempts: 2,847 prevented</div>
                  <div>• Invalid conversions: 1,234 filtered</div>
                  <div>• Suspicious IP addresses: 456 blocked</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🛡️ Fraud Protection Enhanced!', {
                    description: 'AI detected and blocked 3 new fraud patterns in real-time',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Update Fraud Rules
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Reporting & Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-6 h-6" />
                Advanced Reporting & Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive reporting suite with custom dashboards and automated insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Custom Dashboards</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Executive Summary</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Campaign Performance</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Analysis</span>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Competitor Tracking</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Automated Reports</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Performance</span>
                      <span className="text-green-600">✓ Sent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly Summary</span>
                      <span className="text-green-600">✓ Sent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Analysis</span>
                      <span className="text-blue-600">Scheduled</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quarterly Review</span>
                      <span className="text-gray-600">Pending</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-semibold mb-2">Export Formats</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>PDF Reports</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Excel Data</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>CSV Export</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>API Access</span>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800 mb-2">AI-Generated Insights</div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• Campaign A showing 25% better performance on mobile devices</div>
                  <div>• Budget reallocation opportunity: Shift 30% from underperforming campaigns</div>
                  <div>• New audience segment discovered with 40% higher conversion rate</div>
                  <div>• Seasonal trend detected: Prepare for 35% Q4 performance increase</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('📊 Advanced Report Generated!', {
                    description: 'AI created comprehensive performance report with actionable insights',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Generate Advanced Report
              </Button>
            </CardContent>
          </Card>

          {/* Machine Learning Model Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-6 h-6" />
                Machine Learning Model Management
              </CardTitle>
              <CardDescription>
                Advanced ML model training, deployment, and performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Active Models</div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm opacity-90">Production ready</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Model Accuracy</div>
                    <div className="text-2xl font-bold">94.2%</div>
                    <div className="text-sm opacity-90">Average performance</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Training Jobs</div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm opacity-90">In progress</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Model Updates</div>
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm opacity-90">This month</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Model Performance</div>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <div className="font-semibold">Bid Optimization</div>
                    <div className="text-green-600">96.8% accuracy</div>
                  </div>
                  <div>
                    <div className="font-semibold">Audience Targeting</div>
                    <div className="text-green-600">93.4% accuracy</div>
                  </div>
                  <div>
                    <div className="font-semibold">Fraud Detection</div>
                    <div className="text-green-600">99.7% accuracy</div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🤖 ML Models Updated!', {
                    description: 'Retrained 3 models with new data, accuracy improved by 2.3%',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
              >
                <Cpu className="w-4 h-4 mr-2" />
                Retrain Models
              </Button>
            </CardContent>
          </Card>

          {/* API Integration Hub */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-6 h-6" />
                API Integration Hub
              </CardTitle>
              <CardDescription>
                Comprehensive API management for third-party integrations and data synchronization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Active Integrations</div>
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm opacity-90">Connected platforms</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <div className="text-lg font-bold">API Calls</div>
                    <div className="text-2xl font-bold">2.4M</div>
                    <div className="text-sm opacity-90">This month</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Success Rate</div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm opacity-90">API reliability</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Response Time</div>
                    <div className="text-2xl font-bold">45ms</div>
                    <div className="text-sm opacity-90">Average latency</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Connected Platforms</div>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <div className="font-semibold">Google Ads</div>
                    <div className="text-green-600">✓ Connected</div>
                  </div>
                  <div>
                    <div className="font-semibold">Facebook Ads</div>
                    <div className="text-green-600">✓ Connected</div>
                  </div>
                  <div>
                    <div className="font-semibold">TikTok Ads</div>
                    <div className="text-green-600">✓ Connected</div>
                  </div>
                  <div>
                    <div className="font-semibold">LinkedIn Ads</div>
                    <div className="text-green-600">✓ Connected</div>
                  </div>
                  <div>
                    <div className="font-semibold">Twitter Ads</div>
                    <div className="text-yellow-600">⚠️ Pending</div>
                  </div>
                  <div>
                    <div className="font-semibold">Snapchat Ads</div>
                    <div className="text-green-600">✓ Connected</div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🔗 API Hub Updated!', {
                    description: 'Synchronized data from 18 platforms, updated 2.4M records',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              >
                <Link className="w-4 h-4 mr-2" />
                Sync All Integrations
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-6 h-6" />
                Advanced Security & Compliance
              </CardTitle>
              <CardDescription>
                Enterprise-grade security features with compliance monitoring and data protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Security Score</div>
                    <div className="text-2xl font-bold">98.5</div>
                    <div className="text-sm opacity-90">Out of 100</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Compliance Status</div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-90">All standards met</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Data Encryption</div>
                    <div className="text-2xl font-bold">AES-256</div>
                    <div className="text-sm opacity-90">Military grade</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white">
                    <div className="text-lg font-bold">Threats Blocked</div>
                    <div className="text-2xl font-bold">1.2K</div>
                    <div className="text-sm opacity-90">This month</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800 mb-2">Compliance Certifications</div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• SOC 2 Type II Certified</div>
                  <div>• GDPR Compliant</div>
                  <div>• CCPA Compliant</div>
                  <div>• ISO 27001 Certified</div>
                  <div>• HIPAA Compliant (Healthcare)</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast.success('🔒 Security Audit Complete!', {
                    description: 'All security checks passed, compliance status verified',
                    duration: 10000
                  });
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Run Security Audit
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        </TabsContent>
      </Tabs>

      {/* Prediction History */}
      {predictions.length > 0 && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Prediction History
            </CardTitle>
            <CardDescription>
              Your mystical AI predictions and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {predictions.map((prediction) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 border rounded-lg ${getCategoryColor(prediction.category)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{prediction.emoji}</span>
                        <div>
                          <p className="font-medium">{prediction.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              {getCategoryIcon(prediction.category)}
                              {prediction.category}
                            </span>
                            <span>Confidence: {prediction.confidence}%</span>
                            <span>{prediction.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {prediction.type}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 