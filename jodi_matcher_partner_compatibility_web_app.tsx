import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, User, Users, CheckCircle, ArrowRight, ArrowLeft, 
  RefreshCw, Award, Smile, Compass, BookOpen, Target, Check, ShieldCheck 
} from 'lucide-react';

export default function App() {
  // Navigation & Active View state: 'welcome' | 'setup' | 'questionnaire' | 'results'
  const [view, setView] = useState('welcome');
  const [activeUserIndex, setActiveUserIndex] = useState(0); // 0 = Person 1, 1 = Person 2

  // Multi-step form index (0 to 4)
  const [step, setStep] = useState(0);

  // User profiles state
  const [profiles, setProfiles] = useState([
    {
      name: '',
      gender: '',
      targetGender: '',
      age: 25,
      location: 'Kathmandu',
      traits: [],
      values: [],
      hobbies: [],
      lifeGoals: '',
      loveLanguage: '',
      communicationStyle: ''
    },
    {
      name: '',
      gender: '',
      targetGender: '',
      age: 26,
      location: 'Pokhara',
      traits: [],
      values: [],
      hobbies: [],
      lifeGoals: '',
      loveLanguage: '',
      communicationStyle: ''
    }
  ]);

  // Options for step-by-step choices
  const traitOptions = [
    { id: 'kind', label: 'Kind & Caring (दयालु ra स्नेही)', category: 'Personality' },
    { id: 'humorous', label: 'Funny & Witty (हास्यरस/ठट्टा रमाइलो)', category: 'Personality' },
    { id: 'ambitious', label: 'Ambitious & Hardworking (महत्वाकांक्षी)', category: 'Personality' },
    { id: 'calm', label: 'Calm & Patient (शान्त र धैर्यशील)', category: 'Personality' },
    { id: 'adventurous', label: 'Adventurous (साहसी र घुम्न रुचाउने)', category: 'Personality' },
    { id: 'honest', label: 'Honest & Loyal (इमानदार र निष्ठावान)', category: 'Personality' }
  ];

  const valueOptions = [
    { id: 'family', label: 'Family Orientation (परिवारलाई प्राथमिकता)' },
    { id: 'career', label: 'Career & Growth (करियर र प्रगति)' },
    { id: 'culture', label: 'Culture & Tradition (संस्कृति र परम्परा)' },
    { id: 'independence', label: 'Personal Freedom (व्यक्तिगत स्वतन्त्रता)' },
    { id: 'spirituality', label: 'Spirituality/Peace (अध्यात्म र मानसिक शान्ति)' },
    { id: 'financial_security', label: 'Financial Stability (आर्थिक सुरक्षा)' }
  ];

  const hobbyOptions = [
    { id: 'travel', label: 'Travelling & Exploring (यात्रा/घुमफिर)' },
    { id: 'foodie', label: 'Food & Cooking (मीठो खाने/पकाउने)' },
    { id: 'reading', label: 'Reading & Learning (किताब/ज्ञान)' },
    { id: 'fitness', label: 'Fitness & Sports (खेलकुद/व्यायाम)' },
    { id: 'music', label: 'Music & Movies (गीत-संगीत/फिल्म)' },
    { id: 'art', label: 'Art & Creativity (कला र सिर्जना)' }
  ];

  const loveLanguages = [
    { id: 'words', label: 'Words of Affirmation (मीठो वचन र प्रशंसा)' },
    { id: 'quality_time', label: 'Quality Time together (गुणस्तरीय समय)' },
    { id: 'acts', label: 'Acts of Service (सहयोग र हेरचाह)' },
    { id: 'gifts', label: 'Thoughtful Gifts (उपहार र सरप्राइज)' }
  ];

  const communicationOptions = [
    { id: 'direct', label: 'Direct & Clear (प्रष्ट कुराकानी गर्ने)' },
    { id: 'gentle', label: 'Gentle & Soft-spoken (नम्र र शान्त)' },
    { id: 'deep', label: 'Deep Conversations (गहिरो छलफल रुचाउने)' },
    { id: 'fun', label: 'Playful & Lighthearted (रमाइलो र खुकुलो)' }
  ];

  // Helper to update current user state
  const updateCurrentUser = (field, value) => {
    setProfiles(prev => {
      const updated = [...prev];
      updated[activeUserIndex] = {
        ...updated[activeUserIndex],
        [field]: value
      };
      return updated;
    });
  };

  const toggleArrayOption = (field, value) => {
    setProfiles(prev => {
      const updated = [...prev];
      const currentList = updated[activeUserIndex][field] || [];
      const newList = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      
      updated[activeUserIndex] = {
        ...updated[activeUserIndex],
        [field]: newList
      };
      return updated;
    });
  };

  // Switch to questionnaire or handle step transitions
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Completed questionnaire for active user
      if (activeUserIndex === 0) {
        // Prompt for Person 2
        alert("Person 1 completed! Now pass the device or set up profile for Person 2.");
        setActiveUserIndex(1);
        setStep(0);
      } else {
        // Both finished! Show Results
        setView('results');
      }
    }
  };

  // Compatibility Logic
  const calculateCompatibility = () => {
    const p1 = profiles[0];
    const p2 = profiles[1];

    if (!p1.name || !p2.name) return { score: 0, breakdown: [] };

    let totalPoints = 0;
    let maxPoints = 0;
    const breakdown = [];

    // 1. Gender Match Validation (Check if they fit target gender)
    let genderMatch = false;
    if (
      (p1.targetGender === 'any' || p1.targetGender === p2.gender) &&
      (p2.targetGender === 'any' || p2.targetGender === p1.gender)
    ) {
      genderMatch = true;
      totalPoints += 20;
    }
    maxPoints += 20;
    breakdown.push({
      title: 'Gender & Orientation Alignment',
      match: genderMatch,
      details: genderMatch ? 'Both partners match each other’s target preferences!' : 'Gender preferences differ.'
    });

    // 2. Desired Personality Traits Overlap
    const sharedTraits = p1.traits.filter(t => p2.traits.includes(t));
    const traitScore = Math.min(25, sharedTraits.length * 8);
    totalPoints += traitScore;
    maxPoints += 25;
    breakdown.push({
      title: 'Personality Expectations',
      score: traitScore,
      max: 25,
      details: `${sharedTraits.length} desired traits shared (${sharedTraits.join(', ') || 'None'})`
    });

    // 3. Core Values Overlap
    const sharedValues = p1.values.filter(v => p2.values.includes(v));
    const valueScore = Math.min(25, sharedValues.length * 8);
    totalPoints += valueScore;
    maxPoints += 25;
    breakdown.push({
      title: 'Core Values Alignment',
      score: valueScore,
      max: 25,
      details: `${sharedValues.length} shared life values (${sharedValues.join(', ') || 'None'})`
    });

    // 4. Hobbies & Interests Overlap
    const sharedHobbies = p1.hobbies.filter(h => p2.hobbies.includes(h));
    const hobbyScore = Math.min(15, sharedHobbies.length * 5);
    totalPoints += hobbyScore;
    maxPoints += 15;
    breakdown.push({
      title: 'Common Hobbies & Activities',
      score: hobbyScore,
      max: 15,
      details: `${sharedHobbies.length} common interests (${sharedHobbies.join(', ') || 'None'})`
    });

    // 5. Love Language & Communication
    let commScore = 0;
    if (p1.loveLanguage === p2.loveLanguage) commScore += 8;
    if (p1.communicationStyle === p2.communicationStyle) commScore += 7;
    totalPoints += commScore;
    maxPoints += 15;
    breakdown.push({
      title: 'Love Language & Communication',
      score: commScore,
      max: 15,
      details: p1.loveLanguage === p2.loveLanguage ? 'Matching Love Languages!' : 'Different expressing styles'
    });

    const finalPercent = Math.round((totalPoints / maxPoints) * 100);
    return { score: finalPercent, breakdown, sharedTraits, sharedValues, sharedHobbies };
  };

  const results = calculateCompatibility();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg shadow-rose-500/30">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">
                Jodi Matcher
              </h1>
              <p className="text-xs text-slate-400">दुवै जनाको रोजाई र जोडी मेल (Compatibility Test)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {view !== 'welcome' && (
              <button
                onClick={() => {
                  if (confirm("Reset setup and start fresh?")) {
                    setView('welcome');
                    setActiveUserIndex(0);
                    setStep(0);
                  }
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex-1 w-full flex flex-col justify-center">

        {/* VIEW 1: WELCOME SCREEN */}
        {view === 'welcome' && (
          <div className="text-center max-w-2xl mx-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Discover Real Compatibility
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              तपाईं र तपाईंको मान्छेको जोडी कत्तिको मिल्छ?
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Step-by-step match maker for couples & singles. Both users enter their preferences, traits, and values privately. Discover your compatibility score instantly!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
                <User className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Person 1 Fill Out</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    First person enters basic details, expected partner traits, values & hobbies.
                  </p>
                </div>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex items-start space-x-3">
                <Users className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Person 2 Fill Out</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Second person completes the questionnaire. Preferences stay safe & private.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setView('questionnaire');
                setActiveUserIndex(0);
                setStep(0);
              }}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 transition transform active:scale-95 flex items-center justify-center gap-2 mx-auto text-lg"
            >
              Start Matching Test (सुरु गर्नुहोस्) <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* VIEW 2: QUESTIONNAIRE (STEP BY STEP) */}
        {view === 'questionnaire' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
            {/* Header / Tracker */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-700 pb-4 mb-6 gap-3">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeUserIndex === 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'}`}>
                  {activeUserIndex === 0 ? 'Person 1 (पहिलो व्यक्ति)' : 'Person 2 (दोस्रो व्यक्ति)'}
                </span>
                <span className="text-slate-400 text-sm">Step {step + 1} of 5</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full md:w-48 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-300"
                  style={{ width: `${((step + 1) / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* STEP 0: BASIC PROFILE */}
            {step === 0 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-rose-500 pl-3">
                  <h3 className="text-xl font-bold text-white">Basic Information (व्यक्तिगत विवरण)</h3>
                  <p className="text-xs text-slate-400">Tell us a little about yourself first.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your Name / उपनाम</label>
                  <input
                    type="text"
                    value={profiles[activeUserIndex].name}
                    onChange={(e) => updateCurrentUser('name', e.target.value)}
                    placeholder="e.g. Aarav / Puja"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Your Gender (तपाईंको लिंग)</label>
                    <select
                      value={profiles[activeUserIndex].gender}
                      onChange={(e) => updateCurrentUser('gender', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male (पुरुष)</option>
                      <option value="female">Female (महिला)</option>
                      <option value="other">Other / Non-binary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Looking For (के खोज्नुभएको?)</label>
                    <select
                      value={profiles[activeUserIndex].targetGender}
                      onChange={(e) => updateCurrentUser('targetGender', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="">Select Preferred Gender</option>
                      <option value="female">Seeking Female (महिला partner)</option>
                      <option value="male">Seeking Male (पुरुष partner)</option>
                      <option value="any">Open to Any (जुनै पनि)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Age (उमेर)</label>
                    <input
                      type="number"
                      value={profiles[activeUserIndex].age}
                      onChange={(e) => updateCurrentUser('age', parseInt(e.target.value) || 18)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Location / शहर</label>
                    <input
                      type="text"
                      value={profiles[activeUserIndex].location}
                      onChange={(e) => updateCurrentUser('location', e.target.value)}
                      placeholder="e.g. Kathmandu, Pokhara, Chitwan"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: DESIRED TRAITS */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-rose-500 pl-3">
                  <h3 className="text-xl font-bold text-white">Desired Partner Traits (साथीमा खोजेको गुणहरू)</h3>
                  <p className="text-xs text-slate-400">Select traits you value most in a partner (choose multiple):</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {traitOptions.map((item) => {
                    const isSelected = profiles[activeUserIndex].traits.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayOption('traits', item.id)}
                        className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-medium text-sm">{item.label}</span>
                        {isSelected && <Check className="w-5 h-5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: CORE VALUES */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-amber-500 pl-3">
                  <h3 className="text-xl font-bold text-white">Core Life Values (मुख्य जीवन मूल्य/मान्यता)</h3>
                  <p className="text-xs text-slate-400">What principles should guide your relationship?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {valueOptions.map((item) => {
                    const isSelected = profiles[activeUserIndex].values.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayOption('values', item.id)}
                        className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-medium text-sm">{item.label}</span>
                        {isSelected && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: HOBBIES & INTERESTS */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-emerald-500 pl-3">
                  <h3 className="text-xl font-bold text-white">Hobbies & Passions (अभिरुचि र रुचि)</h3>
                  <p className="text-xs text-slate-400">What activities would you like to enjoy together?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hobbyOptions.map((item) => {
                    const isSelected = profiles[activeUserIndex].hobbies.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleArrayOption('hobbies', item.id)}
                        className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-medium text-sm">{item.label}</span>
                        {isSelected && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: LOVE LANGUAGE & COMMUNICATION */}
            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-l-4 border-sky-500 pl-3">
                  <h3 className="text-xl font-bold text-white">Love Language & Communication</h3>
                  <p className="text-xs text-slate-400">How do you best express affection and resolve conflict?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Primary Love Language</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {loveLanguages.map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => updateCurrentUser('loveLanguage', lang.id)}
                        className={`p-3 rounded-xl border text-left text-sm transition ${
                          profiles[activeUserIndex].loveLanguage === lang.id
                            ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Communication Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {communicationOptions.map((comm) => (
                      <button
                        key={comm.id}
                        type="button"
                        onClick={() => updateCurrentUser('communicationStyle', comm.id)}
                        className={`p-3 rounded-xl border text-left text-sm transition ${
                          profiles[activeUserIndex].communicationStyle === comm.id
                            ? 'bg-sky-500/20 border-sky-500 text-sky-200'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {comm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition ${
                  step === 0 
                    ? 'opacity-40 cursor-not-allowed text-slate-500' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={step === 0 && (!profiles[activeUserIndex].name || !profiles[activeUserIndex].gender)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center gap-1 transition shadow-lg shadow-rose-500/20"
              >
                {step === 4 
                  ? (activeUserIndex === 0 ? "Finish Person 1 -> Start Person 2" : "Calculate Match Results (जोडी नतिजा)") 
                  : "Next Step"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: MATCH RESULTS DASHBOARD */}
        {view === 'results' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="bg-gradient-to-br from-rose-950/80 via-slate-900 to-amber-950/80 border border-slate-700/80 rounded-3xl p-6 md:p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" /> Final Match Analysis
              </div>

              <div className="flex justify-center items-center gap-4 my-2">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-500/20 border-2 border-rose-500 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl text-rose-300 mx-auto">
                    {profiles[0].name.charAt(0).toUpperCase() || 'P1'}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-300">{profiles[0].name}</p>
                </div>

                <div className="text-rose-500 animate-pulse text-2xl font-bold">❤️</div>

                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl text-amber-300 mx-auto">
                    {profiles[1].name.charAt(0).toUpperCase() || 'P2'}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-300">{profiles[1].name}</p>
                </div>
              </div>

              {/* Huge Percentage */}
              <div className="my-6">
                <span className="text-5xl md:text-7xl font-black bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                  {results.score}%
                </span>
                <p className="text-sm font-medium text-slate-400 mt-1">Compatibility Rating (जोडी अनुकूलता)</p>
              </div>

              <div className="max-w-md mx-auto bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 text-xs text-slate-300">
                {results.score >= 80 && "🌟 Excellent Match! High alignment in values, goals, and lifestyle."}
                {results.score >= 50 && results.score < 80 && "✨ Good Potential! Common ground with room for great conversations."}
                {results.score < 50 && "🌱 Unique Dynamic! Different priorities, great opportunity to learn from each other."}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.breakdown.map((item, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                      {item.score !== undefined && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-700 text-rose-300">
                          {item.score} / {item.max}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.details}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0" /> Evaluated from both profiles
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  setActiveUserIndex(0);
                  setStep(0);
                  setView('questionnaire');
                }}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition text-center"
              >
                Modify Responses (सच्याउनुहोस्)
              </button>
              <button
                onClick={() => {
                  setProfiles([
                    { name: '', gender: '', targetGender: '', age: 25, location: 'Kathmandu', traits: [], values: [], hobbies: [], lifeGoals: '', loveLanguage: '', communicationStyle: '' },
                    { name: '', gender: '', targetGender: '', age: 26, location: 'Pokhara', traits: [], values: [], hobbies: [], lifeGoals: '', loveLanguage: '', communicationStyle: '' }
                  ]);
                  setView('welcome');
                }}
                className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition shadow-lg shadow-rose-500/25 text-center"
              >
                Test Another Couple (नयाँ जोडीको लागि)
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 bg-slate-950/60 text-center text-xs text-slate-500">
        <p>Jodi Matcher App — Respectful, Constructive & Privacy-Friendly Partner Compatibility Tool</p>
      </footer>
    </div>
  );
}