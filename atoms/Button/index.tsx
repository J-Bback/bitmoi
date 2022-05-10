import React, { Component } from 'react';
import styles from './Button.module.scss';

interface ComponentProps {
  // required
  btnText: string;
  // optional
  id?: string;
  className?: string;
  inlineStyle?: React.CSSProperties;
  btnClick?: Function;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: any;
}

const Loading = () => (
  <div className={styles.loading_wrap}>
    <img src="/images/spinner.png" className={styles.loading} />
  </div>
);

class Button extends Component<ComponentProps> {
  _handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
    const { btnClick } = this.props;
    btnClick && btnClick(e);
  };

  children = () => {
    const { loading, children, btnText } = this.props;
    if (loading) return <Loading />;
    if (children) return children;
    return btnText;
  };

  render() {
    const { id, className, inlineStyle, outline, disabled, loading } = this.props;
    return (
      <button
        disabled={disabled}
        className={`${outline ? styles.outline : styles.btn_default} ${className || ''}`}
        onClick={loading ? () => undefined : this._handleClick}
        style={inlineStyle || {}}
        id={id}
      >
        {this.children()}
      </button>
    );
  }
}

export default Button;
