import React, { Component, RefObject } from 'react';
import './AutoCompleteInput.scss';

export interface IProps {
    id: string;
    options: Array<string>;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    listClassName?: string;
    onInputValueChanged: (inputValue: string) => void;
    onTypedValueChanged?: (typeValue: string) => void;
    onSelectedChanged?: (selected: string) => void;
    onKeyDown?: (key: string) => void;
    inputValue: string;
}

class AutoCompleteInput extends Component<IProps, { isShowDropdown: boolean, typedValue: string, selectedOption: string }> {

    inputRef: RefObject<HTMLInputElement>;
    constructor(props: Readonly<IProps>) {
        super(props);
        this.inputRef = React.createRef<HTMLInputElement>();
        this.state = {
            isShowDropdown: false,
            selectedOption: '',
            typedValue: this.props.inputValue
        }
    }

    filterOptions(value: string) {
        const { options } = this.props;
        return options.filter(p => p.indexOf(value) > -1).sort((a, b) => a.length - b.length);
    }

    inputValueChanged(inputValue: string) {
        const { onInputValueChanged, onTypedValueChanged, options } = this.props;
        onTypedValueChanged && onTypedValueChanged(inputValue);
        onInputValueChanged(inputValue);
        this.setState({
            isShowDropdown: !!inputValue,
            selectedOption: options.includes(inputValue) ? inputValue : '',
            typedValue: inputValue
        });

    }

    selectValueChanged(selected: string) {
        const { onInputValueChanged, onSelectedChanged } = this.props;
        onSelectedChanged && onSelectedChanged(selected);
        onInputValueChanged(selected);
        this.setState({
            selectedOption: selected,
        });
    }

    typedValueChanged(key: string) {
        const { onKeyDown } = this.props;
        const { selectedOption, typedValue } = this.state;
        const options = this.filterOptions(typedValue);
        if (options.length > 0) {
            let selected = selectedOption;
            if (key === "ArrowUp") {
                let index = options.findIndex(p => p === selectedOption);
                if (index <= 0) {
                    selected = options[options.length - 1];
                }
                else {
                    selected = options[index - 1];
                }
                this.setState({ selectedOption: selected });
                this.selectValueChanged(selected);
            }

            if (key === "ArrowDown") {
                let index = options.findIndex(p => p === selectedOption);
                if (index < options.length - 1) {
                    selected = options[index + 1];
                }
                else {
                    selected = options[0];
                }
                this.setState({ selectedOption: selected });
                this.selectValueChanged(selected);
            }

            if (key === "Tab") {
                this.setState({ isShowDropdown: false })
            }
        }
        onKeyDown && onKeyDown(key);
    }

    blur() {
        this.inputRef.current?.blur();
    }

    renderOption(option: string) {
        const { typedValue } = this.state;
        if (typedValue && option.includes(typedValue)) {
            return <>
                <span>{option.split(typedValue)[0]}</span>
                <span className="typed">{typedValue}</span>
                <span>{option.split(typedValue)[1]}</span>
            </>
        }
    }

    render() {
        const {
            id,
            placeholder,
            className,
            inputClassName,
            listClassName,
            inputValue,
        } = this.props;
        const {
            isShowDropdown,
            selectedOption,
            typedValue,
        } = this.state;
        return (
            <div className={className || 'auto-complete'}>
                <input type="text" id={id || 'auto-complete-input'}
                    ref={this.inputRef}
                    onBlur={() => this.setState({ isShowDropdown: false })}
                    className={`auto-complete-input-class-name ${inputClassName}`}
                    placeholder={placeholder || ''}
                    onKeyDown={e => { this.typedValueChanged(e.key); if (e.key === "Tab" || e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault() }}
                    onChange={e => this.inputValueChanged(e.currentTarget.value)}
                    value={inputValue}
                >
                </input>
                <ul className={`auto-complete-list-class-name ${listClassName} ${isShowDropdown && 'show'}`}>
                    {this.filterOptions(typedValue).map(option =>
                        <li key={option} className={option === selectedOption ? 'selected' : ''}>
                            {this.renderOption(option)}
                        </li>)
                    }
                </ul>
            </div>
        );
    }
}

export default AutoCompleteInput;
