import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AvailabilityCalendar({ selectedDate, onSelectDate, driverId }: { selectedDate: string, onSelectDate: (date: string) => void, driverId?: number }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const isOffDay = (date: Date) => {
    // Simulando dias off dinâmicos baseado no motorista
    const seed = driverId || 1;
    const isSunday = date.getDay() === 0;
    const isRandomDayOff = date.getDate() % (5 + seed) === 2;
    return isSunday || isRandomDayOff;
  };
  
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          type="button"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="font-semibold text-sm capitalize">
          {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          type="button"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-500 font-medium">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="p-2"></div>;
          
          // Formatar data ajustando fuso horário para garantir YYYY-MM-DD correto
          const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
          const dateStr = utcDate.toISOString().split('T')[0];
          
          const isSelected = selectedDate === dateStr;
          const isPast = date < today;
          const off = isOffDay(date);
          
          let bgColor = "bg-slate-50";
          let textColor = "text-slate-900";
          let border = "border border-transparent";
          
          if (isPast) {
            bgColor = "bg-slate-100 opacity-40";
            textColor = "text-slate-400";
          } else if (off) {
            bgColor = "bg-rose-100 hover:bg-rose-200 transition-colors";
            textColor = "text-rose-700";
          } else {
            bgColor = "bg-emerald-100 hover:bg-emerald-200 transition-colors";
            textColor = "text-emerald-800";
          }
          
          if (isSelected) {
            border = "ring-2 ring-slate-900 ring-offset-2";
          }
          
          return (
            <button
              key={i}
              disabled={isPast || off}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square flex items-center justify-center rounded-lg transition-all text-sm font-semibold ${bgColor} ${textColor} ${border} ${isPast || off ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:scale-105'}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-6 justify-center text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-400 rounded-sm shadow-sm ring-1 ring-black/5"></div> Disponível</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-400 rounded-sm shadow-sm ring-1 ring-black/5"></div> Indisponível</div>
      </div>
    </div>
  );
}
