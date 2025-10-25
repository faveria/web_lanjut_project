import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Monitor, 
  Zap, 
  Globe, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Shield,
  Cloud,
  CheckCircle,
  Users,
  Award,
  BarChart3,
  Cpu,
  Droplets,
  Thermometer,
  Gauge,
  Play,
  Quote,
  ArrowDown,
  Star,
  Sun,
  Moon,
  Wind,
  Lightbulb,
  Clock,
  Activity,
  Package,
  Package2,
  Rss,
  Sparkles,
  Circle,
  Target,
  TrendingDown,
  Volume2,
  VolumeX,
  PlayCircle,
  CloudRain,
  Wind as WindIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Thermometer as ThermometerIcon,
  Droplets as DropletsIcon,
  Waves,
  Mountain,
  TreePine,
  Sprout,
  Crop,
  Flower,
  SunMedium,
  CloudDrizzle,
  Droplet,
  Eye,
  EyeOff,
  Bot,
  Brain,
  Zap as ZapFast,
  MessageSquare,
  Rocket,
  Gamepad2,
  Gamepad,
  Sparkle,
  Sparkles as Sparkles2
} from 'lucide-react';

// Animated counter component for stats
const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const [targetValue, setTargetValue] = useState(0);

  useEffect(() => {
    const numValue = parseFloat(value);
    setTargetValue(numValue);
    
    let start = 0;
    const increment = numValue / (duration * 60); // Assuming 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>{Math.round(count)}{suffix}</span>
  );
};

// Parallax background effect component
const ParallaxBackground = ({ children, speed = 0.5 }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);

  return (
    <motion.div style={{ y }} className="absolute inset-0">
      {children}
    </motion.div>
  );
};

// Animated particles effect
const AnimatedParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-primary-300/50 to-green-300/50 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Interactive 3D card component
const InteractiveCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
    setPosition({ 
      x: (x - centerX) * 0.02, 
      y: (y - centerY) * 0.02 
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate3d(${position.x}px, ${position.y}px, 0)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Interactive dashboard visualization
const InteractiveDashboard = () => {
  const [sensorData, setSensorData] = useState({
    ph: 6.8,
    temp: 24.5,
    tds: 560,
    humidity: 65,
    light: 12
  });

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ph: Math.max(4, Math.min(9, prev.ph + (Math.random() - 0.5) * 0.1)),
        temp: Math.max(15, Math.min(35, prev.temp + (Math.random() - 0.5) * 0.2)),
        tds: Math.max(400, Math.min(800, prev.tds + (Math.random() - 0.5) * 10)),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5))),
        light: Math.max(0, Math.min(24, prev.light + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white font-semibold">Real-time Sensor Dashboard</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-xs text-gray-400">Live</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <DropletsIcon className="w-6 h-6 text-blue-400 mr-2" />
            <div>
              <div className="text-white font-bold">{sensorData.ph.toFixed(1)}</div>
              <div className="text-xs text-gray-400">pH Level</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${((sensorData.ph - 4) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <ThermometerIcon className="w-6 h-6 text-red-400 mr-2" />
            <div>
              <div className="text-white font-bold">{sensorData.temp.toFixed(1)}°C</div>
              <div className="text-xs text-gray-400">Water Temp</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${((sensorData.temp - 15) / 20) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Gauge className="w-6 h-6 text-green-400 mr-2" />
            <div>
              <div className="text-white font-bold">{sensorData.tds}</div>
              <div className="text-xs text-gray-400">TDS Level</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(sensorData.tds / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <Droplet className="w-6 h-6 text-cyan-400 mr-2" />
            <div>
              <div className="text-white font-bold">{sensorData.humidity}%</div>
              <div className="text-xs text-gray-400">Humidity</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${sensorData.humidity}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Live chart visualization */}
      <div className="h-32 bg-gray-800 rounded-lg p-2">
        <div className="h-full flex items-end justify-between space-x-0.5">
          {Array.from({ length: 24 }, (_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-primary-500 to-blue-500 w-full rounded-t"
              style={{ height: `${Math.random() * 80 + 20}%` }}
              initial={{ height: Math.random() * 30 + 10 }}
              animate={{ height: `${Math.random() * 80 + 20}%` }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const controls = useAnimation();

  const features = [
    {
      icon: Monitor,
      title: 'Realtime Watch',
      description: 'Track your hydroponic system parameters in real-time with live data updates.'
    },
    {
      icon: Zap,
      title: 'Smart Efficiency',
      description: 'Optimize resource usage with intelligent monitoring and automated insights.'
    },
    {
      icon: Globe,
      title: 'Remote Access',
      description: 'Monitor and manage your hydroponic system from anywhere in the world.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable farming with reduced water consumption and optimal nutrient usage.'
    }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Connect Your Sensors',
      description: 'Set up our IoT hardware with your hydroponic system to start collecting data',
      icon: Cpu
    },
    {
      step: 2,
      title: 'Monitor Real-Time',
      description: 'View live sensor readings on our dashboard with instant updates',
      icon: Monitor
    },
    {
      step: 3,
      title: 'Analyze Data',
      description: 'Get insights and trends to optimize your growing conditions',
      icon: BarChart3
    },
    {
      step: 4,
      title: 'Take Action',
      description: 'Control your system remotely and receive alerts when needed',
      icon: Zap
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Urban Farm Owner",
      content: "HY.YUME helped me reduce water usage by 40% while increasing yield by 25%. The real-time monitoring is invaluable.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Hydroponic Consultant",
      content: "The dashboard is incredibly intuitive. I can monitor multiple farms remotely and make informed decisions quickly.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Commercial Grower",
      content: "Since implementing HY.YUME, I've reduced waste and improved my crop quality significantly. A game-changer!",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Rp 299K",
      period: "/month",
      features: [
        "Real-time monitoring",
        "Basic alerts",
        "Mobile app access",
        "Email support",
        "1 IoT device"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "Rp 799K",
      period: "/month",
      features: [
        "All starter features",
        "Advanced analytics",
        "Custom alerts",
        "Priority support",
        "5 IoT devices",
        "Historical data (30 days)"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Rp 1.499K",
      period: "/month",
      features: [
        "All professional features",
        "Unlimited devices",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced insights",
        "Historical data (unlimited)"
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the IoT system connect to my hydroponic setup?",
      answer: "Our hardware connects seamlessly to your existing hydroponic system via WiFi. It monitors water temperature, pH levels, TDS, humidity, and air temperature while allowing remote control of pumps and other equipment."
    },
    {
      question: "What sensors are included in the system?",
      answer: "Our all-in-one sensor module measures water temperature, air temperature, humidity, pH levels, and TDS (Total Dissolved Solids). All sensors are calibrated for optimal hydroponic accuracy."
    },
    {
      question: "Can I monitor multiple systems?",
      answer: "Yes! Our Professional and Enterprise plans allow you to monitor multiple hydroponic systems from a single dashboard, perfect for commercial operations."
    },
    {
      question: "Is there a mobile app?",
      answer: "Absolutely! Download our mobile app for iOS and Android to monitor and control your hydroponic system anywhere, anytime with real-time push notifications."
    }
  ];

  // Stats data with animated counters
  const stats = [
    { value: "99.9", suffix: "%", label: "Uptime" },
    { value: "24/7", label: "Monitoring" },
    { value: "50", suffix: "%", label: "Water Saved" },
    { value: "100", suffix: "%", label: "Secure" }
  ];

  // Enhanced feature benefits with more icons
  const enhancedBenefits = [
    {
      icon: Droplets,
      title: "Water Optimization",
      description: "Intelligent water management to reduce usage by up to 60%",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Leaf,
      title: "Nutrient Control",
      description: "Precise nutrient dosing for optimal plant health",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track plant health metrics in real-time",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: Shield,
      title: "Risk Prevention",
      description: "Early warning system for potential issues",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: TrendingUp,
      title: "Yield Optimization",
      description: "Maximize your harvest through data analytics",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Sun,
      title: "Light Management",
      description: "Automate lighting based on plant needs",
      gradient: "from-yellow-500 to-amber-500"
    }
  ];

  // Additional testimonials
  const additionalTestimonials = [
    {
      name: "Emma Rodriguez",
      role: "Organic Grower",
      content: "The automation features have reduced my daily maintenance by 70%. I can focus on what really matters - growing quality produce.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Research Facility Manager",
      content: "The data accuracy and consistency are crucial for our research. HY.YUME has become an essential tool in our facility.",
      rating: 5
    }
  ];

  // Interactive plant growth visualization
  const plantGrowthVisualizations = [
    {
      title: "Growth Progress",
      icon: Sprout,
      value: 85,
      unit: "%",
      description: "Compared to traditional methods"
    },
    {
      title: "Nutrient Efficiency",
      icon: Droplets,
      value: 40,
      unit: "%",
      description: "Reduction in nutrient waste"
    },
    {
      title: "Energy Usage",
      icon: Zap,
      value: 30,
      unit: "%",
      description: "Energy consumption reduction"
    },
    {
      title: "Harvest Quality",
      icon: Award,
      value: 90,
      unit: "%",
      description: "Consistent high-quality yields"
    }
  ];

  useEffect(() => {
    // Trigger animations on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        controls.start('visible');
      } else {
        controls.start('hidden');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 overflow-x-hidden">
      {/* Animated particles background */}
      <AnimatedParticles />
      
      {/* Navigation */}
      <nav className="px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/favicon.png" 
              alt="HY.YUME Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">HY.YUME</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 dark:from-primary-600 dark:to-blue-600 dark:hover:from-primary-700 dark:hover:to-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced Cinematic Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-200/5 to-blue-200/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="mb-6 flex justify-center">
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 rounded-full text-primary-700 dark:from-primary-900/30 dark:to-blue-900/30 dark:text-primary-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Sparkles2 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Smart Hydroponic IoT Platform</span>
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 dark:text-white leading-tight">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-primary-500 via-green-500 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:via-green-400 dark:to-blue-400">
                Hydroponic
              </span>{' '}
              <br />
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Operation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
              Smart Hydroponic IoT System – Monitor, Analyze, and Optimize Your Hydroponic Farm in Real-Time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 px-8 py-3 text-lg dark:from-primary-600 dark:to-blue-600 dark:hover:from-primary-700 dark:hover:to-blue-700">
                  Start Monitoring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30 flex items-center"
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">5,000+ Happy Farmers</span>
              </div>
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">100% Eco-Friendly</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-28 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <InteractiveCard
                  key={feature.title}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100 dark:bg-gray-800/70 dark:border-gray-700"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center dark:bg-gradient-to-br dark:from-primary-600 dark:to-blue-600">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed dark:text-gray-300 text-center">
                    {feature.description}
                  </p>
                </InteractiveCard>
              );
            })}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-gray-500 text-sm mb-2">Scroll to explore</span>
            <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="px-6 py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl shadow-lg border border-primary-100 dark:from-gray-700 dark:to-gray-800 dark:border-gray-600"
              >
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              Advanced <span className="text-primary-600">Features</span> for Modern Growers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Innovative technology to optimize your hydroponic operation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enhancedBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <InteractiveCard
                  key={benefit.title}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="relative">
                    <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-r ${benefit.gradient} opacity-20 blur-md`}></div>
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${benefit.gradient}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </InteractiveCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Growth Visualization Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-green-50 to-primary-50 dark:from-green-900/20 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              <span className="text-green-600">Growth</span> & <span className="text-primary-600">Efficiency</span> Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              See the real impact of HY.YUME on your hydroponic operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plantGrowthVisualizations.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {item.value}{item.unit}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                  <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="px-6 py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              How It <span className="text-primary-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Simple 4-step process to transform your hydroponic operation
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500 to-blue-500 hidden md:block"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`text-center group ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16 md:mt-20'}`}
                  >
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary-200 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              Why Choose <span className="text-primary-600">HY.YUME</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Superior technology and results for your hydroponic operation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Analytics",
                description: "Get deep insights from your data to optimize growing conditions and maximize yields.",
                icon: BarChart3
              },
              {
                title: "Remote Control",
                description: "Control pumps, lights, and other equipment remotely with our intuitive interface.",
                icon: Globe
              },
              {
                title: "Smart Alerts",
                description: "Receive real-time notifications when conditions go out of optimal range.",
                icon: Shield
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <InteractiveCard
                  key={benefit.title}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-primary-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                </InteractiveCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              What Our <span className="text-primary-600">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Real results from satisfied hydroponic farmers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <InteractiveCard
                key={testimonial.name}
                className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-primary-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-primary-500/5 to-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary-500 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
          
          {/* Additional testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {additionalTestimonials.map((testimonial, index) => (
              <InteractiveCard
                key={testimonial.name}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              Simple, Transparent <span className="text-primary-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Choose the plan that's right for your hydroponic operation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <InteractiveCard
                key={plan.name}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border ${
                  plan.popular 
                    ? 'border-primary-500 ring-2 ring-primary-500/20 scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 dark:from-primary-600 dark:to-blue-600 dark:hover:from-primary-700 dark:hover:to-blue-700' 
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500'
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-white">
              Frequently <span className="text-primary-600">Asked</span> Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Everything you need to know about HY.YUME
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <InteractiveCard
                key={index}
                className="bg-gradient-to-r from-primary-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-600 dark:to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Hydroponic Farm?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of hydroponic farmers who trust HY.YUME for their monitoring and control needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/favicon.png" 
                  alt="HY.YUME Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold">HY.YUME Monitor</span>
              </div>
              <p className="text-gray-400">
                Smart Hydroponic IoT System for modern farming operations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 HY.YUME Monitor. All rights reserved. Smart Hydroponic IoT System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;