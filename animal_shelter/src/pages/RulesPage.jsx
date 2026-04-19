import React from 'react';

const RulesPage = () => {
  const rules = [
    {
      icon: "🌸",
      title: "1. Загальні положення",
      content: "Animal Shelter — це платформа, створена для об'єднання волонтерів, притулків та небайдужих сердець. Використовуючи наш сайт, ви погоджуєтесь поважати інших учасників та діяти виключно в інтересах тварин."
    },
    {
      icon: "✍️",
      title: "2. Правила публікацій",
      content: "Усі пости у 'Стрічці допомоги' повинні стосуватися порятунку, адопції або допомоги тваринам. Суворо заборонено публікувати неперевірені збори коштів, спам, рекламу або контент, що пропагує жорстокість."
    },
    {
      icon: "💬",
      title: "3. Взаємодія в чатах",
      content: "Будьте ввічливими. Заборонені образи, погрози або шахрайство. Наша платформа — це безпечний простір. Адміністрація залишає за собою право блокувати користувачів за порушення етики спілкування."
    },
    {
      icon: "💎",
      title: "4. Фінансова прозорість",
      content: "Ми дбаємо про безпеку. Усі збори коштів, які отримують статус 'Перевірено', проходять верифікацію. Волонтери зобов'язані надавати звіти (чеки, фото) про використання фінансів на вимогу благодійників."
    },
    {
      icon: "🏡",
      title: "5. Відповідальна адопція",
      content: "Забираючи тваринку з притулку, ви берете на себе повну відповідальність за її життя та здоров'я. Притулки мають право проводити співбесіди та перевіряти умови утримання тварини у новому домі."
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gray-50/50 pt-16 pb-24 px-4 overflow-hidden">
      
      {/* Декоративні розмиті плями на фоні */}
      <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-80 h-80 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-100 shadow-sm mb-6">
            <span className="text-rose-500">📜</span>
            <span className="text-sm font-bold text-gray-800 uppercase tracking-widest">
              Офіційні правила
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Правила нашої <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">платформи</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ми створили ці правила, щоб Animal Shelter залишався безпечним та комфортним місцем для всіх користувачів та хвостиків.
          </p>
        </div>

        {/* Картки з правилами */}
        <div className="space-y-6">
          {rules.map((rule, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-rose-100 shadow-inner">
                {rule.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{rule.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {rule.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Блок згоди */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl text-white shadow-xl shadow-rose-200">
          <h3 className="text-2xl font-bold mb-2">Залишилися питання?</h3>
          <p className="text-rose-100 mb-6 font-medium">Наша служба підтримки завжди готова допомогти вам розібратися.</p>
          <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
            Зв'язатися з нами
          </button>
        </div>

      </div>
    </div>
  );
};

export default RulesPage;