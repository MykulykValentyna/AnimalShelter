import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from '../components/posts/Comments';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setPost({
          id,
          title: 'Терміново потрібен корм для притулку "Хвостики"',
          content: 'Друзі, звертаємося до вас за допомогою. У нашому притулку зараз перебуває понад 40 собак, і наші запаси сухого корму майже вичерпані. Через неочікуване збільшення кількості врятованих тварин минулого тижня, ми не розрахували ресурси. Будемо вдячні за будь-яку кількість корму або фінансову підтримку для його закупівлі. Кожен пакет корму — це ситий день для наших підопічних.',
          type: 'financial_help_animal',
          authorName: 'Олена Волонтер',
          createdAt: new Date().toISOString(),
          status: 'approved'
        });
        setComments([
          { id: '1', authorName: 'Дмитро', text: 'Зміг замовити 20кг корму на вашу адресу, має бути завтра!', createdAt: new Date().toISOString() },
          { id: '2', authorName: 'Анна', text: 'Яку марку корму ви зазвичай використовуєте?', createdAt: new Date().toISOString() }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchPostData();
  }, [id]);

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now().toString(),
      authorName: 'Ви',
      text,
      createdAt: new Date().toISOString()
    };
    setComments([...comments, newComment]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-rose-500 font-bold mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад до стрічки
        </button>

        <article className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-rose-100 shadow-xl shadow-rose-100/30 mb-12">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-200 to-purple-200 flex items-center justify-center text-2xl shadow-sm border-2 border-white">
                🌸
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-lg">{post.authorName}</h4>
                <span className="text-sm text-gray-400 font-medium">Опубліковано сьогодні</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-full border border-rose-100">
                {post.type === 'financial_help_animal' ? 'Терміновий збір' : 'Допомога'}
              </span>
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                Перевірено адміном
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-rose max-w-none mb-10">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap italic border-l-4 border-rose-200 pl-6 py-2 bg-rose-50/30 rounded-r-2xl">
              {post.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-8 border-t border-rose-50">
            <button className="flex-1 min-w-[200px] py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              <span className="text-xl">💳</span>
              Допомогти фінансово
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className="flex-1 min-w-[200px] py-4 bg-white text-gray-800 font-bold rounded-2xl border border-gray-200 hover:border-rose-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-xl">✉️</span>
              Написати автору
            </button>
          </div>
        </article>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-rose-100 shadow-xl shadow-rose-100/30">
          <Comments comments={comments} onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;