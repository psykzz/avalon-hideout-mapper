'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { Server } from '@/lib/types';
import { getAvalonZoneNames } from '@/lib/zones';

interface ReportHideoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_AUTOCOMPLETE_RESULTS = 10;
const SUCCESS_MESSAGE_DELAY_MS = 2000;

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
      ).slice(0, MAX_AUTOCOMPLETE_RESULTS);
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
        }, SUCCESS_MESSAGE_DELAY_MS);
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
      className="
        backdrop:bg-black backdrop:opacity-50 
        bg-white dark:bg-gray-800 
        border-2 border-gray-900 dark:border-gray-300 
        p-0 max-w-2xl w-full
      "
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Report New Hideout
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500 disabled:opacity-50 text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zone Name */}
          <div className="relative">
            <label htmlFor="zoneName" className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
              Zone Name *
            </label>
            <input
              type="text"
              id="zoneName"
              value={zoneName}
              onChange={handleZoneSearch}
              required
              placeholder="e.g., AVALON-LIONEL-01"
              className="w-full px-4 py-3 border-2 border-gray-900 dark:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0"
            />
            {filteredZones.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-300 max-h-60 overflow-y-auto">
                {filteredZones.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => handleSelectZone(zone)}
                    className="w-full px-4 py-3 text-left border-b border-gray-300 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  >
                    {zone}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guild Name */}
          <div>
            <label htmlFor="guildName" className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
              Guild Name *
            </label>
            <input
              type="text"
              id="guildName"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              required
              placeholder="e.g., Example Guild"
              className="w-full px-4 py-3 border-2 border-gray-900 dark:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0"
            />
          </div>

          {/* Server Selection */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
              Server *
            </label>
            <div className="flex gap-3 flex-wrap">
              {servers.map((serverOption) => (
                <button
                  key={serverOption}
                  type="button"
                  onClick={() => setServer(serverOption)}
                  className={`px-6 py-3 border-2 font-semibold transition-colors ${
                    server === serverOption
                      ? 'bg-gray-900 dark:bg-gray-300 text-white dark:text-gray-900 border-gray-900 dark:border-gray-300'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-900 dark:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {serverOption}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-base font-semibold text-gray-900 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information (optional)"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-900 dark:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0 resize-vertical"
            />
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 border-2 ${
                message.type === 'success'
                  ? 'bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300'
                  : 'bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-900 dark:bg-gray-300 text-white dark:text-gray-900 border-2 border-gray-900 dark:border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full"></div>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
