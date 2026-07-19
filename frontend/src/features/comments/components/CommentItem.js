// frontend/src/features/comments/components/CommentItem.js

import React, { useState } from 'react';
import CommentInput from './CommentInput';
import { updateComment, deleteComment, replyToComment } from '../../../api/commentApi/commentApi';

const CommentItem = ({ 
  comment, 
  currentUserId, 
  onCommentUpdated, 
  onCommentDeleted,
  depth = 0 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isAuthor = comment.author?.id === currentUserId;
  const canEdit = comment.canEdit || isAuthor;
  const canDelete = comment.canDelete || isAuthor;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isNested = depth > 0;

  const handleEdit = async (newContent) => {
    try {
      setLoading(true);
      await updateComment(comment.id, newContent);
      setIsEditing(false);
      if (onCommentUpdated) onCommentUpdated();
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setLoading(true);
      await deleteComment(comment.id);
      if (onCommentDeleted) onCommentDeleted(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (content) => {
    try {
      setLoading(true);
      await replyToComment(comment.id, content);
      setIsReplying(false);
      if (onCommentUpdated) onCommentUpdated();
    } catch (err) {
      console.error('Failed to reply:', err);
      alert(err.response?.data?.message || 'Failed to reply');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Style with indentation for nested comments
  const commentStyle = {
    paddingLeft: isNested ? 'var(--spacing-4)' : '0',
    borderLeft: isNested ? '2px solid var(--border-color)' : 'none',
    marginLeft: isNested ? 'var(--spacing-4)' : '0',
    paddingBottom: 'var(--spacing-2)',
  };

  return (
    <div style={commentStyle}>
      <div className="card" style={{ 
        padding: 'var(--spacing-3)', 
        marginBottom: 'var(--spacing-2)',
        backgroundColor: isNested ? 'var(--color-gray-50)' : 'var(--color-white)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--border-radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: 'var(--font-size-sm)',
              flexShrink: 0,
            }}>
              {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-gray-900)',
              }}>
                {comment.author?.name || 'Unknown User'}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-gray-500)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
              }}>
                <span>{formatDate(comment.createdAt)}</span>
                {comment.edited && (
                  <span style={{ fontStyle: 'italic' }}>(edited)</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                }}
                disabled={loading}
              >
                ✏️
              </button>
            )}
            {canDelete && !isEditing && (
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                }}
                disabled={loading}
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <CommentInput
            initialValue={comment.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            placeholder="Edit your comment..."
            loading={loading}
            autoFocus
          />
        ) : (
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-700)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {comment.content}
          </div>
        )}

        {/* Reply button */}
        {!isEditing && (
          <div style={{
            marginTop: 'var(--spacing-2)',
            display: 'flex',
            gap: 'var(--spacing-2)',
          }}>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="btn btn-secondary"
              style={{
                fontSize: 'var(--font-size-xs)',
                padding: 'var(--spacing-1) var(--spacing-2)',
                background: 'none',
                border: 'none',
                color: 'var(--color-gray-500)',
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              💬 Reply
            </button>
            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="btn btn-secondary"
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gray-500)',
                  cursor: 'pointer',
                }}
                disabled={loading}
              >
                {showReplies ? '▼' : '▶'} {comment.replies.length} replies
              </button>
            )}
          </div>
        )}

        {/* Reply form */}
        {isReplying && (
          <CommentInput
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="Write a reply..."
            isReply
            loading={loading}
            autoFocus
          />
        )}
      </div>

      {/* Replies */}
      {hasReplies && showReplies && (
        <div style={{ marginLeft: 'var(--spacing-2)' }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;