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
  ChevronDown,
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
  Sparkles as Sparkles2,
  RefreshCw,
  AlertTriangle,
  X,
  Sun as SunIconRegular,
  Moon as MoonIconRegular
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Enhanced dashboard demo visualization for landing page
const InteractiveDashboard = () => {
  const [sensorData, setSensorData] = useState({
    suhu_air: 24.5,
    suhu_udara: 23.2,
    kelembapan: 65,
    tds: 560,
    ph: 6.8,
    pompa: 'ON'
  });

  // Mock historical data for charts - generate data for the last 10 hours
  const generateLast10HoursData = (sensorKey, baseValue, variation = 1) => {
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const date = new Date(now);
      date.setHours(date.getHours() - (9 - i)); // Start from 9 hours ago to now
      
      // Generate slightly varying values
      const value = baseValue + (Math.random() - 0.5) * variation * 2;
      
      return {
        created_at: date.toISOString(),
        [sensorKey]: value
      };
    });
  };

  const [historyData, setHistoryData] = useState({
    suhu_air: generateLast10HoursData('suhu_air', 24.0, 1.5), // Water temperature
    suhu_udara: generateLast10HoursData('suhu_udara', 23.0, 2.0), // Air temperature
    kelembapan: generateLast10HoursData('kelembapan', 65, 5), // Humidity
    tds: generateLast10HoursData('tds', 560, 20), // TDS
    ph: generateLast10HoursData('ph', 6.8, 0.3) // pH
  });

  const [showAlert, setShowAlert] = useState(true);

  // Simulate real-time sensor updates and update history data every hour
  useEffect(() => {
    // Update sensor values every 2 seconds
    const sensorInterval = setInterval(() => {
      setSensorData(prev => ({
        suhu_air: Math.max(15, Math.min(35, prev.suhu_air + (Math.random() - 0.5) * 0.5)),
        suhu_udara: Math.max(15, Math.min(35, prev.suhu_udara + (Math.random() - 0.5) * 0.5)),
        kelembapan: Math.max(30, Math.min(90, prev.kelembapan + (Math.random() - 0.5) * 2)),
        tds: Math.max(400, Math.min(800, prev.tds + (Math.random() - 0.5) * 10)),
        ph: Math.max(4, Math.min(9, prev.ph + (Math.random() - 0.5) * 0.1)),
        pompa: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'ON' : 'OFF') : prev.pompa
      }));
    }, 2000);

    // Update history data every 30 seconds (to simulate hourly updates in a shorter time for demo purposes)
    const historyInterval = setInterval(() => {
      setHistoryData(prev => {
        const now = new Date();
        const newDataPoint = {
          created_at: now.toISOString(),
          suhu_air: sensorData.suhu_air,
          suhu_udara: sensorData.suhu_udara,
          kelembapan: sensorData.kelembapan,
          tds: sensorData.tds,
          ph: sensorData.ph
        };

        // Update each sensor's history, keeping only the last 10 data points
        const updateHistory = (prevHistory, sensorKey) => {
          const newHistory = [...prevHistory, { 
            created_at: newDataPoint.created_at, 
            [sensorKey]: newDataPoint[sensorKey] 
          }];
          // Keep only the last 10 data points
          return newHistory.slice(-10);
        };

        return {
          suhu_air: updateHistory(prev.suhu_air, 'suhu_air'),
          suhu_udara: updateHistory(prev.suhu_udara, 'suhu_udara'),
          kelembapan: updateHistory(prev.kelembapan, 'kelembapan'),
          tds: updateHistory(prev.tds, 'tds'),
          ph: updateHistory(prev.ph, 'ph')
        };
      });
    }, 30000); // Update history every 30 seconds for demo purposes (would be 3600000ms in production)

    return () => {
      clearInterval(sensorInterval);
      clearInterval(historyInterval);
    };
  }, [sensorData]);

  // Mock constants for sensor thresholds
  const SENSOR_THRESHOLDS = {
    suhu_air: { min: 18, max: 28 },
    suhu_udara: { min: 18, max: 30 },
    kelembapan: { min: 50, max: 80 },
    tds: { min: 400, max: 800 },
    ph: { min: 5.5, max: 7.5 }
  };

  const SENSOR_UNITS = {
    suhu_air: '°C',
    suhu_udara: '°C',
    kelembapan: '%',
    tds: 'ppm',
    ph: '',
    pompa: ''
  };

  const SENSOR_LABELS = {
    suhu_air: 'Water Temperature',
    suhu_udara: 'Air Temperature',
    kelembapan: 'Humidity',
    tds: 'TDS Level',
    ph: 'pH Level',
    pompa: 'Pump Status'
  };

  const iconMap = {
    suhu_air: Thermometer,
    suhu_udara: WindIcon,
    kelembapan: Droplets,
    tds: Gauge,
    ph: Activity,
    pompa: ToggleLeft,
  };

  const getStatusColor = (type, value) => {
    if (type === 'pompa') {
      return value === 'ON' ? 'text-green-500' : 'text-gray-500';
    }
    
    const threshold = SENSOR_THRESHOLDS[type];
    if (!threshold) return 'text-gray-600';
    
    if (value < threshold.min || value > threshold.max) {
      return 'text-red-500';
    }
    return 'text-green-500';
  };

  const getStatusText = (type, value) => {
    if (type === 'pompa') {
      return value === 'ON' ? 'Active' : 'Inactive';
    }
    
    const threshold = SENSOR_THRESHOLDS[type];
    if (!threshold) return 'Normal';
    
    if (value < threshold.min) return 'Too Low';
    if (value > threshold.max) return 'Too High';
    return 'Normal';
  };

  // SensorCard component for demo
  const SensorCard = ({ type, value }) => {
    const Icon = iconMap[type];
    const unit = SENSOR_UNITS[type];
    const label = SENSOR_LABELS[type];
    const statusColor = value != null && value !== undefined ? getStatusColor(type, value) : 'text-gray-600';
    const statusText = value != null && value !== undefined ? getStatusText(type, value) : 'No Data';

    return (
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 p-6 h-full flex flex-col"
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{label}</h3>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            type === 'suhu_air' ? "bg-gradient-to-br from-red-500 to-red-600" :
            type === 'suhu_udara' ? "bg-gradient-to-br from-orange-500 to-orange-600" :
            type === 'kelembapan' ? "bg-gradient-to-br from-blue-500 to-blue-600" :
            type === 'tds' ? "bg-gradient-to-br from-green-500 to-green-600" :
            type === 'ph' ? "bg-gradient-to-br from-purple-500 to-purple-600" :
            "bg-gradient-to-br from-gray-500 to-gray-600"
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              {value != null && value !== undefined 
                ? (() => {
                    let displayValue;
                    if (type === 'ph') {
                      displayValue = parseFloat(value.toFixed(1));
                    } else if (type === 'suhu_air' || type === 'suhu_udara') {
                      displayValue = parseFloat(value.toFixed(1));
                    } else {
                      displayValue = Math.round(value);
                    }
                    
                    // Determine font size based on value length
                    const valueLength = displayValue.toString().length;
                    let fontSizeClass;
                    if (valueLength <= 3) {
                      fontSizeClass = "text-3xl";
                    } else if (valueLength === 4) {
                      fontSizeClass = "text-2xl";
                    } else {
                      fontSizeClass = "text-xl";
                    }
                    
                    return (
                      <>
                        <span className={`${fontSizeClass} font-bold text-gray-900 dark:text-white break-words max-w-[70%]`}>
                          {displayValue}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{unit}</span>
                      </>
                    );
                  })()
                : (
                  <>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">--</span>
                  </>
                )}
            </div>
          </div>
          
          <div className={cn(
            'text-sm font-medium px-3 py-1 rounded-full inline-block mt-2 w-fit',
            statusColor === 'text-red-500' 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
              : statusColor === 'text-green-500'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          )}>
            {statusText}
          </div>
        </div>
      </motion.div>
    );
  };

  // ChartBox component for demo
  const ChartBox = ({ data, title, dataKey }) => {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const chartData = data?.map(item => ({
      time: formatTime(item.created_at),
      value: item[dataKey],
      fullTime: new Date(item.created_at).toLocaleTimeString(),
    })) || [];

    // Map titles to icons
    const getIcon = (title) => {
      if (title.includes('Water')) return <Droplets className="w-5 h-5 text-white" />;
      if (title.includes('Air')) return <WindIcon className="w-5 h-5 text-white" />;
      if (title.includes('Humidity')) return <Droplets className="w-5 h-5 text-white" />;
      if (title.includes('TDS')) return <Gauge className="w-5 h-5 text-white" />;
      if (title.includes('pH')) return <Activity className="w-5 h-5 text-white" />;
      if (title.includes('Temperature')) return <Thermometer className="w-5 h-5 text-white" />;
      return <Activity className="w-5 h-5 text-white" />;
    };

    // Map titles to gradient colors
    const getGradient = (title) => {
      if (title.includes('Water')) return 'from-blue-500 to-cyan-500';
      if (title.includes('Air')) return 'from-orange-500 to-yellow-500';
      if (title.includes('Humidity')) return 'from-blue-400 to-indigo-500';
      if (title.includes('TDS')) return 'from-green-500 to-emerald-500';
      if (title.includes('pH')) return 'from-purple-500 to-violet-500';
      if (title.includes('Temperature')) return 'from-red-500 to-orange-500';
      return 'from-gray-500 to-gray-600';
    };

    // Define a color based on the title
    const getColor = (title) => {
      if (title.includes('Water')) return '#00A884';
      if (title.includes('Air')) return '#3B82F6';
      if (title.includes('Humidity')) return '#8B5CF6';
      if (title.includes('TDS')) return '#F59E0B';
      if (title.includes('pH')) return '#EF4444';
      return '#6B7280';
    };

    return (
      <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 bg-gradient-to-br ${getGradient(title)} rounded-lg flex items-center justify-center mr-3`}>
            {getIcon(title)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} animationDuration={0}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:stroke-gray-600" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                interval="preserveStartEnd"
                tickMargin={10}
                stroke="currentColor"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                width={40}
                tickMargin={10}
                stroke="currentColor"
              />
              <Tooltip 
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `Time: ${payload[0].payload.fullTime}`;
                  }
                  return `Time: ${label}`;
                }}
                formatter={(value) => [`${value}`, title]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'inherit',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getColor(title)}
                strokeWidth={2}
                dot={{ fill: getColor(title), strokeWidth: 2, r: 4, animationDuration: 0 }}
                activeDot={{ r: 6, fill: getColor(title), animationDuration: 0 }}
                animationDuration={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // SummaryCard component for demo
  const SummaryCard = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Activity className="w-6 h-6 text-primary-500 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Real-time hydroponic system monitoring</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg border flex items-center space-x-2
              bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100
              dark:bg-gray-700/70 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>
    );
  };

  // PumpControl component for demo
  const PumpControl = ({ pumpStatus = 'OFF' }) => {
    const isOn = pumpStatus === 'ON';
    
    // Mock function to simulate pump control
    const togglePump = () => {
      // In a real implementation, this would call the API
    };
    
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 p-6 h-full"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mr-3">
              <ToggleLeft className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pump Control</h3>
          </div>
          <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
        
        {/* Status Display */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {pumpStatus != null && pumpStatus !== undefined ? pumpStatus : '--'}
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block mt-2 ${
                isOn ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {isOn ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 ml-4">
              <div 
                onClick={togglePump}
                className={`relative inline-flex items-center h-7 rounded-full w-16 cursor-pointer transition-all duration-300 ${
                  isOn ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span 
                  className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-lg transition-all duration-300 ${
                    isOn ? 'translate-x-10' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      {/* Sensor Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <SensorCard type="suhu_air" value={sensorData.suhu_air} />
        <SensorCard type="suhu_udara" value={sensorData.suhu_udara} />
        <SensorCard type="kelembapan" value={sensorData.kelembapan} />
        <SensorCard type="tds" value={sensorData.tds} />
        <SensorCard type="ph" value={sensorData.ph} />
        <PumpControl pumpStatus={sensorData.pompa} />
      </motion.div>

      {/* Charts Grid */}
      <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <Activity className="w-5 h-5 text-primary-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Last 10 Hours Trend</h2>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Showing data from the last 10 hours ({historyData.suhu_air.length} data points total)
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <ChartBox
              title="Water Temperature Trend"
              dataKey="suhu_air"
              data={historyData.suhu_air}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <ChartBox
              title="Air Temperature Trend"
              dataKey="suhu_udara"
              data={historyData.suhu_udara}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <ChartBox
              title="Humidity Trend"
              dataKey="kelembapan"
              data={historyData.kelembapan}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <ChartBox
              title="TDS Trend"
              dataKey="tds"
              data={historyData.tds}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="lg:col-span-2"
          >
            <ChartBox
              title="pH Level Trend"
              dataKey="ph"
              data={historyData.ph}
            />
          </motion.div>
        </div>
      </div>


    </div>
  );
};

// Helper functions for dashboard
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Additional icon needed for the dashboard (not available in lucide-react)
const ToggleLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="6"></rect>
    <circle cx="8" cy="12" r="2"></circle>
  </svg>
);

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const controls = useAnimation();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check initial theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Toggle dark mode class on document element
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
      title: 'Install Smart Sensors',
      description: 'Connect our advanced IoT sensors to your hydroponic system to monitor water temperature, pH levels, TDS, humidity, and other critical parameters in real-time.',
      icon: Cpu
    },
    {
      step: 2,
      title: 'Real-Time Dashboard',
      description: 'Access live data feeds through our intuitive dashboard that displays all key metrics and system status indicators at a glance.',
      icon: Monitor
    },
    {
      step: 3,
      title: 'Analyze & Optimize',
      description: 'Utilize our AI-powered analytics to identify patterns, predict issues, and receive actionable insights to maximize your crop yield.',
      icon: BarChart3
    },
    {
      step: 4,
      title: 'Remote Control & Alerts',
      description: 'Control your pumps and equipment remotely while receiving instant notifications when parameters go outside optimal ranges.',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 overflow-x-hidden relative">
      {/* Animated particles background */}
      <AnimatedParticles />
      
      {/* Floating animated elements throughout the page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-green-400/30"
          animate={{ 
            y: [-10, 10, -10],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-6 h-6 rounded-full bg-blue-400/25"
          animate={{ 
            y: [10, -10, 10],
            x: [15, -15, 15],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/5 w-3 h-3 rounded-full bg-purple-400/35"
          animate={{ 
            y: [20, -20, 20],
            x: [-15, 15, -15],
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
    {/* Navigation */}
<nav className={`px-6 py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  scrolled 
    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
    : darkMode ? 'bg-transparent' : 'bg-transparent'
}`}>
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <img 
        src="/favicon.png"
        alt="HY.YUME Logo"
        className="w-10 h-10 object-contain"
      />
      {/* DIUBAH: Dihapus kondisi scrolled, style teks sekarang permanen */}
      <span className={`text-2xl font-bold text-gray-900 dark:text-white`}>
        HY.YUME
      </span>
    </div>

    <div className="flex items-center space-x-4">
      <button
        onClick={toggleDarkMode}
        // DIUBAH: Dihapus kondisi scrolled, style tombol sekarang permanen
        className={`p-2 rounded-full text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <SunIconRegular className="w-5 h-5" />
        ) : (
          <MoonIconRegular className="w-5 h-5" />
        )}
      </button>
      <Link to="/login">
        <Button 
          variant="outline"
          // DIUBAH: Dihapus kondisi scrolled, style tombol sekarang permanen
          className={`border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30`}
        >
          Sign In
        </Button>
      </Link>

      <Link to="/register">
        <Button 
          // DIUBAH: Dihapus kondisi scrolled, style tombol sekarang permanen
          className={`bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 dark:from-primary-600 dark:to-blue-600 dark:hover:from-primary-700 dark:hover:to-blue-700`}
        >
          Get Started
        </Button>
      </Link>
    </div>
  </div>
</nav>


      {/* Hero Section with Enhanced Cinematic Elements */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-200/10 via-primary-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto text-center flex flex-col justify-center h-full">
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
            <div className="flex flex-wrap justify-center gap-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>Smart Efficiency</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>Remote Access</span>
              </div>
            </div>
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

      {/* Features Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-primary-50/40 via-green-50/50 to-blue-50/40 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Key <span className="text-primary-600">Features</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Essential capabilities for modern hydroponic farming
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <InteractiveCard
                    className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 h-full relative overflow-hidden"
                  >
                    {/* Animated background element */}
                    <div className={`absolute -top-10 -right-10 w-24 h-24 ${
                      index === 0 ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20' :
                      index === 1 ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20' :
                      index === 2 ? 'bg-gradient-to-r from-blue-400/20 to-indigo-500/20' :
                      'bg-gradient-to-r from-emerald-400/20 to-teal-500/20'
                    } rounded-full blur-xl`}></div>
                    
                    <div className="relative z-10 flex items-start space-x-4">
                      <div className="flex-shrink-0 relative">
                        {/* Background circle with gradient */}
                        <div className={`w-16 h-16 rounded-2xl ${
                          index === 0 ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                          index === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          index === 2 ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                          'bg-gradient-to-br from-emerald-400 to-teal-500'
                        } flex items-center justify-center shadow-lg`}>
                          <motion.div
                            className="w-10 h-10 flex items-center justify-center text-white"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          >
                            <Icon className="w-6 h-6" />
                          </motion.div>
                        </div>
                        {/* Glowing effect */}
                        <motion.div 
                          className={`absolute -inset-2 rounded-2xl bg-current opacity-20 ${
                            index === 0 ? 'text-green-400' :
                            index === 1 ? 'text-yellow-400' :
                            index === 2 ? 'text-blue-400' :
                            'text-emerald-400'
                          } blur-lg`}
                          whileHover={{ opacity: 0.4 }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </div>
                      <div>
                        <motion.h3 
                          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {feature.title}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-600 dark:text-gray-300"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {feature.description}
                        </motion.p>
                        
                        {/* Animated hover effect line */}
                        <motion.div 
                          className={`h-0.5 mt-4 ${
                            index === 0 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                            index === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            index === 2 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                            'bg-gradient-to-r from-emerald-400 to-teal-500'
                          }`}
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Powerful Dashboard Experience Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-green-50/30 via-primary-100/40 to-blue-50/40 dark:from-green-900/20 dark:via-gray-800 dark:to-gray-800 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Powerful <span className="text-primary-600">Dashboard</span> Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Experience real-time monitoring and control with our intuitive dashboard interface
            </p>
          </motion.div>

          {/* Animated floating elements */}
          <div className="absolute top-20 left-20 w-8 h-8 bg-green-400/20 rounded-full blur-md animate-pulse"></div>
          <div className="absolute top-1/3 right-40 w-6 h-6 bg-blue-400/20 rounded-full blur-md animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-primary-400/20 rounded-full blur-md animate-pulse delay-500"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -5 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-4xl relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative">
                <InteractiveDashboard />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-blue-50/40 via-primary-50/40 to-green-50/50 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Advanced <span className="text-primary-600">Features</span> for Modern Growers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Innovative technology to optimize your hydroponic operation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enhancedBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <InteractiveCard
                  key={benefit.title}
                  className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
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



      {/* How It Works Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-green-50/50 via-primary-50/40 to-slate-50/50 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              How It <span className="text-primary-600 dark:text-primary-400">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300 mb-8">
              Transform your hydroponic farming with our 4-step smart solution
            </p>
            
            {/* Visual representation of hydroponic system */}
            <div className="relative max-w-4xl mx-auto h-40 mb-12">
              <motion.div 
                className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              ></motion.div>
              
              <motion.div 
                className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Sprout className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 left-2/4 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Monitor className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <BarChart3 className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Step descriptions */}
            <div className="space-y-8">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-6 p-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg border border-primary-100/30 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{step.step}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 pl-11">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Visual representation */}
            <div className="flex justify-center">
              <InteractiveCard className="w-full max-w-lg bg-gradient-to-br from-green-50/40 to-primary-50/50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-3xl shadow-2xl border border-primary-200/50 dark:border-gray-600">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-primary-700 dark:from-green-900/30 dark:to-blue-900/30 dark:text-primary-300 mb-4">
                    <Droplets className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Smart Hydroponic System</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Monitoring Solution</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Real-time control and analytics for optimal growth</p>
                </div>
                
                {/* Simplified hydroponic system visualization */}
                <div className="relative">
                  {/* Water tank */}
                  <div className="w-full h-24 bg-gradient-to-b from-blue-900/30 to-blue-700/50 rounded-lg border border-blue-500/50 mb-6 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-blue-400/40 to-blue-500/60"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-blue-300/70 to-transparent flex justify-between px-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-blue-300/80 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Plant containers */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="relative">
                        <div className="w-full h-16 bg-gradient-to-b from-green-800/40 to-green-700/60 rounded-lg flex items-center justify-center">
                          <div className="w-8 h-12 bg-gradient-to-b from-green-500 to-emerald-600 rounded-t-full relative">
                            {/* Leaves */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                            <div className="absolute -top-1 -left-2 w-4 h-3 bg-gradient-to-r from-lime-300 to-green-400 rounded-full"></div>
                            <div className="absolute -top-1 -right-2 w-4 h-3 bg-gradient-to-r from-lime-300 to-green-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Sensors visualization */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-primary-500/20 to-blue-500/20 p-4 rounded-xl border border-primary-300/50">
                      <div className="flex items-center">
                        <Thermometer className="w-5 h-5 mr-2 text-primary-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Water Temp: 24°C</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-300/50">
                      <div className="flex items-center">
                        <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">pH: 6.8</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-300/50">
                      <div className="flex items-center">
                        <Gauge className="w-5 h-5 mr-2 text-green-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">TDS: 560 ppm</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-4 rounded-xl border border-purple-300/50">
                      <div className="flex items-center">
                        <WindIcon className="w-5 h-5 mr-2 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Humidity: 65%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Control panel */}
                  <div className="mt-6 pt-4 border-t border-gray-300/50 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pump: </span>
                      <div className="flex items-center">
                        <span className="text-xs mr-2 text-green-600 dark:text-green-400">ON</span>
                        <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-center relative">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-slate-50/50 via-primary-100/40 to-green-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800/80 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Why Choose <span className="text-primary-600">HY.YUME</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Superior technology and results for your hydroponic operation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Analytics",
                description: "Get deep insights from your data to optimize growing conditions and maximize yields.",
                icon: BarChart3,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Remote Control",
                description: "Control pumps, lights, and other equipment remotely with our intuitive interface.",
                icon: Globe,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Smart Alerts",
                description: "Receive real-time notifications when conditions go out of optimal range.",
                icon: Shield,
                gradient: "from-green-500 to-teal-500"
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -15, scale: 1.03 }}
                >
                  <InteractiveCard
                    className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 relative overflow-hidden"
                  >
                    {/* Animated background element */}
                    <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r ${benefit.gradient} rounded-full blur-xl opacity-20`}></div>
                    
                    <motion.div 
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${benefit.gradient} bg-clip-text text-transparent`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        textShadow: "0 0 15px rgba(255,255,255,0.5)"
                      }}
                      style={{
                        background: `linear-gradient(135deg, ${index === 0 ? '#a855f7' : index === 1 ? '#3b82f6' : '#10b981'} 0%, ${index === 0 ? '#ec4899' : index === 1 ? '#60a5fa' : '#06b6d4'} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                    
                    <motion.h3 
                      className="text-xl font-semibold text-gray-900 mb-3 dark:text-white"
                      whileHover={{ color: "#4f46e5" }}
                    >
                      {benefit.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {benefit.description}
                    </motion.p>
                  </InteractiveCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-green-50/40 via-primary-50/40 to-slate-100/50 dark:from-gray-800/80 dark:via-gray-800 dark:to-gray-900 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              What Our <span className="text-primary-600 dark:text-primary-400">Customers</span> Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Real results from satisfied hydroponic farmers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <InteractiveCard
                  className="bg-gradient-to-br from-primary-50 to-white/80 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700 relative overflow-hidden"
                >
                  {/* Animated background element */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-yellow-400/30 to-green-400/30 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: [0, -5, 0, 5, 0],
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Quote className="w-8 h-8 text-primary-500 mb-4" />
                    </motion.div>
                    <motion.p 
                      className="text-gray-700 dark:text-gray-300 mb-6 italic"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      "{testimonial.content}"
                    </motion.p>
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
              </motion.div>
            ))}
          </div>
          
          {/* Additional testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {additionalTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <InteractiveCard
                  className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-primary-100/50 dark:border-gray-700"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
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
                  </motion.div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-slate-100/30 via-primary-50/40 to-gray-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-800 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Simple, Transparent <span className="text-primary-600">Pricing</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Choose the plan that's right for your hydroponic operation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`relative rounded-2xl shadow-xl border ${
                  plan.popular
                    ? 'border-primary-500 bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-gray-900 ring-2 ring-primary-500/20'
                    : 'bg-white/70 dark:bg-gray-800/70 border-primary-200/30 dark:border-gray-700 backdrop-blur-sm'
                }`}>
                  <div className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/register">
                      <motion.button 
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white hover:from-primary-600 hover:to-blue-600 shadow-md hover:shadow-lg' 
                            : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Get Started
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-12 bg-gradient-to-br from-gray-50/50 via-primary-100/40 to-slate-50/50 dark:from-gray-800 dark:via-gray-800/70 dark:to-gray-900 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Frequently <span className="text-primary-600 dark:text-primary-400">Asked</span> Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Everything you need to know about HY.YUME
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <InteractiveCard
                  className="bg-gradient-to-r from-primary-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-xl cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      className="text-primary-500"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3"
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </motion.div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-12 bg-gradient-to-br from-primary-600 via-blue-600 to-indigo-700 dark:from-primary-800 dark:via-blue-800 dark:to-indigo-900 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:40px_40px]"></div>
        
        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl"
            animate={{ 
              y: [-20, 20, -20],
              x: [-20, 20, -20],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-2/3 right-1/3 w-16 h-16 bg-white/15 rounded-full blur-xl"
            animate={{ 
              y: [15, -15, 15],
              x: [15, -15, 15],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl"
            animate={{ 
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              scale: [1, 1.4, 1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 text-white">
              <Sparkles2 className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Join thousands of successful farmers</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your <span className="text-primary-300">Hydroponic Farm</span>?
            </h2>
            
            <motion.p 
              className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              Join thousands of hydroponic farmers who trust HY.YUME for their monitoring and control needs.
              Experience the power of smart farming with real-time insights and automated controls.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold shadow-2xl w-full sm:w-auto"
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </div>
            
            {/* Social proof section */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5,000+</div>
                <div className="text-primary-100">Active Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-primary-100">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-primary-100">Support</div>
              </div>
            </motion.div>
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