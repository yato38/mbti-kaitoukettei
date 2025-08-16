import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserInfo } from '../types';

interface PDFGeneratorProps {
  userInfo: UserInfo;
  leaderPercentage: number;
  playerPercentage: number;
  personaPercentages: Array<{
    key: string;
    persona: any;
    percentage: number;
  }>;
}

export const generatePDF = async ({
  userInfo,
  leaderPercentage,
  playerPercentage,
  personaPercentages,
}: PDFGeneratorProps) => {
  try {
    // PDF用のHTML要素を作成
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '40px';
    pdfContainer.style.backgroundColor = '#0f172a';
    pdfContainer.style.color = '#ffffff';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';

    // ヘッダー
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="text-align: center; color: #22c55e; font-size: 32px; margin-bottom: 30px; font-weight: bold;">
        MBTI診断結果レポート
      </h1>
      <div style="background-color: rgba(34, 197, 94, 0.1); padding: 20px; border-radius: 10px; border: 1px solid rgba(34, 197, 94, 0.3); margin-bottom: 30px;">
        <h3 style="color: #22c55e; margin-bottom: 15px; font-size: 18px;">診断者情報</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; color: #bbf7d0;">
          <div><strong>ID:</strong> ${userInfo.id}</div>
          <div><strong>氏名:</strong> ${userInfo.name}</div>
          <div><strong>所属チーム:</strong> ${userInfo.team}</div>
        </div>
      </div>
    `;
    pdfContainer.appendChild(header);

    // リーダー/プレイヤー結果
    const leaderPlayerSection = document.createElement('div');
    leaderPlayerSection.innerHTML = `
      <div style="background-color: rgba(34, 197, 94, 0.15); padding: 25px; border-radius: 15px; border: 1px solid rgba(34, 197, 94, 0.3); margin-bottom: 30px; text-align: center;">
        <h2 style="color: #22c55e; margin-bottom: 20px; font-size: 20px;">リーダー / プレイヤー 傾向</h2>
        <div style="display: flex; justify-content: center; align-items: center; gap: 30px; font-size: 28px;">
          <div style="color: #60a5fa;"><strong>リーダー: ${leaderPercentage}%</strong></div>
          <span style="color: #22c55e; font-size: 20px;">/</span>
          <div style="color: #a78bfa;"><strong>プレイヤー: ${playerPercentage}%</strong></div>
        </div>
      </div>
    `;
    pdfContainer.appendChild(leaderPlayerSection);

    // ペルソナ詳細
    const personaSection = document.createElement('div');
    personaSection.innerHTML = `
      <h2 style="color: #22c55e; margin-bottom: 20px; font-size: 24px; text-align: center;">
        ペルソナ構成詳細
      </h2>
    `;

    personaPercentages.forEach(({ persona, percentage }, index) => {
      const personaCard = document.createElement('div');
      personaCard.style.cssText = `
        background-color: rgba(34, 197, 94, 0.1);
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid ${persona.color};
        margin-bottom: 20px;
      `;
      personaCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
          <h3 style="color: #22c55e; font-size: 18px; margin: 0;">
            ${index + 1}. ${persona.name}
          </h3>
          <span style="background-color: ${persona.color}; color: white; padding: 5px 12px; border-radius: 15px; font-weight: bold; font-size: 14px;">
            ${percentage}%
          </span>
        </div>
        <p style="color: #bbf7d0; line-height: 1.6; margin: 0; font-size: 14px;">
          ${persona.description}
        </p>
      `;
      personaSection.appendChild(personaCard);
    });

    pdfContainer.appendChild(personaSection);

    // フッター
    const footer = document.createElement('div');
    footer.innerHTML = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(34, 197, 94, 0.3); text-align: center; color: #64748b; font-size: 12px;">
        <p>診断日時: ${new Date().toLocaleString('ja-JP')}</p>
        <p>このレポートは自動生成されました。</p>
      </div>
    `;
    pdfContainer.appendChild(footer);

    // 一時的にDOMに追加
    document.body.appendChild(pdfContainer);

    // HTMLをキャンバスに変換
    const canvas = await html2canvas(pdfContainer, {
      background: '#0f172a',
      useCORS: true,
      allowTaint: true,
    });

    // DOMから削除
    document.body.removeChild(pdfContainer);

    // PDF生成
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // PDFをダウンロード
    const fileName = `MBTI診断結果_${userInfo.name}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('PDF生成エラー:', error);
    alert('PDFの生成に失敗しました。もう一度お試しください。');
  }
};
