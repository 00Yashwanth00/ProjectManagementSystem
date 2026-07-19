// frontend/src/features/comments/components/CommentInput.js

import React, { useState } from 'react';

const CommentInput = ({ 
  onSubmit, 
  onCancel, 
  placeholder = 'Write a comment...', 
  isReply = false,
  initialValue = '',
  autoFocus = false,
  loading = false 
}) => {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 1500) {
      setError('Comment cannot exceed 1500 characters');
      return;
    }

    try {
      setError(null);
      await onSubmit(content);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    }
  };

  return (
    <div style={{ marginTop: isReply ? 'var(--spacing-2)' : 'var(--spacing-4)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={loading}
            style={{
              width: '100%',
              minHeight: isReply ? '60px' : '80px',
              padding: 'var(--spacing-2)',
              borderRadius: 'var(--border-radius-md)',
              border: 'var(--border-width) solid var(--border-color)',
              fontSize: 'var(--font-size-sm)',
              resize: 'vertical',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-bg)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {/* Character counter */}
          <div style={{
            position: 'absolute',
            bottom: 'var(--spacing-1)',
            right: 'var(--spacing-2)',
            fontSize: 'var(--font-size-xs)',
            color: content.length > 1400 ? 'var(--color-warning)' : 'var(--color-gray-400)',
          }}>
            {content.length}/1500
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
          marginTop: 'var(--spacing-2)',
          justifyContent: 'flex-end',
        }}>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !content.trim()}
            style={{ fontSize: 'var(--font-size-sm)' }}
          >
            {loading ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;