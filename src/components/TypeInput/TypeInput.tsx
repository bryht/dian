import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import { loadWordsAsync } from './Load';

interface ITypeInputProps {
    placeholder: string;
    onKeyDown: (e: any) => void;
    onChange: (value: string) => void;
    value: string;
}

class TypeInput extends Component<ITypeInputProps, { options: Array<string>, inputValue: string }> {
    typeaheadRef:React.RefObject<any>;
    constructor(props: Readonly<ITypeInputProps>) {
        super(props);
        this.typeaheadRef=React.createRef<any>();
        this.state = {
            options: [],
            inputValue: ''
        }
    }


    async onInputChanged(input: string) {
        console.log(input);
        const options = await loadWordsAsync('en', input, 6);
        this.setState({ options: options ?? [] });
        const { onChange } = this.props;
        onChange(input);
    }

    async onValueChanged(value: string) {
        console.log(value);
        const { onChange } = this.props;
        onChange(value[0] ?? '');
    }

    render() {
        const { placeholder, onKeyDown, value } = this.props;
        const { options } = this.state;
        return (
            <Typeahead
                id='word'
                ref={this.typeaheadRef}
                autoFocus
                options={options}
                placeholder={placeholder ?? ''}
                defaultInputValue={value}
                inputProps={{ 'id': 'word' }}
                onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                        this.typeaheadRef.current.hideMenu();
                    }
                    onKeyDown(e)
                }}
                onInputChange={async (input, e) => await this.onInputChanged(input)}
                onChange={value => this.onValueChanged(value[0] ?? '')}
            />
        );
    }

}

export default TypeInput;
