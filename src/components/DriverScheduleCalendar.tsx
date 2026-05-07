import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Schedule } from '../App'; // Adjust import if needed

export function DriverScheduleCalendar({ schedules, driverId }: { schedules: Schedule[], driverId: number }) {
  const driverSchedules = schedules.filter(s => s.driverId === driverId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Agrupar por data
  const schedulesByDate = driverSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.date]) {
      acc[schedule.date] = [];
    }
    acc[schedule.date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const [selectedDate, setSelectedDate] = useState<string>(Object.keys(schedulesByDate)[0] || new Date().toISOString().split('T')[0]);

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-slate-900" /> Minha Agenda</CardTitle>
        <CardDescription>Visualize seus dias de trabalho, horários e rotas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Calendário Simplificado / Lista de Dias */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-slate-700">Dias com reservas</h4>
            {Object.keys(schedulesByDate).length === 0 ? (
              <p className="text-sm text-slate-500">Você não tem reservas futuras.</p>
            ) : (
              <div className="flex w-full overflow-x-auto pb-2 mb-2 md:flex-col md:overflow-visible gap-2 md:pb-0 md:mb-0 scrollbar-hide">
                {Object.keys(schedulesByDate).sort().map(dateStr => {
                  const date = new Date(dateStr + 'T12:00:00'); // Evitar problemas de timezone
                  const isSelected = selectedDate === dateStr;
                  const count = schedulesByDate[dateStr].length;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex-shrink-0 min-w-[120px] md:min-w-0 md:w-full flex md:items-center justify-between p-3 rounded-lg border text-left transition-all ${isSelected ? 'border-slate-500 bg-slate-100' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900 whitespace-nowrap">
                          {date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace('.', '')}
                        </div>
                        <div className="text-xs text-slate-500">{dateStr}</div>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-medium text-slate-700">
                        {count}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lista de Reservas do Dia */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-medium text-sm text-slate-700">
              Rotas para {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }) : 'o dia'}
            </h4>
            
            <div className="space-y-4">
              {(!schedulesByDate[selectedDate] || schedulesByDate[selectedDate].length === 0) ? (
                 <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-md border border-dashed border-slate-300">
                   Selecione um dia com reservas para visualizar as rotas.
                 </div>
              ) : (
                schedulesByDate[selectedDate].sort((a, b) => a.time.localeCompare(b.time)).map(schedule => (
                  <div key={schedule.id} className="p-4 rounded-md border border-slate-200 bg-white shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">{schedule.time} {schedule.endTime ? `- ${schedule.endTime}` : ''}</span>
                      </div>
                      <div className={`px-2 py-1 flex items-center justify-center rounded text-xs font-medium border ${
                        schedule.status === 'Reservado' ? 'bg-slate-50 border-slate-200 text-slate-700' : 
                        schedule.status === 'Em Standby' ? 'bg-amber-100 border-amber-300 text-amber-800' : 
                        schedule.status === 'A Caminho' ? 'bg-blue-100 border-blue-200 text-blue-800' : 
                        schedule.status === 'Em Andamento' ? 'bg-indigo-100 border-indigo-200 text-indigo-800' : 
                        schedule.status === 'Bloqueado' ? 'bg-rose-50 border-rose-200 text-rose-600' : 
                        'bg-green-50 border-green-200 text-green-700'}`}>
                        {schedule.status === 'Reservado' ? 'Agendado' : schedule.status === 'Bloqueado' ? 'Bloqueio' : schedule.status}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {schedule.status !== 'Bloqueado' && (
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 mb-2">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Passageiro</p>
                          <p className="text-sm font-semibold text-slate-900">{schedule.passengerName || 'Titular da Conta'}</p>
                          {schedule.passengerPhone && <p className="text-xs text-slate-600">{schedule.passengerPhone}</p>}
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <div className={`w-2 h-2 rounded-full ${schedule.status === 'Bloqueado' ? 'bg-rose-600' : 'bg-slate-900'}`} />
                          {schedule.status !== 'Bloqueado' && (
                            <>
                              <div className="w-0.5 h-6 bg-slate-200 my-1" />
                              <div className="w-2 h-2 rounded-full bg-rose-500" />
                            </>
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          {schedule.status === 'Bloqueado' ? (
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Motivo</p>
                                <p className="text-sm font-medium text-slate-900">{schedule.origin}</p>
                            </div>
                          ) : schedule.serviceType === 'Diaria' ? (
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Modalidade: À Disposição</p>
                              <p className="text-sm font-medium text-slate-900">{schedule.hours} horas contratadas</p>
                            </div>
                          ) : (
                            <>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Origem</p>
                                <p className="text-sm font-medium text-slate-900">{schedule.origin}</p>
                              </div>
                              {schedule.stops && schedule.stops.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Paradas Intermediárias</p>
                                  <ul className="list-disc pl-4 mt-1">
                                    {schedule.stops.map((stp, idxx) => (
                                      <li key={idxx} className="text-sm font-medium text-slate-700">{stp}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Destino Final</p>
                                <p className="text-sm font-medium text-slate-900">{schedule.destination}</p>
                              </div>
                            </>
                          )}
                          {schedule.preferences && schedule.status !== 'Bloqueado' && (
                            <div className="pt-2">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Preferências VIP</p>
                              <p className="text-sm font-medium text-amber-700 bg-amber-50 inline-block px-2 py-1 rounded mt-1 border border-amber-200">{schedule.preferences}</p>
                            </div>
                          )}
                          {schedule.price && (
                            <div className="pt-2">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Registrado</p>
                              <p className="text-sm font-bold text-green-700">R$ {schedule.price.toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
