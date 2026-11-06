import React from 'react';
import { X, Rocket } from 'lucide-react';
import { AutoUpdaterPipeline } from './AutoUpdaterPipeline';

interface AutoUpdaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAppVersion: string;
  onApplyNewVersion: (newVersion: string, releaseNotes: string) => void;
  onOpenDocModal?: () => void;
}

export const AutoUpdaterModal: React.FC<AutoUpdaterModalProps> = ({
  isOpen,
  onClose,
  currentAppVersion,
  onApplyNewVersion,
  onOpenDocModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Barra Superior del Modal */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Centro de Despliegue .EXE & Auto-Actualización (CI/CD GitHub Releases)
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">
                  v{currentAppVersion}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Demostración interactiva para sustentar ante el docente el flujo de entrega continua
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-5 overflow-y-auto max-h-[calc(92vh-60px)] space-y-4">
          <AutoUpdaterPipeline
            currentAppVersion={currentAppVersion}
            onApplyNewVersion={(newV, notes) => {
              onApplyNewVersion(newV, notes);
            }}
            onOpenDocModal={() => {
              onClose();
              if (onOpenDocModal) onOpenDocModal();
            }}
          />
        </div>
      </div>
    </div>
  );
};
