import { Language } from 'components/Models/Language';
import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
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
    typeaheadRef: React.RefObject<any>;
    constructor(props: Readonly<ITypeInputProps>) {
        super(props);
        this.typeaheadRef = React.createRef<any>();
        this.state = {
            options: [],
            inputValue: ''
        }
    }


    async onInputChanged(inputValue: string) {
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
                this.typeaheadRef.current.clear();
                this.typeaheadRef.current.getInput().value = inputValue;
            }
        }
        onChange(inputValue);
    }

    async onValueChanged(value: string) {
        const { onChange } = this.props;
        onChange(value[0] ?? '');
    }

    render() {
        const { placeholder, onKeyDown } = this.props;
        const { options } = this.state;
        return (
            <div className="form-control">
                <Typeahead
                    id='word'
                    ref={this.typeaheadRef}
                    options={options}
                    placeholder={placeholder ?? ''}
                    inputProps={{ 'id': 'word' }}
                    onKeyDown={(e: any) => {
                        if (e.key === "Enter") {
                            this.typeaheadRef.current.clear();
                        }
                        onKeyDown(e)
                    }}
                    onInputChange={async (input, e) => await this.onInputChanged(input)}
                    onChange={value => this.onValueChanged(value[0] ?? '')}
                />
            </div>
        );
    }

}

export default TypeInput;
