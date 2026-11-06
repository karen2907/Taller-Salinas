import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPassword?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPassword = 'admin123'
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetPassword = correctPassword || 'admin123';

    if (passwordInput.trim() === targetPassword) {
      setPasswordInput('');
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Contraseña incorrecta. Verifique sus credenciales de administrador.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden shadow-amber-500/10">
        {/* Cabecera del candado */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-inner">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Acceso Restringido</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Rol Administrador
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ingrese la contraseña maestra para acceder a configuraciones
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setErrorMsg('');
              setPasswordInput('');
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-200/90 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              El <strong>Módulo de Administrador</strong> y la <strong>Configuración del Logo del Taller</strong> están protegidos para evitar modificaciones no autorizadas por mecánicos o cajeros.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Contraseña de Administrador</span>
              <span className="text-[11px] text-amber-400/80 font-mono">Clave inicial: admin123</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ingrese contraseña de admin..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setPasswordInput('');
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Desbloquear Administrador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
