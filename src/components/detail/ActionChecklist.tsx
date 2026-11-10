import React, { useState } from 'react';
import { ActionStep } from '../../types/case';
import { CheckSquare, Square, Plus, Sparkles, Scale } from 'lucide-react';

interface ActionChecklistProps {
  actionSteps: ActionStep[];
  onToggleStep: (stepId: string) => void;
  onOpenTemplate: (templateId?: string) => void;
  onOpenResource: (resourceId?: string) => void;
  onAddCustomStep: (step: ActionStep) => void;
}

export const ActionChecklist: React.FC<ActionChecklistProps> = ({
  actionSteps,
  onToggleStep,
  onOpenTemplate,
  onOpenResource,
  onAddCustomStep
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const completedCount = actionSteps.filter(s => s.isCompleted).length;
  const totalCount = actionSteps.length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStep: ActionStep = {
      id: `step-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom user action step',
      isCompleted: false
    };

    onAddCustomStep(newStep);
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Personalized Resolution Plan</h2>
            <span className="text-xs bg-brand-100 text-brand-900 font-bold px-2 py-0.5 rounded-full">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Recommended legal escalation steps tailored to your dispute
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Step</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 bg-[#faf8f5] rounded-2xl border border-amber-900/10 space-y-2 text-xs">
          <input
            type="text"
            placeholder="Step title (e.g. Call credit card dispute team)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full p-2 bg-white rounded-lg border border-slate-200"
            required
          />
          <input
            type="text"
            placeholder="Description or notes"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full p-2 bg-white rounded-lg border border-slate-200"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-brand-600 text-white rounded-lg font-bold"
            >
              Save Step
            </button>
          </div>
        </form>
      )}

      {/* Steps List */}
      <div className="space-y-3">
        {actionSteps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              step.isCompleted
                ? 'bg-slate-50 border-slate-200/80 opacity-75'
                : step.isEscalationStep
                ? 'bg-amber-50/40 border-amber-200/80'
                : 'bg-white border-amber-900/10 hover:border-amber-900/20 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onToggleStep(step.id)}
                className="mt-0.5 text-brand-600 hover:text-brand-800 transition-transform active:scale-90"
              >
                {step.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${step.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {idx + 1}. {step.title}
                  </span>
                  {step.isEscalationStep && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      Escalation
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${step.isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>
              </div>
            </div>

            {/* Step Action Button */}
            {!step.isCompleted && (
              <div className="shrink-0 flex items-center gap-1.5">
                {step.recommendedTemplateId && (
                  <button
                    onClick={() => onOpenTemplate(step.recommendedTemplateId)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 px-2.5 py-1.5 rounded-xl transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Use Template</span>
                  </button>
                )}
                {step.officialResourceId && (
                  <button
                    onClick={() => onOpenResource(step.officialResourceId)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl transition-all"
                  >
                    <Scale className="w-3 h-3 text-slate-600" />
                    <span>View Body</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
