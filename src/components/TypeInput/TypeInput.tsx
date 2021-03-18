import { Language } from 'components/Models/Language';
import React, { Component } from 'react';
import { AutoCompleteInput } from '@bryht/auto-complete-input';
import { loadWordsAsync } from './Load';
import './TypeInput.scss';

interface ITypeInputProps {
    placeholder: string;
    onKeyDown: (e: any) => void;
    onChange: (value: string) => void;
    value: string;
    languages: Array<Language>;
    culture: string;
    onCultureChanged: (culture: string) => void;
}

class TypeInput extends Component<ITypeInputProps, { options: Array<string>, inputValue: string }> {
    inputRef: React.RefObject<any>;
    constructor(props: Readonly<ITypeInputProps>) {
        super(props);
        this.inputRef = React.createRef<any>();
        this.state = {
            options: [],
            inputValue: ''
        }
    }

    async onValueChanged(inputValue: string) {
        const { culture, onChange, onCultureChanged } = this.props;
        const options = await loadWordsAsync(culture, inputValue, 6);
        this.setState({ options: options ?? [] });
        if (inputValue.includes(',')) {
            var cultures = this.props.languages.map(x => x.culture);
            var inputCulture = inputValue.split(',')[1];
            var findCulture = cultures.find(x => x === inputCulture);
            if (findCulture) {
                inputValue = inputValue.split(',')[0];
                onCultureChanged(findCulture);
            }
        }

        onChange(inputValue);
    }

    render() {
        const { placeholder, onKeyDown } = this.props;
        const { options } = this.state;
        return (<AutoCompleteInput id="word"
                    className=""
                    inputClassName=""
                    listClassName=""
                    value=""
                    options={options}
                    placeholder={placeholder}
                    onChange={(value)=>this.onValueChanged(value)}
                    onKeyDown={(key) => onKeyDown(key)}
                />
        );
    }

}

export default TypeInput;
