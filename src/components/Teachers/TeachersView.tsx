import React, { useState } from "react";
import { Users, GraduationCap, Download, Plus, CheckCircle, Search } from "lucide-react";
import { Student } from "../../types";

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Emma Watson", email: "emma@school.edu", avgWpm: 78, avgAccuracy: 98.2, lessonsCompleted: 12, lastActive: "Today", status: "Exceeding Target" },
  { id: "2", name: "Liam Miller", email: "liam@school.edu", avgWpm: 64, avgAccuracy: 95.8, lessonsCompleted: 10, lastActive: "Today", status: "On Track" },
  { id: "3", name: "Sophia Davis", email: "sophia@school.edu", avgWpm: 52, avgAccuracy: 91.4, lessonsCompleted: 7, lastActive: "Yesterday", status: "Needs Practice" },
  { id: "4", name: "Noah Wilson", email: "noah@school.edu", avgWpm: 81, avgAccuracy: 99.0, lessonsCompleted: 14, lastActive: "Today", status: "Exceeding Target" },
];

export const TeachersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_STUDENTS.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Avg WPM,Accuracy,Status\n" +
      MOCK_STUDENTS.map((s) => `${s.name},${s.email},${s.avgWpm},${s.avgAccuracy}%,${s.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TypeBlast_Classroom_Gradebook.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Teachers & Schools Management Portal</span>
          </h3>
          <p className="text-xs text-slate-400">Track student typing benchmarks, manage assignments, and export gradebooks</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Gradebook (CSV)</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl max-w-sm">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name..."
            className="bg-transparent text-xs text-slate-200 focus:outline-none w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Avg WPM</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Lessons Done</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-200">{s.name}</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{s.avgWpm} WPM</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">{s.avgAccuracy}%</td>
                  <td className="py-3 px-4 text-slate-300">{s.lessonsCompleted} Modules</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === "Exceeding Target"
                          ? "bg-purple-500/20 text-purple-300"
                          : s.status === "On Track"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
