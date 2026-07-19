// frontend/src/features/comments/components/CommentList.js

import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

const CommentList = ({ 
  comments = [], 
  currentUserId, 
  onAddComment, 
  onCommentUpdated, 
  onCommentDeleted,
  loading = false,
  targetType = 'task', // 'task' or 'issue'
  targetId = null
}) => {
  const [localComments, setLocalComments] = useState(comments);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleAddComment = async (content) => {
    try {
      const newComment = await onAddComment(content);
      setLocalComments(prev => [...prev, newComment]);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const handleCommentUpdated = () => {
    // Refresh comments from parent
    if (onCommentUpdated) onCommentUpdated();
  };

  const handleCommentDeleted = (commentId) => {
    setLocalComments(prev => prev.filter(c => c.id !== commentId));
    if (onCommentDeleted) onCommentDeleted(commentId);
  };

  const sortedComments = [...localComments].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="card" style={{ marginTop: 'var(--spacing-4)' }}>
      <div style={{
        padding: 'var(--spacing-3)',
        borderBottom: 'var(--border-width) solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h4 style={{ margin: 0 }}>
          💬 Discussion ({localComments.length})
        </h4>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-gray-500)',
        }}>
          {targetType === 'task' ? 'Task' : 'Issue'} comments
        </span>
      </div>

      <div style={{ padding: 'var(--spacing-3)' }}>
        {/* Add Comment Input */}
        <CommentInput
          onSubmit={handleAddComment}
          placeholder={`Add a comment to this ${targetType}...`}
          loading={loading}
        />

        {/* Comments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-gray-500)' }}>
            Loading comments...
          </div>
        ) : sortedComments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-4)',
            color: 'var(--color-gray-400)',
            fontSize: 'var(--font-size-sm)',
          }}>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            {sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;