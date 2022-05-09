import React, { Component } from 'react';
import Image from 'next/image';
import styles from './Input.module.scss';

interface ComponentProps {
  type: string;

  inputRef?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  handleBlur?: Function;
  handleFocus?: Function;
  handleChange?: Function;
  propValue?: string | number;
  dataset?: string;

  inlineStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  clearButton?: string; // 'on'
  addText?: string;
  className?: string;
  pattern?: string;
  inputMode?: React.HTMLAttributes<Input>['inputMode'];
  inputClick?: React.MouseEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  parser?: any;
  unitInInputComponent?: boolean;
  unit?: string;
}

// const CLOSE_IMG = require('close_button.png');

class Input extends Component<ComponentProps, { clearBtn: boolean }> {
  constructor(props: ComponentProps) {
    super(props);
    this.state = {
      clearBtn: false,
    };
  }

  getType = () => {
    const { type } = this.props;
    if (['password', 'text', 'tel'].includes(type)) {
      return type;
    }
    return 'text';
  };

  _handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { handleBlur } = this.props;
    const value = e.target.value;
    handleBlur && handleBlur(value);
  };

  _handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { handleFocus, inputRef } = this.props;
    const value = inputRef || e.target.value;
    handleFocus && handleFocus(value);
  };

  _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { handleChange, maxLength } = this.props;
    let value = e.target.value;

    if (maxLength) value = value.slice(0, maxLength);
    handleChange && handleChange(value);
  };

  valueParser = () => {
    const { propValue, maxLength, parser } = this.props;
    if (parser) {
      return parser(propValue);
    }
    if (!propValue) {
      return '';
    }
    if (maxLength && propValue && typeof propValue === 'string') return propValue.slice(0, maxLength);
    return propValue;
  };

  inputValueClear = () => {
    const { handleChange } = this.props;
    handleChange && handleChange('');
  };

  inputClearButtonStyle = (placeholder: Readonly<string>) => {
    if (placeholder === '검색') {
      return styles.clear_button;
    }
  };

  render() {
    const {
      className,
      onKeyPress,
      onKeyDown,
      inputClick,
      inputMode,
      inputRef,
      inlineStyle,
      placeholder,
      disabled,
      pattern,
      maxLength,
      clearButton,
    } = this.props;
    return (
      <div className={styles.input_container}>
        <input
          className={`${styles.input} ${className || ''}`}
          style={inlineStyle || {}}
          type={this.getType()}
          placeholder={placeholder}
          disabled={disabled}
          pattern={pattern}
          inputMode={inputMode}
          maxLength={maxLength}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          onChange={this._handleChange}
          onKeyPress={onKeyPress}
          onClick={inputClick}
          readOnly={!!inputClick}
          onKeyDown={onKeyDown}
          value={this.valueParser()}
          ref={inputRef || null}
        />
        <div className={styles.search_button}>
          <Image src="/images/search-button.png" alt="Search Button" width={16} height={16} />
        </div>

        {clearButton === 'on' && this.valueParser() && (
          <div className={this.inputClearButtonStyle(placeholder || '')}>
            <Image
              src="/images/close-button.png"
              alt="Close Button"
              width={16}
              height={16}
              onClick={() => this.inputValueClear()}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Input;
