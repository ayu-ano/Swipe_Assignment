import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../store/slices/uiSlice';

const ConfirmDialog = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, variant = 'default' } = 
    useSelector(state => state.ui.modals.confirmation);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    dispatch(closeModal({ modalName: 'confirmation' }));
  };

  const handleCancel = () => {
    onCancel?.();
    dispatch(closeModal({ modalName: 'confirmation' }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const variants = {
    default: {
      icon: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
    danger: {
      icon: 'text-red-600 bg-red-100 dark:bg-red-900',
      confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    success: {
      icon: 'text-green-600 bg-green-100 dark:bg-green-900',
      confirmButton: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    }
  };

  const currentVariant = variants[variant];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full mx-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${currentVariant.icon}`}>
            {variant === 'danger' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
            {variant === 'warning' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {variant === 'success' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {(variant === 'default' || !variant) && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title || 'Are you sure?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {message || 'This action cannot be undone.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end p-6 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
          <button
            onClick={handleCancel}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            className={`w-full sm:w-auto text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${currentVariant.confirmButton}`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for using confirm dialog
export const useConfirm = () => {
  const dispatch = useDispatch();

  const confirm = (options) => {
    return new Promise((resolve) => {
      dispatch(openModal({
        modalName: 'confirmation',
        data: {
          ...options,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        }
      }));
    });
  };

  return { confirm };
};

export default ConfirmDialog;