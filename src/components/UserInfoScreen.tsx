import React, { useState } from 'react';
import { TEAMS } from '../data';

interface UserInfo {
  id: string;
  name: string;
  team: string;
}

interface UserInfoScreenProps {
  onComplete: (userInfo: UserInfo) => void;
}

export const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ onComplete }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: '',
    team: '',
  });

  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {};

    if (!userInfo.id.trim()) {
      newErrors.id = 'IDを入力してください';
    } else if (userInfo.id.length !== 6) {
      newErrors.id = 'IDは6桁で入力してください';
    }

    if (!userInfo.name.trim()) {
      newErrors.name = '氏名を入力してください';
    }

    if (!userInfo.team.trim()) {
      newErrors.team = '所属チームを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(userInfo);
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 数字のみを許可し、6桁まで制限
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    handleInputChange('id', numericValue);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
                 <div className="text-center mb-8">
           <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4 text-shadow">
             教務研究員ペルソナ診断
           </h1>
           <p className="text-green-200 text-lg">
             あなたの働き方の特徴を診断します
           </p>
         </div>
         
         <div className="bg-green-900/40 p-6 md:p-8 rounded-2xl border border-green-700/50 backdrop-blur-sm">
           <div className="text-center mb-6">
             <h2 className="text-xl md:text-2xl font-bold text-green-300 mb-2">
               基本情報の入力
             </h2>
             <p className="text-green-200 text-sm md:text-base">
               診断を開始する前に、以下の情報を入力してください
             </p>
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                 <label htmlFor="id" className="block text-green-300 font-semibold mb-2 text-sm">
                   ID (6桁)
                 </label>
                 <input
                   type="text"
                   id="id"
                   value={userInfo.id}
                   onChange={handleIdChange}
                   className={`w-full ${
                     errors.id ? 'border-red-400' : ''
                   }`}
                   placeholder="例: 123456"
                   maxLength={6}
                   inputMode="numeric"
                   pattern="[0-9]*"
                 />
                 {errors.id && (
                   <p className="text-red-400 text-xs mt-1">{errors.id}</p>
                 )}
               </div>

               <div>
                 <label htmlFor="name" className="block text-green-300 font-semibold mb-2 text-sm">
                   氏名
                 </label>
                 <input
                   type="text"
                   id="name"
                   value={userInfo.name}
                   onChange={(e) => handleInputChange('name', e.target.value)}
                   className={`w-full ${
                     errors.name ? 'border-red-400' : ''
                   }`}
                   placeholder="例: 田中太郎"
                 />
                 {errors.name && (
                   <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                 )}
               </div>
             </div>

             <div>
               <label htmlFor="team" className="block text-green-300 font-semibold mb-2 text-sm">
                 所属チーム
               </label>
                               <select
                  id="team"
                  value={userInfo.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  className={`w-full ${
                    errors.team ? 'border-red-400' : ''
                  }`}
                >
                 <option value="">チームを選択してください</option>
                 {TEAMS.map((team) => (
                   <option key={team} value={team}>
                     {team}
                   </option>
                 ))}
               </select>
               {errors.team && (
                 <p className="text-red-400 text-xs mt-1">{errors.team}</p>
               )}
             </div>

             <div className="diagnosis-button-container">
               <button
                 type="submit"
                 className="btn-start-diagnosis w-full"
               >
                 診断を開始する
                 <span className="icon">→</span>
               </button>
             </div>
           </form>
         </div>
      </div>
    </div>
  );
};
