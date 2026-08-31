import React, { useState, useEffect } from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { getConfirmState, subscribeConfirm, resolveConfirm } from '../../lib/confirm';
import useEscapeKey from '../../hooks/useEscapeKey';

const ConfirmDialog = () => {
  const [state, setState] = useState(getConfirmState);

  useEffect(() => {
    return subscribeConfirm(() => setState(getConfirmState()));
  }, []);

  useEscapeKey(state.isOpen, () => resolveConfirm(false));

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          {state.danger && (
            <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">{state.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{state.message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => resolveConfirm(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => resolveConfirm(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              state.danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
