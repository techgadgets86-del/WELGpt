import { motion } from "framer-motion";

export default function AnimatedGuide({ part, color }: { part: string, color: string }) {
  // We use abstract wireframe biomechanics 
  
  if (part === "chest") {
    // Push-up / Pressing motion
    return (
      <div className="relative w-48 h-48 mx-auto bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
        {/* Floor */}
        <div className="absolute bottom-10 w-32 h-1 bg-white/20 rounded-full" />
        
        {/* Torso & Arms */}
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative mt-[-20px]"
        >
          {/* Torso */}
          <div className="w-16 h-4 border-2 rounded-full" style={{ borderColor: color }} />
          
          {/* Left Arm */}
          <motion.div 
            animate={{ height: [40, 20, 40], rotate: [-20, -45, -20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 top-2 w-1 origin-top rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          {/* Right Arm */}
          <motion.div 
            animate={{ height: [40, 20, 40], rotate: [20, 45, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-2 top-2 w-1 origin-top rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
        </motion.div>
        
        <div className="absolute top-4 left-4 font-mono text-[10px] text-gray-500 uppercase">Biomechanics // Vector</div>
      </div>
    );
  }

  if (part === "legs") {
    // Squat motion
    return (
      <div className="relative w-48 h-48 mx-auto bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
        {/* Floor */}
        <div className="absolute bottom-8 w-32 h-1 bg-white/20 rounded-full" />
        
        <motion.div 
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          {/* Torso */}
          <div className="w-2 h-16 rounded-full mx-auto" style={{ backgroundColor: color }} />
          
          {/* Thighs */}
          <motion.div 
            animate={{ rotate: [15, 80, 15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-14 -left-1 w-2 h-12 origin-top rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          <motion.div 
            animate={{ rotate: [-15, -80, -15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-14 -right-1 w-2 h-12 origin-top rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
        </motion.div>
        <div className="absolute top-4 left-4 font-mono text-[10px] text-gray-500 uppercase">Kinematics // Vector</div>
      </div>
    );
  }

  if (part === "core") {
    // Core Hold / Tension
    return (
      <div className="relative w-48 h-48 mx-auto bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ rotate: [-5, 5, -5], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Hollow body curve */}
          <svg width="100" height="100" viewBox="0 0 100 100">
            <motion.path 
              d="M 10,20 Q 50,80 90,20" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="4"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
              animate={{ d: ["M 10,20 Q 50,90 90,20", "M 10,30 Q 50,60 90,30", "M 10,20 Q 50,90 90,20"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Core tension point */}
            <motion.circle 
              cx="50" cy="65" r="4" fill="#fff"
              animate={{ opacity: [0.3, 1, 0.3], cy: [75, 50, 75] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
        <div className="absolute top-4 left-4 font-mono text-[10px] text-gray-500 uppercase">Tension // Vector</div>
      </div>
    );
  }

  if (part === "arms" || part === "shoulders") {
    // Pull / Press
    return (
      <div className="relative w-48 h-48 mx-auto bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
        <div className="absolute top-8 w-24 h-1 bg-white/20 rounded-full" />
        <motion.div 
          animate={{ y: [30, -10, 30] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative mt-8"
        >
          {/* Torso */}
          <div className="w-12 h-16 border-2 rounded-t-2xl mx-auto" style={{ borderColor: color }} />
          
          {/* Forearms connecting to bar */}
          <motion.div 
            animate={{ height: [40, 20, 40], rotate: [-20, 0, -20] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 top-0 w-2 origin-bottom rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          <motion.div 
            animate={{ height: [40, 20, 40], rotate: [20, 0, 20] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-2 top-0 w-2 origin-bottom rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
        </motion.div>
        <div className="absolute top-4 left-4 font-mono text-[10px] text-gray-500 uppercase">Leverage // Vector</div>
      </div>
    );
  }

  // Fallback radar ping
  return (
    <div className="relative w-48 h-48 mx-auto bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 rounded-full border-2"
        style={{ borderColor: color, filter: `drop-shadow(0 0 15px ${color})` }}
      />
      <div className="absolute w-2 h-2 rounded-full bg-white" />
    </div>
  );
}
