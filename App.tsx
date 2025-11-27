import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, Zap, Gauge, Play, AlertTriangle, BrainCircuit } from 'lucide-react';
import { generateMotorData } from './utils/simulation';
import { analyzeDataWithGemini } from './services/gemini';
import { MotorData, SimulationState, AnalysisResult } from './types';
import { KpiCard } from './components/KpiCard';

const MAX_DATA_POINTS = 30;

export default function App() {
  const [data, setData] = useState<MotorData[]>([]);
  const [simState, setSimState] = useState<SimulationState>(SimulationState.NORMAL);
  const [isPaused, setIsPaused] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Referencia para el intervalo
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setData(prevData => {
        const newDataPoint = generateMotorData(simState);
        const newData = [...prevData, newDataPoint];
        if (newData.length > MAX_DATA_POINTS) {
          return newData.slice(newData.length - MAX_DATA_POINTS);
        }
        return newData;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [simState, isPaused]);

  const handleManualAnalysis = async () => {
    if (data.length < 5) return;
    setIsAnalyzing(true);
    const result = await analyzeDataWithGemini(data);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const currentData = data[data.length - 1] || { temperature: 0, vibration: 0, rpm: 0, power: 0, status: 'Normal' };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            MechaMind Analytics
          </h1>
          <p className="text-slate-400 mt-1">Monitor de Condición de Motor Industrial (Digital Twin)</p>
        </div>
        
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setSimState(SimulationState.NORMAL)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${simState === SimulationState.NORMAL ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          >
            Normal
          </button>
          <button 
             onClick={() => setSimState(SimulationState.OVERHEAT)}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${simState === SimulationState.OVERHEAT ? 'bg-orange-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          >
            Falla Térmica
          </button>
          <button 
             onClick={() => setSimState(SimulationState.UNBALANCED)}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${simState === SimulationState.UNBALANCED ? 'bg-red-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          >
            Desbalanceo
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard 
          title="Temperatura" 
          value={currentData.temperature} 
          unit="°C" 
          icon={Thermometer} 
          color={currentData.temperature > 65 ? 'red' : 'blue'} 
        />
        <KpiCard 
          title="Vibración" 
          value={currentData.vibration} 
          unit="mm/s" 
          icon={Activity} 
          color={currentData.vibration > 6 ? 'orange' : 'green'} 
        />
        <KpiCard 
          title="Velocidad" 
          value={currentData.rpm} 
          unit="RPM" 
          icon={Gauge} 
          color="blue" 
        />
        <KpiCard 
          title="Potencia" 
          value={currentData.power} 
          unit="kW" 
          icon={Zap} 
          color="blue" 
        />
      </div>

      {/* Main Content: Charts & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Temperature Chart */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Thermometer size={18} className="text-cyan-400" /> Historial Térmico
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" stroke="#94a3b8" tick={{fontSize: 12}} interval={4} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                    itemStyle={{ color: '#22d3ee' }}
                  />
                  <Area type="monotone" dataKey="temperature" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                  {/* Threshold Line */}
                  <Line type="monotone" dataKey={() => 80} stroke="#ef4444" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vibration Chart */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-orange-400" /> Análisis de Vibración
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" stroke="#94a3b8" tick={{fontSize: 12}} interval={4} />
                  <YAxis stroke="#94a3b8" domain={[0, 15]} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                  />
                  <Line type="monotone" dataKey="vibration" stroke="#f97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey={() => 10} stroke="#ef4444" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI & Controls Column */}
        <div className="space-y-6">
          
          {/* Controls */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Control de Panel</h3>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="w-full mb-3 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-all"
            >
              {isPaused ? <Play size={18} /> : <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>}
              {isPaused ? "Reanudar Telemetría" : "Pausar Telemetría"}
            </button>
            <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-900 rounded">
              <p>Simulación ejecutándose a 1Hz.</p>
              <p>Buffer de datos: {data.length}/30 puntos.</p>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-xl border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit size={120} />
            </div>
            
            <h3 className="text-lg font-semibold mb-4 text-indigo-300 flex items-center gap-2">
              <BrainCircuit size={20} />
              IA Diagnóstico Gemini
            </h3>

            <p className="text-sm text-slate-400 mb-6">
              Envía los datos actuales a Google Gemini para detectar anomalías y recibir recomendaciones de mantenimiento.
            </p>

            <button 
              onClick={handleManualAnalysis}
              disabled={isAnalyzing}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                isAnalyzing 
                ? 'bg-indigo-800 text-indigo-400 cursor-wait' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50'
              }`}
            >
              {isAnalyzing ? (
                <>Analizando datos...</>
              ) : (
                <>Generar Reporte IA</>
              )}
            </button>

            {analysis && (
              <div className="mt-6 animate-fadeIn">
                <div className={`text-sm font-bold mb-2 px-3 py-1 rounded-full w-fit ${
                  analysis.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' :
                  analysis.status === 'At Risk' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  Estado: {analysis.status}
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs uppercase text-indigo-400 font-bold">Análisis</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{analysis.explanation}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-indigo-400 font-bold">Recomendación</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{analysis.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}