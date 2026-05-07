import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Calendar, Clock, Car, ChevronRight, CheckCircle2, MessageCircle, AlertCircle, Star, Loader2, User, Home, Settings, Save, Menu, X, LayoutDashboard, History, LogOut, ChevronLeft, Bell, DollarSign, FileText, ShieldAlert, Users, Power, Activity } from 'lucide-react';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DriverScheduleCalendar } from './components/DriverScheduleCalendar';

type Driver = {
  id: number;
  name: string;
  category: 'Comfort' | 'Executivo' | 'Black';
  vehicle: string;
  whatsapp: string;
  email?: string;
  password?: string;
  workingDays?: string[];
  workStart?: string;
  workEnd?: string;
};

const INITIAL_DRIVERS: Driver[] = [
  { id: 1, name: 'Carlos Silva', category: 'Executivo', vehicle: 'Toyota Corolla', whatsapp: '+5511999999991', email: 'carlos@pds.com', password: '123', workingDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], workStart: '08:00', workEnd: '20:00' },
  { id: 2, name: 'Roberto Almeida', category: 'Black', vehicle: 'Mercedes C-Class', whatsapp: '+5511999999992', email: 'roberto@pds.com', password: '123', workingDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], workStart: '08:00', workEnd: '20:00' },
  { id: 3, name: 'Fernando Costa', category: 'Comfort', vehicle: 'Jeep Compass', whatsapp: '+5511999999993', email: 'fernando@pds.com', password: '123', workingDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], workStart: '08:00', workEnd: '20:00' },
];

const INITIAL_ADMIN_USERS = [
  { id: 'USR-001', name: 'João Silva', role: 'Cliente', appVersion: 'v1.2', registration: '10/01/2026', status: 'Ativo' },
  { id: 'USR-002', name: 'Roberto Costa', role: 'Cliente', appVersion: 'v1.2', registration: '12/02/2026', status: 'Ativo' },
  { id: 'USR-003', name: 'Carlos Mendes', role: 'Motorista', appVersion: 'v1.1', registration: '05/03/2026', status: 'Ativo' },
  { id: 'USR-004', name: 'Admin Frota 1', role: 'Gestor de Frota', appVersion: 'v1.2', registration: '01/01/2026', status: 'Suspenso' }
];

const INITIAL_ADMIN_VEHICLES = [
  { plate: 'ABC-1234', model: 'Audi A6', ownerId: 'USR-003', armored: 'Sim', status: 'Ativo' },
  { plate: 'XYZ-9876', model: 'Porsche Cayenne', ownerId: 'USR-004', armored: 'Não', status: 'Ativo' },
  { plate: 'DEF-5555', model: 'BMW Série 7', ownerId: 'USR-004', armored: 'Sim', status: 'Bloqueado (Doc Pendente)' }
];

const INITIAL_ADMIN_TOGGLES = [
  { feature: 'Ghost_Tracking', type: 'Segurança', status: 'LIGADO' },
  { feature: 'Flight_Tracker', type: 'Integração API', status: 'LIGADO' },
  { feature: 'Modo_Escuro_Auto', type: 'Interface/UX', status: 'LIGADO' },
  { feature: 'Painel_Multi_Empresas', type: 'Arquitetura', status: 'DESLIGADO' }
];

export type Schedule = {
  id: string;
  driverId: number;
  date: string;
  time: string;
  endTime?: string;
  origin: string;
  stops?: string[];
  destination: string;
  serviceType?: 'Trajeto' | 'Diaria' | 'Bloqueio';
  hours?: number;
  price?: number;
  preferences?: string;
  status: 'Reservado' | 'Concluido' | 'Bloqueado' | 'Em Standby' | 'A Caminho' | 'Em Andamento';
  timingMode?: 'Fixo' | 'Standby';
  paymentStatus?: 'A Faturar' | 'Aguardando Aprovação' | 'Pago';
  reviewed?: boolean;
  passengerName?: string;
  passengerPhone?: string;
  flightNumber?: string;
  receptionType?: string;
  costCenter?: string;
  paymentMethod?: string;
};

type Review = {
  id: string;
  driverId: number;
  rating: number;
  comment: string;
};

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  preferredCategory: string;
  notifications: boolean;
};

const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', driverId: 1, rating: 5, comment: 'Excelente motorista, muito pontual.' },
  { id: 'r2', driverId: 1, rating: 4, comment: 'Carro muito limpo.' },
  { id: 'r3', driverId: 2, rating: 5, comment: 'Viagem perfeita.' },
  { id: 'r4', driverId: 3, rating: 4, comment: 'Bom atendimento.' },
];

function getInitialSchedules(): Schedule[] {
  const date = new Date();
  
  const mDate = date.toISOString().split('T')[0];
  
  const schedules: Schedule[] = [];

  // Tomorrow
  let d = new Date(date);
  d.setDate(d.getDate() + 1);
  let dStr = d.toISOString().split('T')[0];
  schedules.push({
    id: 's1', driverId: 1, date: dStr, time: '08:00', origin: 'Av. Brigadeiro Faria Lima, 3477', destination: 'Aeroporto de Congonhas', status: 'Reservado', serviceType: 'Trajeto', price: 180, preferences: 'Ar-condicionado (22°C) | Viagem Silenciosa (Foco/Trabalho)', timingMode: 'Fixo', paymentStatus: 'A Faturar', passengerName: 'Carlos Bertolazzi', passengerPhone: '(11) 98765-4321', paymentMethod: 'Corporate'
  });

  schedules.push({
    id: 's2', driverId: 2, date: dStr, time: '14:30', origin: 'Rua Amauri, 255', destination: 'Av. Paulista, 1578', status: 'Reservado', serviceType: 'Trajeto', price: 120, preferences: 'Ar-condicionado (20°C) | Rádio/Notícias', timingMode: 'Fixo', paymentStatus: 'A Faturar', passengerName: 'Mariana Silva', passengerPhone: '(11) 91234-5678', paymentMethod: 'Corporate'
  });

  // Today - In Progress / Standby
  d = new Date(date);
  dStr = d.toISOString().split('T')[0];
  let h = d.getHours();
  schedules.push({
    id: 's3', driverId: 1, date: dStr, time: `${String(h).padStart(2, '0')}:00`, origin: 'Aeroporto de Guarulhos', destination: 'Hotel Fasano São Paulo', status: 'Em Standby', serviceType: 'Trajeto', price: 350, preferences: 'Sem preferência | Viagem Silenciosa (Foco/Trabalho)', timingMode: 'Standby', paymentStatus: 'A Faturar', passengerName: 'Roberto Justus', passengerPhone: '(11) 99999-9999', paymentMethod: 'Corporate'
  });

  // Yesterday - Completed
  d = new Date(date);
  d.setDate(d.getDate() - 1);
  dStr = d.toISOString().split('T')[0];
  schedules.push({
    id: 's4', driverId: 1, date: dStr, time: '09:00', endTime: '18:00', origin: 'Hotel Unique', destination: '8 horas', status: 'Concluido', serviceType: 'Diaria', hours: 8, price: 1200, preferences: 'Ar-condicionado (21°C) | Playlist do Cliente / Bluetooth', timingMode: 'Fixo', paymentStatus: 'Aguardando Aprovação', passengerName: 'Luiza Trajano', passengerPhone: '(11) 98888-8888', reviewed: true, paymentMethod: 'Corporate'
  });

  schedules.push({
    id: 's5', driverId: 2, date: dStr, time: '18:00', origin: 'B3 - Brasil Bolsa Balcão', destination: 'Restaurante D.O.M.', status: 'Concluido', serviceType: 'Trajeto', price: 150, preferences: 'Sem preferência | Viagem Silenciosa (Foco/Trabalho)', timingMode: 'Standby', paymentStatus: 'A Faturar', passengerName: 'Carlos Bertolazzi', passengerPhone: '(11) 98765-4321', reviewed: false, paymentMethod: 'Corporate'
  });

  // 3 Days Ago - Paid
  d = new Date(date);
  d.setDate(d.getDate() - 3);
  dStr = d.toISOString().split('T')[0];
  schedules.push({
    id: 's6', driverId: 1, date: dStr, time: '10:00', origin: 'Av. Engenheiro Luís Carlos Berrini, 105', destination: 'Aeroporto Viracopos', status: 'Concluido', serviceType: 'Trajeto', price: 450, preferences: 'Ar-condicionado (23°C) | Viagem Silenciosa (Foco/Trabalho)', timingMode: 'Fixo', paymentStatus: 'Pago', passengerName: 'Mariana Silva', passengerPhone: '(11) 91234-5678', reviewed: true, paymentMethod: 'Corporate'
  });

  return schedules;
}

export default function App() {
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [reviewingSchedule, setReviewingSchedule] = useState<Schedule | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [origin, setOrigin] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(15);
  const [serviceType, setServiceType] = useState<'Trajeto' | 'Diaria'>('Trajeto');
  const [hours, setHours] = useState(4);
  const [prefClimate, setPrefClimate] = useState('Sem preferência');
  const [prefClimateTemp, setPrefClimateTemp] = useState<number | ''>(22);
  const [prefSound, setPrefSound] = useState('Viagem Silenciosa (Foco/Trabalho)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timingMode, setTimingMode] = useState<'Fixo' | 'Standby'>('Fixo');
  const [faturasPendentes, setFaturasPendentes] = useState(true);
  const [isBooking, setIsBooking] = useState<number | null>(null);
  const [reservaSucesso, setReservaSucesso] = useState(false);
  const [alertaMotorista, setAlertaMotorista] = useState(false);
  
  const [bookingFor, setBookingFor] = useState<'me' | 'guest'>('me');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  const [flightNumber, setFlightNumber] = useState('');
  const [receptionType, setReceptionType] = useState('Curbside Pickup (Encontro no meio-fio)');
  const [costCenter, setCostCenter] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('Pix (5% de Desconto)');
  const [paymentChange, setPaymentChange] = useState('');
  
  const [savedAddresses, setSavedAddresses] = useState<{name: string, address: string}[]>([
    { name: '🏢 Escritório', address: 'Av. Brigadeiro Faria Lima, 1200 - São Paulo, SP' },
    { name: '🏠 Residência', address: 'Alameda Rio Negro, 500 - Alphaville, Barueri - SP' }
  ]);
  const [newAddressName, setNewAddressName] = useState('');
  const [newAddressValue, setNewAddressValue] = useState('');
  
  const [authRole, setAuthRole] = useState<'cliente' | 'motorista' | 'admin' | null>(null);
  const [loggedDriverId, setLoggedDriverId] = useState<number | null>(null);
  const [selectedClientDriverId, setSelectedClientDriverId] = useState<number | null>(null);
  
  const [blockReason, setBlockReason] = useState('Manutenção Preventiva');
  const [blockDate, setBlockDate] = useState('');
  const [blockStartTime, setBlockStartTime] = useState('');
  const [blockEndTime, setBlockEndTime] = useState('');
  const [showClientLogin, setShowClientLogin] = useState(false);
  const [showDriverLogin, setShowDriverLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [clientLoginName, setClientLoginName] = useState('João Silva');
  const [clientLoginDob, setClientLoginDob] = useState('15/04/1980');
  const [loginEmail, setLoginEmail] = useState('carlos@pds.com');
  const [loginPassword, setLoginPassword] = useState('123');
  const [adminId, setAdminId] = useState('sysadmin');
  const [adminKey, setAdminKey] = useState('godmode2026');
  const [loginError, setLoginError] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'trips' | 'programacao' | 'painel' | 'admin_health' | 'admin_users' | 'admin_fleet' | 'admin_toggles'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Carlos Bertolazzi',
    email: 'carlos.b@example.com',
    phone: '(11) 98765-4321',
    preferredCategory: 'Qualquer',
    notifications: true,
  });

  const [pricing, setPricing] = useState({
    Trajeto: { Comfort: { base: 15.0, km: 2.5 }, Executivo: { base: 25.0, km: 4.0 }, Black: { base: 40.0, km: 6.5 } },
    Diaria: { Comfort: { hr: 70.0 }, Executivo: { hr: 120.0 }, Black: { hr: 180.0 } }
  });

  const calculatePrice = (srvType: 'Trajeto' | 'Diaria', distKm: number, hrs: number, cat: Driver['category']): number => {
    if (srvType === 'Trajeto') {
      const base = pricing.Trajeto[cat].base;
      const km = pricing.Trajeto[cat].km;
      return base + (distKm * km);
    } else {
      const hr = pricing.Diaria[cat].hr;
      return hrs * hr;
    }
  };

  // Negotiation state is removed

  useEffect(() => {
    setSchedules(getInitialSchedules());
    // initialize date to today, time to current time + 2h
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    now.setHours(now.getHours() + 3);
    setTime(now.getHours().toString().padStart(2, '0') + ':00');
  }, []);

  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  const diffHours = (selectedDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isValidTime = diffHours >= 2;
  const isFilled = (serviceType === 'Trajeto' ? origin.trim() && destination.trim() : true) && date && time;
  const hasConflict = selectedClientDriverId ? schedules.some(s => s.driverId === selectedClientDriverId && s.date === date && s.time === time.substring(0, 5) && s.status === 'Reservado') : false;

  const MAPA_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const selectedDayName = MAPA_DIAS[selectedDateTime.getDay()];
  const driverForValidation = selectedClientDriverId ? drivers.find(d => d.id === selectedClientDriverId) : null;
  const isDayAvailable = driverForValidation ? (driverForValidation.workingDays?.includes(selectedDayName) ?? true) : true;
  
  const selectedTimeNum = time ? parseInt(time.replace(':', ''), 10) : 0;
  const driverStartNum = driverForValidation && driverForValidation.workStart ? parseInt(driverForValidation.workStart.replace(':', ''), 10) : 0;
  const driverEndNum = driverForValidation && driverForValidation.workEnd ? parseInt(driverForValidation.workEnd.replace(':', ''), 10) : 2359;
  
  const isTimeAvailable = selectedTimeNum >= driverStartNum && selectedTimeNum <= driverEndNum;
  const isDriverAvailable = isDayAvailable && isTimeAvailable;

  const calculateEndTime = (start_time: string, durationMinutes: number, bufferMinutes: number) => {
    const [h, m] = start_time.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(h, m, 0, 0);
    dateObj.setMinutes(dateObj.getMinutes() + durationMinutes + bufferMinutes);
    return dateObj.getHours().toString().padStart(2, '0') + ':' + dateObj.getMinutes().toString().padStart(2, '0');
  };

  const calculateFinalPrice = (basePrice: number) => {
    if (paymentMethod === 'Pix (5% de Desconto)') return basePrice * 0.95;
    if (paymentMethod === 'Cartão de Crédito/Débito (Taxa de 5%)') return basePrice * 1.05;
    return basePrice;
  };

  const handleBook = (driverId: number, driverCategory: Driver['category']) => {
    if (hasConflict) return;
    setIsBooking(driverId);
    
    // Calculate price
    const basePrice = calculatePrice(serviceType, distance, hours, driverCategory);
    const estimatedPrice = calculateFinalPrice(basePrice);
    
    // Payment method string
    let finalPaymentString = paymentMethod;
    if (paymentMethod === 'Dinheiro (Espécie)' && paymentChange) {
      finalPaymentString = `Dinheiro (Troco para ${paymentChange})`;
    }
    
    // Estimate duration for Trajeto: 1 min per km + 10 mins base. For Diaria, use hours.
    const durationMinutes = serviceType === 'Trajeto' ? (distance * 1) + 10 : (hours * 60);
    const calculatedEndTime = calculateEndTime(time, durationMinutes, 30);
    
    setTimeout(() => {
      setSchedules(prev => [...prev, { 
        id: Date.now().toString(), 
        driverId, 
        date, 
        origin: serviceType === 'Trajeto' ? origin : 'À Disposição', 
        destination: serviceType === 'Trajeto' ? destination : `${hours} horas`, 
        stops: serviceType === 'Trajeto' ? stops : [],
        serviceType,
        hours: serviceType === 'Diaria' ? hours : undefined,
        time: time.slice(0, 5), 
        endTime: calculatedEndTime,
        price: estimatedPrice,
        preferences: `${prefClimate}${prefClimate !== 'Sem preferência' && prefClimateTemp ? ` (${prefClimateTemp}°C)` : ''} | ${prefSound}`,
        status: timingMode === 'Standby' ? 'Em Standby' : 'Reservado',
        timingMode,
        paymentStatus: 'A Faturar',
        passengerName: bookingFor === 'guest' ? guestName : profile.name,
        passengerPhone: bookingFor === 'guest' ? guestPhone : profile.phone,
        flightNumber: flightNumber || undefined,
        receptionType,
        costCenter: costCenter || 'Padrão',
        paymentMethod: finalPaymentString,
      }]);
      setIsBooking(null);
      setStops([]); // reset stops
      setOrigin('');
      setDestination('');
      setReservaSucesso(true);
      setAlertaMotorista(true);
    }, 600);
  };

  const handleComplete = (id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: 'Concluido' } : s));
  };

  const handleSubmitReview = () => {
    if (!reviewingSchedule) return;
    const newReview: Review = {
      id: Date.now().toString(),
      driverId: reviewingSchedule.driverId,
      rating,
      comment
    };
    setReviews(prev => [...prev, newReview]);
    setSchedules(prev => prev.map(s => s.id === reviewingSchedule.id ? { ...s, reviewed: true } : s));
    setReviewingSchedule(null);
    setRating(5);
    setComment('');
  };

  const getDriverRating = (driverId: number) => {
    const driverReviews = reviews.filter(r => r.driverId === driverId);
    if (driverReviews.length === 0) return { avg: 0, count: 0 };
    const sum = driverReviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: (sum / driverReviews.length).toFixed(1), count: driverReviews.length };
  };

  const handleSaveProfile = () => {
    // Simulando salvamento
    setTimeout(() => {
      alert('Perfil salvo com sucesso!');
      setCurrentView('home');
    }, 300);
  };

  if (!authRole) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-md">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-slate-900 p-8 flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-4">
                <Car className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Private Drive</h1>
              <p className="text-slate-300 mt-2 text-sm">Selecione seu perfil para continuar</p>
            </div>
            <CardContent className="p-6">
              {!showAdminLogin ? (
                <div className="space-y-6">
                  <Tabs defaultValue="cliente" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="cliente">Sou Cliente</TabsTrigger>
                      <TabsTrigger value="motorista">Sou Motorista</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="cliente" className="space-y-4 outline-none">
                      {loginError && (
                        <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm text-center">
                          {loginError}
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Login Cliente (Nome Completo)</label>
                        <Input 
                           type="text" 
                           placeholder="Ex: João Silva"
                           value={clientLoginName} 
                           onChange={e => setClientLoginName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Senha (Data de Nascimento)</label>
                        <Input 
                           type="password"
                           placeholder="DD/MM/AAAA"
                           value={clientLoginDob} 
                           onChange={e => setClientLoginDob(e.target.value)} 
                        />
                      </div>
                      <Button 
                        className="w-full mt-4 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-md shadow-md transition-all active:scale-95" 
                        onClick={() => {
                            const user = INITIAL_ADMIN_USERS.find(u => u.name === clientLoginName && u.role === 'Cliente');
                            if (user && clientLoginDob === '15/04/1980') { // Simplified check based on prompt
                                setAuthRole('cliente');
                                setProfile(prev => ({...prev, name: clientLoginName}));
                                setCurrentView('home');
                            } else {
                                setLoginError('Acesso Negado. Verifique seu nome ou data de nascimento.');
                            }
                        }}
                      >
                        Acessar Plataforma VIP
                      </Button>
                      <div className="text-center mt-4">
                         <p className="text-xs text-slate-500">Dados para teste:</p>
                         <p className="text-xs font-mono text-slate-500 mt-1">João Silva / 15/04/1980</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="motorista" className="space-y-4 outline-none">
                      {loginError && (
                        <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm text-center">
                          {loginError}
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ID Motorista (E-mail)</label>
                        <Input 
                           type="email" 
                           placeholder="motorista@exemplo.com"
                           value={loginEmail} 
                           onChange={e => setLoginEmail(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Senha Operacional</label>
                        <Input 
                           type="password"
                           placeholder="Sua senha"
                           value={loginPassword} 
                           onChange={e => setLoginPassword(e.target.value)} 
                        />
                      </div>
                      <Button 
                        className="w-full mt-4 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-md shadow-md transition-all active:scale-95" 
                        onClick={() => {
                            const driver = INITIAL_DRIVERS.find(d => d.email === loginEmail && d.password === loginPassword);
                            if (driver) {
                                setAuthRole('motorista');
                                setLoggedDriverId(driver.id);
                                setCurrentView('trips');
                            } else {
                                setLoginError('Acesso Negado. Verifique credenciais.');
                            }
                        }}
                      >
                        Acessar Logística
                      </Button>
                      <div className="text-center mt-4">
                         <p className="text-xs text-slate-500">Dados para teste:</p>
                         <p className="text-xs font-mono text-slate-500 mt-1">carlos@pds.com / 123</p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button 
                    variant="ghost" 
                    className="w-full text-slate-400 hover:text-slate-600 font-mono text-xs uppercase mt-2 pt-4 border-t border-slate-100" 
                    onClick={() => { setShowAdminLogin(true); setLoginError(''); }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Master Console / System Owner
                  </Button>
                </div>
              ) : showAdminLogin ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-slate-500" onClick={() => {setShowAdminLogin(false); setLoginError('');}}>
                        <ChevronLeft className="w-4 h-4" />
                     </Button>
                     <h3 className="font-semibold px-2 font-mono tracking-tight">SYSTEM_CORE / AUTH</h3>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm text-center">
                      {loginError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium font-mono text-slate-500">Developer ID</label>
                    <Input 
                       type="text" 
                       placeholder="sysadmin"
                       value={adminId} 
                       onChange={e => setAdminId(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium font-mono text-slate-500">Master Key</label>
                    <Input 
                       type="password"
                       placeholder="godmode2026"
                       value={adminKey} 
                       onChange={e => setAdminKey(e.target.value)} 
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-4 h-12 bg-[#D4AF37] hover:bg-yellow-600 text-[#000] rounded-md shadow-md transition-all active:scale-95 font-mono tracking-widest font-semibold uppercase" 
                    onClick={() => {
                        if (adminId === 'sysadmin' && adminKey === 'godmode2026') {
                            setAuthRole('admin');
                            setCurrentView('admin_health');
                        } else {
                            setLoginError('Access Denied.');
                        }
                    }}
                  >
                    Execute Login
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${authRole === 'admin' ? 'bg-[#0A0A0A] text-[#E5E7EB]' : 'bg-[#FAFAFA] text-[#1A1A1A]'}`}>
      {/* Sidebar Desktop e Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 ${authRole === 'admin' ? 'bg-[#0A0A0A] text-slate-400 border-[#262626]' : 'bg-white text-slate-600 border-[#F0F0F0]'} border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-[2px_0_15px_rgba(0,0,0,0.05)]' : '-translate-x-full md:shadow-[2px_0_15px_rgba(0,0,0,0.02)]'} flex flex-col flex-shrink-0`}>
        <div className={`p-6 flex items-center justify-between border-b ${authRole === 'admin' ? 'border-[#262626] bg-[#111111]' : 'border-[#F0F0F0]'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center shadow-lg ${authRole === 'admin' ? 'bg-[#D4AF37]' : 'bg-slate-900'}`}>
              <Car className={`w-5 h-5 ${authRole === 'admin' ? 'text-black' : 'text-white'}`} />
            </div>
            <div className={`font-heading font-semibold text-xl tracking-tight leading-tight ${authRole === 'admin' ? 'text-white' : 'text-slate-900'}`}>
              {authRole === 'admin' ? (
                <>Núcleo_do_<br/>Sistema</>
              ) : (
                <>Private<br/>Drive</>
              )}
            </div>
          </div>
          <button className={`md:hidden ${authRole === 'admin' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className={`flex-1 flex flex-col px-4 space-y-2 mt-6 pb-4 ${authRole === 'admin' ? 'bg-[#0A0A0A]' : ''}`}>
          <div className={`text-[10px] font-heading font-semibold uppercase tracking-widest pl-4 mb-2 ${authRole === 'admin' ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
            {authRole === 'admin' ? '// TERMINAL DO PROPRIETÁRIO' : 'Menu Principal'}
          </div>
          {authRole === 'cliente' && (
            <button 
              onClick={() => { setCurrentView('home'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Nova Reserva
            </button>
          )}
          {authRole !== 'admin' && (
            <button 
              onClick={() => { setCurrentView('trips'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'trips' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <History className="w-4 h-4" /> {authRole === 'motorista' ? 'Minhas Corridas' : 'Histórico de Viagens'}
            </button>
          )}
          {authRole === 'motorista' && (
            <>
              <button 
                onClick={() => { setCurrentView('programacao'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'programacao' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Calendar className="w-4 h-4" /> Programação
              </button>
              <button 
                onClick={() => { setCurrentView('painel'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'painel' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Settings className="w-4 h-4" /> Painel Logístico
              </button>
            </>
          )}

          {authRole === 'admin' && (
            <>
              <button 
                onClick={() => { setCurrentView('admin_health'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'admin_health' ? 'bg-[#111111] border-l-4 border-[#D4AF37] text-white shadow-md' : 'text-slate-500 hover:bg-[#111111] hover:text-white'}`}
              >
                <Activity className="w-4 h-4" /> Saúde da Infraestrutura
              </button>
              <button 
                onClick={() => { setCurrentView('admin_users'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'admin_users' ? 'bg-[#111111] border-l-4 border-[#D4AF37] text-white shadow-md' : 'text-slate-500 hover:bg-[#111111] hover:text-white'}`}
              >
                <Users className="w-4 h-4" /> Banco de Dados: Usuários
              </button>
              <button 
                onClick={() => { setCurrentView('admin_fleet'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'admin_fleet' ? 'bg-[#111111] border-l-4 border-[#D4AF37] text-white shadow-md' : 'text-slate-500 hover:bg-[#111111] hover:text-white'}`}
              >
                <Car className="w-4 h-4" /> Banco de Dados: Frota
              </button>
              <button 
                onClick={() => { setCurrentView('admin_toggles'); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'admin_toggles' ? 'bg-[#111111] border-l-4 border-[#D4AF37] text-white shadow-md' : 'text-slate-500 hover:bg-[#111111] hover:text-white'}`}
              >
                <Power className="w-4 h-4" /> Controle de Funcionalidades
              </button>
            </>
          )}

          {authRole !== 'admin' && (
            <button 
              onClick={() => { setCurrentView('profile'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'profile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User className="w-4 h-4" /> Meu Perfil
            </button>
          )}
          
          {authRole === 'cliente' && (
            <button 
              onClick={() => { setCurrentView('enderecos'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'enderecos' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <MapPin className="w-4 h-4" /> Meus Endereços
            </button>
          )}

          {authRole === 'cliente' && (
            <button 
              onClick={() => { setCurrentView('faturamento'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${currentView === 'faturamento' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <FileText className="w-4 h-4" /> Faturamento
            </button>
          )}

          <div className="mt-auto pt-6">
            <button 
              onClick={() => { setAuthRole(null); setLoggedDriverId(null); setCurrentView('home'); setIsSidebarOpen(false); }} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all hover:bg-rose-50 text-rose-500 hover:text-rose-600 font-medium text-sm"
            >
              <LogOut className="w-4 h-4" /> Encerrar Sessão
            </button>
          </div>
        </nav>
        <div className={`p-4 border-t ${authRole === 'admin' ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#F0F0F0] bg-slate-50/50'}`}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className={`w-9 h-9 border rounded-full flex items-center justify-center shrink-0 shadow-sm ${authRole === 'admin' ? 'bg-[#111111] border-[#333333] text-[#D4AF37]' : 'bg-white border-slate-200 text-slate-400'}`}>
              {authRole === 'motorista' ? <Car className="w-4 h-4" /> : authRole === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`text-sm truncate min-w-0 ${authRole === 'admin' ? 'text-white' : 'text-slate-900'}`}>
              <p className="font-semibold truncate">
                {authRole === 'admin' ? 'System Administrator' : authRole === 'motorista' ? INITIAL_DRIVERS.find(d => d.id === loggedDriverId)?.name : profile.name}
              </p>
              <p className={`text-xs font-medium truncate ${authRole === 'admin' ? 'text-[#D4AF37] font-mono tracking-tight' : 'text-slate-500'}`}>
                {authRole === 'admin' ? 'godmode / engine control' : authRole === 'motorista' ? INITIAL_DRIVERS.find(d => d.id === loggedDriverId)?.category : profile.preferredCategory}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col pt-0 md:pt-4">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
              <Car className="text-white w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Private Drive</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-4 pb-20">
          <div className="hidden md:block mb-8">
            <h1 className="text-[1.8rem] font-heading font-semibold tracking-[-0.5px] text-[#111827] mb-1">Private Drive</h1>
            <p className="font-heading text-[0.85rem] font-normal text-[#6B7280] tracking-[0.5px]">Concierge de Mobilidade Corporativa | Consolidação 2026</p>
          </div>
        <AnimatePresence mode="wait">
          {currentView === 'home' || currentView === 'trips' ? (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-8"
            >
          
          {/* Main Content */}
          <div className="space-y-6">
            {currentView === 'home' && (
              <>
                {reservaSucesso && authRole === 'cliente' ? (
                  <div className="bg-white border-2 border-emerald-500 rounded-xl p-8 text-center shadow-lg my-12 animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-emerald-600 mb-2">✅ Reserva Confirmada</h2>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">Sua viagem foi agendada com sucesso. O motorista acaba de ser notificado em tempo real e a corrida já está disponível no seu painel logístico.</p>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 h-12 text-base"
                      onClick={() => {
                        setReservaSucesso(false);
                        setCurrentView('trips');
                        setSelectedClientDriverId(null);
                      }}
                    >
                      Voltar ao Painel Principal
                    </Button>
                  </div>
                ) : (
                <>
                {authRole === 'cliente' && schedules.some(s => s.status === 'Em Standby') && (
                  <div className="bg-[#FDFAEF] border border-[#f0ead6] border-l-4 border-l-[#D4AF37] p-5 rounded font-sans flex flex-col sm:flex-row gap-5 items-center justify-between mt-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm shrink-0 border border-[#f0ead6]">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-[0.9rem] font-heading font-semibold text-slate-900 tracking-wide uppercase">Veículo em Posição</h3>
                        <p className="text-[#8C8C8C] text-sm mt-0.5">O motorista aguarda sua autorização de embarque.</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-[#111827] hover:bg-[#2D3748] text-white font-medium h-[46px] w-full sm:w-auto px-8 rounded tracking-[0.5px] transition-all hover:-translate-y-[1px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] shrink-0"
                      onClick={() => {
                        const nowTime = new Date();
                        nowTime.setMinutes(nowTime.getMinutes() + 5);
                        const strTime = nowTime.getHours().toString().padStart(2, '0') + ':' + nowTime.getMinutes().toString().padStart(2, '0');
                        setSchedules(prev => prev.map(s => s.status === 'Em Standby' ? { ...s, status: 'A Caminho', time: strTime } : s));
                      }}
                    >
                      Autorizar Embarque (Deslocamento imediato)
                    </Button>
                  </div>
                )}

                {!selectedClientDriverId ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Car className="w-5 h-5 text-slate-900" /> Selecione um Motorista
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {INITIAL_DRIVERS.filter(driver => profile.preferredCategory === 'Qualquer' || profile.preferredCategory === driver.category).map(driver => (
                        <Card key={driver.id} className="cursor-pointer overflow-hidden border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-400 group" onClick={() => setSelectedClientDriverId(driver.id)}>
                          <div className="p-4 flex flex-col items-start gap-3">
                            <div className="flex items-center gap-2 pb-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider group-hover:bg-slate-100 group-hover:text-slate-800 transition-colors">
                                {driver.category}
                              </span>
                              {getDriverRating(driver.id).count > 0 && (
                                <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full gap-1 border border-amber-100">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  {getDriverRating(driver.id).avg} ({getDriverRating(driver.id).count})
                                </span>
                              )}
                            </div>
                            <div>
                               <h3 className="font-semibold text-lg leading-tight group-hover:text-slate-900 transition-colors">{driver.name}</h3>
                               <p className="text-sm text-slate-500">{driver.vehicle}</p>
                            </div>
                            <div className="mt-2 text-xs font-medium text-slate-500 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                               Selecionar <ChevronRight className="w-3 h-3" />
                            </div>
                          </div>
                        </Card>
                      ))}
                      {INITIAL_DRIVERS.filter(driver => profile.preferredCategory === 'Qualquer' || profile.preferredCategory === driver.category).length === 0 && (
                        <div className="p-8 col-span-full text-center text-slate-500 bg-white rounded-md border border-dashed border-slate-300">
                          Não há motoristas disponíveis na categoria "{profile.preferredCategory}". Tente ajustar as preferências no seu perfil.
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" className="text-slate-500 hover:bg-slate-200 p-2 h-auto" onClick={() => setSelectedClientDriverId(null)}>
                        <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
                      </Button>
                      <h2 className="text-xl font-semibold">
                        Agendar com {INITIAL_DRIVERS.find(d=> d.id === selectedClientDriverId)?.name}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column: Form */}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                        
                        <Card className="shadow-sm border-slate-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base"><User className="w-5 h-5 text-slate-900" /> Identificação do Passageiro</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex gap-6 mb-2">
                              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input type="radio" value="me" checked={bookingFor === 'me'} onChange={() => setBookingFor('me')} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                Para mim
                              </label>
                              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input type="radio" value="guest" checked={bookingFor === 'guest'} onChange={() => setBookingFor('guest')} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                                Agendar para convidado/colega
                              </label>
                            </div>
                            {bookingFor === 'guest' && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                                <Input placeholder="Nome do Passageiro" value={guestName} onChange={e => setGuestName(e.target.value)} className="bg-slate-50" />
                                <Input placeholder="WhatsApp do Passageiro" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="bg-slate-50" />
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Route Card */}
                        <Card className="shadow-sm border-slate-200 h-full flex flex-col">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2"><Navigation className="w-5 h-5 text-slate-900" /> Configuração de Rota</CardTitle>
                            <CardDescription>Defina sua modalidade e detalhes preferenciais.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            
                            <datalist id="saved-addresses">
                              {savedAddresses.map((addr, idx) => (
                                <option key={idx} value={addr.address}>{addr.name}</option>
                              ))}
                            </datalist>

                            <div className="mb-4">
                              <label className="text-sm font-medium mb-2 block">Selecione o tipo de operação:</label>
                              <select 
                                className="w-full h-11 rounded-[4px] border border-[#E2E8F0] bg-transparent px-[15px] text-[0.95rem] transition-colors outline-none focus-visible:border-[#111827] focus-visible:ring-1 focus-visible:ring-[#111827]"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value as any)}
                              >
                                <option value="Trajeto">Trajeto Único</option>
                                <option value="Diaria">À Disposição (Pacote de Horas)</option>
                              </select>
                            </div>

                            {savedAddresses.length > 0 && (
                              <div className="mb-4">
                                <div className="text-[10px] font-heading font-semibold text-[#8C8C8C] uppercase tracking-widest mb-3 border-b border-[#EAEAEA] pb-2">
                                  ⚡ Acesso Rápido (Fast-Track)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-widest mb-2">DEFINIR ORIGEM:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {savedAddresses.map((addr, idx) => (
                                        <button 
                                          key={`orig_${idx}`} 
                                          onClick={() => setOrigin(addr.address)}
                                          className="text-[0.8rem] bg-white border border-[#E2E8F0] text-[#4A5568] px-3 py-1.5 rounded-[4px] hover:border-[#A0AEC0] hover:text-[#1A202C] transition-colors font-medium shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                                        >
                                          {addr.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  {serviceType === 'Trajeto' && (
                                    <div>
                                      <p className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-widest mb-2">DEFINIR DESTINO:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {savedAddresses.map((addr, idx) => (
                                          <button 
                                            key={`dest_${idx}`} 
                                            onClick={() => setDestination(addr.address)}
                                            className="text-[0.8rem] bg-white border border-[#E2E8F0] text-[#4A5568] px-3 py-1.5 rounded-[4px] hover:border-[#A0AEC0] hover:text-[#1A202C] transition-colors font-medium shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                                          >
                                            {addr.name}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {serviceType === 'Trajeto' ? (
                              <>
                                <div className="space-y-4 pb-2 pt-2">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Origem (Ponto de Partida)</label>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                      <Input list="saved-addresses" className="pl-9 bg-slate-50 border-slate-200" placeholder="Ex: Av. Paulista, 1000" value={origin} onChange={e => setOrigin(e.target.value)} />
                                    </div>
                                  </div>

                                  {/* Múltiplos Destinos */}
                                  {stops.map((stop, idx) => (
                                    <div key={idx} className="space-y-2 animate-in fade-in">
                                      <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Parada {idx + 1}</label>
                                        <button onClick={() => setStops(prev => prev.filter((_, i) => i !== idx))} className="text-xs text-rose-500 hover:text-rose-700 font-medium bg-rose-50 px-2 py-1 rounded">Remover</button>
                                      </div>
                                      <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                                        <Input list="saved-addresses" className="pl-9 bg-slate-50 border-slate-200" placeholder="Ex: Parada na Padaria" value={stop} onChange={e => {
                                          const newStops = [...stops];
                                          newStops[idx] = e.target.value;
                                          setStops(newStops);
                                        }} />
                                      </div>
                                    </div>
                                  ))}

                                  <Button variant="outline" size="sm" className="w-full border-dashed text-slate-500 hover:text-slate-800" onClick={() => setStops(prev => [...prev, ''])}>
                                    ➕ Adicionar Parada Intermediária
                                  </Button>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Destino Final</label>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                      <Input list="saved-addresses" className="pl-9 bg-slate-50 border-slate-200" placeholder="Ex: Aeroporto de Guarulhos" value={destination} onChange={e => setDestination(e.target.value)} />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="space-y-4 py-2">
                                <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm p-3 rounded-md">
                                  O motorista ficará aguardando por você durante todo o período selecionado.
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Local de Início do Serviço</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <Input list="saved-addresses" className="pl-9" placeholder="Ex: Sua Residência" value={origin} onChange={e => setOrigin(e.target.value)} />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Duração do Serviço</label>
                                  <select 
                                    className="w-full h-11 rounded-[4px] border border-[#E2E8F0] bg-transparent px-[15px] text-[0.95rem] transition-colors outline-none focus-visible:border-[#111827] focus-visible:ring-1 focus-visible:ring-[#111827]"
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                  >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                      <option key={h} value={h}>{h} Hora{h > 1 ? 's' : ''}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            <div className="p-4 bg-slate-50 border-l-4 border-slate-500 rounded-r-lg space-y-4 shadow-sm mt-4">
                              <h4 className="font-semibold text-slate-700 text-sm">Personalização de Bordo (VIP)</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-slate-700">Clima</label>
                                  <div className="flex items-center gap-2">
                                    <select className="flex-1 p-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 h-[40px]" value={prefClimate} onChange={e => setPrefClimate(e.target.value)}>
                                      <option>Sem preferência</option>
                                      <option>Ar-condicionado</option>
                                    </select>
                                    {prefClimate !== 'Sem preferência' && (
                                      <div className="flex items-center gap-1 w-[80px] shrink-0">
                                        <Input type="number" className="h-[40px] px-2 text-center" value={prefClimateTemp} onChange={e => setPrefClimateTemp(e.target.value ? Number(e.target.value) : '')} />
                                        <span className="text-sm font-medium text-slate-600">°C</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-slate-700">Ambiente</label>
                                  <select className="w-full p-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 h-[40px]" value={prefSound} onChange={e => setPrefSound(e.target.value)}>
                                    <option>Viagem Silenciosa (Foco/Trabalho)</option>
                                    <option>Rádio/Notícias</option>
                                    <option>Playlist Ambiente</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Schedule Card */}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Card className="shadow-sm border-slate-200">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-slate-900" /> Protocolo de Embarque</CardTitle>
                            <CardDescription>Confirme a data e horário desejados.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Data da Viagem</label>
                              <AvailabilityCalendar selectedDate={date} onSelectDate={setDate} driverId={selectedClientDriverId} />
                            </div>
                            
                            <div className="space-y-4 pt-2">
                              <label className="text-sm font-medium block">Modelo de Agendamento:</label>
                              <select 
                                className="w-full h-11 rounded-[4px] border border-[#E2E8F0] bg-transparent px-[15px] text-[0.95rem] transition-colors outline-none focus-visible:border-[#111827] focus-visible:ring-1 focus-visible:ring-[#111827]"
                                value={timingMode}
                                onChange={(e) => setTimingMode(e.target.value as any)}
                              >
                                <option value="Fixo">Horário Pré-Definido</option>
                                <option value="Standby">Modo Standby (Acionar ao sair)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{timingMode === 'Fixo' ? 'Horário Exato' : 'Posicionar a partir de:'}</label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input type="time" className="pl-9 bg-slate-50" value={time} onChange={e => setTime(e.target.value)} />
                              </div>
                              {timingMode === 'Standby' && (
                                <p className="text-xs text-amber-700 mt-1">
                                  O motorista ficará aguardando a partir deste horário. Acione "Descendo em 5 min" quando estiver pronto.
                                </p>
                              )}
                            </div>
                            
                            {!isValidTime && time && date && (
                              <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm flex items-start gap-2 mt-4 border border-amber-200">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>As reservas devem ser feitas com no mínimo <strong>2 horas</strong> de antecedência.</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex flex-col gap-3">
                              {isValidTime && isFilled && (
                                <div className="w-full space-y-4 mt-2">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Centro de Custo / Tag do Projeto (Opcional)</label>
                                    <Input placeholder="Ex: Reunião Diretoria" value={costCenter} onChange={e => setCostCenter(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Método de Pagamento</label>
                                    <select 
                                      className="w-full h-11 rounded-[4px] border border-[#E2E8F0] bg-transparent px-[15px] text-[0.95rem] transition-colors outline-none focus-visible:border-[#111827] focus-visible:ring-1 focus-visible:ring-[#111827]"
                                      value={paymentMethod}
                                      onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                      <option value="Pix (5% de Desconto)">Pix (5% de Desconto)</option>
                                      <option value="Cartão de Crédito/Débito (Taxa de 5%)">Cartão de Crédito/Débito (Taxa de 5%)</option>
                                      <option value="Dinheiro (Espécie)">Dinheiro (Espécie)</option>
                                    </select>
                                    {paymentMethod === 'Pix (5% de Desconto)' && (
                                      <p className="text-sm text-emerald-600 mt-1">✨ Desconto de 5% aplicado com sucesso para pagamento via Pix.</p>
                                    )}
                                    {paymentMethod === 'Cartão de Crédito/Débito (Taxa de 5%)' && (
                                      <p className="text-sm text-amber-600 mt-1">💳 Acréscimo de 5% adicionado referente à taxa da operadora.</p>
                                    )}
                                  </div>
                                  {paymentMethod === 'Dinheiro (Espécie)' && (
                                    <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-md">
                                      <label className="text-sm font-medium">Precisa de troco para o motorista?</label>
                                      <Input 
                                        placeholder="Ex: R$ 200,00" 
                                        value={paymentChange} 
                                        onChange={e => setPaymentChange(e.target.value)} 
                                      />
                                      <p className="text-xs text-slate-500 mt-1">Deixe em branco se não precisar de troco.</p>
                                    </div>
                                  )}
                                  
                                  <div className="w-full flex-col flex items-center justify-center p-[25px_20px] bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white rounded-xl border border-[#333333] shadow-[0_10px_25px_rgba(0,0,0,0.15)] text-center">
                                    <span className="font-heading text-[#A0AEC0] text-[0.75rem] tracking-[1px] uppercase mb-1">TARIFA FINAL ESTIMADA</span>
                                    <span className="text-[2.2rem] font-heading font-normal tracking-[-1px] text-white">R$ {calculateFinalPrice(calculatePrice(serviceType, distance, hours, INITIAL_DRIVERS.find(d => d.id === selectedClientDriverId)!.category)).toFixed(2)}</span>
                                  </div>
                                </div>
                              )}
                              
                              {hasConflict && (
                                <div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
                                  <p className="font-semibold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Horário Indisponível</p>
                                  <p className="mt-1 mb-2 text-rose-700">O motorista já possui uma viagem agendada para este horário.</p>
                                  <a 
                                    href={`https://wa.me/${INITIAL_DRIVERS.find(d => d.id === selectedClientDriverId)?.whatsapp?.replace(/\D/g, '')}`}
                                    target="_blank" rel="noreferrer"
                                    className="inline-flex py-1 px-3 bg-rose-100 font-semibold hover:bg-rose-200 rounded transition-colors text-rose-900"
                                  >
                                    Falar via WhatsApp
                                  </a>
                                </div>
                              )}

                              {!isDriverAvailable && !hasConflict && (
                                <div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
                                  <p className="font-semibold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Operação Indisponível</p>
                                  {!isDayAvailable ? (
                                    <p className="mt-1 text-rose-700">O motorista não atende de {selectedDayName}.</p>
                                  ) : (
                                    <p className="mt-1 text-rose-700">Horário fora da escala. O motorista atende das {driverForValidation?.workStart} às {driverForValidation?.workEnd}.</p>
                                  )}
                                </div>
                              )}

                              <Button 
                                className="w-full h-[46px] text-base transition-all shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] bg-[#111827] hover:bg-[#2D3748] text-white rounded tracking-[0.5px] font-medium" 
                                onClick={() => handleBook(selectedClientDriverId!, INITIAL_DRIVERS.find(d => d.id === selectedClientDriverId)!.category)}
                                disabled={isBooking === selectedClientDriverId || !isFilled || !isValidTime || hasConflict || !isDriverAvailable}
                              >
                                {isBooking === selectedClientDriverId ? (
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-5 h-5 mr-2" />
                                )}
                                {isBooking === selectedClientDriverId ? 'Processando Reserva...' : 'Confirmar Reserva do Veículo'}
                              </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                )}
                </>
                )}
              </>
            )}

            {/* Minhas Viagens */}
            <AnimatePresence>
            {currentView === 'trips' && (
              <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-6">
                {alertaMotorista && authRole === 'motorista' && (
                  <div className="bg-[#FFFBEB] border border-[#D4AF37] p-5 rounded flex flex-col sm:flex-row gap-5 items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                       <BellRing className="w-6 h-6 text-[#92400E] shrink-0" />
                       <div className="text-[#92400E]">
                         <b className="block">🔔 NOVA VIAGEM RECEBIDA!</b>
                         <span className="text-sm">Um cliente acaba de realizar um agendamento.</span>
                       </div>
                    </div>
                    <Button 
                      className="bg-[#D4AF37] hover:bg-[#B8962E] text-black font-semibold shrink-0"
                      onClick={() => setAlertaMotorista(false)}
                    >
                      Ciente (Dispensar Alerta)
                    </Button>
                  </div>
                )}
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="w-5 h-5" /> {authRole === 'motorista' ? 'Painel Logístico (Viagens)' : 'Histórico de Viagens'}
                </h2>

                {authRole === 'motorista' && schedules.some(s => s.driverId === loggedDriverId && s.status === 'A Caminho') && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-md shadow-sm mb-4">
                    <b className="font-semibold block">Prioridade Urgente:</b>
                    <span className="text-sm">Solicitação de embarque confirmada pelo cliente. Iniciar deslocamento imediatamente.</span>
                  </div>
                )}
                
                {schedules.filter(s => authRole === 'cliente' || (s.driverId === loggedDriverId && s.status !== 'Concluido' && s.status !== 'Cancelado')).length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-white rounded-md border border-dashed border-slate-300">
                    <p>{authRole === 'motorista' ? 'Nenhuma corrida agendada para você ainda.' : 'Nenhuma viagem agendada ainda.'}</p>
                    {authRole === 'cliente' && (
                      <Button variant="link" onClick={() => setCurrentView('home')} className="mt-2 text-slate-900">
                        Fazer um novo agendamento
                      </Button>
                    )}
                  </div>
                ) : (
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                {schedules.filter(s => authRole === 'cliente' || (s.driverId === loggedDriverId && s.status !== 'Concluido' && s.status !== 'Cancelado')).map(schedule => {
                    const driver = INITIAL_DRIVERS.find(d => d.id === schedule.driverId);
                    if (!driver) return null;
                    return (
                      <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={schedule.id}>
                        <Card className="overflow-hidden border-slate-200 shadow-sm pt-4 hover:shadow-md transition-shadow duration-300">
                          <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center flex-wrap gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium">{schedule.date} {schedule.time} {schedule.endTime ? `às ${schedule.endTime}` : ''}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  schedule.status === 'Reservado' ? 'bg-slate-100 text-slate-800 border border-slate-200' : 
                                  schedule.status === 'Em Standby' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                  schedule.status === 'A Caminho' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  schedule.status === 'Em Andamento' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                  schedule.status === 'Bloqueado' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  'bg-green-50 text-green-700 border border-green-100'} transition-colors duration-300`}>
                                  {schedule.status}
                                </span>
                                {schedule.paymentStatus === 'A Faturar' && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    Fatura Pendente
                                  </span>
                                )}
                                {schedule.paymentStatus === 'Pago' && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Fatura Paga
                                  </span>
                                )}
                              </div>
                              {schedule.status === 'Bloqueado' ? (
                                <p className="font-semibold text-slate-900 mt-2">Bloqueio: {schedule.origin}</p>
                              ) : (
                                <>
                                  {authRole === 'cliente' ? (
                                    <>
                                      {schedule.passengerName && schedule.passengerName !== profile.name && (
                                        <p className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block mb-1 border border-slate-100">
                                          Passageiro Convidado: <span className="font-semibold">{schedule.passengerName}</span>
                                        </p>
                                      )}
                                      <p className="font-semibold text-slate-900">Motorista: {driver.name}</p>
                                      <p className="text-sm text-slate-500">Veículo: {driver.vehicle}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="font-semibold text-slate-900">Passageiro: {schedule.passengerName || 'Titular da Conta'} {schedule.passengerPhone && `- ${schedule.passengerPhone}`}</p>
                                    </>
                                  )}
                                  
                                  <div className="mt-3 space-y-1">
                                    {schedule.serviceType === 'Diaria' ? (
                                      <div className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Modalidade:</span> À Disposição por {schedule.hours} horas</p>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex items-start gap-2">
                                          <div className="mt-1 w-2 h-2 rounded-full bg-slate-900 shrink-0"></div>
                                          <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Origem:</span> {schedule.origin}</p>
                                        </div>
                                        {schedule.stops && schedule.stops.map((stp, idxx) => (
                                          <div key={idxx} className="flex items-start gap-2">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                                            <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Parada {idxx + 1}:</span> {stp}</p>
                                          </div>
                                        ))}
                                        <div className="flex items-start gap-2">
                                          <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
                                          <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Destino:</span> {schedule.destination}</p>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  
                                  {(schedule.preferences || schedule.price) && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {schedule.preferences && (
                                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                          VIP: {schedule.preferences}
                                        </span>
                                      )}
                                      {schedule.costCenter && (
                                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                          CC: {schedule.costCenter}
                                        </span>
                                      )}
                                      {schedule.paymentMethod && (
                                        <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                                          Pagamento: {schedule.paymentMethod}
                                        </span>
                                      )}
                                      {schedule.price && (
                                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                                          R$ {schedule.price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-end sm:justify-end pt-2 sm:pt-0">
                              {(schedule.status === 'Reservado' || schedule.status === 'A Caminho' || schedule.status === 'Em Andamento') && authRole === 'motorista' ? (
                                <Button 
                                  variant="outline" 
                                  className={`w-full sm:w-auto transition-all hover:scale-[1.02] active:scale-95 ${schedule.status === 'Em Andamento' ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white border-transparent' : ''}`} 
                                  onClick={() => {
                                    if (schedule.status === 'A Caminho') {
                                      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, status: 'Em Andamento' } : s));
                                    } else if (schedule.status === 'Em Andamento') {
                                      handleComplete(schedule.id);
                                    } else {
                                      handleComplete(schedule.id);
                                    }
                                  }}
                                >
                                  {schedule.status === 'A Caminho' ? 'Registrar Início da Corrida (Em Andamento)' : schedule.status === 'Em Andamento' ? '🏁 Finalizar Viagem Atual (Concluir)' : 'Marcar como Concluído'}
                                </Button>
                              ) : (!schedule.reviewed && authRole === 'cliente' && schedule.status === 'Concluido') ? (
                                <Button className="w-full sm:w-auto transition-all hover:scale-[1.02] active:scale-95 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setReviewingSchedule(schedule)}>
                                  <Star className="w-4 h-4 mr-2 fill-current" /> Avaliar Motorista
                                </Button>
                              ) : schedule.status === 'Concluido' ? (
                                <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-sm text-slate-500 flex items-center justify-center sm:justify-start bg-slate-50 px-3 py-2 sm:py-1.5 rounded-md border border-slate-100">
                                  {schedule.reviewed ? <><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Avaliado</> : <><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Concluído</>}
                                </motion.span>
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto w-full space-y-6"
            >
              {currentView === 'programacao' && authRole === 'motorista' ? (
                <>
                  {loggedDriverId && (
                    <>
                      <Card className="shadow-sm border-slate-200 border-l-4 border-l-amber-500">
                        <CardHeader className="pb-3 bg-amber-50/50 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center gap-2 text-amber-900"><AlertCircle className="w-5 h-5 text-amber-600" /> Modo Manutenção / Off-Duty</CardTitle>
                          <CardDescription>Bloqueie sua agenda para revisões do veículo, folgas ou compromissos pessoais.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Motivo do Bloqueio</label>
                            <select 
                              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={blockReason}
                              onChange={(e) => setBlockReason(e.target.value)}
                            >
                              <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                              <option value="Lavagem/Higienização">Lavagem/Higienização</option>
                              <option value="Horário de Almoço">Horário de Almoço</option>
                              <option value="Folga/Off-Duty">Folga/Off-Duty</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Data</label>
                              <Input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Início</label>
                              <Input type="time" value={blockStartTime} onChange={e => setBlockStartTime(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Fim</label>
                              <Input type="time" value={blockEndTime} onChange={e => setBlockEndTime(e.target.value)} />
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                            disabled={!blockDate || !blockStartTime || !blockEndTime}
                            onClick={() => {
                              setSchedules(prev => [...prev, {
                                id: Date.now().toString(),
                                driverId: loggedDriverId!,
                                date: blockDate,
                                time: blockStartTime,
                                endTime: blockEndTime,
                                origin: blockReason,
                                destination: '',
                                serviceType: 'Bloqueio',
                                status: 'Bloqueado'
                              }]);
                              alert(`Agenda bloqueada para: ${blockReason}`);
                              setBlockDate('');
                              setBlockStartTime('');
                              setBlockEndTime('');
                            }}
                          >
                            Lançar Bloqueio na Agenda
                          </Button>
                        </CardContent>
                      </Card>
                      <div className="mt-8 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-4 rounded-md text-amber-800 text-sm mb-4">
                        <strong className="font-semibold">Atenção:</strong> O 'Horário Fim' das viagens já inclui automaticamente 30 minutos de <strong className="font-semibold">Buffer de Deslocamento</strong> para garantir tempo hábil de manobra e segurança até o próximo embarque.
                      </div>
                      <DriverScheduleCalendar schedules={schedules} driverId={loggedDriverId} />
                    </>
                  )}
                </>
              ) : currentView === 'painel' && authRole === 'motorista' ? (
                <>
                  <Card className="shadow-lg border-slate-200">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center">
                          <Settings className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Painel Logístico</CardTitle>
                          <CardDescription>Gestão financeira e de tarifas do motorista.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  {loggedDriverId && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-[#F0F0F0] bg-white">
                          <CardHeader className="pb-4 border-b border-[#F0F0F0]">
                            <CardTitle className="text-sm font-heading font-semibold text-[#8C8C8C] uppercase tracking-wide">Faturamento Consolidado</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="text-3xl font-heading font-light text-[#1A1A1A]">
                              R$ {schedules.filter(s => s.driverId === loggedDriverId && s.paymentStatus === 'A Faturar').reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Volume pendente a faturar</p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className="w-full bg-[#111827] hover:bg-[#2D3748] text-white font-medium h-11 tracking-[0.5px] transition-all hover:-translate-y-[1px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] rounded-[4px]"
                              onClick={() => {
                                setSchedules(prev => prev.map(s => s.driverId === loggedDriverId && s.paymentStatus === 'A Faturar' ? { ...s, paymentStatus: 'Aguardando Aprovação' as any } : s));
                                setFaturasPendentes(true);
                              }}
                              disabled={schedules.filter(s => s.driverId === loggedDriverId && s.paymentStatus === 'A Faturar').reduce((acc, curr) => acc + (curr.price || 0), 0) === 0}
                            >
                              Processar Remessa Mensal
                            </Button>
                          </CardFooter>
                        </Card>
                        <Card className="shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-[#F0F0F0] bg-white">
                          <CardHeader className="pb-4 border-b border-[#F0F0F0]">
                            <CardTitle className="text-sm font-heading font-semibold text-[#8C8C8C] uppercase tracking-wide">Receita Realizada</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="text-3xl font-heading font-light text-slate-900">
                              R$ {schedules.filter(s => s.driverId === loggedDriverId && s.paymentStatus === 'Pago').reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Em faturas já pagas / concluídas</p>
                          </CardContent>
                          <CardFooter>
                              <div className="flex w-full gap-2 mt-auto">
                                <Button variant="outline" className="flex-1 bg-white border-[#E2E8F0] text-[#4A5568] hover:border-[#A0AEC0] hover:text-[#1A202C]" onClick={() => alert('Exportando PDF...')}>
                                  Baixar PDF
                                </Button>
                                <Button variant="outline" className="flex-1 bg-white border-[#E2E8F0] text-[#4A5568] hover:border-[#A0AEC0] hover:text-[#1A202C]" onClick={() => alert('Exportando Csv...')}>
                                  Baixar CSV
                                </Button>
                              </div>
                          </CardFooter>
                        </Card>
                      </div>

                      <Card className="shadow-sm border-slate-200 mt-6">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-slate-700" /> Painel de Tarifas (Motorista)</CardTitle>
                          <CardDescription>Ajuste os parâmetros que o cliente verá ao agendar.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Taxa Base (R$) - Trajeto</label>
                              <Input 
                                type="number" 
                                value={pricing.Trajeto[INITIAL_DRIVERS.find(d => d.id === loggedDriverId)!.category].base}
                                onChange={(e) => {
                                  const cat = INITIAL_DRIVERS.find(d => d.id === loggedDriverId)!.category;
                                  setPricing(prev => ({
                                    ...prev,
                                    Trajeto: { ...prev.Trajeto, [cat]: { ...prev.Trajeto[cat], base: parseFloat(e.target.value) || 0 } }
                                  }));
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Valor por KM (R$) - Trajeto</label>
                              <Input 
                                type="number" 
                                value={pricing.Trajeto[INITIAL_DRIVERS.find(d => d.id === loggedDriverId)!.category].km}
                                onChange={(e) => {
                                  const cat = INITIAL_DRIVERS.find(d => d.id === loggedDriverId)!.category;
                                  setPricing(prev => ({
                                    ...prev,
                                    Trajeto: { ...prev.Trajeto, [cat]: { ...prev.Trajeto[cat], km: parseFloat(e.target.value) || 0 } }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="text-sm font-medium">Valor por Hora (R$) - À Disposição</label>
                            <Input 
                              type="number" 
                              value={pricing.Diaria[INITIAL_DRIVERS.find(d => d.id === loggedDriverId)!.category].hr}
                              onChange={(e) => {
                                const cat = INITIAL_DRIVERS.find(d => d.id === loggedDriverId)!.category;
                                setPricing(prev => ({
                                  ...prev,
                                  Diaria: { ...prev.Diaria, [cat]: { hr: parseFloat(e.target.value) || 0 } }
                                }));
                              }}
                            />
                          </div>
                          <Button className="w-full mt-2" onClick={() => alert('Tarifas atualizadas com sucesso!')}>Salvar Novos Preços</Button>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </>
              ) : currentView === 'profile' ? (
                authRole === 'motorista' ? (
                <>
                  <Card className="shadow-lg border-slate-200">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center">
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Meu Perfil</CardTitle>
                          <CardDescription>Bem-vindo, {drivers.find(d => d.id === loggedDriverId)?.name}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Nome Completo</p>
                          <p className="text-lg font-medium text-slate-900">{drivers.find(d => d.id === loggedDriverId)?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Categoria</p>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 border border-slate-200">{drivers.find(d => d.id === loggedDriverId)?.category}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Veículo</p>
                          <p className="text-base text-slate-700">{drivers.find(d => d.id === loggedDriverId)?.vehicle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">WhatsApp</p>
                          <p className="text-base text-slate-700">{drivers.find(d => d.id === loggedDriverId)?.whatsapp}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">E-mail de Login</p>
                          <p className="text-base text-slate-700">{drivers.find(d => d.id === loggedDriverId)?.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-[#F0F0F0] mt-6">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">⚙️ Minha Escala de Trabalho</CardTitle>
                          <CardDescription>Defina seus dias e horários de atendimento.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Dias de atendimento:</label>
                        <div className="flex flex-wrap gap-2">
                          {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(dia => {
                            const driver = drivers.find(d => d.id === loggedDriverId);
                            const isSelected = driver?.workingDays?.includes(dia);
                            return (
                              <button
                                key={dia}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isSelected ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                onClick={() => {
                                  setDrivers(prev => prev.map(d => {
                                    if (d.id === loggedDriverId) {
                                      const currentDays = d.workingDays || [];
                                      const newDays = isSelected 
                                        ? currentDays.filter(day => day !== dia)
                                        : [...currentDays, dia];
                                      return { ...d, workingDays: newDays };
                                    }
                                    return d;
                                  }));
                                }}
                              >
                                {dia}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Início do turno:</label>
                          <Input 
                            type="time" 
                            value={drivers.find(d => d.id === loggedDriverId)?.workStart || ''} 
                            onChange={e => {
                              setDrivers(prev => prev.map(d => d.id === loggedDriverId ? { ...d, workStart: e.target.value } : d));
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Fim do turno:</label>
                          <Input 
                            type="time" 
                            value={drivers.find(d => d.id === loggedDriverId)?.workEnd || ''} 
                            onChange={e => {
                              setDrivers(prev => prev.map(d => d.id === loggedDriverId ? { ...d, workEnd: e.target.value } : d));
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
                ) : (
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Meu Perfil</CardTitle>
                      <CardDescription>Gerencie suas informações pessoais e preferências de viagem.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 p-6 mt-2">
                  {/* Informações Pessoais */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-slate-400" />
                      Informações Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome Completo</label>
                        <Input 
                          value={profile.name} 
                          onChange={e => setProfile({...profile, name: e.target.value})} 
                          className="transition-all focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">E-mail</label>
                        <Input 
                          type="email" 
                          value={profile.email} 
                          onChange={e => setProfile({...profile, email: e.target.value})}
                          className="transition-all focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone</label>
                        <Input 
                          type="tel" 
                          value={profile.phone} 
                          onChange={e => setProfile({...profile, phone: e.target.value})}
                          className="transition-all focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="h-px bg-slate-200 w-full" />

                  {/* Preferências */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5 text-slate-400" />
                      Preferências de Viagem
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Categoria de Veículo Preferida</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                          value={profile.preferredCategory}
                          onChange={e => setProfile({...profile, preferredCategory: e.target.value})}
                        >
                          <option value="Qualquer">Qualquer Categoria</option>
                          <option value="Comfort">Comfort</option>
                          <option value="Executivo">Executivo</option>
                          <option value="Black">Black</option>
                        </select>
                        <p className="text-xs text-slate-500">Iremos sugerir motoristas dessa categoria primeiro.</p>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium">Notificações por SMS</label>
                          <p className="text-xs text-slate-500">Receba atualizações do motorista via SMS ou WhatsApp.</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-slate-900 rounded focus:ring-blue-500 border-slate-300"
                            checked={profile.notifications}
                            onChange={e => setProfile({...profile, notifications: e.target.checked})}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </CardContent>
                <CardFooter className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setCurrentView('home')} className="transition-all hover:scale-[1.02] active:scale-95">
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile} className="transition-all hover:scale-[1.02] active:scale-95">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
              )
              ) : currentView === 'faturamento' && authRole === 'cliente' ? (
                <div className="space-y-6">
                  {faturasPendentes && (
                    <div className="bg-white border border-[#EAEAEA] p-6 rounded font-sans flex flex-col sm:flex-row gap-5 items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-l-4 border-l-[#111827]">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-800 shadow-sm shrink-0 border border-slate-200">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-[0.9rem] font-heading font-semibold text-slate-900 tracking-wide uppercase">Fatura Pendente</h4>
                          <p className="text-[#8C8C8C] text-sm mt-0.5">Você possui uma Fatura de Fechamento Mensal pendente de aprovação (Corporate).</p>
                        </div>
                      </div>
                      <Button onClick={() => {
                        setFaturasPendentes(false);
                        setSchedules(prev => prev.map(s => s.paymentStatus === 'Aguardando Aprovação' || s.paymentStatus === 'A Faturar' ? { ...s, paymentStatus: 'Pago' as any } : s));
                      }} className="bg-[#111827] hover:bg-[#2D3748] text-white font-medium h-[46px] w-full sm:w-auto px-8 rounded tracking-[0.5px] transition-all hover:-translate-y-[1px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] shrink-0">
                        Aprovar Pagamento
                      </Button>
                    </div>
                  )}

                  <Card className="shadow-lg border-slate-200">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Faturamento</CardTitle>
                          <CardDescription>Resumo financeiro e histórico de faturas corporativas.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 mt-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-[#F0F0F0] bg-white">
                          <CardHeader className="pb-4 border-b border-[#F0F0F0]">
                            <CardTitle className="text-sm font-heading font-semibold text-[#8C8C8C] uppercase tracking-wide">Volume a Faturar</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="text-3xl font-heading font-light text-[#1A1A1A]">
                              R$ {schedules.filter(s => s.paymentStatus === 'A Faturar' || s.paymentStatus === 'Aguardando Aprovação').reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Viagens realizadas aguardando fechamento</p>
                          </CardContent>
                        </Card>
                        <Card className="shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-[#F0F0F0] bg-white">
                          <CardHeader className="pb-4 border-b border-[#F0F0F0]">
                            <CardTitle className="text-sm font-heading font-semibold text-[#8C8C8C] uppercase tracking-wide">Faturas Pagas</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="text-3xl font-heading font-light text-slate-900">
                              R$ {schedules.filter(s => s.paymentStatus === 'Pago').reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Em faturas já pagas / concluídas corporativo</p>
                          </CardContent>
                        </Card>
                      </div>

                    </CardContent>
                  </Card>
                </div>
              ) : currentView === 'enderecos' && authRole === 'cliente' ? (
                <Card className="shadow-lg border-slate-200">
                  <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 text-slate-900 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Meus Endereços</CardTitle>
                        <CardDescription>Gerencie seus locais favoritos para agendamentos mais rápidos.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6 mt-2">
                    <div className="space-y-4">
                      {savedAddresses.length > 0 ? (
                        savedAddresses.map((addr, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-200 rounded-md bg-slate-50">
                            <div>
                                <p className="font-semibold text-slate-900 text-lg">{addr.name}</p>
                                <p className="text-sm text-slate-600">{addr.address}</p>
                            </div>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 w-full sm:w-auto"
                              onClick={() => setSavedAddresses(prev => prev.filter((_, i) => i !== idx))}
                            >
                              Remover
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 py-4 text-center">Nenhum endereço salvo.</p>
                      )}
                    </div>
                    
                    <div className="pt-6 border-t border-slate-200 mt-6 space-y-4">
                      <h3 className="font-semibold text-slate-900">Adicionar Novo Endereço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Apelido (ex: Casa, Trabalho)</label>
                            <Input 
                              placeholder="Apelido do local" 
                              value={newAddressName} 
                              onChange={e => setNewAddressName(e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Endereço Completo</label>
                            <Input 
                              placeholder="Rua, Número, Bairro, Cidade" 
                              value={newAddressValue} 
                              onChange={e => setNewAddressValue(e.target.value)} 
                            />
                          </div>
                      </div>
                      <Button 
                        disabled={!newAddressName || !newAddressValue}
                        className="w-full sm:w-auto"
                        onClick={() => {
                          if (newAddressName && newAddressValue) {
                            setSavedAddresses(prev => [...prev, { name: newAddressName, address: newAddressValue }]);
                            setNewAddressName('');
                            setNewAddressValue('');
                          }
                        }}
                      >
                        Salvar Local
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : currentView === 'admin_health' && authRole === 'admin' ? (
                <div className="space-y-6 text-slate-900">
                  <div className="mb-4">
                    <h2 className="text-[1.6rem] font-medium font-mono mb-1">Saúde da Infraestrutura</h2>
                    <p className="text-[#6B7280] font-mono text-sm tracking-wide border-b border-[#E5E7EB] pb-4">// MONITORAMENTO EM TEMPO REAL DO ECOSSISTEMA // 2026</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="bg-white border border-[#E5E7EB] border-l-4 border-l-[#10B981] p-5 rounded-md shadow-sm">
                        <p className="font-mono text-[0.7rem] text-[#6B7280] uppercase">Tempo de Atividade</p>
                        <p className="text-[1.8rem] font-light mt-1">99.99%</p>
                        <p className="font-mono text-[0.7rem] text-[#10B981] mt-2">Servidor Operacional</p>
                     </div>
                     <div className="bg-white border border-[#E5E7EB] border-l-4 border-l-[#333333] p-5 rounded-md shadow-sm">
                        <p className="font-mono text-[0.7rem] text-[#6B7280] uppercase">Total de Usuários (BD)</p>
                        <p className="text-[1.8rem] font-light mt-1">{INITIAL_ADMIN_USERS.length}</p>
                        <p className="font-mono text-[0.7rem] text-[#6B7280] mt-2">Nós Indexados</p>
                     </div>
                     <div className="bg-white border border-[#E5E7EB] border-l-4 border-l-[#333333] p-5 rounded-md shadow-sm">
                        <p className="font-mono text-[0.7rem] text-[#6B7280] uppercase">Latência da API</p>
                        <p className="text-[1.8rem] font-light mt-1">42ms</p>
                        <p className="font-mono text-[0.7rem] text-[#6B7280] mt-2">Resposta Ideal</p>
                     </div>
                     <div className="bg-white border border-[#E5E7EB] border-l-4 border-l-[#D4AF37] p-5 rounded-md shadow-sm">
                        <p className="font-mono text-[0.7rem] text-[#6B7280] uppercase">Volume Transacionado</p>
                        <p className="text-[1.8rem] font-light mt-1">R$ 1.2M</p>
                        <p className="font-mono text-[0.7rem] text-[#D4AF37] mt-2">Processado no App</p>
                     </div>
                  </div>
                  <div className="mt-8">
                      <p className="font-mono text-[0.85rem] font-semibold text-[#9CA3AF] uppercase mb-4 tracking-widest mt-6">REGISTROS DO SISTEMA (LOGS)</p>
                      <div className="bg-[#111111] text-[#E5E7EB] p-4 rounded-md font-mono text-sm shadow-inner overflow-x-auto whitespace-pre">
[2026-05-07 12:01:02] INFO: Usuário USR-001 autenticado com sucesso.
[2026-05-07 12:03:45] AVISO: Limite da API de Voos próximo da cota (85%).
[2026-05-07 12:05:10] INFO: Link de Rota Segura (Ghost Tracking) gerado para OP-0034.
[2026-05-07 12:06:50] SUCESSO: Backup do banco de dados concluído no Servidor Alpha.
                      </div>
                  </div>
                </div>
              ) : currentView === 'admin_users' && authRole === 'admin' ? (
                <div className="space-y-6">
                  <div className="mb-4">
                    <h2 className="text-[1.6rem] font-medium font-mono mb-1">Banco de Dados: Usuários</h2>
                    <p className="text-[#6B7280] font-mono text-sm tracking-wide border-b border-[#E5E7EB] pb-4">// VISÃO MESTRE DO PROPRIETÁRIO // 2026</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 text-sm mb-4">
                      <strong className="font-semibold">God Mode Ativo:</strong> Você está manipulando a tabela-mestre de identidades. Altere Níveis de Acesso ou desative contas instantaneamente.
                  </div>
                  <Card className="shadow-sm border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-[#111111] text-[#D4AF37] font-mono uppercase text-xs">
                              <tr>
                                 <th className="px-6 py-4 font-normal tracking-wider">ID_Sis</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Nome</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Nível de Acesso</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">App_Version</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Data_Cadastro</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Status_Conta</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 bg-white">
                              {INITIAL_ADMIN_USERS.map((user, i) => (
                                 <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{user.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{user.role}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{user.appVersion}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{user.registration}</td>
                                    <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${user.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                         {user.status}
                                      </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    </div>
                  </Card>
                </div>
              ) : currentView === 'admin_fleet' && authRole === 'admin' ? (
                <div className="space-y-6">
                  <div className="mb-4">
                    <h2 className="text-[1.6rem] font-medium font-mono mb-1">Banco de Dados: Frota</h2>
                    <p className="text-[#6B7280] font-mono text-sm tracking-wide border-b border-[#E5E7EB] pb-4">// REGISTRO DE VEÍCULOS // 2026</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 text-sm mb-4">
                      <strong className="font-semibold">God Mode Ativo:</strong> Manipulação direta do registro de hardwares (veículos) vinculados à plataforma.
                  </div>
                  <Card className="shadow-sm border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-[#111111] text-[#D4AF37] font-mono uppercase text-xs">
                              <tr>
                                 <th className="px-6 py-4 font-normal tracking-wider">Placa</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Modelo</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">ID_Proprietario</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Blindagem</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Status no BD</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 bg-white">
                              {INITIAL_ADMIN_VEHICLES.map((vehicle, i) => (
                                 <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{vehicle.plate}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{vehicle.model}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{vehicle.ownerId}</td>
                                    <td className="px-6 py-4 font-mono text-xs font-semibold">{vehicle.armored}</td>
                                    <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${vehicle.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                         {vehicle.status}
                                      </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    </div>
                  </Card>
                </div>
              ) : currentView === 'admin_toggles' && authRole === 'admin' ? (
                <div className="space-y-6">
                  <div className="mb-4">
                    <h2 className="text-[1.6rem] font-medium font-mono mb-1">Feature Toggles (Engine)</h2>
                    <p className="text-[#6B7280] font-mono text-sm tracking-wide border-b border-[#E5E7EB] pb-4">// PLATFORM ENGINE SETTINGS // 2026</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-md text-rose-800 text-sm mb-4">
                      <strong className="font-semibold">ENGINE CONTROL:</strong> Ligar ou desligar recursos altera o código de todos os usuários em tempo real. Cuidado ao desativar integrações de API.
                  </div>
                  <Card className="shadow-sm border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-[#111111] text-[#D4AF37] font-mono uppercase text-xs">
                              <tr>
                                 <th className="px-6 py-4 font-normal tracking-wider">Component Code</th>
                                 <th className="px-6 py-4 font-normal tracking-wider">Classification</th>
                                 <th className="px-6 py-4 font-normal tracking-wider text-right">Switch</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 bg-white">
                              {INITIAL_ADMIN_TOGGLES.map((toggle, i) => (
                                 <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-900 font-semibold">{toggle.feature}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{toggle.type}</td>
                                    <td className="px-6 py-4 text-right">
                                      <div className={`inline-flex items-center justify-center w-12 h-6 rounded-full cursor-pointer transition-colors ${toggle.status === 'ON' ? 'bg-[#10B981]' : 'bg-slate-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggle.status === 'ON' ? 'translate-x-3' : '-translate-x-3'}`} />
                                      </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    </div>
                  </Card>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {reviewingSchedule && (
          <Dialog open={!!reviewingSchedule} onOpenChange={(open) => !open && setReviewingSchedule(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Avaliar Motorista</DialogTitle>
                <DialogDescription>
                  Como foi sua viagem com {INITIAL_DRIVERS.find(d => d.id === reviewingSchedule.driverId)?.name}?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comentário (opcional)</label>
                  <Textarea
                    placeholder="Deixe um comentário sobre a experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReviewingSchedule(null)}>Cancelar</Button>
                <Button onClick={handleSubmitReview}>Enviar Avaliação</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      </main>
    </div>
  );
}
