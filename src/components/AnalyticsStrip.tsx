import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, Minus } from 'lucide-react';
import { Separator } from './ui/separator';

export function AnalyticsStrip() {
  const marketData = [
    {
      label: "Cotton Index",
      value: "94.5",
      change: "+2.3%",
      isPositive: true,
    },
    {
      label: "Export Volume (Apr)",
      value: "$3.2B",
      change: "+5.1%",
      isPositive: true,
    },
    {
      label: "Lead Time Avg.",
      value: "45 days",
      change: "-12%",
      isPositive: true,
    },
    {
      label: "Compliance Score",
      value: "87/100",
      change: "+3 pts",
      isPositive: true,
    },
    {
      label: "Worker Training",
      value: "22K enrolled",
      change: "+18%",
      isPositive: true,
    },
    {
      label: "Factory Delays",
      value: "8.2%",
      change: "-4.5%",
      isPositive: true,
    },
    {
      label: "BDT/USD",
      value: "110.25",
      change: "-0.5%",
      isPositive: false,
    },
    {
      label: "Buyer Inquiries",
      value: "1,847",
      change: "+12%",
      isPositive: true,
    },
  ];

  return (
    <section className="bg-[#101725] dark:bg-gradient-to-r dark:from-[#0a0e1a] dark:via-[#101725] dark:to-[#0a0e1a] py-4 border-y-2 border-[#EAB308] transition-all duration-300 shadow-lg dark:shadow-[#EAB308]/10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Market Data Ticker */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 border-r-2 border-[#EAB308] pr-4">
            <Activity className="w-4 h-4 text-[#EAB308]" />
            <span 
              className="text-white uppercase tracking-widest text-xs" 
              style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
            >
              Market Data
            </span>
          </div>
          <span className="text-[#6F83A7] text-xs">
            Live Updates • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Scrolling Ticker */}
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            className="flex gap-8 whitespace-nowrap"
          >
            {/* Duplicate the data for seamless loop */}
            {[...marketData, ...marketData].map((item, index) => (
              <div key={index} className="flex items-center gap-3 min-w-fit">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#6F83A7] text-xs uppercase tracking-wider">
                    {item.label}:
                  </span>
                  <span className="text-white">{item.value}</span>
                  <span
                    className={`text-xs flex items-center gap-0.5 ${
                      item.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {item.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {item.change}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-[#6F83A7]/30" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Static Grid Alternative */}
        <div className="hidden lg:block mt-4 pt-4 border-t border-[#6F83A7]/30">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div className="border-r border-[#6F83A7]/30">
              <p className="text-xs text-[#6F83A7] uppercase tracking-wider mb-1">Today's Top Trend</p>
              <p className="text-white text-sm">AI in Supply Chain</p>
            </div>
            <div className="border-r border-[#6F83A7]/30">
              <p className="text-xs text-[#6F83A7] uppercase tracking-wider mb-1">Most Read</p>
              <p className="text-white text-sm">ESG Compliance 2025</p>
            </div>
            <div className="border-r border-[#6F83A7]/30">
              <p className="text-xs text-[#6F83A7] uppercase tracking-wider mb-1">Factories Online</p>
              <p className="text-green-500 text-sm">2,847 Active</p>
            </div>
            <div>
              <p className="text-xs text-[#6F83A7] uppercase tracking-wider mb-1">Next Update</p>
              <p className="text-white text-sm">In 15 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
