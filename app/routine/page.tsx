"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

export default function RoutinePage() {
  const routines = [
    { time: "07:00 AM", task: "Morning Hydration", desc: "Drink 500ml of water with a pinch of sea salt", status: "done" },
    { time: "07:15 AM", task: "Box Breathing", desc: "5 minutes of 4-4-4-4 breathing to regulate cortisol", status: "pending" },
    { time: "07:30 AM", task: "Sunlight Exposure", desc: "10-15 minutes of direct sunlight viewing", status: "pending" },
    { time: "08:00 AM", task: "Deep Work Block", desc: "90 minutes of focused work without distractions", status: "pending" }
  ];

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 h-full flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
          >
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">Routine.</span>
          </motion.h1>
          <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl"
          >
            Your personalized daily schedule based on your neuroscience profile.
          </motion.p>
        </div>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors self-start md:self-end"
        >
          <RefreshCw size={16} />
          Regenerate
        </motion.button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#111127] border border-white/10 rounded-3xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 text-sm uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Task</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {routines.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    {item.status === "done" ? (
                      <CheckCircle2 className="text-teal-400" size={24} />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      {item.time}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap font-medium text-white">
                    {item.task}
                  </td>
                  <td className="px-6 py-5 text-gray-400 text-sm">
                    {item.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
