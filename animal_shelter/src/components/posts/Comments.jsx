import React, { useState } from 'react';

const Comments = ({ comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString || Date.now()));
  };

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🌸</span>
        Коментарі
        <span className="ml-2 text-sm font-medium bg-rose-100 text-rose-600 py-1 px-3 rounded-full">
          {comments.length}
        </span>
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Додайте свій коментар..."
          className="w-full bg-white border border-rose-100 text-gray-900 text-base rounded-3xl pl-6 pr-16 py-4 min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all shadow-sm"
          rows="2"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="absolute right-3 bottom-3 p-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <svg className="w-5 h-5 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-2xl p-5 border border-rose-50 shadow-sm flex gap-4 transition-all hover:shadow-md">
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center text-rose-500 font-bold border border-white shadow-sm">
              {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-gray-900 text-sm">
                  {comment.authorName || 'Небайдужий користувач'}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-10 bg-gray-50/50 rounded-3xl border border-dashed border-rose-100">
            <p className="text-gray-500 text-sm font-medium">Поки немає коментарів. Будьте першим!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;