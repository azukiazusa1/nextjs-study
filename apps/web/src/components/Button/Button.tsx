import React from 'react';

type Props = {
  /**
   * ボタンのカラー
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'ghost';
  /**
   * ボタンのサイズ
   * @default 'md'
   */
  size?: 'lg' | 'md' | 'sm' | 'xs';
  /**
   * アウトライン
   * @default false
   */
  outline?: boolean;
  /**
   * アクティブかどうか
   * @default false
   */
  active?: boolean;
  /**
   * 無効化どうか
   * @default false
   */
  disabled?: boolean;
  /**
   * リンク形式かどうか
   * @default false
   */
  link?: boolean;
  /**
   * ローディングスピナーを表示するかどうか
   * @default false
   */
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};
const Button: React.FC<Props> = ({
  color = 'primary',
  size = 'md',
  outline = false,
  active = false,
  disabled = false,
  link = false,
  loading = false,
  onClick,
  children,
}) => {
  const className = ['btn', `btn-${color}`, `btn-${size}`];

  if (outline) {
    className.push('btn-outline');
  }

  if (active) {
    className.push('active');
  }

  if (disabled) {
    className.push('disabled');
  }

  if (link) {
    className.push('btn-link');
  }

  if (loading) {
    className.push('loading');
  }

  return (
    <button type="button" className={className.join(' ')} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
