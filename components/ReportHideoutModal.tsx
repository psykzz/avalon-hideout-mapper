'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { Server } from '@/lib/types';
import { getAvalonZoneNames } from '@/lib/zones';

interface ReportHideoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportHideoutModal({ isOpen, onClose }: ReportHideoutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zones] = useState<string[]>(() => getAvalonZoneNames());
  const [zoneName, setZoneName] = useState('');
  const [filteredZones, setFilteredZones] = useState<string[]>([]);
  const [guildName, setGuildName] = useState('');
  const [server, setServer] = useState<Server>('America');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const servers: Server[] = ['America', 'Europe', 'Asia'];

  // Handle dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle zone search
  const handleZoneSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZoneName(value);
    
    if (value) {
      const filtered = zones.filter(zone => 
        zone.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredZones(filtered);
    } else {
      setFilteredZones([]);
    }
  };

  const handleSelectZone = (zone: string) => {
    setZoneName(zone);
    setFilteredZones([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/create-hideout-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: zoneName.trim(),
          guild: guildName.trim(),
          server,
          additional_notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Success! Issue #${data.issueNumber} has been created. Your hideout report has been submitted for review.`,
        });
        
        // Reset form after a short delay
        setTimeout(() => {
          setZoneName('');
          setGuildName('');
          setServer('America');
          setNotes('');
          setMessage(null);
          onClose();
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to submit hideout report. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to submit hideout report. Please check your connection and try again.',
      });
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage(null);
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="backdrop:bg-black backdrop:opacity-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 max-w-2xl w-full"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Report New Hideout
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zone Name */}
          <div className="relative">
            <label htmlFor="zoneName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zone Name *
            </label>
            <input
              type="text"
              id="zoneName"
              value={zoneName}
              onChange={handleZoneSearch}
              required
              placeholder="e.g., AVALON-LIONEL-01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {filteredZones.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredZones.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => handleSelectZone(zone)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white"
                  >
                    {zone}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guild Name */}
          <div>
            <label htmlFor="guildName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Guild Name *
            </label>
            <input
              type="text"
              id="guildName"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              required
              placeholder="e.g., Example Guild"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Server Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Server *
            </label>
            <div className="flex gap-2 flex-wrap">
              {servers.map((serverOption) => (
                <button
                  key={serverOption}
                  type="button"
                  onClick={() => setServer(serverOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    server === serverOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {serverOption}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information (optional)"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical"
            />
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
